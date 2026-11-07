/* Browse already-public PDF files; never writes the catalogue or changes selection. */
(async()=>{
'use strict';
const catalog=await fetch('/asset-library/data/builder.json').then(r=>{if(!r.ok)throw Error('Catalogue unavailable');return r.json()});
const assets=new Map(catalog.assets.filter(a=>a.extension==='.pdf'&&a.page_count>1).map(a=>[a.id,a]));
const states=new Map(),docs=new Map();let library,activeId='',activeSequence=0;
// The DeepVision Logo Studies thumbnail depicts the first clean lockup, on page 4.
const lockupPreviewHash='82512df7322803b2a5b3f0dbc3030d4af6e2b5069242844c138e144ca6d266e4';
const hasLockupPreview=a=>a.sha256===lockupPreviewHash&&a.page_count>=4;
const style=document.createElement('style');style.textContent=`
.pdf-paged-tile{position:relative;width:calc(148.253906 * var(--u));height:calc(148.253906 * var(--u))}
.pdf-paged-tile>.asset-tile{width:100%;height:100%}
.pdf-paged-tile .tile-image{height:calc(83.147% - 32px);object-fit:contain}
.library-pdf-pages{position:absolute;left:4px;right:4px;bottom:4px;display:flex;align-items:center;justify-content:space-between;gap:2px;height:28px;background:#15101def;border-radius:5px;z-index:5;color:#eeeaf2;font:400 14px/1 Inter,Arial,sans-serif}
.library-pdf-pages button{width:28px;height:28px;padding:0;border:1px solid #9b8aaa;border-radius:4px;background:#35204f;color:#fff;font:400 24px/1 Inter,Arial,sans-serif;cursor:pointer}
.library-pdf-pages button:disabled{opacity:.35;cursor:default}.library-pdf-pages button:focus-visible{outline:2px solid white;outline-offset:1px}.library-pdf-pages span{white-space:nowrap}
`;document.head.append(style);
async function pdf(a){if(!library){library=await import('/asset-library/assets/pdf-page-controls05/pdf.js');library.GlobalWorkerOptions.workerSrc='/asset-library/assets/pdf-page-controls05/pdf-worker.js';}if(!docs.has(a.id))docs.set(a.id,library.getDocument({url:a.download_url}).promise);return docs.get(a.id);}
function show(a,st){document.querySelector('#layout-stage')?.dispatchEvent(new CustomEvent('library-preview-asset',{detail:{id:a.id}}));const panel=document.querySelector('.asset-preview');if(panel)panel.setAttribute('aria-label','Enlarged preview of '+a.filename+', page '+st.page+' of '+a.page_count);const image=document.querySelector('.preview-image'),name=document.querySelector('.preview-filename');if(image){image.src=st.url||a.thumbnail_url;image.hidden=false;}if(name){
  const pageLabel=st.page+' / '+a.page_count;
  if(hasLockupPreview(a)&&new URLSearchParams(location.search).get('drawer')==='brand-identity'){
    const link=document.createElement('a');link.href=a.download_url;link.download=a.filename;link.textContent='Logo Studies (PDF)';
    link.setAttribute('aria-label','Download '+a.filename);link.style.color='inherit';link.style.textUnderlineOffset='.2em';
    name.replaceChildren(link,document.createTextNode(' · '+pageLabel));
  }else name.textContent=a.filename+' · '+pageLabel;
  name.hidden=false;
}}
function install(){for(const tile of document.querySelectorAll('.asset-tile[data-asset-id]')){
if(tile.dataset.pageArrows)continue;const a=assets.get(tile.dataset.assetId);if(!a)continue;tile.dataset.pageArrows='true';
let st=states.get(a.id);if(!st){st={page:hasLockupPreview(a)?4:1,url:'',busy:false};states.set(a.id,st);}
const wrapper=document.createElement('div');wrapper.className='pdf-paged-tile';tile.before(wrapper);wrapper.append(tile);
const bar=document.createElement('div');bar.className='library-pdf-pages';bar.setAttribute('aria-label','Pages of '+a.source_name);
const prev=document.createElement('button'),next=document.createElement('button'),label=document.createElement('span');label.setAttribute('aria-live','polite');
prev.type=next.type='button';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Previous page of '+a.source_name);next.setAttribute('aria-label','Next page of '+a.source_name);
const img=tile.querySelector('.tile-image');
function paint(){label.textContent=st.page+' / '+a.page_count;prev.disabled=st.busy||st.page===1;next.disabled=st.busy||st.page===a.page_count;if(st.url)img.src=st.url;}
const activate=()=>{activeId=a.id;activeSequence++;show(a,st);};tile.addEventListener('mouseenter',activate);tile.addEventListener('focus',activate);tile.addEventListener('click',activate);
async function turn(delta,e){e.preventDefault();e.stopPropagation();if(st.busy)return;const target=st.page+delta;if(target<1||target>a.page_count)return;activeId=a.id;const seq=++activeSequence;st.busy=true;paint();
try{const doc=await pdf(a);const page=await doc.getPage(target);const original=page.getViewport({scale:1});const viewport=page.getViewport({scale:1000/Math.max(original.width,original.height)});const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Page rendering failed');if(st.url)URL.revokeObjectURL(st.url);st.url=URL.createObjectURL(blob);st.page=target;page.cleanup();if(activeId===a.id&&activeSequence===seq)show(a,st);if(docs.size>3){for(const[id,promise]of docs){if(id!==a.id&&!states.get(id)?.busy){docs.delete(id);promise.then(d=>d.destroy()).catch(()=>{});break;}}}}
catch(err){const live=document.querySelector('[role=status]');if(live)live.textContent='Could not preview '+a.source_name+'. Try the page arrow again.';console.error('PDF page preview:',err.message);}
finally{st.busy=false;paint();}}
prev.onclick=e=>turn(-1,e);next.onclick=e=>turn(1,e);bar.append(prev,label,next);wrapper.append(bar);paint();
}}
let scheduled=false;new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;install();});}}).observe(document.body,{childList:true,subtree:true});install();
})().catch(e=>console.error('PDF thumbnail controls:',e.message));
