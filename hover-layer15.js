/* The active native artwork sits above the scroll mask; its grid slot stays intact. */
(()=>{
 let grid,layer,portal,active,source,frame=0;
 const ns='http://www.w3.org/2000/svg';let serial=0;
 const style=document.createElement('style');style.textContent=`
 #owner-hover-layer15{position:fixed;inset:0;z-index:70;pointer-events:none;overflow:visible}
 #owner-hover-layer15 .owner-hover-portal15{position:absolute;display:block;margin:0;padding:0;border:0;background:none;pointer-events:none;transform:none!important;scale:none!important;filter:none!important;opacity:1!important;overflow:visible}
 #owner-hover-layer15 .badge-art{display:block;width:100%;height:100%;overflow:visible}
 #grid .badge-art[data-hover-above-mask=true]{opacity:0!important}
 `;document.head.append(style);
 function unique(svg){const ids=new Map();for(const e of svg.querySelectorAll('[id]')){ids.set(e.id,'hover15-'+serial+'-'+e.id);e.id=ids.get(e.id)}for(const e of svg.querySelectorAll('*'))for(const a of [...e.attributes]){let v=a.value;for(const[old,next]of ids)v=v.replaceAll('#'+old, '#'+next);if(v!==a.value)e.setAttribute(a.name,v)}}
 function clear(){if(layer)delete layer.dataset.activeCategory;if(source)delete source.dataset.hoverAboveMask;portal?.remove();portal=null;active=null;source=null;cancelAnimationFrame(frame);frame=0}
 function mount(card){
  clear();if(!card)return;active=card;source=card.querySelector('.badge-art');if(!source)return clear();
  const svg=source.cloneNode(true);delete svg.dataset.hoverAboveMask;serial++;unique(svg);
  const oldTitles=source.querySelectorAll('.badge-title-svg'),newTitles=svg.querySelectorAll('.badge-title-svg');
  oldTitles.forEach((e,i)=>{const cs=getComputedStyle(e);for(const key of ['font-size','font-family','font-weight','letter-spacing','fill','stroke','stroke-width','paint-order'])newTitles[i].style.setProperty(key,cs.getPropertyValue(key),'important')});
  portal=document.createElement('div');portal.className='owner-hover-portal15 badge-drawer is-pointed';portal.setAttribute('aria-hidden','true');portal.append(svg);layer.append(portal);
  const originals=source.getAnimations({subtree:true});const copies=svg.getAnimations({subtree:true});copies.forEach((a,i)=>{if(originals[i]?.currentTime!=null)a.currentTime=originals[i].currentTime});
  source.dataset.hoverAboveMask='true';layer.dataset.activeCategory=card.dataset.category||card.dataset.extraCategory||card.getAttribute('aria-label')||'';
 }

 function hasVisibleSlot(card){
  const viewport=grid.closest('.category-scroll'),clip=viewport?.getBoundingClientRect();if(!clip)return true;
  const mask=getComputedStyle(viewport),scale=clip.height/viewport.offsetHeight||1;
  const topInset=(parseFloat(mask.getPropertyValue('--scroll-top-feather'))||0)*scale,bottomInset=(parseFloat(mask.getPropertyValue('--scroll-bottom-feather'))||0)*scale;
  const r=grid.getBoundingClientRect(),sx=r.width/grid.offsetWidth||1,sy=r.height/grid.offsetHeight||1;
  let x=0,y=0,p=card;while(p&&p!==grid){x+=p.offsetLeft;y+=p.offsetTop;p=p.offsetParent;}
  const left=r.left+x*sx,top=r.top+y*sy;
  return left<clip.right&&left+card.offsetWidth*sx>clip.left&&top<clip.bottom-bottomInset&&top+card.offsetHeight*sy>clip.top+topInset;
 }
 function tick(){
  frame=0;if(!grid?.isConnected)return clear();
  const card=grid.querySelector('.badge-drawer.is-pointed')||grid.querySelector('.badge-drawer:focus-visible');
  if(!card||!hasVisibleSlot(card)){clear();return}if(card!==active)mount(card);if(!source||!portal)return;
  const r=source.getBoundingClientRect();for(const[k,v]of Object.entries({left:r.left,top:r.top,width:r.width,height:r.height}))portal.style[k]=v+'px';
  frame=requestAnimationFrame(tick);
 }
 function queue(){if(!frame)frame=requestAnimationFrame(tick)}
 function boot(){if(grid||document.body?.dataset.view!=='overview')return;grid=document.querySelector('#grid');if(!grid)return;layer=document.createElement('div');layer.id='owner-hover-layer15';layer.setAttribute('aria-hidden','true');document.body.append(layer);new MutationObserver(queue).observe(grid,{subtree:true,attributes:true,attributeFilter:['class']});grid.addEventListener('focusin',queue);grid.addEventListener('focusout',queue);addEventListener('focus',queue);document.addEventListener('scroll',queue,true);addEventListener('resize',queue);addEventListener('blur',clear);queue()}
 new MutationObserver(boot).observe(document.documentElement,{childList:true,subtree:true});addEventListener('DOMContentLoaded',boot);boot();
})();
