/* Native badge construction, open category list: no twelve-category ceiling. */
(() => {
  const NS='http://www.w3.org/2000/svg';
  let grid,viewport,template,serial=0;
  const nativeTemplates=new Map();
  function uniqueIds(root,prefix){
    const ids=new Map();
    for(const e of root.querySelectorAll('[id]')){ids.set(e.id,prefix+e.id);e.id=prefix+e.id;}
    for(const e of root.querySelectorAll('*'))for(const a of [...e.attributes]){
      let value=a.value.replace(/url\(\s*(['"]?)#([^)'"\s]+)\1\s*\)/g,(all,quote,id)=>ids.has(id)?'url(#'+ids.get(id)+')':all);
      if(value.startsWith('#')&&ids.has(value.slice(1)))value='#'+ids.get(value.slice(1));
      if(value!==a.value)e.setAttribute(a.name,value);
    }
  }
  function label(text,value){
    const first=text.querySelector('tspan');
    const x=first?.getAttribute('x')||text.getAttribute('x'),y=first?.getAttribute('y')||text.getAttribute('y');
    text.replaceChildren();text.setAttribute('x',x);text.setAttribute('y',y);text.textContent=value;
  }
  function extra(record){
    const iconSource=nativeTemplates.get(record.iconFrom||record.id);
    const card=(iconSource||template).cloneNode(true);card.className='badge-drawer category-slot';
    card.removeAttribute('style');card.dataset.extraCategory=record.id;card.dataset.category=record.id;
    card.href=record.href||'#category-'+record.id;
    card.setAttribute('aria-label',record.label||'Unassigned category '+record.number);
    card.querySelectorAll('.badge-meta,.drawer-top,.drawer-needle,.handle').forEach(e=>e.remove());
    const svg=card.querySelector('.badge-art');uniqueIds(svg,'extra-'+(++serial)+'-');
    label(svg.querySelector('.badge-title-svg'),record.label||'Category '+record.number);
    label(svg.querySelector('.owner-badge-number'),String(record.number).padStart(2,'0'));
    svg.querySelector('.badge-quantity').textContent=record.count==null?'—':String(record.count);
    const face=[...svg.querySelectorAll(':scope>g[clip-path]')].find(e=>e.getAttribute('clip-path').endsWith('-face)'));
    if(face&&!iconSource)face.querySelectorAll('g').forEach(e=>e.remove());
    const hiddenTitle=card.querySelector('.badge-heading-accessible');if(hiddenTitle)hiddenTitle.textContent=record.label||'Unassigned category '+record.number;
    if(!record.href){card.setAttribute('aria-disabled','true');card.tabIndex=-1;card.addEventListener('click',e=>e.preventDefault());}
    else{
      card.classList.remove('category-slot');card.removeAttribute('aria-disabled');card.tabIndex=0;
    }
    return card;
  }
  function fitTitles(){
    document.fonts.ready.then(()=>{
      for(const title of grid.querySelectorAll('.badge-title-svg')){
        const svg=title.closest('svg'),wing=svg.querySelector('clipPath[id$="-fill"] path');
        if(!wing)continue;
        let size=79.115581;
        function fits(){
          const r=title.getBBox(),matrix=wing.getCTM().inverse().multiply(title.getCTM());
          return [[r.x-7,r.y-7],[r.x+r.width+7,r.y-7],[r.x+r.width+7,r.y+r.height+7],[r.x-7,r.y+r.height+7]].every(([x,y])=>wing.isPointInFill(new DOMPoint(x,y).matrixTransform(matrix)));
        }
        title.style.setProperty('--drawer-title-size',size+'px');
        while(size>70&&!fits()){size-=.25;title.style.setProperty('--drawer-title-size',size+'px');}
        title.dataset.readabilityFit='true';
      }
    });
  }
  function setExtraCategories(records){
    grid.querySelectorAll('[data-extra-category]').forEach(e=>e.remove());
    const first=grid.children.length+1;
    records.forEach((record,i)=>grid.append(extra({...record,id:record.id||'category-'+(first+i),number:first+i})));
    [...grid.children].forEach((c,i)=>{c.classList.toggle('badge-first-column',i%4===0);c.classList.toggle('badge-last-column',i%4===3);});
    fitTitles();
    viewport.dataset.categoryCount=String(grid.children.length);
    viewport.dispatchEvent(new CustomEvent('categorylayoutchange',{bubbles:true}));
  }
  function setCategories(records){
    const cards=records.map((record,i)=>extra({...record,id:record.id||'category-'+(i+1),number:i+1}));
    grid.replaceChildren(...cards);
    cards.forEach((c,i)=>{c.classList.toggle('badge-first-column',i%4===0);c.classList.toggle('badge-last-column',i%4===3);});
    fitTitles();
    viewport.dataset.categoryCount=String(cards.length);
    viewport.dispatchEvent(new CustomEvent('categorylayoutchange',{bubbles:true}));
  }
  function boot(){
    if(grid||document.documentElement.dataset.libraryReady!=='true'||document.body.dataset.view!=='overview')return;
    grid=document.querySelector('#grid');if(!grid?.querySelector('.badge-art')){grid=null;return;}
    for(const card of grid.children)nativeTemplates.set(new URL(card.href).searchParams.get('drawer'),card.cloneNode(true));
    template=grid.lastElementChild.cloneNode(true);
    viewport=document.createElement('section');viewport.className='category-scroll';
    viewport.setAttribute('aria-label','Asset categories');viewport.tabIndex=0;
    grid.before(viewport);viewport.append(grid);document.body.dataset.fourRowLayout='true';
    // Owner demo: four opening rows, with more editable slots below the fold.
    // Real categories are supplied through DSCategoryLayout in the integration.
    const count=Number(new URL(location).searchParams.get('slots')||12);
    setExtraCategories(Array.from({length:Math.max(0,Math.min(200,count)-12)},(_,i)=>({id:'unassigned-'+(i+13)})));
    window.DSCategoryLayout={setCategories,setExtraCategories,getCategoryCount:()=>grid.children.length};
    // Match scroll snap to the native card's rendered top, including its source
    // inset. Otherwise the browser starts a few pixels down and exposes row five.
    requestAnimationFrame(()=>{
      const first=grid.firstElementChild,u=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--owner-u'));
      if(first&&u){
        const top=first.getBoundingClientRect().top-viewport.getBoundingClientRect().top+viewport.scrollTop;
        viewport.style.scrollPaddingTop='calc('+(top/u)+' * var(--owner-u))';
        viewport.scrollTop=0;
      }
    });
    observer.disconnect();
  }
  const observer=new MutationObserver(boot);observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-library-ready']});boot();
})();
