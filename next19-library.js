'use strict';
(() => {
 const node=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=(tag==='p'||tag==='h3')?withoutOrphan(text):text;return n;};
 const byId=id=>document.getElementById(id);
 let registering=false,replacementTarget=null;
 // Operator credentials are never accepted in a URL. Setup is a local command.
 if(new URLSearchParams(location.hash.slice(1)).has('setup')){const clean=new URL(location);clean.hash='';history.replaceState(null,'',clean);}
 let session=null, catalog=null, items=[], mode=new URLSearchParams(location.search).get('mode')||'browse', folder=new URLSearchParams(location.search).get('folder')||'', busy=false;
 if(!['store','shop','browse'].includes(mode))mode='browse';
 const current=()=>categories.find(c=>c.id===(new URLSearchParams(location.search).get('drawer')||location.hash.slice(1)));
 const pilotCategory='brand-identity';
 let tierDesign=null;fetch('assets/owner-second-tier19/design.json').then(r=>r.json()).then(d=>{tierDesign=d;renderWorkspace();}).catch(e=>message('Layout source unavailable.',true));
 const isOwner=()=>session?.user?.role==='owner';
 const toolbar=node('div','library-toolbar');toolbar.setAttribute('aria-label','Library actions');
 const modes=node('div','library-modes');const modeButtons={};
 for(const [id,label,desc] of [['store','STORE','Upload assets'],['shop','SHOP','Download final files'],['browse','BROWSE','View inspiration and work in progress']]){
  const b=node('button','mode-button',label);b.type='button';b.title=desc;b.onclick=()=>setMode(id);modes.append(b);modeButtons[id]=b;
 }
 const account=node('div','library-account');toolbar.append(modes,account);document.querySelector('.intro').after(toolbar);
 const utilities=node('div','overview-utilities');const inventory=document.querySelector('.inventory');
 document.querySelector('header').append(utilities);utilities.append(inventory);
 modes.hidden=!current();toolbar.classList.toggle('overview-account',!current());utilities.prepend(account);
 let utilityArtwork=null,utilityRimStops='';
 fetch('assets/owner-layout-61/utility-wings.json?v=glass-64').then(r=>r.json()).then(art=>{
  const count=byId('asset-total').textContent;utilityArtwork=art;utilityRimStops=(art.login.match(/<linearGradient[^>]*>([\s\S]*?)<\/linearGradient>/)||[])[1]||'';inventory.innerHTML=art.total;byId('asset-total').textContent=count;drawAccount();
  for(const rim of document.querySelectorAll('linearGradient[data-owner-rim]'))rim.innerHTML=utilityRimStops;
 });
 const workspace=node('section','asset-workspace');workspace.setAttribute('aria-label','Asset collection');toolbar.after(workspace);
 const status=node('p','library-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');workspace.before(status);
 const detailGrid=document.querySelector('.detail-grid');detailGrid.hidden=true;document.querySelector('.file-roles').hidden=true;
 const preview=node('dialog','library-dialog preview-dialog');preview.innerHTML='<form method="dialog" class="dialog-close"><button aria-label="Close preview">×</button></form><h2></h2><div class="preview-art"></div><p class="preview-meta"></p>';
 const activity=node('dialog','library-dialog activity-dialog');activity.innerHTML='<form method="dialog" class="dialog-close"><button aria-label="Close activity">×</button></form><h2>Activity</h2><p class="activity-scope"></p><div class="activity-rows"></div>';
 document.body.append(preview,activity);
 const date=value=>new Date(value).toLocaleString([], {dateStyle:'medium',timeStyle:'short'});
 const size=value=>value<1024*1024?Math.ceil(value/1024)+' KB':(value/1024/1024).toFixed(1)+' MB';
 async function api(url,opts={}){
  const response=await fetch(url,{credentials:'same-origin',...opts});let data;
  try{data=await response.json();}catch{throw Error('The library server did not respond. Reopen the local launcher.');}
  if(!response.ok){if(response.status===401&&session?.user){session.user=null;items=[];renderWorkspace();}throw Error(data.error||'Request failed.');}return data;
 }
 function message(text,error=false){status.textContent=text;status.classList.toggle('error',error);}
 function button(text,handler,cls='secondary-action'){const b=node('button',cls,text);b.type='button';b.onclick=handler;return b;}
 function rimGradient(id){return `<linearGradient id="${id}" data-owner-rim="true">${utilityRimStops||'<stop stop-color="#c4c9d2"/>'}</linearGradient>`;}
 function anglePath(w,h,cut){
  return `M${h+8},1 H${w-15} Q${w+2},1 ${w-10},13 L${w-h+13},${h-10} Q${w-h+4},${h-1} ${w-h-8},${h-1} H15 Q-2,${h-1} 10,${h-13} L${h-13},10 Q${h-4},1 ${h+8},1Z`;
 }
 function positionScroll(scroller,cut){
  const next=scroller.scrollWidth>scroller.clientWidth+1?'pan':'fit',changed=scroller.dataset.layoutMode!==next;
  const previous=Number(scroller.dataset.shapeCut);
  if(next==='pan')scroller.scrollLeft=Math.max(0,changed||!Number.isFinite(previous)?cut:scroller.scrollLeft+cut-previous);
  else if(changed)scroller.scrollLeft=0;
  scroller.dataset.layoutMode=next;scroller.dataset.shapeCut=String(cut);
 }
 function tightenFolderSpacing(strip){
  const style=getComputedStyle(strip),columns=Math.max(1,style.gridTemplateColumns.split(/\s+/).length),gap=parseFloat(style.columnGap)||0;
  const tiles=[...strip.children];
  for(let i=0;i<tiles.length;i++){
   const height=tiles[i].getBoundingClientRect().height,stroke=parseFloat(tiles[i].querySelector('.folder-shape path').getAttribute('stroke-width'))||0;
   // At mid-height each original straight side sits three units inside h/2.
   // Include both half-strokes when reducing the visible border-to-border gap.
   const visibleGap=height-6+gap-stroke;
   tiles[i].style.setProperty('--folder-shift',(-((i%columns)*visibleGap*2/3))+'px');
  }
  strip.dataset.visibleGapRatio='1/3';
 }
 // Folder faces share the owner's utility shape. Only horizontal runs grow;
 // each diagonal keeps equal x/y travel, so resizing never shears the type.
 const folderShapeObserver=new ResizeObserver(entries=>{
  for(const {target:tile} of entries){
   const {width:w,height:h}=tile.getBoundingClientRect();
   if(w<80)continue;
   const cut=h-2;
   tile.style.setProperty('--folder-height',h+'px');
   tile.style.setProperty('--folder-cut',cut+'px');
   const svg=tile.querySelector('.folder-shape');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
   svg.querySelector('path').setAttribute('d',anglePath(w,h,cut));
   tightenFolderSpacing(tile.parentElement);
   positionScroll(tile.parentElement,cut-24);
  }
 });
 function drawFolders(chosen){
  if(!chosen)return;
  // The folder index starts directly with its tags. Keep return navigation
  // only after a folder has actually been opened.
  if(folder){
   const row=node('div','folder-filter');row.append(button('All folders',()=>selectFolder('')));
   const active=chosen.folders.find(f=>f.id===folder);if(active)row.append(node('span','folder-current',active.name));
   workspace.append(row);return;
  }
  const strip=node('div','folder-grid');strip.setAttribute('aria-label','Folders');strip.tabIndex=0;
  for(const f of chosen.folders){
   const tile=button('',()=>selectFolder(f.id),'folder-tile');tile.setAttribute('aria-pressed','false');
   const key=chosen.id+'/'+f.id,cover=catalog.covers[key],uid='folder-'+chosen.id+'-'+f.id;
   tile.innerHTML=`<svg class="folder-shape" aria-hidden="true"><defs><linearGradient id="${uid}-fill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3c2850"/><stop offset="1" stop-color="#000000"/></linearGradient>${rimGradient(uid+'-rim')}</defs><path fill="url(#${uid}-fill)" stroke="url(#${uid}-rim)" stroke-width="1.25"/></svg>`;
   const text=node('div','folder-content'),meta=node('div','folder-meta');
   text.append(node('h3','',f.name));
   if(cover){const img=node('img','folder-cover');img.src=cover;img.alt='';meta.append(img);}
   meta.prepend(node('p','asset-meta',(catalog.folder_counts[key]||0)+' files'));text.append(meta);tile.append(text);strip.append(tile);
  }
  workspace.append(strip);for(const tile of strip.children)folderShapeObserver.observe(tile,{box:'border-box'});
 }
 const choiceObserver=new ResizeObserver(entries=>{
  for(const {target} of entries){
   const {width,height}=target.getBoundingClientRect(),svg=target.querySelector('svg');
   if(!width||!height)continue;
   svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
   svg.querySelector('path').setAttribute('d',anglePath(width,height,height-2));
  }
 });
 function drawCollectionPilot(chosen,restricted=false){
  if(!tierDesign){workspace.append(node('p','','Loading the layout…'));return;}
  const h1=byId('title');h1.classList.toggle('owner-title-clear',chosen.id!=='brand-identity');h1.setAttribute('aria-label',current().name);h1.replaceChildren();const titleSVG=document.createElementNS('http://www.w3.org/2000/svg','svg');titleSVG.setAttribute('viewBox','0 0 1320 80');titleSVG.setAttribute('preserveAspectRatio','xMinYMid meet');titleSVG.setAttribute('aria-hidden','true');const titleText=document.createElementNS('http://www.w3.org/2000/svg','text');titleText.setAttribute('x','0');titleText.setAttribute('y','60');titleText.setAttribute('class','owner-title-text');titleText.textContent=current().name;titleSVG.append(titleText);h1.append(titleSVG);
  const design=tierDesign,layout=node('div','owner-machine'),choices=node('nav','owner-choices');choices.setAttribute('aria-label','Folders');
  const pane=node('section','owner-pane');pane.setAttribute('aria-label','File thumbnails');pane.innerHTML=design.pane.svg;
  pane.firstElementChild.classList.add('owner-pane-art');
  const scroller=node('div','owner-vending-scroll');scroller.tabIndex=0;scroller.setAttribute('aria-label','Scroll through file thumbnails');pane.append(scroller);
  const counter=node('span','owner-total');counter.setAttribute('role','status');
  const nativeFolders=chosen?.folders||[];
  const options=nativeFolders.map(f=>({id:f.id,label:f.name,category:chosen.id,folder:f.id}));
  const tableMenu=chosen.id==='for-the-table';
  const jejuOptions=[{id:'jeju-chips',label:'Chips',category:chosen.id,folder:'jeju-chips'},{id:'jeju-cards',label:'Cards',category:chosen.id,folder:'jeju-cards'}];
  if(tableMenu){
   layout.classList.add('table-menu');
   options.splice(0,options.length,...[
    {id:'2',label:'Chips',folder:'2'}, {id:'1',label:'Cards',folder:'1'},
    {id:'4',label:'Felt',folder:'4'}, {id:'table',label:'Table',folder:'table'},
    {id:'jeju',label:'Jeju',folder:'jeju'}
   ].map(o=>({...o,category:chosen.id})));
  }
  const jejuMenu=node('nav','table-jeju-menu');jejuMenu.setAttribute('aria-label','Jeju');jejuMenu.hidden=true;
  function setJeju(open){
   if(!tableMenu)return;
   jejuMenu.hidden=!open;choices.classList.toggle('jeju-open',open);
   const trigger=choices.querySelector('[data-folder="jeju"]');if(trigger)trigger.setAttribute('aria-expanded',String(open));
  }
  if(chosen.id==='brand-identity'){
   for(const f of options)f.label=({'1':'Logo','2':'Font','3':'Color'})[f.id]||f.label;
   options.push({id:'overlay',label:'Overlay',category:'overlays',folder:''});
  }
  let selected=[...options,...(tableMenu?jejuOptions:[])].find(f=>f.id===folder)||options[0];
  function showFiles(option){
   if(!option)return;selected=option;folder=option.id;
   const u=new URL(location);u.searchParams.set('folder',option.id);history.replaceState(null,'',u);
   for(const b of [...choices.children,...jejuMenu.children])b.setAttribute('aria-pressed',String(b.dataset.folder===option.id||(b.dataset.folder==='jeju'&&option.id.startsWith('jeju-'))));
   const selectedItems=restricted?[]:items.filter(a=>a.category===option.category&&(!option.folder||a.folder===option.folder)&&a.is_current);
   counter.textContent='Total Items : '+selectedItems.length;
   scroller.replaceChildren();scroller.scrollTop=0;pane.querySelectorAll('.owner-access-message').forEach(e=>e.remove());
   const grid=node('div','owner-vending-grid');grid.setAttribute('aria-label',option.label+' files');
   const totalSlots=Math.max(18,Math.ceil(selectedItems.length/6)*6);
   for(let i=0;i<totalSlots;i++){
    const asset=selectedItems[i];let tile;
    if(asset){
     tile=button('',()=>asset.collection==='shop'?download(asset):view(asset),'owner-thumbnail');
     tile.title=asset.name+(asset.collection==='browse'?' · Reference, view only':'');
     tile.setAttribute('aria-label',(asset.collection==='shop'?'Download ':'View reference ')+asset.name);tile.dataset.assetId=asset.id;
    }else{tile=node('div','owner-thumbnail owner-slot-empty');tile.setAttribute('aria-hidden','true');}
    tile.innerHTML=uniqueSVG(design.slot.svg,'slot-'+i);
    if(asset){
     if(asset.thumbnail_url||asset.preview_url){const image=node('img');image.src=asset.thumbnail_url||asset.preview_url;image.alt='';image.loading=i<18?'eager':'lazy';image.decoding='async';tile.append(image);}
     else tile.append(node('span','owner-file-extension',asset.name.split('.').pop().toUpperCase()));
     if(asset.collection==='browse'){const indicator=node('span','owner-reference-mark','○');indicator.setAttribute('aria-hidden','true');tile.append(indicator);}
    }
    grid.append(tile);
   }
   scroller.append(grid);pane.dataset.fileCount=String(selectedItems.length);pane.dataset.folder=option.id;pane.dataset.scrollable=String(selectedItems.length>18);
   if(restricted){const note=node('p','owner-access-message','Owner clearance required');pane.append(note);}
  }
  function makeChoice(option,index,isChild=false){
   const activate=()=>{setJeju(option.id==='jeju'||isChild);showFiles(option.id==='jeju'?jejuOptions[0]:option);};
   const choice=button('',activate,'owner-folder-choice');choice.dataset.folder=option.id;choice.setAttribute('aria-pressed','false');
   choice.innerHTML=uniqueSVG(design.button.svg,'folder-'+index);
   const svg=choice.firstElementChild,path=svg.querySelector('path'),glare=path.cloneNode();glare.removeAttribute('style');glare.setAttribute('class','owner-running-glare');glare.setAttribute('fill','none');glare.setAttribute('stroke','#fff');glare.setAttribute('stroke-width','1.7');glare.setAttribute('pathLength','100');glare.setAttribute('stroke-dasharray','3 97');svg.append(glare);
   const label=document.createElementNS('http://www.w3.org/2000/svg','text');label.setAttribute('x','219.255905');label.setAttribute('y','468.70610');label.setAttribute('class','owner-folder-label');label.textContent=option.label;svg.append(label);
   choice.setAttribute('aria-label',option.label);choice.onpointerenter=activate;choice.onfocus=activate;
   if(option.id==='jeju'){choice.setAttribute('aria-expanded','false');choice.setAttribute('aria-controls','table-jeju-children');}
   return choice;
  }
  for(const [index,option] of options.entries())choices.append(makeChoice(option,index));
  if(tableMenu){
   jejuMenu.id='table-jeju-children';
   jejuOptions.forEach((option,index)=>jejuMenu.append(makeChoice(option,index+options.length,true)));
   layout.append(jejuMenu);
   layout.addEventListener('keydown',event=>{if(event.key==='Escape'){setJeju(false);}});
  }
  layout.append(choices,pane,counter);workspace.append(layout);
  showFiles(selected);setJeju(selected.id.startsWith('jeju'));
  // Preserve the native 24pt size and wrap longer folder names inside its safe text area.
  requestAnimationFrame(()=>{for(const label of choices.querySelectorAll('.owner-folder-label')){
   if(label.getComputedTextLength()<=215)continue;
   const words=label.textContent.split(/\s+/),lines=[''];
   for(const word of words){label.textContent=lines[lines.length-1]+(lines[lines.length-1]?' ':'')+word;if(label.getComputedTextLength()>215&&lines[lines.length-1])lines.push(word);else lines[lines.length-1]=label.textContent;}
   label.replaceChildren();const firstY=lines.length>1?462.70610:468.70610;
   for(const [i,line] of (lines.length>2?[lines[0],lines.slice(1).join(' ')]:lines).entries()){const span=document.createElementNS('http://www.w3.org/2000/svg','tspan');span.setAttribute('x','219.255905');span.setAttribute('y',String(firstY+i*28));span.textContent=line;label.append(span);}
  }});
 }
 function uniqueSVG(markup,prefix){return markup.replace(/id="([^"]+)"/g,(_,id)=>`id="${prefix}-${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#${prefix}-${id})`);}
 // Reuse one45-degree frame for the remaining collection panels and actions.
 // Full-height slants stay45°. Scroll the complete shape when a viewport is
 // narrower than its readable content; never substitute clipped corners.
 const queuedFrames=new Set();let frameUpdatePending=false;
 function updateAngleFrame(el){
  if(!el.isConnected)return;
  const svg=el.querySelector(':scope>.angle-frame');if(!svg)return;
  const textWidth=innerWidth<=700?240:el.matches('.library-dialog-frame')?460:el.matches('.drop-zone')?360:el.matches('.asset-card')?300:500;
  if(!el.matches('button'))el.style.setProperty('--angle-content-width',textWidth+'px');
  for(let pass=0;pass<3;pass++){
   const box=el.getBoundingClientRect();if(box.width<40||box.height<20)return;
   const cut=box.height-2;
   if(el.style.getPropertyValue('--angle-cut')!==cut+'px')el.style.setProperty('--angle-cut',cut+'px');
   if(!el.matches('button')){const minWidth=Math.ceil(2*(cut+24)+textWidth)+'px';if(el.style.minWidth!==minWidth)el.style.minWidth=minWidth;}
  }
  const {width:w,height:h}=el.getBoundingClientRect(),cut=h-2;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.querySelector('path').setAttribute('d',anglePath(w,h,cut));
  const scroller=el.parentElement;
  if(scroller.matches('.angle-scroll,.library-dialog'))positionScroll(scroller,cut);
 }
 const angleFrameObserver=new ResizeObserver(entries=>{
  for(const {target} of entries)queuedFrames.add(target);
  if(frameUpdatePending)return;frameUpdatePending=true;
  requestAnimationFrame(()=>{frameUpdatePending=false;for(const el of queuedFrames)updateAngleFrame(el);queuedFrames.clear();});
 });
 let angleFrameIndex=0;
 function frameCollection(){
  for(const dialog of document.querySelectorAll('.library-dialog')){
   let inner=dialog.querySelector(':scope>.library-dialog-frame');
   if(!inner){inner=node('div','library-dialog-frame');dialog.append(inner);}
   for(const child of [...dialog.childNodes])if(child!==inner)inner.append(child);
  }
  for(const el of document.querySelectorAll('.primary-action,.asset-card,.store-form,.drop-zone,.library-dialog-frame')){
   if(el.querySelector(':scope>.angle-frame'))continue;
   if(!el.matches('button,.library-dialog-frame')&&!el.parentElement.matches('.angle-scroll')){
    const scroller=node('div','angle-scroll');el.before(scroller);scroller.append(el);
    scroller.setAttribute('tabindex','0');scroller.setAttribute('aria-label','Scroll across this panel');
   }
   const uid='collection-frame-'+angleFrameIndex++,svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.classList.add('angle-frame');svg.setAttribute('aria-hidden','true');
   svg.innerHTML=`<defs><linearGradient id="${uid}-fill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3c2850"/><stop offset="1" stop-color="#000"/></linearGradient>${rimGradient(uid+'-rim')}</defs><path fill="url(#${uid}-fill)" stroke="url(#${uid}-rim)" stroke-width="1.25"/>`;
   el.prepend(svg);el.classList.add('collection-angled');angleFrameObserver.observe(el,{box:'border-box'});
  }
 }
 new MutationObserver(frameCollection).observe(document.body,{childList:true,subtree:true});
 frameCollection();
 function setMode(next){if(next===mode||(next==='store'&&!isOwner()))return;mode=next;folder='';const u=new URL(location);u.searchParams.set('mode',next);u.searchParams.delete('folder');history.replaceState(null,'',u);renderWorkspace();}
 function drawAccount(){
  account.replaceChildren();
  modeButtons.store.hidden=!isOwner();
  if(session?.user){account.append(node('span','signed-name',session.user.name),button('Activity',showActivity),button('Sign out',async()=>{try{await api('/api/logout',{method:'POST'});session.user=null;items=[];await refresh();}catch(e){message(e.message,true);}}));}

  if(isOwner()&&current())account.append(button(mode==='store'?'Shop':'Store',()=>setMode(mode==='store'?'shop':'store'),'operator-store text-action'));
  inventory.setAttribute('role','status');inventory.setAttribute('aria-live','polite');inventory.setAttribute('aria-label','Files: '+byId('asset-total').textContent);
  window.dispatchEvent(new Event('libraryaccountchange'));
 }
 async function showActivity(){
  try{const data=await api('/api/activity');activity.querySelector('.activity-scope').textContent=(data.scope==='all'?'All visitors':'Your session')+' · latest 500 events · times shown in your local time zone';
   const list=activity.querySelector('.activity-rows');list.replaceChildren();
   if(!data.events.length)list.append(node('p','','No activity yet.'));
   for(const event of data.events){const row=node('div','activity-row');row.append(node('strong','',event.user_name+' · '+event.action.replaceAll('_',' ')),node('p','',event.file_name||'Library session'),node('p','asset-meta',date(event.at)+(event.category?' · '+event.category:'')));list.append(row);}activity.showModal();
  }catch(e){message(e.message,true);}
 }
 const savedDrawerRoots={"brand-identity": "brand-identity", "overlays": "77550a8bb23a4532afe94605ad1ba092", "for-the-table": "af1cd41762074e339e3c76796436706c", "spatial-design": "007da08abbcc4e2d9e7b908eb4112844", "merchandise": "25b8ab7ecda54514b2de22b2a0e69df6", "advertisements": "9ac869294ddf419f942f4b39320d5811", "music": "68036daf8d3d4a439cf5a3625718f474", "mvs": "18cb9fde548543079310060803e9ea26", "episodes": "a0e4e759c8f044b996605526c6b64bf2", "codings": "5ce6e9939cea46718d77dbb26f041c45", "guidelines": "9855ea90661044d7b4e2f7d2cd12b07b", "templates": "1607f253c84b4c1d8125ee24b3956f80"};
 let countsLoading=false;
 async function syncSavedCounts(){
  if(!catalog||countsLoading)return;countsLoading=true;
  try{
   const [savedLibrary,binLibrary,brandItems]=await Promise.all([api('/asset-library/data/builder.json',{cache:'no-store'}),api('/asset-library/data/bins.json',{cache:'no-store'}),api('/asset-library/assets/third-tier-sample19/owner02nov/brands/brand-assets.json',{cache:'no-store'})]);
   const identity=catalog.categories.find(c=>c.id==='brand-identity');
   if(identity)identity.asset_count=new Set([...binLibrary.bins.filter(a=>a.download_ready!==false&&a.id!=='8a0d0e6e52494babb74fda38511618c4'),...brandItems].filter(a=>a.brand||/^(0-|1-0$|2-0$)/.test(a.collection||'')).map(a=>a.id)).size;
   for(const category of catalog.categories){
    if(category.id==='brand-identity')continue;
    const root=savedLibrary.nodes.find(n=>n.id===savedDrawerRoots[category.id]);
    if(!root)continue;
    const folders=new Set([root.id]);let expanded=true;
    while(expanded){expanded=false;for(const n of savedLibrary.nodes)if(folders.has(n.parent)&&!folders.has(n.id)){folders.add(n.id);expanded=true;}}
    category.asset_count=savedLibrary.assets.filter(a=>folders.has(a.folder)).length;
   }
   byId('asset-total').textContent=String(catalog.categories.reduce((n,c)=>n+c.asset_count,0));
   for(const c of catalog.categories){const card=Array.from(document.querySelectorAll('.drawer')).find(a=>new URL(a.href).searchParams.get('drawer')===c.id);if(card){card.dataset.assetCount=String(c.asset_count);const countLabel=card.querySelector('.drawer-top span:last-child');if(countLabel)countLabel.textContent=c.access_classification==='RESTRICTED'?'RESTRICTED':c.asset_count+' ASSETS';card.setAttribute('aria-label',c.name+', '+c.asset_count+' assets');}}
   window.dispatchEvent(new CustomEvent('librarycatalogchange',{detail:catalog.categories}));

   inventory.setAttribute('aria-label','Files: '+byId('asset-total').textContent);
  }finally{countsLoading=false;}
 }
 window.addEventListener('focus',()=>syncSavedCounts().catch(()=>{}));
 window.addEventListener('pageshow',()=>syncSavedCounts().catch(()=>{}));
 setInterval(()=>{if(!document.hidden)syncSavedCounts().catch(()=>{})},5000);
 async function refresh(){
  try{catalog=await api('/asset-library/data/catalog.json');items=(await api('/asset-library/data/assets.json')).assets;const binCatalog=await api('/asset-library/data/bins.json');const logoBins=binCatalog.bins.filter(a=>a.download_ready!==false&&a.collection.startsWith('0-')&&a.id!=='8a0d0e6e52494babb74fda38511618c4');const identity=catalog.categories.find(c=>c.id==='brand-identity');if(identity)identity.asset_count=logoBins.length;
   await syncSavedCounts();
   drawAccount();
   renderWorkspace();
  }catch(e){message(e.message,true);}
 }
 function updateLinks(){
   for(const a of document.querySelectorAll('#nav a,.drawer,#back')){const u=new URL(a.href);if(u.searchParams.get('drawer')==='all')u.searchParams.delete('mode');else u.searchParams.set('mode',!current()&&u.searchParams.get('drawer')===pilotCategory?'shop':mode);if(u.searchParams.get('drawer')===pilotCategory){u.pathname='/asset-library/asset-library-live19.html';u.search='?drawer=brand-identity';}a.href=u.pathname+u.search;}
 }
 function renderWorkspace(){
  const c=current(),pilot=!!c;
  document.body.dataset.ownerTier=String(!!c&&mode!=='store');
  if(mode==='store'&&!isOwner()){mode='shop';const u=new URL(location);u.searchParams.set('mode',mode);history.replaceState(null,'',u);}
  if(!c)mode='browse';
  document.body.dataset.collectionPilot=String(pilot);toolbar.hidden=pilot;
  utilities.prepend(account);drawAccount();modes.hidden=!c;toolbar.classList.toggle('overview-account',!c);folderShapeObserver.disconnect();choiceObserver.disconnect();workspace.replaceChildren();message('');for(const [id,b] of Object.entries(modeButtons))b.setAttribute('aria-pressed',String(id===mode));updateLinks();
  // Keep the original overview as the folder index; mode actions share one implementation.
  byId('overview').hidden=!!c||mode!=='browse';
  byId('detail').hidden=!c||c.access_classification!=='RESTRICTED';byId('back').hidden=true;
  if(c){workspace.before(byId('detail'));byId('detail').append(byId('back'),byId('access-note'));}
  document.body.dataset.libraryMode=mode;
  if(!catalog){workspace.append(node('p','','Loading the library…'));return;}
  if(mode==='browse'&&!c){workspace.hidden=true;return;}workspace.hidden=false;
  const chosen=catalog.categories.find(x=>x.id===c?.id);
  if(c&&c.access_classification==='RESTRICTED'&&session?.user?.role!=='owner'){drawCollectionPilot(chosen,true);return;}
  if(mode==='store'){drawStore(chosen);return;}
  if(pilot){drawCollectionPilot(chosen);return;}
  drawFolders(chosen);
  const filtered=items.filter(a=>(!c||a.category===c.id)&&(!folder||a.folder===folder)&&a.collection===mode&&a.is_current);
  if(!filtered.length){workspace.append(empty(mode==='shop'?'No final assets here yet':'No previews here yet',mode==='shop'?'Files appear here when they are available for download.':'Add mood boards or work in progress through STORE.'));return;}
  const grid=node('div','asset-grid');for(const a of filtered)grid.append(assetCard(a));workspace.append(grid);
 }
 function selectFolder(id){folder=id;const u=new URL(location);if(id)u.searchParams.set('folder',id);else u.searchParams.delete('folder');history.replaceState(null,'',u);renderWorkspace();}
 function empty(title,copy){const box=node('div','collection-empty');box.append(node('h3','',title),node('p','',withoutOrphan(copy)));return box;}
 function assetCard(a){
  const card=node('article','asset-card');const click=button('',()=>a.collection==='shop'?download(a):view(a),'asset-image');
  click.setAttribute('aria-label',(a.collection==='shop'?'Download ':'View ')+a.name);
  if(a.preview_url){const image=node('img');image.src=a.preview_url;image.alt=a.name;image.loading='lazy';click.append(image);}else{click.append(node('span','file-format',a.name.split('.').pop().toUpperCase()),node('span','', 'Download file'));}
  const info=node('div','asset-info');info.append(node('h3','',a.name),node('p','asset-meta',size(a.size)+' · '+date(a.created)));
  if(a.collection==='shop')info.append(button('Download',()=>download(a),'text-action'));else info.append(node('span','view-only','VIEW ONLY'));
  card.append(click,info);return card;
 }
 async function download(a){
  message('Preparing '+a.name+'…');
  try{const response=await fetch(a.download_url,{credentials:'same-origin'});if(!response.ok){const d=await response.json();throw Error(d.error||'Download failed.');}
   const blob=await response.blob(), url=URL.createObjectURL(blob),link=node('a');link.href=url;link.download=a.name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);message(a.name+' · download sent to your browser.');
  }catch(e){message(e.message,true);}
 }
 async function view(a){
  try{await api('/api/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:a.id})});preview.querySelector('h2').textContent=a.name;const art=preview.querySelector('.preview-art');art.replaceChildren();const image=node('img');image.src=a.preview_url;image.alt=a.name;art.append(image);preview.querySelector('.preview-meta').textContent='Reference image · View only';preview.showModal();}catch(e){message(e.message,true);}
 }
 function drawStore(chosen){
  if(!isOwner())return;
  const head=node('div','collection-heading');head.append(node('h2','',replacementTarget?'Replace '+replacementTarget.name:'Store an asset'),node('p','','Uploads remain private until you choose Make current.'));if(replacementTarget)head.append(button('Cancel replacement',()=>{replacementTarget=null;renderWorkspace();},'text-action'));workspace.append(head);
  drawFolders(chosen);
  if(!session?.user)return;
  const form=node('form','store-form');form.innerHTML='<div class="store-fields"><label>Drawer<select name="category" required></select></label><label>Folder<select name="folder" required></select></label><label>Destination<select name="collection"><option value="shop">Shop · downloadable originals</option><option value="browse">Browse · references</option></select></label></div><label class="restricted-check"><input type="checkbox" name="restricted"> Restricted asset (chips, cards, BLUVV or other private work)</label><label class="drop-zone" tabindex="0"><input type="file" name="files" multiple><span class="drop-symbol" aria-hidden="true">＋</span><strong>Drop files here</strong><span>or choose files · up to 250 MB each</span></label><p class="store-policy"></p><div class="upload-results" role="status" aria-live="polite"></div>';
  const cat=form.elements.category, fol=form.elements.folder;for(const c of catalog.categories){if(chosen&&c.id!==chosen.id)continue;if(c.access_classification==='RESTRICTED'&&session.user.role!=='owner')continue;cat.append(new Option(c.name,c.id));}if(chosen)cat.value=chosen.id;
  const fill=()=>{const c=catalog.categories.find(c=>c.id===cat.value);fol.replaceChildren(...c.folders.map(f=>new Option(f.name,f.id)));if(chosen?.id===c.id&&folder)fol.value=folder;};cat.onchange=fill;fill();
  if(replacementTarget){cat.value=replacementTarget.category;fill();fol.value=replacementTarget.folder;form.elements.collection.value=replacementTarget.collection;form.elements.files.multiple=false;for(const control of [cat,fol,form.elements.collection])control.disabled=true;}
  const help=form.querySelector('.store-policy');const explain=()=>{help.textContent=withoutOrphan(form.elements.collection.value==='browse'?'Browse shows image references. Originals remain private.':'Shop downloads the exact original. Transparent PNGs keep their alpha channel.');};form.elements.collection.onchange=explain;explain();
  const zone=form.querySelector('.drop-zone');zone.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();form.elements.files.click();}};
  zone.ondragover=e=>{e.preventDefault();zone.classList.add('dragging');};zone.ondragleave=()=>zone.classList.remove('dragging');zone.ondrop=e=>{e.preventDefault();zone.classList.remove('dragging');uploadFiles(e.dataTransfer.files,form);};form.elements.files.onchange=e=>uploadFiles(e.target.files,form);form.onsubmit=e=>e.preventDefault();workspace.append(form);
  const mine=items.filter(a=>(!chosen||a.category===chosen.id)&&(a.owner===session.user.id||session.user.role==='owner'));
  if(mine.length){workspace.append(node('h3','submission-heading','Files and private revisions'));const list=node('div','submission-list');for(const a of mine){
   const row=node('div','submission-row');row.dataset.revision=a.id;row.setAttribute('aria-label',a.name+' revision '+a.revision);
   const meta=node('div','revision-description');meta.append(node('strong','',a.name),node('span','asset-meta',a.collection.toUpperCase()+' · Revision '+a.revision+' · '+(a.is_current?(a.restricted?'Current · restricted':'Current · shareable'):a.status==='pending'?'Private draft':a.status==='superseded'?'Superseded · private':a.status==='withdrawn'?'Withdrawn · private':'Archived · private')));row.append(meta);
   const actions=node('div','revision-actions');
   if(!a.is_current)actions.append(button('Make current',()=>mutateRevision('/api/publish',a),'text-action'));
   actions.append(button('Replace',()=>{replacementTarget=a;drawStoreReplacement();},'text-action'));
   if(a.is_current)actions.append(button('Withdraw',()=>mutateRevision('/api/withdraw',a),'text-action'));
   else if(a.status!=='archived')actions.append(button('Archive',()=>mutateRevision('/api/archive',a),'text-action'));
   if(a.owner_download_url)actions.append(button('Original',()=>download({...a,download_url:a.owner_download_url}),'text-action'));
   row.append(actions);list.append(row);
  }workspace.append(list);}
 }
 function drawStoreReplacement(){renderWorkspace();workspace.querySelector('.collection-heading')?.scrollIntoView({block:'start',behavior:'smooth'});}
 async function mutateRevision(endpoint,asset){try{await api(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:asset.id})});await refresh();message(endpoint==='/api/publish'?asset.name+' is now current.':asset.name+' is private. Original retained.');}catch(e){message(e.message,true);}}
 async function uploadFiles(files,form){
  if(!isOwner()||busy||!files.length)return;busy=true;const output=form.querySelector('.upload-results');output.replaceChildren();const fields=Array.from(form.elements);fields.forEach(n=>n.disabled=true);
  const target={category:form.elements.category.value,folder:form.elements.folder.value,collection:form.elements.collection.value,restricted:form.elements.restricted.checked?'1':'0'};if(replacementTarget)target.replace=replacementTarget.asset_key;
  if(replacementTarget&&files.length!==1){busy=false;fields.forEach(n=>n.disabled=false);message('Choose one replacement file.',true);return;}
  try{const results=[];for(const file of files){const line=node('p','',file.name+' · uploading…');output.append(line);try{await api('/api/upload?'+new URLSearchParams({...target,name:file.name}),{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:file});results.push(file.name+' · saved privately');}catch(e){results.push(file.name+' · '+e.message);}}
   replacementTarget=null;await refresh();message(results.join(' · ')+'. Choose Make current when ready.');
  }finally{busy=false;fields.forEach(n=>n.disabled=false);form.elements.files.value='';}
 }
 window.addEventListener('dragover',e=>{if(e.dataTransfer?.types.includes('Files'))e.preventDefault();});
 window.addEventListener('drop',e=>{if(e.dataTransfer?.types.includes('Files')){e.preventDefault();if(!e.target.closest('.drop-zone'))message('Choose STORE and drop files into the upload box.',true);}});
 window.addEventListener('drawerchange',()=>{folder='';renderWorkspace();});
 api('/asset-library/data/session.json').then(data=>{session=data;return refresh();}).catch(e=>{message(e.message,true);workspace.append(empty('Library connection unavailable','Reopen Open Asset Library.command to reconnect to saved files.'));});
})();
