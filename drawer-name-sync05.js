(()=>{const roots={"brand-identity": "brand-identity", "overlays": "77550a8bb23a4532afe94605ad1ba092", "for-the-table": "af1cd41762074e339e3c76796436706c", "spatial-design": "007da08abbcc4e2d9e7b908eb4112844", "merchandise": "25b8ab7ecda54514b2de22b2a0e69df6", "advertisements": "9ac869294ddf419f942f4b39320d5811", "music": "68036daf8d3d4a439cf5a3625718f474", "mvs": "18cb9fde548543079310060803e9ea26", "episodes": "a0e4e759c8f044b996605526c6b64bf2", "codings": "5ce6e9939cea46718d77dbb26f041c45", "guidelines": "9855ea90661044d7b4e2f7d2cd12b07b", "templates": "1607f253c84b4c1d8125ee24b3956f80"};let names={};
function apply(){
 for(const [id,label] of Object.entries(names)){
  if(typeof categories!=='undefined'){const c=categories.find(c=>c.id===id);if(c)c.name=label;}
  document.querySelectorAll('a[href*="drawer="],a[data-category]').forEach(a=>{
   let key=a.dataset.category;try{key=key||new URL(a.href,location.href).searchParams.get('drawer')}catch{}
   if(key!==id)return;
   const h=a.querySelector('h3');if(h&&h.textContent!==label)h.textContent=label;
   const art=a.querySelector('.badge-title-svg');if(art&&art.dataset.drawerLabel!==label){
    const first=art.querySelector('tspan');if(first){const t=first.cloneNode(false);t.removeAttribute('textLength');t.removeAttribute('lengthAdjust');t.textContent=label;art.replaceChildren(t);art.dataset.drawerLabel=label;}
   }
   if(a.closest('#nav,#drawer-library-index')){for(const n of [...a.childNodes])if(n.nodeType===3)n.remove();a.append(document.createTextNode(label));}
   if(h)a.setAttribute('aria-label',label);
  });
 }
}
async function sync(){try{const r=await fetch('/asset-library/data/builder.json',{cache:'no-store'});if(!r.ok)return;const c=await r.json();for(const[id,root]of Object.entries(roots)){const n=c.nodes.find(n=>n.id===root);if(n)names[id]=n.label||n.name;}apply();}catch{}}
let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;observer.disconnect();apply();observer.observe(document.body,{childList:true,subtree:true});});});
observer.observe(document.body,{childList:true,subtree:true});sync();setInterval(sync,5000);window.addEventListener('focus',sync);
})();