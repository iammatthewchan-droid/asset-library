/* Owner correction: lengthen native traps inward; preserve row endpoints,
   height, curved ends and slopes. Match horizontal clear gap at mid-height
   to the square thumbnail gap, not the rectangular SVG-box gap. */
(()=>{
 const W=190.220215,H=38.073029,X=1145.10791,Y=835.121979;
 const observed=new WeakSet(); let queued=false;
 const sizes=new ResizeObserver(()=>schedule());
 function extend(delta){return `M${1330.5238037+delta},835.1219482h${-138.7293701-delta}c-14.2232666,0-16.8109131,2.8093262-22.7186279,8.7156982l-21.182251,21.1741943c-6.1081543,6.1066895-0.8811035,8.1831665,3.3905029,8.1831665h${145.3840332+delta}c8.1690674,0,14.590332-7.2423096,15.489502-8.1412964l21.7568359-21.7486572C${1336.9345703+delta},840.2855835,${1334.7955322+delta},835.1219482,${1330.5238037+delta},835.1219482z`;}
 function apply(){queued=false; document.querySelectorAll('#layout-stage .section-actions').forEach(row=>{
  const buttons=[...row.querySelectorAll('.section-download')], n=buttons.length;
  if(n<2)return;
  const tiles=row.parentElement.querySelector('.tiles'); if(!tiles)return;
  if(!observed.has(tiles)){observed.add(tiles);sizes.observe(tiles);}
  const gap=parseFloat(getComputedStyle(tiles).columnGap), width=parseFloat(getComputedStyle(row).width);
  if(!(width>0&&gap>0))return;
  // Lock original height before lengthening. All dimensions are local CSS pixels.
  const oldW=(width-(n-1)*gap)/n, height=oldW*H/W, scale=height/H;
  const mid=Y+H/2;
  const left=1169.0758057-(mid-843.8376464)*21.182251/21.1741943;
  const right=1312.1575928+(865.0537108-mid)*21.7568359/21.7486572;
  const inset=(left-X)+(X+W-right);
  const boxGap=gap-inset*scale, buttonW=(width-(n-1)*boxGap)/n;
  row.style.position='relative'; row.style.display='block'; row.style.height=height+'px';
  buttons.forEach((button,i)=>{
   const svg=button.querySelector('svg'), path=svg?.querySelector(':scope > path');
   if(!path)return;
   button.style.position='absolute';button.style.left=(i*(buttonW+boxGap))+'px';button.style.top='0';
   button.style.width=buttonW+'px';button.style.height=height+'px';button.style.aspectRatio='auto';
   const delta=buttonW/scale-W, d=extend(delta);
   svg.setAttribute('viewBox',`${X} ${Y} ${W+delta} ${H}`);
   path.setAttribute('d',d);
   svg.querySelectorAll('.native-beam').forEach(beam=>beam.style.offsetPath=`path('${d}')`);
  });
 });}
 function schedule(){if(!queued){queued=true;requestAnimationFrame(apply);}}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('resize',schedule); schedule();
})();
