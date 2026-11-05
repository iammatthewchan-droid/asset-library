'use strict';
// Asset Library naming and owner-requested Inter Bold home heading. Server-side access rules remain unchanged.
(()=>{
 const ns='http://www.w3.org/2000/svg';
 function apply(){
  document.body.dataset.personalLibrary='asset-library';
  const header=document.querySelector('.owner-header-art text');
  if(header&&header.textContent!=='ASSET LIBRARY'){header.textContent='ASSET LIBRARY';header.setAttribute('font-size','38');}
  const title=document.querySelector('#title');
  if(document.body.dataset.view==='overview'&&title){
   const art=title.querySelector('.owner-heading-art');
   if(art&&art.dataset.personalTitle!=='asset-categories-bold-motion-02nov'){
    art.replaceChildren();document.documentElement.style.setProperty('--owner-heading-width','735.24345');art.setAttribute('viewBox','0 0 735.24345 82');art.dataset.personalTitle='asset-categories-bold-motion-02nov';
    const text=document.createElementNS(ns,'text');text.setAttribute('x','0');text.setAttribute('y','64.7236');text.setAttribute('font-family','Inter,Arial,sans-serif');text.setAttribute('font-size','62.787');text.setAttribute('font-weight','700');text.setAttribute('letter-spacing','-1.569675');text.setAttribute('fill','#cccccc');text.textContent='Design Asset Categories';art.append(text);
    const accessible=title.querySelector('.page-heading-accessible');if(accessible)accessible.textContent='Design Asset Categories';title.setAttribute('aria-label','Design Asset Categories');
   }
  }
  const name=document.body.dataset.view==='overview'?'':(title?.getAttribute('aria-label')||'');const label=(name?name+' · ':'')+'Asset Library';if(document.title!==label)document.title=label;
  const home=document.querySelector('.brand-home');if(home)home.setAttribute('aria-label','Asset Library — all drawers');
 }
 const observer=new MutationObserver(apply);observer.observe(document.body,{subtree:true,childList:true});
 for(const event of ['ownerlayoutready','drawerchange','libraryaccountchange'])window.addEventListener(event,apply);
 apply();
})();
