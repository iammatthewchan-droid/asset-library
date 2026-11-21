/* Local category-editor preview. Connected deployments must authorize writes
 * on the server; client-side locked fields alone are not an access boundary. */
(()=>{
 const key='ds-additional-categories-v1';let dialog,trigger,list,form,error,originals,extras=[],editing=null,busy=false,booted=false;
 const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e};
 const clean=name=>String(name||'').trim().replace(/\s+/g,' ');
 const records=()=>extras.map(e=>({...e,count:0,href:'#'+e.id}));
 function persist(){localStorage.setItem(key,JSON.stringify(extras));}
 function position(){
  if(!trigger)return;const dots=document.querySelector('.ds-style-selector');if(!dots)return;
  const r=dots.getBoundingClientRect(),u=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--compact-home-unit'))||1;
  trigger.style.top=r.top+'px';trigger.style.right=((innerWidth-1920*u)/2+135.337*u)+'px';
 }
 function render(){
  window.DSCategoryLayout.setExtraCategories(records());list.replaceChildren();
  if(!extras.length)list.append(node('p','No additional categories.','category-empty'));
  for(const record of extras){
   const row=node('div',null,'category-edit-row'),label=node('span',record.label),rename=node('button','Rename'),remove=node('button','Remove');
   rename.type=remove.type='button';rename.onclick=()=>start(record);remove.onclick=()=>{extras=extras.filter(e=>e.id!==record.id);persist();render()};
   row.append(label,rename,remove);list.append(row);
  }
 }
 function start(record=null){editing=record?.id||null;form.hidden=false;form.elements.name.value=record?.label||'';error.textContent='';form.elements.name.focus();}
 async function save(name,id=null){
  name=clean(name);if(!name)throw Error('Enter a category name.');
  if(id&&!extras.some(e=>e.id===id))throw Error('Original drawers can only be changed by Matthew.');
  const backup=extras.map(e=>({...e}));
  const record={id:id||'custom-'+crypto.randomUUID(),label:name};
  if(id)extras=extras.map(e=>e.id===id?record:e);else extras.push(record);
  render();await document.fonts.ready;await new Promise(requestAnimationFrame);
  const card=document.querySelector('#grid>[data-extra-category="'+record.id+'"]'),text=card?.querySelector('.badge-title-svg'),path=card?.querySelector('clipPath[id$="-fill"] path');
  if(text&&path){
   const r=text.getBBox(),m=path.getCTM().inverse().multiply(text.getCTM());
   const fits=[[r.x-12,r.y-8],[r.x+r.width+12,r.y-8],[r.x+r.width+12,r.y+r.height+8],[r.x-12,r.y+r.height+8]].every(([x,y])=>path.isPointInFill(new DOMPoint(x,y).matrixTransform(m)));
   if(!fits){extras=backup;render();throw Error('Use a shorter name so it fits comfortably inside the drawer.');}
  }
  persist();return record;
 }
 function boot(){
  if(booted||!window.DSCategoryLayout||document.body.dataset.view!=='overview')return;booted=true;
  originals=[...document.querySelectorAll('#grid>.badge-drawer')].filter(e=>!e.dataset.extraCategory).map(e=>e.querySelector('.badge-title-svg')?.textContent||'');
  try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))extras=saved.filter(e=>typeof e.id==='string'&&/^custom-[\w-]+$/.test(e.id)&&typeof e.label==='string'&&clean(e.label)).map(e=>({id:e.id,label:clean(e.label)}));}catch{}
  trigger=node('button',null,'category-editor-trigger');trigger.type='button';trigger.setAttribute('aria-label','Add or manage categories');trigger.title='Add or manage categories';
  trigger.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6v20M6 16h20"/></svg>';
  dialog=node('dialog',null,'category-editor');dialog.setAttribute('aria-labelledby','category-editor-title');
  const heading=node('h2','Categories');heading.id='category-editor-title';const close=node('button','×','category-editor-close');close.type='button';close.setAttribute('aria-label','Close category editor');close.onclick=()=>dialog.close();
  const note=node('p','The original twelve drawers are managed by Matthew.');
  const details=node('details'),summary=node('summary','Original drawers (12)'),base=node('ul');originals.forEach(name=>base.append(node('li',name)));details.append(summary,base);
  const h3=node('h3','Additional categories');list=node('div',null,'category-editor-list');
  const add=node('button','Add category','category-add');add.type='button';add.onclick=()=>start();
  form=node('form');form.hidden=true;const label=node('label','Category name'),input=node('input');input.name='name';input.required=true;input.maxLength=80;label.append(input);
  error=node('p',null,'category-editor-error');error.setAttribute('role','alert');const submit=node('button','Save'),cancel=node('button','Cancel');submit.type='submit';cancel.type='button';cancel.onclick=()=>{form.hidden=true;editing=null;error.textContent=''};
  const actions=node('div',null,'category-form-actions');actions.append(submit,cancel);form.append(label,error,actions);
  form.onsubmit=async event=>{event.preventDefault();if(busy)return;busy=true;submit.disabled=true;try{await save(input.value,editing);form.hidden=true;editing=null;error.textContent='';add.focus()}catch(e){error.textContent=e.message}finally{busy=false;submit.disabled=false}};
  const scope=node('p','Preview changes are saved in this browser.','category-editor-scope');
  dialog.append(heading,close,note,details,h3,list,add,form,scope);document.body.append(trigger,dialog);trigger.onclick=()=>{render();dialog.showModal();add.focus()};
  document.addEventListener('click',event=>{
   const card=event.target.closest?.('#grid>[data-extra-category]'),record=card&&extras.find(e=>e.id===card.dataset.extraCategory);if(!record)return;
   event.preventDefault();event.stopImmediatePropagation();render();dialog.showModal();start(record);
  },true);
  window.DSCategoryAdmin={list:()=>extras.map(e=>({...e})),add:name=>save(name),rename:(id,name)=>save(name,id),remove:id=>{if(!extras.some(e=>e.id===id))throw Error('Original drawers can only be changed by Matthew.');extras=extras.filter(e=>e.id!==id);persist();render()}};
  render();position();watch.disconnect();
 }
 const watch=new MutationObserver(boot);watch.observe(document.documentElement,{childList:true,subtree:true});
 addEventListener('stylecontrolpositioned',position);addEventListener('resize',position);addEventListener('DOMContentLoaded',boot);boot();
})();
