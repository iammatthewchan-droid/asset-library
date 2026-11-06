/* Short reflections follow the border itself, including every curved corner. */
(()=>{
const NS='http://www.w3.org/2000/svg';
const style=document.createElement('style');
style.textContent=`
.rim-flow-beam{offset-path:none!important;animation:none!important}
.rim-flow-stroke{animation:ds-border-flow 7.2s linear infinite;animation-delay:var(--flow-phase,0s);animation-play-state:paused;pointer-events:none}
.active-glare .rim-flow-stroke,.badge-drawer:is(.is-pointed,:focus-visible) .rim-flow-stroke{animation-play-state:running}
#library-download-confirm .confirm-plaque:not(:hover) .rim-flow-stroke,#library-download-confirm .confirm-plaque:disabled .rim-flow-stroke{animation-play-state:paused!important}
@keyframes ds-border-flow{from{stroke-dashoffset:var(--flow-start)}to{stroke-dashoffset:var(--flow-end)}}
@media(prefers-reduced-motion:reduce){.rim-flow-stroke{animation:none!important}}
`;
document.head.append(style);
window.DSBorderGlare={fill(group,d,phase='0s',width=668){
 group.classList.add('rim-flow-beam');group.replaceChildren();
 const route=document.createElementNS(NS,'path');route.setAttribute('d',d);group.append(route);
 const length=route.getTotalLength();let area=0,p=route.getPointAtLength(0);
 for(let i=1;i<=128;i++){const n=route.getPointAtLength(length*i/128);area+=p.x*n.y-n.x*p.y;p=n}
 route.remove();
 const span=Math.min(32,Math.max(14,width*.09/length*1000));
 for(const [fraction,opacity,weight] of [[1,.12,3],[.76,.2,2.3],[.5,.35,1.6],[.24,.75,1]]){
  const light=document.createElementNS(NS,'path'),dash=span*fraction,center=dash/2;
  for(const [k,v] of Object.entries({d,pathLength:1000,fill:'none',stroke:'#fff','stroke-width':Math.max(1,width/550)*weight,'stroke-linecap':'round','stroke-dasharray':`${dash} ${1000-dash}`,opacity,class:'rim-flow-stroke'}))light.setAttribute(k,v);
  light.style.setProperty('--flow-start',String(center));light.style.setProperty('--flow-end',String(center+(area<0?1000:-1000)));light.style.setProperty('--flow-phase',phase);
  group.append(light);
 }
}};
})();
