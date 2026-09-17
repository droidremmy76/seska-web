import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const files=['index.html','about.html','privacy.html','services.html','ordering-guide.html','answers.html'];
const canonical='https://www.seskainvestments.com/';
const data=JSON.parse(await readFile(resolve(root,'content/answers.json'),'utf8'));
// Build twice: a content-only edit must never accumulate duplicate head tags or sections.
execFileSync(process.execPath,[resolve(root,'scripts/build-aeo.mjs')]);
const first=await Promise.all(files.map(f=>readFile(resolve(root,f),'utf8')));
execFileSync(process.execPath,[resolve(root,'scripts/build-aeo.mjs')]);
const second=await Promise.all(files.map(f=>readFile(resolve(root,f),'utf8')));
assert.deepEqual(second,first,'build is deterministic and idempotent');
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE?pathToFileURL(process.env.PLAYWRIGHT_MODULE).href:'playwright');
const server=createServer(async(req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!path.startsWith(root+sep)){res.writeHead(403).end();return;}
 try {const body=await readFile(path);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.xml':'application/xml','.json':'application/json','.png':'image/png'})[extname(path)]||'application/octet-stream');res.end(body);}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const results=[];
const evidence=resolve(root,'../aeo-evidence');await mkdir(evidence,{recursive:true});
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const external=[],errors=[],failed=[];
 await context.route('**/*',async route=>{if(!route.request().url().startsWith(origin)){external.push(route.request().url());await route.abort();}else await route.continue();});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 const graphs=[];
 const linkTargets=[];
 for(const file of files){
  await page.goto(origin+'/'+file);await page.waitForFunction(()=>!!window.SeskaPrivacy);
  assert.equal(await page.locator('h1').count(),1,file+' has one H1');
  for(const selector of ['title','meta[name="description"]','link[rel="canonical"]','meta[name="robots"]','meta[property="og:url"]','script[type="application/ld+json"]']) assert.equal(await page.locator(selector).count(),1,file+' '+selector);
  const canonicalUrl=canonical+(file==='index.html'?'':file);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),canonicalUrl);
  assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),canonicalUrl);
  const graph=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());graphs.push(graph);
  assert.equal(graph['@context'],'https://schema.org');
  assert.ok(graph['@graph'].find(n=>n['@id']===canonicalUrl+'#webpage'));
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(ids).size,ids.length,file+' unique IDs');
  const hrefs=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  for(const href of hrefs){const target=new URL(href,origin+'/'+file);if(target.origin===origin) linkTargets.push(target.href);}
  if(file!=='index.html') assert.equal(await page.locator('nav[aria-label="Breadcrumb"]').count(),1);
  await page.setViewportSize({width:375,height:812});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' mobile width');
  await page.setViewportSize({width:1440,height:1000});
  if(file==='index.html'||file==='about.html'){
   if(await page.locator('#seska-cookie-banner').isVisible()) await page.locator('#seska-cookie-banner [data-reject]').click();
   await page.screenshot({path:resolve(evidence,file.replace('.html','')+'-desktop.png')});
  }
 }
 results.push('All six pages: metadata uniqueness, canonical/OG agreement, one H1, breadcrumbs, unique IDs and mobile width');
 const definitions=new Set(graphs.flatMap(g=>g['@graph'].map(n=>n['@id'])));
 for(const graph of graphs){
  function validateRef(value){if(!value||typeof value!=='object')return;if(Object.keys(value).length===1&&value['@id'])assert.ok(definitions.has(value['@id']),'resolvable graph reference '+value['@id']);Object.values(value).forEach(v=>Array.isArray(v)?v.forEach(validateRef):validateRef(v));}validateRef(graph);
 }
 results.push('Structured graph references resolve across published page definitions');
 await page.goto(origin+'/services.html');
 const serviceGraph=graphs[3]['@graph'].filter(n=>n['@type']==='Service');assert.equal(serviceGraph.length,9);
 for(const service of data.services){const node=serviceGraph.find(n=>n.name===service.name);assert.equal(node.description,await page.locator('#'+service.id+' .direct-answer').textContent());assert.equal(node.provider['@id'],canonical+'#business');}
 await page.goto(origin+'/answers.html');
 const q=graphs[5]['@graph'].find(n=>n['@type']==='FAQPage').mainEntity;assert.equal(q.length,14);
 for(const f of data.faqs){assert.equal(q.find(n=>n.name===f.question).acceptedAnswer.text,await page.locator('#'+f.id+' .direct-answer').textContent());}
 results.push('Nine Service descriptions and fourteen Question/Answer pairs exactly match visible source content');
 const localDocs=new Map();
 for(const href of new Set(linkTargets)){
  const t=new URL(href);const file=t.pathname==='/'?'index.html':t.pathname.slice(1);
  if(!file.endsWith('.html'))continue;
  if(!localDocs.has(file))localDocs.set(file,await readFile(resolve(root,file),'utf8'));
  if(t.hash)assert.ok(localDocs.get(file).includes(`id="${decodeURIComponent(t.hash.slice(1))}"`),'link anchor exists '+href);
 }
 results.push('All local HTML link destinations and fragment targets exist');
 const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');
 assert.equal((sitemap.match(/<loc>/g)||[]).length,6);
 for(const f of files)assert.ok(sitemap.includes('<loc>'+canonical+(f==='index.html'?'':f)+'</loc>'));
 assert.ok((await readFile(resolve(root,'robots.txt'),'utf8')).includes('Sitemap: '+canonical+'sitemap.xml'));
 results.push('Sitemap lists six canonical pages and robots.txt points to it');
 if(await page.locator('#seska-cookie-banner').isVisible()) await page.locator('#seska-cookie-banner [data-reject]').click();
 await page.goto(origin+'/answers.html');
 await page.keyboard.press('Tab');await page.keyboard.press('Tab');
 assert.notEqual(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'none','keyboard focus visible');
 await page.screenshot({path:resolve(evidence,'answers-desktop.png')});
 await page.setViewportSize({width:375,height:812});
 await page.locator('.menu').click();assert.equal(await page.locator('.menu').getAttribute('aria-expanded'),'true');
 await page.locator('.header nav a[href="services.html"]').click();await page.waitForURL('**/services.html');
 await page.screenshot({path:resolve(evidence,'services-mobile.png')});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:resolve(evidence,'services-desktop.png')});
 results.push('Keyboard focus, mobile navigation and desktop/mobile screenshots');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(failed,[]);
 results.push('No page errors, failing local responses or automatic third-party requests');
 await context.close();
 const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1280,height:900}});
 const rawPage=await noJs.newPage();
 for(const file of ['services.html','ordering-guide.html','answers.html']){
  await rawPage.goto(origin+'/'+file);assert.ok(await rawPage.locator('h1').isVisible());assert.ok(await rawPage.locator('.direct-answer').first().isVisible());
 }
 results.push('Service, ordering and answer content remains visible with JavaScript disabled');
 await noJs.close();
 const report={passed:results,limits:'Local consistency and browser validation only; not external rich-result validation, live indexing, rankings or AI citation measurement.'};
 await writeFile(resolve(evidence,'validation.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();server.close();}
