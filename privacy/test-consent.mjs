import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, extname, sep } from 'node:path';

// Set PLAYWRIGHT_MODULE to an installed playwright/index.mjs if not on Node's module path.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    const data = await readFile(path);
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml'})[extname(path)] || 'application/octet-stream');
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless:true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge'});
const reports = [];
async function session({gpc=false, saved, storageBlocked=false, configured=true}={}) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(({gpc,saved,storageBlocked}) => {
    Object.defineProperty(navigator, 'globalPrivacyControl', {value:gpc});
    if(saved !== undefined && !sessionStorage.getItem('seeded')) { localStorage.setItem('seska.privacy.v1',saved); sessionStorage.setItem('seeded','true'); }
    if(storageBlocked) { Storage.prototype.getItem=()=>{throw Error('blocked')}; Storage.prototype.setItem=()=>{throw Error('blocked')}; }
  },{gpc,saved,storageBlocked});
  const external=[]; const errors=[];
  await context.route('**/*', async route => {
    if(!route.request().url().startsWith(origin)) { external.push(route.request().url()); await route.fulfill({status:200,contentType:'application/javascript',body:'/* vendor SDK intercepted; no real analytics sent */'}); return; }
    if(configured && route.request().url().endsWith('/privacy/config.js')) { await route.fulfill({contentType:'application/javascript',body:'window.SeskaPrivacyConfig={enabled:true,ga4Id:"G-TEST123",clarityId:"test123",privacyUrl:"privacy.html"};'}); return; }
    await route.continue();
  });
  const page=await context.newPage(); page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin); await page.waitForFunction(()=>!!window.SeskaPrivacy);
  return {context,page,external,errors};
}
try {
  let s=await session();
  assert.equal(s.external.length,0,'no third-party requests before consent');
  await s.page.locator('[data-accept]').click();
  await s.page.waitForFunction(()=>window.SeskaPrivacyGaLoaded && window.SeskaPrivacyClarityLoaded);
  await s.page.waitForTimeout(100);
  assert.equal(s.external.length,2);
  const commands=await s.page.evaluate(()=>dataLayer.map(x=>Array.from(x)));
  assert.equal(commands[0][2].analytics_storage,'denied');
  assert.equal(commands.find(x=>x[0]==='consent' && x[1]==='update')[2].ad_storage,'denied');
  await s.page.locator('#seska-privacy-controls [data-optout]').click();
  await s.page.waitForFunction(()=>!!window.SeskaPrivacy && !window.SeskaPrivacyGaLoaded);
  assert.equal(await s.page.evaluate(()=>SeskaPrivacy.state().analytics),false);
  assert.equal(s.external.length,2,'withdrawal reload must not load trackers');
  assert.deepEqual(s.errors,[]); reports.push('accept both; consent defaults; advertising denied; withdraw/reload'); await s.context.close();

  s=await session(); await s.page.locator('#seska-cookie-banner [data-reject]').click();
  await s.page.reload(); assert.equal(s.external.length,0); assert.equal(await s.page.locator('#seska-cookie-banner').isVisible(),false);
  reports.push('rejection persists without tracker requests'); await s.context.close();

  for(const category of ['analytics','recordings']) {
    s=await session(); await s.page.locator('#seska-cookie-banner [data-settings]').click();
    await s.page.locator(`[name="${category}"]`).check(); await s.page.locator('[data-save]').click();
    await s.page.waitForTimeout(100); assert.equal(s.external.length,1);
    assert.ok(s.external[0].includes(category==='analytics'?'googletagmanager':'clarity.ms'));
    reports.push(`independent ${category} opt-in`); await s.context.close();
  }
  const saved=JSON.stringify({version:1,at:Date.now(),analytics:true,recordings:true});
  s=await session({gpc:true,saved}); assert.equal(s.external.length,0);
  assert.deepEqual(await s.page.evaluate(()=>SeskaPrivacy.state()),{analytics:false,recordings:false});
  reports.push('GPC overrides existing opt-in'); await s.context.close();

  for(const options of [{saved:'bad json'},{saved:JSON.stringify({version:1,at:0,analytics:true,recordings:true})},{storageBlocked:true}]) {
    s=await session(options); assert.equal(s.external.length,0); assert.equal(await s.page.locator('#seska-cookie-banner').isVisible(),true); await s.context.close();
  } reports.push('invalid, expired and blocked storage fail closed');

  s=await session(); await s.page.goto(origin+'/?email=private@example.com#secret');
  await s.page.locator('[data-accept]').click();
  const event=await s.page.evaluate(()=>dataLayer.map(x=>Array.from(x)).find(x=>x[0]==='event')[2]);
  assert.equal(event.page_location,origin+'/'); assert.equal(event.page_referrer,'');
  const configuration=await s.page.evaluate(()=>dataLayer.map(x=>Array.from(x)).find(x=>x[0]==='config')[2]);
  assert.equal(configuration.page_location,origin+'/'); assert.equal(configuration.page_referrer,'');
  reports.push('page-view payload strips query, hash and referrer'); await s.context.close();

  s=await session(); await s.page.locator('#seska-cookie-banner [data-settings]').click();
  await s.page.keyboard.press('Shift+Tab');
  assert.ok(await s.page.evaluate(()=>document.querySelector('#seska-cookie-dialog').contains(document.activeElement)));
  await s.page.keyboard.press('Escape');
  assert.equal(await s.page.evaluate(()=>document.activeElement.hasAttribute('data-settings')),true);
  reports.push('native dialog keyboard containment and Escape focus return');
  await s.page.locator('[data-accept]').click();
  const second=await s.context.newPage(); await second.goto(origin+'/about.html');
  await second.locator('#seska-privacy-controls [data-optout]').click();
  await s.page.waitForFunction(()=>!!window.SeskaPrivacy && !window.SeskaPrivacyGaLoaded);
  reports.push('cross-tab withdrawal unloads trackers'); await s.context.close();

  s=await session({configured:false});
  assert.equal(await s.page.locator('[data-accept]').isEnabled(),false);
  for(const filename of ['index.html','about.html','privacy.html']) {
    await s.page.goto(origin+'/'+filename); assert.equal(await s.page.locator('#seska-cookie-banner').count(),1);
  }
  await s.page.goto(origin);
  await mkdir(resolve(root,'../privacy-evidence'),{recursive:true});
  await s.page.setViewportSize({width:1440,height:1000});
  await s.page.screenshot({path:resolve(root,'../privacy-evidence/desktop.png')});
  await s.page.setViewportSize({width:375,height:812});
  assert.equal(await s.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await s.page.screenshot({path:resolve(root,'../privacy-evidence/mobile.png')});
  assert.equal(s.external.length,0); assert.deepEqual(s.errors,[]);
  reports.push('unconfigured production state, all pages, mobile width and screenshots');
  console.log(JSON.stringify({passed:reports, vendorTraffic:'intercepted; account receipt not tested'},null,2));
  await s.context.close();
} finally { await browser.close(); server.close(); }
