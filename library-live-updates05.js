/* Keep the live dispenser current without interrupting a download dialog. */
(()=>{
 if(window.libraryLiveUpdates)return;window.libraryLiveUpdates=true;
 let baseline=null,checking=false;
 const assets=[...document.querySelectorAll('script[src],link[rel=stylesheet][href]')].map(e=>e.src||e.href).filter(u=>new URL(u).origin===location.origin);
 async function fingerprint(){
  const r=await fetch('/asset-library/data/builder.json',{cache:'no-store'});if(!r.ok)throw Error('Catalog unavailable');const c=await r.json();
  const versions=await Promise.all(assets.map(async u=>{const x=await fetch(u,{method:'HEAD',cache:'no-store'});return x.headers.get('last-modified')+':'+x.headers.get('content-length');}));
  return c.revision+'|'+versions.join('|');
 }
 async function check(){
  if(checking||document.hidden)return;checking=true;
  try{const next=await fingerprint();if(baseline!==null&&next!==baseline){
   if(document.querySelector('dialog[open]')||document.activeElement?.matches('input,textarea,select'))return;
   window.libraryBeforeRefresh?.();location.reload();return;
  }baseline=next;}catch{}finally{checking=false;}
 }
 check();setInterval(check,5000);window.addEventListener('focus',check);document.addEventListener('visibilitychange',check);
})();
