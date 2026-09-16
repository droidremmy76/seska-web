(() => {
 const icon = name => `<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use href="assets/icons.svg#${name}"></use></svg>`;
 // Modal content is created dynamically; apply the same icon family there.
 const dialog=document.getElementById('detail-dialog');
 if(dialog) new MutationObserver(()=>{
  dialog.querySelectorAll('a.button,button.button').forEach(el=>{
   if(el.querySelector('svg'))return;
   el.textContent=el.textContent.replace('↗','').trim();
   el.insertAdjacentHTML('beforeend',icon(el.id==='download-brief'?'Download':el.id==='copy-brief'?'Copy':'ArrowUpRight'));
  });
 }).observe(dialog,{childList:true,subtree:true});
 const menu=document.querySelector('.menu'),nav=document.querySelector('header nav');
 const closeMenu=()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation')};
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
 document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!e.target.closest('header'))closeMenu()});
})();
