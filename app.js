const menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=document.querySelector('nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('nav').classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.querySelectorAll('[data-product]').forEach(a=>a.addEventListener('click',()=>document.getElementById('service-select').value=a.dataset.product));
const dialog=document.getElementById('detail-dialog'),content=document.getElementById('dialog-content');document.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const projects={signage:['Large-format & signage','Make room for a bigger idea.','Banners, outdoor displays and shop branding. Tell us the intended location, dimensions, quantity and preferred material so we can prepare a suitable quote.'],apparel:['Corporate apparel','Bring your team together.','Polos, T-shirts and caps with your branding. Include garment type, sizes, quantities, colours and logo placement in your brief.'],identity:['Cards & brand collateral','Your brand, in every detail.','PVC cards, identification and branded collateral. Share the quantity, artwork requirements and whether individual names or details are needed.'],design:['Design & creative direction','Let’s give your idea a direction.','From a first concept to print-ready artwork, we help turn your brief into a consistent brand presence. Tell us about your audience, message and deliverables.']};
document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>{const p=projects[b.dataset.detail];content.innerHTML=`<img src="assets/${b.dataset.detail}.webp" alt="${p[0]} concept"><span class="eyebrow">${p[0]}</span><h2>${p[1]}</h2><p>${p[2]}</p><p class="form-note">Illustrative brand concept from our supplied visual collection.</p><a href="#quote" class="button">Discuss a similar project ↗</a>`;content.querySelector('a').addEventListener('click',()=>dialog.close());dialog.showModal()}));
document.getElementById('quote-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const brief=`SESKA INVESTMENTS LTD — PROJECT BRIEF\n\nName: ${data.get('name')}\nBusiness: ${data.get('company')||'—'}\nContact: ${data.get('contact')}\nService: ${data.get('service')}\nQuantity: ${data.get('quantity')||'To discuss'}\nPreferred deadline: ${data.get('deadline')||'To discuss'}\nDelivery location: ${data.get('location')||'To discuss'}\n\nProject details:\n${data.get('details')}`;content.innerHTML='<span class="eyebrow">YOUR PROJECT BRIEF</span><h2>READY FOR THE NEXT STEP.</h2><p>Your brief is prepared. It has not been sent to Seska. Copy or download it to share with the team.</p><textarea readonly aria-label="Your project brief"></textarea><button class="button" id="copy-brief">Copy brief</button> <button class="button blue" id="download-brief">Download</button><p id="copy-status" role="status"></p>';content.querySelector('textarea').value=brief;content.querySelector('#copy-brief').onclick=async()=>{try{await navigator.clipboard.writeText(brief);content.querySelector('#copy-status').textContent='Brief copied. Ready to share.'}catch{content.querySelector('textarea').select();content.querySelector('#copy-status').textContent='Select and copy the brief above.'}};content.querySelector('#download-brief').onclick=()=>{const url=URL.createObjectURL(new Blob([brief],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='seska-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};dialog.showModal()});
document.getElementById('year').textContent=new Date().getFullYear();
// Render the hero from ten compact sprite sheets: 240 frames with no media-seeking dependency.
const video = document.getElementById('hero-video');
const hero = document.querySelector('.hero');
const frame = document.querySelector('.hero-image');
const stage = document.querySelector('.video-stage');
const poster = frame.querySelector('img');
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const progressBar = document.querySelector('.video-progress');
const instruction = document.querySelector('.film-instruction');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const FRAME_COUNT=240, COLS=6, ROWS=4, SOURCE_W=480, SOURCE_H=270;
const sheets=new Map(), pending=new Set();
let targetFrame=0, displayedFrame=-1, scheduled=false, active=0, started=false;
function sheetIndexFor(frameNumber){ return Math.floor(frameNumber/24); }
function drawCurrentFrame(){
 if(motionPreference.matches||!ctx)return;
 const sheet=sheets.get(sheetIndexFor(targetFrame));
 if(!sheet||displayedFrame===targetFrame)return;
 const local=targetFrame%24, sx=(local%COLS)*SOURCE_W, sy=Math.floor(local/COLS)*SOURCE_H;
 ctx.drawImage(sheet,sx,sy,SOURCE_W,SOURCE_H,0,0,canvas.width,canvas.height);
 displayedFrame=targetFrame; canvas.hidden=false; poster.hidden=true; canvas.dataset.frame=String(targetFrame);
}
function queueSheets(){
 if(!started||motionPreference.matches||!ctx)return;
 const wanted=sheetIndexFor(targetFrame), order=[wanted,wanted+1,wanted-1];
 for(let i=0;i<10;i++)order.push(i);
 for(const index of order){
  if(active>=3)break;
  if(index<0||index>=10||sheets.has(index)||pending.has(index))continue;
  active++;pending.add(index);const image=new Image();image.decoding='async';
  image.onload=()=>{sheets.set(index,image);pending.delete(index);active--;drawCurrentFrame();queueSheets();};
  image.onerror=()=>{pending.delete(index);active--;started=false;hero.classList.remove('has-video');canvas.hidden=true;poster.hidden=false;video.hidden=true;instruction.textContent='SESKA — DESIGN · PRINT · BRAND';};
  image.src=`assets/hero-sheets/sheet-${String(index+1).padStart(2,'0')}.webp`;
 }
}
function updateFilm(){
 scheduled=false;if(motionPreference.matches||!started)return;
 const inset=parseFloat(getComputedStyle(frame).top)||0;
 const travel=Math.max(1,stage.offsetHeight-frame.offsetHeight);
 const progress=Math.max(0,Math.min(1,(inset-stage.getBoundingClientRect().top)/travel));
 targetFrame=Math.round(progress*(FRAME_COUNT-1));progressBar.style.width=`${progress*100}%`;drawCurrentFrame();queueSheets();
}
function requestFilmUpdate(){if(!scheduled){scheduled=true;requestAnimationFrame(updateFilm);}}
function setMotionMode(){
 video.pause();const reduced=motionPreference.matches||!ctx;hero.classList.toggle('has-video',!reduced);video.hidden=!reduced;video.controls=reduced;
 if(reduced){video.removeAttribute('src');canvas.hidden=true;poster.hidden=false;instruction.textContent='SESKA — DESIGN · PRINT · BRAND';}
 else{video.removeAttribute('src');video.load();started=true;displayedFrame=-1;instruction.textContent='SCROLL DOWN TO PLAY · SCROLL UP TO REWIND';requestFilmUpdate();}
}
addEventListener('scroll',requestFilmUpdate,{passive:true});addEventListener('resize',requestFilmUpdate);addEventListener('pageshow',requestFilmUpdate);motionPreference.addEventListener('change',setMotionMode);setMotionMode();

// Enquiry links prefill the brief without implying it has been sent.
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{document.getElementById('service-select').value=link.dataset.service;}));
document.querySelectorAll('[data-catalog]').forEach(link=>link.addEventListener('click',()=>{const details=document.querySelector('[name="details"]');const item=link.dataset.catalog;details.value=details.value ? details.value+'\nProduct: '+item : 'Product: '+item+'\nSize / finish: ';document.getElementById('service-select').value='Something else';}));
document.querySelectorAll('.whatsapp-trigger').forEach(button=>button.addEventListener('click',()=>{content.innerHTML='<span class="eyebrow">DIRECT CONTACT</span><h2>LET’S GET YOUR BRIEF READY.</h2><p>Seska’s verified WhatsApp number has not been connected to this preview yet. No message has been sent.</p><p>You can prepare and download your project brief, or visit us on Nasser Road, Kampala, Monday–Saturday, 8am–6pm.</p><a class="button blue" href="#quote">Prepare a project brief ↗</a>';content.querySelector('a').onclick=()=>dialog.close();dialog.showModal();}));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.work-card').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.detail!==button.dataset.filter);}));
const resultStages=[['large-format','Illustrative vinyl printing'],['storefront','Illustrative storefront graphic application'],['studio','Illustrative completed branded storefront']];
document.querySelectorAll('[data-result]').forEach(button=>button.addEventListener('click',()=>{const stage=resultStages[Number(button.dataset.result)];const img=document.getElementById('result-image');img.src='assets/'+stage[0]+'.webp';img.alt=stage[1];document.querySelectorAll('[data-result]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
if ('IntersectionObserver' in window) {
 const processSteps=[...document.querySelectorAll('[data-process-image]')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){const step=entry.target;document.getElementById('process-image').src='assets/'+step.dataset.processImage+'.webp';document.getElementById('process-image').alt='Illustrative '+step.dataset.processLabel.toLowerCase();document.getElementById('process-caption').textContent=step.dataset.processLabel+' · Illustrative visual';processSteps.forEach(s=>s.classList.toggle('active',s===step));}}},{rootMargin:'-20% 0px -45% 0px',threshold:0});
 processSteps.forEach(step=>observer.observe(step));
}
