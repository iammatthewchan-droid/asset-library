/* Owner: immediate tag targeting using unscaled layout slots, not lingering enlarged hit boxes. */
(()=>{
 const grid=document.getElementById('grid');if(!grid)return;let active=null,lastPointer=null;grid.dataset.pointerTargets='visible-slots-15nov';
 function point(card){if(card===active)return;active?.classList.remove('is-pointed');active=card;active?.classList.add('is-pointed');grid.dataset.pointedCategory=active?.dataset.category||'';}
 function box(el){
  // Grid coordinates stay neutral while individual badges enlarge or recede.
  // Its screen origin already includes scrolling and ancestor transforms.
  const r=grid.getBoundingClientRect(),sx=r.width/grid.offsetWidth||1,sy=r.height/grid.offsetHeight||1;
  let x=0,y=0,p=el;while(p&&p!==grid){x+=p.offsetLeft;y+=p.offsetTop;p=p.offsetParent;}
  return{x:r.left+x*sx,y:r.top+y*sy,w:el.offsetWidth*sx,h:el.offsetHeight*sy};
 }
 function track(e){
  lastPointer=e;
  if(window.DSStyleControls?.protects(e.clientX,e.clientY)){point(null);return;}
  const viewport=grid.closest('.category-scroll');const r=viewport?.getBoundingClientRect();
  const mask=viewport?getComputedStyle(viewport):null,scale=viewport?r.height/viewport.offsetHeight||1:1;
  const clip=r?{left:r.left,right:r.right,top:r.top+(parseFloat(mask.getPropertyValue('--scroll-top-feather'))||0)*scale,bottom:r.bottom-(parseFloat(mask.getPropertyValue('--scroll-bottom-feather'))||0)*scale}:{left:0,top:0,right:innerWidth,bottom:innerHeight};
  if(viewport){if(e.clientX<clip.left||e.clientX>clip.right||e.clientY<clip.top||e.clientY>clip.bottom){point(null);return;}}
  if(e.pointerType==='touch'||document.body.dataset.view!=='overview'){point(null);return;}
  const cards=[...grid.querySelectorAll('.badge-drawer')];if(!cards.length)return;
  const boxes=cards.map(el=>{const b=box(el);const left=Math.max(b.x,clip.left),top=Math.max(b.y,clip.top),right=Math.min(b.x+b.w,clip.right),bottom=Math.min(b.y+b.h,clip.bottom);return{el,left,top,right,bottom};}).filter(b=>b.right>b.left&&b.bottom>b.top);
  // A masked row and a gap are not pointer targets. Use the visible neutral slot,
  // so enlargement never changes the hit area or selects an off-screen neighbour.
  const hit=boxes.find(b=>e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom);
  point(hit?.el||null);
 }
 document.addEventListener('pointermove',track);
 document.addEventListener('pointerdown',track,true);
 let scrollFrame;document.addEventListener('scroll',e=>{if(e.target===grid.closest('.category-scroll')){cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{if(lastPointer)track(lastPointer);});}},true);
 // Recheck the visible slot at mouse-up as well: the scroll mask may have moved
 // since mouse-down. Gaps and clipped artwork cannot open an underlying drawer.
 grid.addEventListener('click',e=>{if(e.detail<=0||e.ctrlKey||e.metaKey||e.shiftKey)return;track(e);if(!active){e.preventDefault();e.stopImmediatePropagation();return}if(!active.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();active.click();}},true);
 window.addEventListener('resize',()=>point(null));window.addEventListener('blur',()=>point(null));window.addEventListener('drawerchange',()=>point(null));
})();
