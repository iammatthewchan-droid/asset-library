/* One authentic homepage masthead shared at exactly the same screen scale. */
(() => {
  let art,baselineFrame=0;
  const watched=new WeakSet(),baselineSizes=new ResizeObserver(queueBaseline);
  function queueBaseline(){
    cancelAnimationFrame(baselineFrame);baselineFrame=requestAnimationFrame(alignBaseline);
  }
  function alignBaseline(){
    // Shift only the file-count wording by ten actual screen pixels.
    // Convert that distance into the native SVG's coordinates at the current scale.
    if(document.body.dataset.view==='overview')for(const label of document.querySelectorAll('.inventory svg text')){
      const matrix=label.getScreenCTM(),scale=matrix&&Math.hypot(matrix.a,matrix.b);
      if(!scale)continue;
      if(!label.dataset.fileLabelBaseX)label.dataset.fileLabelBaseX=label.getAttribute('x');
      const x=Number(label.dataset.fileLabelBaseX)+10/scale;
      if(Math.abs(Number(label.getAttribute('x'))-x)>.00001)label.setAttribute('x',String(x));
    }
    if(document.body.dataset.view==='overview'){
      const title=document.querySelector('#title svg text'),shape=document.querySelector('.inventory svg>path');
      if(title?.getNumberOfChars()&&shape){
        const baseline=title.getStartPositionOfChar(0).matrixTransform(title.getScreenCTM()).y;
        const m=shape.getScreenCTM(),stroke=parseFloat(getComputedStyle(shape).strokeWidth)||0;
        const bottom=shape.getBoundingClientRect().bottom+stroke*Math.hypot(m.c,m.d)/2;
        const previous=parseFloat(document.body.style.getPropertyValue('--home-cluster-lift'))||0;
        const next=previous+baseline-bottom;
        if(Math.abs(next-previous)>.01)document.body.style.setProperty('--home-cluster-lift',next+'px');
        document.body.dataset.fileBaselineAligned='true';
      }
      const first=document.querySelector('#grid>.badge-drawer'),grid=document.querySelector('#grid'),dots=document.querySelector('.ds-style-selector[data-positioned=true]');
      if(title&&first&&grid&&dots){
        const top=title.getBoundingClientRect().bottom;
        // Header style controls do not define the bottom of the category scene.
        // Retain the previous action dock's existing scene margin and circle bounds.
        const u=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--compact-home-unit'))||1;
        const dot=dots.querySelector('.style-dot').getBoundingClientRect(),bounds=dots.getBoundingClientRect();
        const footerTop=innerHeight-Math.max(0,(innerHeight-1080*u)/2)-25*1.2*u-(bounds.height+dot.height)/2;
        const bottom=dots.dataset.placement==='header-utility'?footerTop:bounds.top;
        const rows=Math.min(4,Math.max(1,Math.ceil(grid.children.length/4)));
        const nativeHeight=parseFloat(getComputedStyle(first).height)||first.offsetHeight,height=nativeHeight*.9;
        const gap=Math.max(0,(bottom-top-rows*height)/(rows+1));
        const homeUnit=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--owner-u'))||1;
        for(const [name,value]of Object.entries({'--home-grid-top':top,'--home-grid-bottom':innerHeight-bottom,'--home-row-step':height+gap,'--home-grid-pad-top':gap-nativeHeight*.05,'--home-menu-top':top+24*homeUnit})){
          const next=value+'px';if(document.body.style.getPropertyValue(name)!==next)document.body.style.setProperty(name,next);
        }
        const viewport=grid.closest('.category-scroll');
        if(viewport){
          viewport.style.scrollPaddingTop=gap+'px';
          if(viewport.dataset.centeredCount!==String(grid.children.length)){viewport.scrollTop=0;viewport.dataset.centeredCount=String(grid.children.length);}
        }
      }
    }
    const stage=document.querySelector('#layout-stage[data-gallery-wide]');if(!stage)return;
    const heading=stage.querySelector('.mobile-library-header>div');if(!heading)return;
    heading.dataset.compactHeading='shared';
    heading.style.removeProperty('top');delete heading.dataset.baselineWithFamily;
  }
  function unit(){
    const u=Math.min(innerWidth/1920,innerHeight/1080);
    document.documentElement.style.setProperty('--compact-home-unit',u+'px');
    document.documentElement.style.setProperty('--compact-home-offset',(innerWidth-1920*u)/2+'px');
  }
  function scan(){
    unit();
    for(const label of document.querySelectorAll('header .edition'))if(label.textContent.trim()==='INTERNAL USE ONLY')label.remove();
    for(const group of document.querySelectorAll('.brand-home,.landscape-masthead')){
      group.dataset.proportionalMasthead='true';
      if(group.matches('.landscape-masthead')&&!group.dataset.homeMasthead){
        group.dataset.homeMasthead='pending';
        (art||=fetch('/compact-home-masthead.svg').then(r=>{if(!r.ok)throw Error('Shared native masthead unavailable');return r.text()})).then(text=>{
          const svg=document.importNode(new DOMParser().parseFromString(text,'image/svg+xml').documentElement,true);
          svg.classList.add('shared-masthead-art');group.append(svg);group.dataset.homeMasthead='true';
        });
      }
    }
    document.fonts.ready.then(queueBaseline);
    document.documentElement.dataset.compactCandidate='true';
  }
  const setupObserver=new MutationObserver(()=>{scan();const ready=document.documentElement.dataset.libraryReady==='true';const home=document.body?.dataset.view==='overview';const mast=document.querySelector('.landscape-masthead');if(ready&&(home||mast?.dataset.homeMasthead==='true'))setupObserver.disconnect();});
  setupObserver.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-library-ready']});
  for(const event of ['DOMContentLoaded','ownerlayoutready','libraryaccountchange','drawerchange','categorylayoutchange','resize'])addEventListener(event,scan);
  addEventListener('stylecontrolpositioned',queueBaseline);
  scan();
})();

/* Feather the scrolling artwork into the continuous scene, without an opaque cover. */
(() => {
  const targets=new Set();let scheduled=false;
  function refresh(){
    scheduled=false;
    for(const el of targets){
      if(!el.isConnected){targets.delete(el);continue;}
      const height=el.clientHeight,maximum=Math.max(0,el.scrollHeight-height),y=el.scrollTop;
      const sceneUnit=document.body.dataset.view==='overview'?parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--owner-u')):document.querySelector('#layout-stage').getBoundingClientRect().width/1440;
      const feather=Math.min(64*(sceneUnit||1),height*.18);
      el.style.setProperty('--scroll-top-feather',Math.min(feather,Math.max(0,y)*2)+'px');
      const openingHome=document.body.dataset.view==='overview'&&y<=1;
      el.style.setProperty('--scroll-bottom-feather',Math.min(openingHome?8*(sceneUnit||1):feather,Math.max(0,maximum-y)*2)+'px');
      el.dataset.scrollFeather='true';el.dataset.scrollPosition=y<=1?'top':maximum-y<=1?'bottom':'middle';
      document.documentElement.style.setProperty('--scene-feather-end',(el.getBoundingClientRect().top+feather)+'px');
    }
  }
  function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(refresh)}}
  const sizes=new ResizeObserver(queue);
  function bind(){
    for(const el of document.querySelectorAll('.category-scroll,.asset-scroll'))if(!targets.has(el)){
      targets.add(el);el.addEventListener('scroll',queue,{passive:true});sizes.observe(el);
    }
    queue();
  }
  new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('resize',queue);addEventListener('drawerchange',bind);bind();
})();

/* Owner17Nov: folder beside the drawer title; count above the last occupied
 * column. The adapter preserves the native collection, title and card geometry.
 */
(()=>{
 let pending=false;const bound=new WeakSet();
 const put=(e,k,v)=>{if(e.style.getPropertyValue(k)!==v)e.style.setProperty(k,v)};
 function update(){
  pending=false;const stage=document.querySelector('#layout-stage[data-gallery-wide]'),heading=stage?.querySelector('.mobile-library-header>div[data-compact-heading]'),scroll=stage?.querySelector('.asset-scroll');if(!heading||!scroll)return;
  const family=scroll.querySelector('.family-title'),sourceCount=scroll.querySelector('.asset-count'),cards=[...scroll.querySelectorAll('.gallery-card')];
  let label=family?.textContent.trim()||family?.getAttribute('aria-label')||'';
  const grouped=scroll.hasAttribute('data-grouped');
  if(grouped){const selected=stage.querySelector('.menu-hit[data-menu-tier="0"][aria-pressed="true"]');label=selected?.getAttribute('aria-label')||selected?.textContent.trim()||'';}
  if(label===(heading.firstChild?.textContent||'').trim())label='';
  let suffix=heading.querySelector('.drawer-folder-label18');if(!suffix){suffix=document.createElement('span');suffix.className='drawer-folder-label18';heading.append(suffix)}
  if(suffix.textContent!==label)suffix.textContent=label;suffix.hidden=!label;
  if(family&&!grouped)family.dataset.headingSuffix='true';
  let total=stage.querySelector('.drawer-item-total18');if(!total){total=document.createElement('div');total.className='drawer-item-total18';total.setAttribute('aria-live','polite');stage.append(total)}
  const count=sourceCount?.textContent.trim()||(stage.dataset.visibleCount?stage.dataset.visibleCount+' items':'');if(total.textContent!==count)total.textContent=count;total.hidden=!count;
  const u=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--compact-home-unit'))||1,s=scroll.getBoundingClientRect(),first=cards[0]?.getBoundingClientRect();
  const firstRow=first?cards.map(e=>e.getBoundingClientRect()).filter(r=>Math.abs(r.top-first.top)<1):[];
  const right=firstRow.length?Math.max(...firstRow.map(r=>r.right)):s.right;
  put(total,'right',(innerWidth-right)+'px');put(total,'top',((first?first.top+scroll.scrollTop:s.top)-total.getBoundingClientRect().height-12*u)+'px');
  if(!bound.has(scroll)){bound.add(scroll);scroll.addEventListener('scroll',queue,{passive:true});new ResizeObserver(queue).observe(scroll)}
 }
 function queue(){if(!pending){pending=true;requestAnimationFrame(update)}}
 new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed','data-visible-count','data-gallery-wide']});
 addEventListener('resize',queue);addEventListener('drawerchange',queue);document.fonts.ready.then(queue);queue();
})();
