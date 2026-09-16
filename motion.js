// Content stays readable without JavaScript and when reduced motion is requested.
(() => {
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const active = new Set();
 let observer;
 const elements = [...document.querySelectorAll('[data-reveal]')];
 function stop() { observer?.disconnect(); active.forEach(a=>a.cancel()); active.clear(); }
 function start() {
  stop();
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el=entry.target;
    observer.unobserve(el);
    if (el.dataset.revealed) return;
    el.dataset.revealed='true';
    const kind=el.dataset.reveal;
    const delay=Math.min(240,Number(el.dataset.delay)||0);
    const start=kind==='image' ? {opacity:0,transform:'translateY(28px) scale(.985)'} : {opacity:0,transform:`translateY(${kind==='line'?32:20}px)`};
    const animation=el.animate([start,{opacity:1,transform:'translateY(0) scale(1)'}],{duration:kind==='image'?1000:760,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    active.add(animation);
    animation.finished.then(()=>active.delete(animation)).catch(()=>active.delete(animation));
   });
  },{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
  elements.forEach(el=>{if(!el.dataset.revealed)observer.observe(el)});
 }
 document.addEventListener('focusin',()=>{active.forEach(a=>a.finish());active.clear()});
 preference.addEventListener('change',start);
 start();
})();
