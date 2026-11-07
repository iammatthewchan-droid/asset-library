/* Keep superseded markup hidden until the current layout has finished assembling. */
(()=>{
 const root=document.documentElement, home=root.dataset.libraryBoot==='home';
 const needed=new Set(home?['layout','badges']:['drawer']);let revealing=false;
 window.DSLibraryReady=part=>{
  if(root.dataset.libraryReady==='error')return;needed.delete(part);if(needed.size||revealing)return;revealing=true;
  Promise.resolve(document.fonts.ready).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(root.dataset.libraryReady==='error')return;root.dataset.libraryReady='true';clearTimeout(timeout);
  })));
 };
 window.DSLibraryLoadFailed=()=>{
  if(root.dataset.libraryReady==='true')return;
  clearTimeout(timeout);root.dataset.libraryReady='error';
  const message=document.createElement('p');message.className='library-load-failure';
  message.textContent='The library could not load. ';const retry=document.createElement('button');
  retry.textContent='Try again';retry.onclick=()=>location.reload();message.append(retry);
  document.body.replaceChildren(message);
 };
 const timeout=setTimeout(()=>window.DSLibraryLoadFailed(),15000);
})();
