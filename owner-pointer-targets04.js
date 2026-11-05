/* Owner: immediate tag targeting using unscaled layout slots, not lingering enlarged hit boxes. */
(()=>{
 const grid=document.getElementById('grid');if(!grid)return;let active=null;
 function point(card){if(card===active)return;active?.classList.remove('is-pointed');active=card;active?.classList.add('is-pointed');grid.dataset.pointedCategory=active?.dataset.category||'';}
 function box(el){let x=0,y=0,p=el;while(p){x+=p.offsetLeft;y+=p.offsetTop;p=p.offsetParent;}return{x:x-scrollX,y:y-scrollY,w:el.offsetWidth,h:el.offsetHeight};}
 document.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||document.body.dataset.view!=='overview'){point(null);return;}
  const cards=[...grid.querySelectorAll('.badge-drawer')];if(!cards.length)return;
  const boxes=cards.map(el=>({el,...box(el)}));
  const left=Math.min(...boxes.map(b=>b.x)),right=Math.max(...boxes.map(b=>b.x+b.w)),top=Math.min(...boxes.map(b=>b.y)),bottom=Math.max(...boxes.map(b=>b.y+b.h));
  if(e.clientX<left||e.clientX>right||e.clientY<top||e.clientY>bottom||e.target.closest('#library-index-panel')){point(null);return;}
  let closest=null,distance=Infinity;for(const b of boxes){const d=((e.clientX-b.x-b.w/2)/b.w)**2+((e.clientY-b.y-b.h/2)/b.h)**2;if(d<distance){closest=b.el;distance=d;}}point(closest);
 });
 // A click in a gap follows the tag visibly targeted by pointer movement.
 grid.addEventListener('click',e=>{if(active&&e.detail>0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!active.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();active.click();}},true);
 window.addEventListener('blur',()=>point(null));window.addEventListener('drawerchange',()=>point(null));
})();
