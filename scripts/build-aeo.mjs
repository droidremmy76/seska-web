import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name,root),'utf8');
const write = (name,text) => writeFileSync(new URL(name,root),text);
const data = JSON.parse(read('content/answers.json'));
const {business:b,services,faqs,steps} = data;
const url = path => new URL(path,data.siteUrl).href;
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ref = id => ({'@id':id});
const businessId=url('#business'), websiteId=url('#website');
const pages = {
 'index.html':{path:'',name:'Printing & Branding in Kampala',title:'Printing & Branding in Kampala | Seska Investments Ltd',description:'Seska Investments Ltd offers printing, signage, branded apparel, ID cards and design on Nasser Road, Kampala. Explore services and prepare a project brief.'},
 'about.html':{path:'about.html',name:'About Seska',title:'About Seska Investments Ltd | Nasser Road, Kampala',description:'Find Seska Investments Ltd business details, opening hours, service area and privacy contact. Printing, design and branding on Nasser Road in Kampala.',type:'AboutPage'},
 'privacy.html':{path:'privacy.html',name:'Privacy notice',title:'Privacy Notice & Cookie Choices | Seska Investments Ltd',description:'How Seska’s local project brief and optional analytics handle information, how to change cookie choices, and how to make a privacy request.'},
 'services.html':{path:'services.html',name:'Services',title:'Printing, Signage & Branding Services | Seska Kampala',description:'Compare nine Seska services: print, signage, ID cards, apparel, merchandise, stickers, finishing, technical plotting and digital design. See what each brief needs.',type:'CollectionPage'},
 'ordering-guide.html':{path:'ordering-guide.html',name:'Ordering guide',title:'How to Prepare a Print Order | Seska Investments Ltd',description:'Prepare a Seska project brief: specifications, artwork, quote, approval, production and delivery. Understand what the website saves and what you must share.'},
 'answers.html':{path:'answers.html',name:'Answers',title:'Printing Questions Answered | Seska Investments Ltd',description:'Answers about Seska’s Kampala location, opening hours, quotes, artwork formats, order quantities, turnaround, delivery and privacy.',type:'FAQPage'}
};
function breadcrumb(file) {
 const p=pages[file]; return `<nav class="answer-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li aria-current="page">${esc(p.name)}</li></ol></nav>`;
}
function businessFacts() { return `<section class="business-facts" id="business-details" aria-labelledby="business-details-title"><h2 id="business-details-title">Seska Investments Ltd: business details</h2><dl><div><dt>Business</dt><dd>${esc(b.name)}</dd></div><div><dt>Services</dt><dd>Printing, design and branding</dd></div><div><dt>Location</dt><dd>${esc(b.street)}, ${esc(b.city)}, Uganda</dd></div><div><dt>Postal address</dt><dd>${esc(b.postalAddress)}</dd></div><div><dt>Listed opening hours</dt><dd>${esc(b.hours)}</dd></div><div><dt>Service area</dt><dd>Uganda; delivery arrangements are confirmed with the quote</dd></div><div><dt>Privacy requests</dt><dd><a href="mailto:${esc(b.privacyEmail)}">${esc(b.privacyEmail)}</a></dd></div></dl><p>The exact workshop map pin and direct enquiry phone number are not yet confirmed on this website. <a href="index.html#contact">Check the contact section before visiting</a>.</p></section>`; }
function toc(items) { return `<nav class="answer-toc" aria-label="On this page"><h2>On this page</h2><ol>${items.map(x=>`<li><a href="#${x.id}">${esc(x.title||x.name||x.question)}</a></li>`).join('')}</ol></nav>`; }
function cta() { return '<aside class="answer-next"><h2>Ready to describe your project?</h2><p>The brief tool prepares text on your device. You can copy or download it; it is not automatically sent to Seska.</p><a class="button blue" href="index.html#quote">Prepare a project brief</a><a href="ordering-guide.html">Read the ordering guide</a></aside>'; }
function article(f) { return `<article class="answer-unit" id="${f.id}" aria-labelledby="${f.id}-title"><h2 id="${f.id}-title">${esc(f.question)}</h2><p class="direct-answer">${esc(f.answer)}</p><a class="answer-related" href="${esc(f.related)}">${esc(f.label)}</a></article>`; }
const servicesMain = `<main id="main-content" class="answer-page">${breadcrumb('services.html')}<header class="answer-intro"><p class="eyebrow">SESKA SERVICE GUIDE</p><h1>Printing, signage<br>and branding services.</h1><p>Seska Investments Ltd provides nine connected services from Nasser Road in Kampala, Uganda. Choose the service that fits your job, then use its brief checklist to describe what you need.</p><p>Materials, pricing, quantities and turnaround are confirmed for each order.</p></header><div class="answer-layout">${toc(services)}<div>${services.map((s,i)=>`<section class="answer-unit" id="${s.id}" aria-labelledby="${s.id}-title"><p class="eyebrow">SERVICE ${String(i+1).padStart(2,'0')}</p><h2 id="${s.id}-title">${esc(s.name)}</h2><p class="direct-answer">${esc(s.summary)}</p><dl class="service-purpose"><dt>What is this service for?</dt><dd>${esc(s.purpose)}</dd></dl><h3>What should your brief include?</h3><ul>${s.inputs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><a class="answer-related" href="index.html#quote">Prepare a ${esc(s.name.toLowerCase())} brief</a></section>`).join('')}</div></div>${cta()}</main>`;
const answersMain = `<main id="main-content" class="answer-page">${breadcrumb('answers.html')}<header class="answer-intro"><p class="eyebrow">QUESTIONS ABOUT SESKA</p><h1>Questions about<br>printing at Seska.</h1><p>Find practical answers about Seska Investments Ltd in Kampala, from artwork and pricing to delivery and your project brief.</p></header><div class="answer-layout">${toc(faqs)}<div>${faqs.map(article).join('')}</div></div>${cta()}</main>`;
const orderMain = `<main id="main-content" class="answer-page">${breadcrumb('ordering-guide.html')}<header class="answer-intro"><p class="eyebrow">FROM BRIEF TO COLLECTION</p><h1>How to prepare<br>your print order.</h1><p>Start a Seska order with the product, size, quantity, artwork, deadline and delivery destination. Agree the quote and approval before production. The online tool prepares a brief locally; it does not submit an order.</p></header><div class="answer-layout">${toc(steps)}<div><ol class="ordering-steps">${steps.map((s,i)=>`<li class="answer-unit" id="${s.id}"><p class="eyebrow">STEP ${i+1}</p><h2>${esc(s.title)}</h2><p class="direct-answer">${esc(s.text)}</p>${s.id==='quote-details'?'<p><a class="answer-related" href="services.html">Check the details needed for your service</a></p>':''}${s.id==='artwork'?'<p><a class="answer-related" href="answers.html#artwork-formats">Read the artwork format answer</a></p>':''}${s.id==='save-brief'?'<p><a class="answer-related" href="privacy.html">Understand how the brief handles your information</a></p>':''}</li>`).join('')}</ol></div></div>${cta()}</main>`;
// New pages reuse the current site's assets, navigation, privacy controls and footer.
const normalizeFooter = html => html.replace(/<footer>[\s\S]*?<\/footer>/, block=>block.replace(/<h2>/g,'<h3>').replace(/<\/h2>/g,'</h3>'));
const shell=normalizeFooter(read('about.html'));
for(const [file,main] of Object.entries({'services.html':servicesMain,'ordering-guide.html':orderMain,'answers.html':answersMain})) write(file,shell.replace(/<main[\s\S]*?<\/main>/,main));

let home=read('index.html');
home=home.replace(/<h1>[\s\S]*?<\/h1>/,'<h1>PRINTING &amp; BRANDING<br/><span>IN <i>KAMPALA.</i></span></h1>');
home=home.replaceAll('Get a Fast Quote','Prepare a Project Brief');
const overview=`<!-- answer-overview:start --><section class="section answer-overview" id="seska-overview"><p class="eyebrow">PRINTING IN KAMPALA, UGANDA</p><h2>What does Seska Investments Ltd do?</h2><p>${esc(faqs[0].answer)}</p><div class="answer-hub-links"><a href="services.html">Compare services and brief requirements</a><a href="ordering-guide.html">Prepare an order</a><a href="answers.html">Find answers about Seska</a></div></section><!-- answer-overview:end -->`;
home=home.replace(/<!-- answer-overview:start -->[\s\S]*?<!-- answer-overview:end -->/,'');
home=home.replace(/(<section[^>]*id="proof"[\s\S]*?<\/section>)/,`$1${overview}`);
home=home.replace(/<section class="section" id="faq">[\s\S]*?<\/section>/,`<section class="section" id="faq"><div class="section-head"><div><span class="eyebrow">BEFORE YOU PLACE YOUR ORDER</span><h2>Printing questions,<br><em>answered.</em></h2></div><p><a class="answer-related" href="answers.html">Read all ${faqs.length} answers about Seska</a></p></div><div class="faq-list">${['quote-cost','turnaround','artwork-formats','delivery'].map(id=>{const f=faqs.find(x=>x.id===id);return `<details><summary>${esc(f.question)}<span aria-hidden="true">+</span></summary><p>${esc(f.answer)} <a class="answer-related" href="${f.related}">${esc(f.label)}</a></p></details>`}).join('')}</div></section>`);
let serviceIndex=0;
home=home.replace(/<div class="service-body">[\s\S]*?<\/div>/g,block=>{
 const s=services[serviceIndex++];
 if(!s) throw Error('Unexpected extra service in homepage');
 block=block.replace(/<p>[\s\S]*?<\/p>/,`<p>${esc(s.summary)}</p>`).replace(/<a class="answer-service-link"[\s\S]*?<\/a>/,'');
 return block.replace('</div>',`<a class="answer-service-link" href="services.html#${s.id}">View service details and brief checklist</a></div>`);
});
if(serviceIndex!==services.length) throw Error('Homepage service count does not match the content model');
write('index.html',home);
let about=read('about.html');
about=about.replace(/<div class="section-head">[\s\S]*?<\/h[12]>/,'<div class="section-head"><div><span class="eyebrow">ABOUT SESKA INVESTMENTS LTD</span><h1>Printing, design and branding<br>on Nasser Road.</h1>');
about=about.replace(/<!-- business-facts:start -->[\s\S]*?<!-- business-facts:end -->/,'');
about=about.replace('</main>',`<!-- business-facts:start -->${businessFacts()}<!-- business-facts:end --></main>`);
about=about.replace(/<h3>/g,'<h2>').replace(/<\/h3>/g,'</h2>');
write('about.html',about);
let privacy=read('privacy.html');
privacy=privacy.replace(/<div class="section-head">[\s\S]*?<\/h[12]>/,'<div class="section-head"><div><span class="eyebrow">YOUR INFORMATION</span><h1>Privacy notice<br>and cookie choices.</h1>');
privacy=privacy.replace(/<h3>/g,'<h2>').replace(/<\/h3>/g,'</h2>');
write('privacy.html',privacy);

function graph(file) {
 const p=pages[file], canonical=url(p.path), pageId=canonical+'#webpage';
 const site={'@type':'WebSite','@id':websiteId,url:data.siteUrl,name:b.name,publisher:ref(businessId),inLanguage:'en'};
 const page={'@type':p.type||'WebPage','@id':pageId,url:canonical,name:p.title,description:p.description,isPartOf:ref(websiteId),about:ref(businessId),inLanguage:'en'};
 const nodes=[site,page];
 if(file==='index.html'||file==='about.html') nodes.push({'@type':'LocalBusiness','@id':businessId,name:b.name,url:data.siteUrl,description:b.description,logo:url('assets/seska-logo.png'),address:{'@type':'PostalAddress',streetAddress:b.street,addressLocality:b.city,addressCountry:b.country,postOfficeBoxNumber:'141411'},areaServed:{'@type':'Country',name:b.serviceArea},openingHoursSpecification:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d=>'https://schema.org/'+d),opens:'08:00',closes:'18:00'},contactPoint:{'@type':'ContactPoint',contactType:'privacy requests',email:b.privacyEmail}});
 if(file!=='index.html') {
  const id=canonical+'#breadcrumb'; page.breadcrumb=ref(id);
  nodes.push({'@type':'BreadcrumbList','@id':id,itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:data.siteUrl},{'@type':'ListItem',position:2,name:p.name,item:canonical}]});
 }
 if(file==='index.html'||file==='about.html') page.mainEntity=ref(businessId);
 if(file==='services.html') {
  const id=canonical+'#service-list'; page.mainEntity=ref(id);
  nodes.push({'@type':'ItemList','@id':id,name:'Seska printing, design and branding services',numberOfItems:services.length,itemListElement:services.map((s,i)=>({'@type':'ListItem',position:i+1,item:ref(canonical+'#'+s.id)}))});
  for(const s of services) nodes.push({'@type':'Service','@id':canonical+'#'+s.id,url:canonical+'#'+s.id,name:s.name,serviceType:s.name,description:s.summary,provider:ref(businessId),areaServed:{'@type':'Country',name:b.serviceArea},mainEntityOfPage:ref(pageId)});
 }
 if(file==='answers.html') page.mainEntity=faqs.map(f=>({'@type':'Question','@id':canonical+'#'+f.id,url:canonical+'#'+f.id,name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}));
 if(file==='ordering-guide.html') {
  const id=canonical+'#ordering-steps'; page.mainEntity=ref(id);
  nodes.push({'@type':'ItemList','@id':id,name:'Preparing a Seska order',itemListOrder:'https://schema.org/ItemListOrderAscending',numberOfItems:steps.length,itemListElement:steps.map((s,i)=>({'@type':'ListItem',position:i+1,name:s.title,description:s.text,url:canonical+'#'+s.id}))});
 }
 return {'@context':'https://schema.org','@graph':nodes};
}
const navigation=[['index.html','Home'],['services.html','Services'],['ordering-guide.html','Ordering'],['answers.html','Answers'],['about.html','About'],['index.html#contact','Contact']];
for(const [file,p] of Object.entries(pages)) {
 let html=normalizeFooter(read(file));
 // Replace rather than append metadata so rebuilding cannot duplicate tags.
 html=html.replace(/<!-- aeo-head:start -->[\s\S]*?<!-- aeo-head:end -->/,'')
  .replace(/<title>[\s\S]*?<\/title>/,'')
  .replace(/<meta\b(?=[^>]*\bname="description")[^>]*>/g,'');
 const meta=`<!-- aeo-head:start -->\n<title>${esc(p.title)}</title>\n<meta name="description" content="${esc(p.description)}">\n<link rel="canonical" href="${url(p.path)}">\n<meta name="robots" content="index, follow, max-image-preview:large">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="${esc(b.name)}">\n<meta property="og:title" content="${esc(p.title)}">\n<meta property="og:description" content="${esc(p.description)}">\n<meta property="og:url" content="${url(p.path)}">\n<meta property="og:image" content="${url('assets/seska-logo.png')}">\n<meta property="og:image:alt" content="Seska Investments Ltd logo">\n<meta name="twitter:card" content="summary">\n<meta name="twitter:title" content="${esc(p.title)}">\n<meta name="twitter:description" content="${esc(p.description)}">\n<meta name="twitter:image" content="${url('assets/seska-logo.png')}">\n<meta name="twitter:image:alt" content="Seska Investments Ltd logo">\n<link rel="stylesheet" href="answers.css">\n<script type="application/ld+json">${JSON.stringify(graph(file)).replace(/</g,'\\u003c')}</script>\n<!-- aeo-head:end -->`;
 html=html.replace('</head>',meta+'</head>');
 html=html.replace(/<nav aria-label="Main navigation">[\s\S]*?<\/nav>/,`<nav aria-label="Main navigation">${navigation.map(([href,label])=>`<a href="${href}"${href===file?' aria-current="page"':''}>${label}</a>`).join('')}</nav>`);
 if(!['index.html','services.html','ordering-guide.html','answers.html'].includes(file)) {
  html=html.replace(/<nav class="answer-breadcrumb"[\s\S]*?<\/nav>/,'');
  html=html.replace('<main id="main-content">','<main id="main-content">'+breadcrumb(file));
 }
 html=html.replace(/<!-- answer-footer:start -->[\s\S]*?<!-- answer-footer:end -->/,'');
 html=html.replace('</footer>',`<!-- answer-footer:start --><div class="answer-footer"><a href="services.html">Service guide</a><a href="ordering-guide.html">Ordering guide</a><a href="answers.html">Questions and answers</a><a href="about.html#business-details">Business details</a><a href="mailto:${esc(b.privacyEmail)}">Privacy requests: ${esc(b.privacyEmail)}</a></div><!-- answer-footer:end --></footer>`);
 write(file,html);
}
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+Object.values(pages).map(p=>`  <url><loc>${url(p.path)}</loc></url>`).join('\n')+'\n</urlset>\n');
write('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${url('sitemap.xml')}\n`);
console.log(`Built ${Object.keys(pages).length} pages with static content, schema, metadata and crawl discovery files.`);
