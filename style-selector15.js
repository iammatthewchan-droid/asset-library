/* Changes only the skin query. Native page, selection, scrolling and effects remain. */
(()=>{
 const choices=[['sky01','Starry sky','#172e48'],['p01','Purple glass','#2b1739'],['mb01','Metallic black','#0b0b0d']];
 const stateKey='ds-style-switch15:'+location.pathname+':'+(new URL(location).searchParams.get('drawer')||'all');
 let control,frame,restored=false;
 function protects(x,y){
  if(!control?.isConnected||control.dataset.positioned!=='true')return false;
  const r=control.getBoundingClientRect();
  const u=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--compact-home-unit'))||1,pad=12*u;
  // Keep the lower approach lane independent of both hover magnification and the index.
  if(document.body.dataset.view==='overview'&&innerWidth>=600)return y>=r.top-pad;
  return x>=r.left-pad&&x<=r.right+pad&&y>=r.top-pad&&y<=r.bottom+pad;
 }
 window.DSStyleControls={protects};
 function place(){
  frame=0;if(!control)return;
  const u=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--compact-home-unit'))||1;
  control.style.setProperty('--style-selector-top','auto');
  // Mirror the existing action dock's69.12-unit right and45-unit bottom margins.
  // Keep the action row's existing1px right inset; mirror it on the homepage too.
  const g=1.2*u,side=innerWidth>=600?(innerWidth-1440*g)/2+69.12*g+1:24;
  // Keep the homepage controller in the same centered16:9 scene as its four rows.
  const homepage=document.body.dataset.view==='overview';
  const sceneTop=Math.max(0,(innerHeight-1080*u)/2);
  const bottom=innerWidth>=600?(homepage?sceneTop+25*g:45*g):24;
  const bounds=control.getBoundingClientRect(),dot=control.querySelector('.style-dot').getBoundingClientRect();
  // Match the visible circle edges, including their borders, rather than hit-box padding.
  control.style.setProperty('--style-selector-left',Math.max(8,side-(dot.left-bounds.left))+'px');
  control.style.setProperty('--style-selector-bottom',Math.max(8,bottom-(bounds.bottom-dot.bottom))+'px');
  control.dataset.positioned='true';
  dispatchEvent(new Event('stylecontrolpositioned'));
 }
 function queue(){if(!frame)frame=requestAnimationFrame(place)}
 function remember(){
  const selected=[...document.querySelectorAll('.asset-tile[role="checkbox"][aria-checked="true"]')].map(e=>e.getAttribute('aria-label'));
  const menu=document.querySelector('.menu-hit[data-menu-tier="0"][aria-checked="true"]');
  sessionStorage.setItem(stateKey,JSON.stringify({selected,folder:menu?.getAttribute('aria-label')||menu?.textContent.trim(),assetScroll:document.querySelector('.asset-scroll')?.scrollTop||0,categoryScroll:document.querySelector('.category-scroll')?.scrollTop||0}));
 }
 function restore(){
  if(restored||document.documentElement.dataset.libraryReady!=='true')return;
  if(document.body.dataset.view==='overview'&&document.querySelector('script[src="/four-rows.js"]')&&!document.querySelector('.category-scroll'))return;
  const saved=sessionStorage.getItem(stateKey);if(!saved){restored=true;return}
  let state;try{state=JSON.parse(saved)}catch{sessionStorage.removeItem(stateKey);restored=true;return}
  const menu=[...document.querySelectorAll('.menu-hit[data-menu-tier="0"]')].find(e=>(e.getAttribute('aria-label')||e.textContent.trim())===state.folder);
  if(menu&&menu.getAttribute('aria-checked')!=='true'){menu.click();queue();return}
  const tiles=[...document.querySelectorAll('.asset-tile[role="checkbox"]')];
  if(state.selected.some(label=>!tiles.some(e=>e.getAttribute('aria-label')===label)))return;
  restored=true;sessionStorage.removeItem(stateKey);
  for(const label of state.selected){const tile=tiles.find(e=>e.getAttribute('aria-label')===label);if(tile&&tile.getAttribute('aria-checked')!=='true')tile.click()}
  // The four-row component sets its initial scroll snap on the next frame.
  // Restore the user's position after that initialization, not before its reset.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const a=document.querySelector('.asset-scroll'),c=document.querySelector('.category-scroll');if(a)a.scrollTop=state.assetScroll;if(c)c.scrollTop=state.categoryScroll;control.dataset.stateRestored='true';queue();}));
 }
 function boot(){
  if(!document.body)return;
  if(!control){
   control=document.createElement('nav');control.className='ds-style-selector';control.setAttribute('aria-label','Choose visual style');
   const current=document.documentElement.dataset.skin||'sky01';
   for(const[key,label,color]of choices){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.title=label;b.dataset.skinChoice=key;b.setAttribute('aria-pressed',String(current===key));const dot=document.createElement('span');dot.className='style-dot';dot.style.setProperty('--style-dot-color',color);b.append(dot);b.onclick=()=>{try{localStorage.setItem('ds-asset-library-skin-v1',key)}catch{}if(current===key)return;remember();const target=new URL(location);target.searchParams.set('skin',key);location.assign(target.href)};control.append(b)}document.body.append(control);
  }
  if(!control.isConnected)document.body.append(control);
  restore();queue();
 }
 const setupObserver=new MutationObserver(()=>{boot();if(restored&&control?.isConnected)setupObserver.disconnect();});
 setupObserver.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-library-ready']});
 addEventListener('resize',queue);addEventListener('drawerchange',()=>{restore();queue()});addEventListener('DOMContentLoaded',boot);boot();
})();
