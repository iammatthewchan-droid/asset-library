/* Fit only the navigation to the available viewport; never resize the scene. */
(()=>{
 let frame;
 function sync(){
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const unit=Math.max(.78,Math.min(1.25,innerWidth/1536,innerHeight/864));
   for(const panel of document.querySelectorAll('.layout>aside,#drawer-library-index')){
    const nav=panel.querySelector('nav');if(!nav)continue;
    panel.style.setProperty('--ds-index-unit',unit+'px');
    panel.style.setProperty('--ds-index-width',Math.min(innerWidth,Math.max(210,256*unit))+'px');
    panel.style.setProperty('--ds-index-font',Math.max(14,18*unit)+'px');
    panel.style.setProperty('--ds-index-heading',Math.max(17,22*unit)+'px');
    panel.style.setProperty('--ds-index-small',Math.max(14,12*unit)+'px');
    const gap=16*unit,foot=panel.querySelector('.side-note');
    const footer=foot?foot.getBoundingClientRect().height+18*unit:0;
    const lastTop=Math.max(gap,innerHeight-nav.getBoundingClientRect().height-footer-gap);
    const anchor=panel.id==='drawer-library-index'?document.querySelector('#layout-stage .menu-hit[data-menu-tier="0"]'):window.libraryIndexController?.trigger;
    const desired=anchor?.getBoundingClientRect().top??gap;
    panel.style.setProperty('--ds-index-top',Math.max(gap,Math.min(desired,lastTop))+'px');
   }
  });
 }
 new MutationObserver(sync).observe(document.documentElement,{childList:true,subtree:true});
 addEventListener('resize',sync);addEventListener('load',sync);document.fonts.ready.then(sync);sync();
})();
