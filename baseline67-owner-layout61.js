'use strict';
// Native owner layout is the reference scene. Responsive views preserve each badge.
(() => {
 const main=document.querySelector('main'),header=document.querySelector('header'),grid=document.getElementById('grid'),layout=document.querySelector('.layout');
 let config=null,frame;
 const controller={fit(){cancelAnimationFrame(frame);frame=requestAnimationFrame(fit);},heading(){return config?.heading||'';}};
 window.ownerLayoutController=controller;
 function fit(){
  if(!config)return;
  const overview=document.body.dataset.view==='overview';
  const unit=Math.min(innerWidth/1920,innerHeight/1080);
  const source=unit>=.97;
  document.body.dataset.ownerMode=source?'source':'fluid';
  document.documentElement.style.setProperty('--owner-u',(source?unit:1)+'px');
  document.documentElement.style.setProperty('--owner-stage-width',source?1920*unit+'px':'100%');
  const trigger=window.libraryIndexController?.trigger;
  if(trigger){
   if(overview&&trigger.dataset.ownerType!=='true'){
    trigger.innerHTML='<span class="page-heading-accessible">LIBRARY INDEX</span>'+config.index;trigger.dataset.ownerType='true';
   }else if(!overview&&trigger.dataset.ownerType==='true'){
    trigger.textContent='LIBRARY INDEX';delete trigger.dataset.ownerType;
   }
  }
  const title=document.getElementById('title');
  if(overview&&!title.querySelector('.owner-heading-art')){
   title.innerHTML='<span class="page-heading-accessible">Brand Asset by Category</span>'+config.heading;
   title.classList.remove('has-title-wing');title.classList.add('owner-page-title');window.dispatchEvent(new Event('titlewingchange'));
  }
  const cards=Array.from(grid.querySelectorAll('.badge-drawer'));
  // Twelve complete badges share one four-column grid across the wide scene.
  // Native SVGs scale as a unit, including the orb, wings and embedded type.
  const margin=146.1979765758949,badgeWidth=344;
  const gap=(1920-2*margin-4*badgeWidth)/3;
  const openShift=344*.9*216/1150-156.6396;
  const openStep=(main.clientWidth/unit-openShift-156.6396-151.524-344*.9)/3;
  const step=source&&layout.classList.contains('index-open')?Math.min(badgeWidth+gap,Math.max(badgeWidth*.9,openStep)):badgeWidth+gap;
  const columns=source?4:getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;
  for(const [index,card] of cards.entries()){
   const id=new URL(card.href).searchParams.get('drawer'),pos=config.positions[id];
   if(!pos)continue;
   card.style.setProperty('--owner-card-x',156.6396-((133.5-114.5)/1150)*badgeWidth*.9+pos.column*step);
   card.style.setProperty('--owner-card-y',490+pos.row*184.5-249.99);
   card.style.setProperty('--owner-card-width',badgeWidth);
   const column=source?pos.column:index%columns;
   card.classList.toggle('badge-first-column',column===0);
   card.classList.toggle('badge-last-column',column===columns-1);
  }
  if(cards.length){const halfOrb=cards[0].offsetWidth*.9*216/1150;const nativeInset=source?156.6396*unit:28;layout.style.setProperty('--index-gap-shift',(halfOrb-nativeInset)+'px');}
  grid.dataset.distribution='twelve-even';
  grid.style.removeProperty('--badge-max-width');grid.style.removeProperty('--badge-hover-clearance');
  if(cards.length){
   // Contract the complete group about its own centre, including inter-badge gaps.
   const left=Math.min(...cards.map(c=>c.offsetLeft)),right=Math.max(...cards.map(c=>c.offsetLeft+c.offsetWidth));
   const top=Math.min(...cards.map(c=>c.offsetTop)),bottom=Math.max(...cards.map(c=>c.offsetTop+c.offsetHeight));
   const cx=(left+right)/2,cy=(top+bottom)/2;
   cards.forEach(card=>{
    card.style.setProperty('--badge-recede-x',(0).toFixed(3)+'px');
    card.style.setProperty('--badge-recede-y',(0).toFixed(3)+'px');
   });
  }
  if(trigger&&overview)layout.style.setProperty('--index-label-size',(trigger.offsetWidth/310*39.855)+'px');
 }
 fetch('assets/owner-layout-61/layout.json?v=04nov-index-flush').then(r=>{if(!r.ok)throw Error('Owner layout source unavailable');return r.json();}).then(async data=>{
  // +25 Illustrator tracking units; preserve each glyph width and source type size.
  const headingBox=document.createElement('div');headingBox.innerHTML=data.heading;
  const headingArt=headingBox.querySelector('svg'),headingText=headingArt?.querySelector('text');
  if(headingArt&&headingText){
   const glyphs=Array.from(headingText.querySelectorAll('tspan'));
   const extra=Number(headingText.getAttribute('font-size'))*.025;
   glyphs.forEach((glyph,index)=>glyph.setAttribute('x',String(Number(glyph.getAttribute('x'))+extra*index)));
   const width=680+extra*Math.max(0,glyphs.length-1);
   headingArt.setAttribute('viewBox','0 0 '+width+' 82');headingArt.dataset.trackingDelta='25';
   document.documentElement.style.setProperty('--owner-heading-width',String(width));data.heading=headingBox.innerHTML;
  }
  config=data;
  header.querySelector('.brand-home').innerHTML=config.header;
  const caption=header.querySelector('.owner-header-art text');
  const first=caption?.querySelector('tspan');
  if(caption&&first){
   caption.setAttribute('x',first.getAttribute('x'));caption.setAttribute('y',first.getAttribute('y'));
   caption.setAttribute('font-family','Inter,Arial,sans-serif');caption.setAttribute('font-weight','400');
   caption.setAttribute('letter-spacing','-.02em');caption.textContent='ASSET LIBRARY';
   caption.dataset.ownerCaption='inter-regular';
  }
  await Promise.all([document.fonts.load('40px OwnerDisplay61'),document.fonts.load('16px OwnerSupport61'),document.fonts.load('400 44.9733px Inter')]);
  controller.fit();window.dispatchEvent(new Event('ownerlayoutready'));
 }).catch(error=>console.warn(error.message));
 for(const event of ['resize','drawerchange','libraryaccountchange','ownerlayoutready'])window.addEventListener(event,controller.fit);
 new ResizeObserver(controller.fit).observe(main);
 layout.addEventListener('transitionend',e=>{if(e.target===layout)controller.fit();});
})();
