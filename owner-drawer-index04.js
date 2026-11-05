(()=>{
 const boot=async()=>{
 const stage=document.getElementById('layout-stage');if(!stage)return;
 const items=[{"id": "brand-identity", "name": "Brand Identity", "number": "01"}, {"id": "overlays", "name": "Overlays", "number": "02"}, {"id": "for-the-table", "name": "For the Table", "number": "03"}, {"id": "spatial-design", "name": "Spatial Design", "number": "04"}, {"id": "merchandise", "name": "Merchandise", "number": "05"}, {"id": "advertisements", "name": "Advertisements", "number": "06"}, {"id": "music", "name": "Music", "number": "07"}, {"id": "mvs", "name": "MVs", "number": "08"}, {"id": "episodes", "name": "Episodes", "number": "09"}, {"id": "codings", "name": "PDFs", "number": "10"}, {"id": "guidelines", "name": "Guidelines", "number": "11"}, {"id": "templates", "name": "Templates", "number": "12"}];
 const panel=document.createElement('aside');panel.id='drawer-library-index';panel.setAttribute('aria-label','Library drawers');
 const nav=document.createElement('nav');panel.append(nav);
 for(const c of [{id:'all',name:'All drawers'},...items]){
  const a=document.createElement('a');a.dataset.category=c.id;
  a.href=c.id==='all'?'/asset-library/next19.html?drawer=all':'/asset-library/asset-library-live19.html?drawer='+c.id;
  if(c.number){const n=document.createElement('span');n.textContent=c.number;a.append(n)}a.append(document.createTextNode(c.name));
  if(c.id===(new URLSearchParams(location.search).get('drawer')||'brand-identity'))a.setAttribute('aria-current','page');
  nav.append(a);
 }
 document.body.append(panel);
 const css=document.createElement('style');css.textContent=`
@font-face{font-family:Inter;src:url('/asset-library/Inter-Bold.ttf');font-weight:700;font-display:swap}
 #drawer-library-index{--r:calc(100vw / 2127);--t:max(.5px,calc(100vw / 2880));box-sizing:border-box;position:fixed;left:0;top:0;bottom:0;width:calc(360 * var(--r));min-width:210px;z-index:100;display:flex;flex-direction:column;padding:calc(42 * var(--r)) calc(24 * var(--r)) calc(36 * var(--r));background:rgba(11,11,13,.97);overflow:auto;transform:translateX(-100%);visibility:hidden;transition:transform 840ms cubic-bezier(.16,1,.3,1),visibility 840ms;font-family:Inter,Arial,sans-serif}
 /* Sidebar overlays the locked stage: no page resize or displacement. */
 #drawer-library-index.open{transform:translateX(0);visibility:visible}
 #drawer-library-index nav{display:grid;gap:calc(3 * var(--r))}
 #drawer-library-index a{display:flex;align-items:center;gap:calc(15 * var(--r));padding:calc(12 * var(--r)) calc(12 * var(--r));border-left:calc(2 * var(--r)) solid transparent;text-decoration:none;color:#b8bdc6;font-size:calc(28 * var(--t) + 6pt);line-height:1.35}
 #drawer-library-index a span{min-width:calc(22 * var(--r));font-size:calc(28 * var(--t) + 6pt);line-height:1.45;color:#959ba6}
 #drawer-library-index a[data-category=all]{font-size:calc(34 * var(--t) + 14pt);font-weight:700}
 #drawer-library-index a:hover{background:linear-gradient(173deg,#3C2850 0%,#39264C 23.58%,#312141 45.455%,#23172E 66.659%,#0F0A14 87.321%,#000 100%);color:#f1f2f4}
 #drawer-library-index a[aria-current=page]{background:transparent;color:#b8bdc6;border-left-color:transparent}
 #drawer-library-index a[aria-current=page]:hover{background:linear-gradient(173deg,#3C2850 0%,#39264C 23.58%,#312141 45.455%,#23172E 66.659%,#0F0A14 87.321%,#000 100%);color:#f1f2f4}
 #drawer-library-index a{position:relative}#drawer-library-index a:not(:last-child)::after{content:'';position:absolute;left:0;right:0;bottom:var(--needle-bottom,0px);height:var(--menu-hairline,1px);background:linear-gradient(90deg,transparent,#bbb9cc 18%,#f3f3f5 50%,#bbb9cc 82%,transparent);opacity:.65;pointer-events:none}
 @media(prefers-reduced-motion:reduce){#drawer-library-index,body,#layout-stage{transition:none}}`;
 document.head.append(css);
 let pinned=false,closeTimer;
 sessionStorage.removeItem('library-index-pinned-04');
 function alignIndex(){
 const first=stage.querySelector('.menu-hit[data-menu-tier="0"]'),all=panel.querySelector('a[data-category=all]');if(!first||!all)return;
 const button=first.getBoundingClientRect();
 const rim=stage.querySelector('#panel-rims-overlay > [data-native-index="42"]')||stage.querySelector('#asset-scroll');
 const ceiling=Math.max(0,rim?rim.getBoundingClientRect().top:button.top);
 panel.style.width=Math.min(innerWidth,button.right)+'px';
 // Anchor the separator below the heading, so larger type grows upward from it.
 panel.style.paddingTop='0px';
 const headingHeight=all.getBoundingClientRect().height;
 panel.style.paddingTop=Math.max(0,ceiling-headingHeight)+'px';
 panel.dataset.ceiling=String(ceiling);
 // Drawer rows continue downward; the artwork behind the sidebar does not move.

 }
 function scheduleAlignment(){requestAnimationFrame(()=>requestAnimationFrame(alignIndex))}
 new ResizeObserver(scheduleAlignment).observe(stage);window.addEventListener('resize',scheduleAlignment);
 function setOpen(v){clearTimeout(closeTimer);closeTimer=null;document.body.classList.toggle('drawer-index-open',v);panel.classList.toggle('open',v);panel.inert=!v;panel.setAttribute('aria-hidden',String(!v));sessionStorage.setItem('library-index-open',String(v));if(v)scheduleAlignment()}
 setOpen(pinned);
 document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const b=stage.getBoundingClientRect();const edge=b.left+b.width*(92.98641/1920);if(e.clientX>=0&&e.clientX<edge||panel.contains(e.target))setOpen(true);else if(!pinned&&!closeTimer)closeTimer=setTimeout(()=>setOpen(false),120)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;sessionStorage.removeItem('library-index-pinned-04');setOpen(false)}});
 };
 const observer=new MutationObserver(()=>{if(document.getElementById('layout-stage')){observer.disconnect();boot()}});observer.observe(document.documentElement,{subtree:true,childList:true});if(document.getElementById('layout-stage')){observer.disconnect();boot()}
})();
// Pixel-align fine silver separators so no row vanishes at fractional browser zoom.
(()=>{let frame;function sync(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const d=devicePixelRatio||1;document.documentElement.style.setProperty('--menu-hairline',(1/d)+'px');document.querySelectorAll('#nav a,#drawer-library-index a').forEach(a=>{const b=a.getBoundingClientRect().bottom;a.style.setProperty('--needle-bottom',(b-Math.round(b*d)/d)+'px')})})}new ResizeObserver(sync).observe(document.body);window.addEventListener('resize',sync);document.addEventListener('transitionend',sync);document.fonts.ready.then(sync);sync()})();
