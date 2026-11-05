'use strict';
(() => {
 const layout=document.querySelector('.layout'), panel=layout.querySelector('aside'), main=layout.querySelector('main');
 const row=document.createElement('div');row.className='index-row';
 const trigger=document.createElement('button');trigger.className='index-trigger';trigger.type='button';trigger.textContent='LIBRARY INDEX';
 trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','library-index-panel');
 panel.id='library-index-panel';panel.setAttribute('aria-label','Library index');
 row.append(trigger);main.querySelector('.intro').after(row);
 window.libraryIndexController={trigger,row};
 function syncTriggerLocation(){
  const title=document.getElementById('title');
  const integrated=document.body.dataset.view==='overview'&&title.classList.contains('has-title-wing');
  (integrated?title:row).append(trigger);
  trigger.classList.toggle('title-index-trigger',integrated);row.hidden=integrated;
 }
 window.addEventListener('titlewingchange',syncTriggerLocation);
 window.addEventListener('drawerchange',()=>{syncTriggerLocation();});
 let opened=false, openTimer, closeTimer, pinned=false;
 const hover=()=>matchMedia('(hover:hover) and (pointer:fine)').matches;
 function setOpen(value){
  clearTimeout(openTimer);clearTimeout(closeTimer);closeTimer=null;opened=value;
  sessionStorage.setItem('library-index-open',String(value));layout.classList.toggle('index-open',value);trigger.setAttribute('aria-expanded',String(value));
  panel.inert=!value;panel.setAttribute('aria-hidden',String(!value));if(value)alignIndex();
 }
 function alignIndex(){const top=trigger.getBoundingClientRect().top,base=panel.getBoundingClientRect().top;panel.style.paddingTop=Math.max(0,top-base)+'px';const all=panel.querySelector('a[data-category=all]');if(all){const range=document.createRange();range.selectNodeContents(all);panel.style.paddingTop=Math.max(0,top-base-(range.getBoundingClientRect().top-top))+'px'}}
 window.addEventListener('resize',()=>{if(opened)alignIndex()});
 function scheduleClose(){if(!pinned&&!closeTimer)closeTimer=setTimeout(()=>setOpen(false),120);}
 sessionStorage.removeItem('library-index-pinned-04');
 // The full empty left gutter is the hover trigger; the label remains click/keyboard accessible.

 panel.addEventListener('pointerenter',()=>{clearTimeout(closeTimer);closeTimer=null;});
 panel.addEventListener('pointerleave',()=>{if(hover())scheduleClose();});
 // Use the actual empty gutter, with no visual overlay or change to layout.
 document.addEventListener('pointermove',e=>{
  if(!hover())return;
  const gutterRight=Math.max(24,document.getElementById('title').getBoundingClientRect().left);
  if(e.clientX>=0&&e.clientX<gutterRight){if(!opened)setOpen(true);else{clearTimeout(closeTimer);closeTimer=null;}return;}
  if(!opened)return;
  const p=panel.getBoundingClientRect();
  if(e.clientX>=p.left&&e.clientX<=p.right&&e.clientY>=p.top&&e.clientY<=p.bottom){clearTimeout(closeTimer);closeTimer=null;}
  else if(!closeTimer)scheduleClose();
 });
 trigger.addEventListener('click',e=>{if(opened){pinned=false;sessionStorage.removeItem('library-index-pinned-04')}setOpen(!opened);if(opened&&e.detail===0)panel.querySelector('a')?.focus();});
 trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);panel.querySelector('a')?.focus();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened){e.preventDefault();pinned=false;sessionStorage.removeItem('library-index-pinned-04');setOpen(false);trigger.focus();}});
 setOpen(pinned);
 syncTriggerLocation();
})();

(() => {
 const grid=document.getElementById('grid'),main=document.querySelector('main'),layout=document.querySelector('.layout');
 let frame;
 function fitOverview(){
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   if(document.body.dataset.view!=='overview'||innerWidth<1000){grid.style.removeProperty('--overview-grid-height');return;}
   const tail=20;
   const height=Math.max(0,innerHeight-(grid.getBoundingClientRect().top+scrollY)-tail);
   const next=height.toFixed(2)+'px';
   if(grid.style.getPropertyValue('--overview-grid-height')!==next)grid.style.setProperty('--overview-grid-height',next);
  });
 }
 new ResizeObserver(fitOverview).observe(main);
 window.addEventListener('resize',fitOverview);
 window.addEventListener('drawerchange',fitOverview);
 layout.addEventListener('transitionend',fitOverview);
 document.fonts.ready.then(fitOverview);fitOverview();
})();

// Pixel-align fine silver separators so no row vanishes at fractional browser zoom.
(()=>{let frame;function sync(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const d=devicePixelRatio||1;document.documentElement.style.setProperty('--menu-hairline',(1/d)+'px');document.querySelectorAll('#nav a,#drawer-library-index a').forEach(a=>{const b=a.getBoundingClientRect().bottom;a.style.setProperty('--needle-bottom',(b-Math.round(b*d)/d)+'px')})})}new ResizeObserver(sync).observe(document.body);window.addEventListener('resize',sync);document.addEventListener('transitionend',sync);document.fonts.ready.then(sync);sync()})();
