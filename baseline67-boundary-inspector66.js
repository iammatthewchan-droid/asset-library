/* Read-only visual measurements. Runs only for the internal QA query. */
(()=>{
 if(!new URL(location).searchParams.has('qa'))return;
 const output=document.createElement('script');output.type='application/json';output.id='boundary-proof';document.body.append(output);
 const canvas=document.createElement('canvas'),context=canvas.getContext('2d');let pending=false;
 function inspect(){
  pending=false;const frames=[];
  for(const el of document.querySelectorAll('.folder-tile,.collection-angled')){
   const svg=el.querySelector(':scope>.folder-shape,:scope>.angle-frame'),path=svg?.querySelector('path');
   const box=el.getBoundingClientRect();if(!path?.getAttribute('d')||box.width<1||box.height<1)continue;
   const matrix=path.getScreenCTM(),inverse=matrix.inverse(),shape=new Path2D(path.getAttribute('d')),length=path.getTotalLength(),points=[];
   for(let s=0;s<=length;s+=2){const p=path.getPointAtLength(s);points.push([matrix.a*p.x+matrix.c*p.y+matrix.e,matrix.b*p.x+matrix.d*p.y+matrix.f]);}
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),texts=[];let text;
   while(text=walker.nextNode()){
    if(!text.textContent.trim()||text.parentElement.closest('svg,script')||text.parentElement.closest('.folder-tile,.collection-angled')!==el)continue;
    const style=getComputedStyle(text.parentElement);if(style.display==='none'||style.visibility==='hidden')continue;
    context.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    let nearest=Infinity,inkCount=0,outside=0;const lines=new Set();
    for(let i=0;i<text.length;i++){
     const character=text.textContent[i];if(!character.trim())continue;
     const range=document.createRange();range.setStart(text,i);range.setEnd(text,i+1);
     const rect=range.getBoundingClientRect();if(!rect.width||!rect.height)continue;lines.add(Math.round(rect.top));
     const ink=context.measureText(character),ascent=ink.fontBoundingBoxAscent??rect.height*.8,descent=ink.fontBoundingBoxDescent??rect.height*.2;
     const baseline=rect.top+(rect.height-ascent-descent)/2+ascent;
     const left=rect.left-ink.actualBoundingBoxLeft,right=rect.left+ink.actualBoundingBoxRight;
     const top=baseline-ink.actualBoundingBoxAscent,bottom=baseline+ink.actualBoundingBoxDescent;
     for(const [x,y] of [[left,top],[right,top],[right,bottom],[left,bottom]]){const localX=inverse.a*x+inverse.c*y+inverse.e,localY=inverse.b*x+inverse.d*y+inverse.f;if(!context.isPointInPath(shape,localX,localY))outside++;}
     for(const [x,y] of points){const dx=Math.max(left-x,0,x-right),dy=Math.max(top-y,0,y-bottom);nearest=Math.min(nearest,Math.hypot(dx,dy)-.625);}
     inkCount++;
    }
    if(inkCount)texts.push({text:text.textContent.trim(),lines:lines.size,font:style.fontSize,ink_clearance_px:Number((outside?-Math.abs(nearest):nearest).toFixed(2)),outside_ink_corners:outside,contained:outside===0});
   }
   const d=path.getAttribute('d'),viewBox=svg.viewBox.baseVal;frames.push({viewBox:[viewBox.width,viewBox.height],geometry_matches_box:Math.abs(viewBox.width-box.width)<.02&&Math.abs(viewBox.height-box.height)<.02,contained:texts.every(t=>t.contained),type:el.className,width:box.width,height:box.height,full_slants:!/[VA]/.test(d),path:d,texts,min_ink_clearance_px:Math.min(...texts.map(t=>t.ink_clearance_px))});
  }
  const report={viewport:[innerWidth,innerHeight],page_overflow:document.documentElement.scrollWidth-innerWidth,frames};
  const serialized=JSON.stringify(report);if(output.textContent!==serialized)output.textContent=serialized;
 }
 function schedule(records){if(Array.isArray(records)&&records.every(r=>r.target===output||r.target.parentElement===output))return;if(!pending){pending=true;requestAnimationFrame(inspect);}}
 new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true});
 addEventListener('resize',schedule);addEventListener('scroll',schedule,true);document.fonts.ready.then(schedule);
})();
