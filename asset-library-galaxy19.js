/* 19 October: inherited 22,222-star catalogue; open, streaming nebula and soft independent twinkle. */
(() => {
 'use strict';
 const layer=document.querySelector('.ambient-smoke-layer');if(!layer)return;
 const COUNT=22222,GAIN=5.2,preference=matchMedia('(prefers-reduced-motion: reduce)');
 const flags=new URL(location).searchParams;
 if(flags.has('qa-background-only'))document.documentElement.classList.add('layout-background-only');
 const qaTime=flags.has('qa-time')?Math.max(0,Math.min(600,Number(flags.get('qa-time'))||0)):null;
 const paused=()=>preference.matches||flags.has('qa-paused')||qaTime!==null;
 Object.assign(layer.dataset,{version:'library19-curl-morph-20oct-r10',starCount:String(COUNT),starTwinkle:'independent-soft-peaks-3-6.5s',twinkleStrength:String(GAIN),cloudMotion:'soft-advected-overlapping-volumes',cloudSpeedMultiplier:'12.6',cloudVolumeCount:'2',starBrightnessMultiplier:'0.5',starSizes:'many-tiny-some-medium-rare-large',blueCloudTransmission:'0.80',cloudOpacityLimit:'0.50',cloudDensityScale:'1',cloudFlow:'local-curl-stretch-and-reform-with-slow-drift',cloudMorph:'independent-evolving-volumes',cloudMorphSeconds:'0.28',cloudEdges:'gradual-density-falloff-to-transparent',cloudSource:'procedural-nebula-not-telescope-footage'});
 // One catalogue drives both renderers. The first5,697 keep the inherited seed;
 // added distant stars are fainter so a larger population does not flatten depth.
 let seed=6408;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const stars=[],points=new Float32Array(COUNT*7);let glints=0;
 for(let i=0;i<COUNT;i++){
  const x=random(),y=random(),size=random(),brightness=random(),tempo=random(),phase=random();
  const distant=i>=5697;
  const radius=(size<.70?.30+size/.70*.32:size<.96?.68+(size-.70)/.26*.50:1.2+(size-.96)/.04*.8)*(distant?.90:1);
  const opacity=((size<.70?.16:size<.96?.26:.40)+brightness*(size<.70?.30:.36))*(distant?.80:1);
  const rate=2*Math.PI/(3+brightness*3.5),angle=phase*2*Math.PI,glint=tempo>.76?1:0;
  stars.push({x,y,radius,opacity,rate,phase:angle,glint});glints+=glint;
  points.set([x,y,radius,opacity,rate,angle,glint],i*7);
 }
 layer.dataset.catalogStarCount=String(stars.length);layer.dataset.twinklingStarCount=String(glints);
 const probes=stars.map((s,i)=>({...s,index:i})).filter(s=>s.glint).slice(0,8);
 const pulse=(s,t)=>GAIN*.90*Math.pow(Math.max(0,Math.sin(t*s.rate+s.phase)),5)*s.glint;
 const mark=(canvas,t,frames)=>{canvas.dataset.motionTime=t.toFixed(3);canvas.dataset.renderedStarCount=String(visibleStarCount());canvas.dataset.frameCount=String(frames);canvas.dataset.twinkleProbe=JSON.stringify(probes.map(s=>({index:s.index,intensity:Number((.5*s.opacity*(.78+pulse(s,t))).toFixed(6))})));};
 const compactSky=()=>innerWidth<1200;
 const visibleStarCount=()=>compactSky()?Math.max(400,Math.min(COUNT,Math.round(COUNT*layer.clientWidth*layer.clientHeight/(1920*1080)))):COUNT;
 const starScale=size=>compactSky()?Math.min(1,size.width/size.cssWidth)*.72:size.height/1080;
 const capSize=()=>{const w=layer.clientWidth,h=layer.clientHeight,d=Math.min(devicePixelRatio||1,1.25,1920/w);return {width:Math.max(1,Math.round(w*d)),height:Math.max(1,Math.round(h*d)),cssWidth:w,cssHeight:h};};
 function fallback(){
  layer.classList.add('smoke-ready');layer.dataset.renderer='animated-galaxy-fallback';layer.dataset.fallbackStarCount=String(COUNT);layer.style.transform='none';layer.style.backgroundImage='none';
  const plate=document.createElement('div');plate.className='galaxy-fallback-plate';plate.style.cssText='position:absolute;inset:0;background:linear-gradient(90deg,rgba(100,30,60,.055),rgba(30,50,100,.055))';layer.append(plate);
  const clouds=document.createElement('div');clouds.className='galaxy-fallback-clouds';clouds.style.cssText='position:absolute;inset:0;background:linear-gradient(90deg,rgb(100,30,60),rgba(30,50,100,.60));opacity:.18;will-change:transform,opacity';layer.append(clouds);
  const cloudLayers=[clouds];for(let i=1;i<4;i++){const cloud=clouds.cloneNode();cloud.classList.add('galaxy-fallback-clouds-'+i);cloudLayers.push(cloud);layer.append(cloud);}
  const streamStyle=document.createElement('style');streamStyle.textContent='@keyframes galaxy-smoke-stream19{0%{transform:translate(-5%,-1%) scale(1.15);opacity:0}18%,82%{opacity:.18}100%{transform:translate(5%,1%) scale(1.15);opacity:0}}';layer.append(streamStyle);
  const morph=document.createElementNS('http://www.w3.org/2000/svg','svg');morph.classList.add('galaxy-smoke-morph');morph.setAttribute('aria-hidden','true');morph.style.cssText='position:absolute;width:0;height:0;pointer-events:none';
  morph.innerHTML='<defs><filter id="galaxy-smoke-morph" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".003 .009" numOctaves="3" seed="17" result="cloud-noise"><animate attributeName="baseFrequency" values=".003 .016;.0033 .015;.003 .016" dur="10s" repeatCount="indefinite"/></feTurbulence><feColorMatrix in="cloud-noise" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.55 0 0 0 -.42" result="cloud-density"/><feComponentTransfer in="cloud-density" result="soft-density"><feFuncA type="gamma" amplitude="1" exponent="1.8" offset="0"/></feComponentTransfer><feComposite in="SourceGraphic" in2="soft-density" operator="in" result="cloud-matter"/><feDisplacementMap in="cloud-matter" in2="cloud-noise" scale="65" xChannelSelector="R" yChannelSelector="G"><animate attributeName="scale" values="40;55;40" dur="11.333333s" repeatCount="indefinite"/></feDisplacementMap><feGaussianBlur stdDeviation="4"/></filter></defs>';layer.append(morph);
  const canvas=document.createElement('canvas');canvas.className='galaxy64-fallback-stars';canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.5';layer.append(canvas);
  const ctx=canvas.getContext('2d'),base=document.createElement('canvas'),baseContext=base.getContext('2d');
  const sprite=document.createElement('canvas');sprite.width=sprite.height=32;const pen=sprite.getContext('2d');
  const glow=pen.createRadialGradient(16,16,0,16,16,16);glow.addColorStop(0,'rgba(255,255,255,1)');glow.addColorStop(.3,'rgba(255,255,255,.55)');glow.addColorStop(.7,'rgba(255,255,255,.06)');glow.addColorStop(1,'rgba(255,255,255,0)');pen.fillStyle=glow;pen.fillRect(0,0,32,32);
  let frame=0,elapsed=qaTime??0,last=null,frames=0,lastDraw=-Infinity,scale=1;
  const stamp=(context,s,amount)=>{const diameter=Math.max(1,s.radius*4*scale);context.globalAlpha=Math.min(1,amount*.80);context.drawImage(sprite,s.x*canvas.width-diameter/2,s.y*canvas.height-diameter/2,diameter,diameter);};
  const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.drawImage(base,0,0);ctx.globalCompositeOperation='lighter';for(const s of stars.slice(0,visibleStarCount()))if(s.glint)stamp(ctx,s,s.opacity*pulse(s,flags.has('qa-freeze-stars')?0:elapsed));ctx.globalAlpha=1;frames++;mark(canvas,elapsed,frames);};
  const resize=()=>{const size=capSize();canvas.width=base.width=size.width;canvas.height=base.height=size.height;scale=starScale(size);baseContext.clearRect(0,0,size.width,size.height);baseContext.globalCompositeOperation='lighter';for(const s of stars.slice(0,visibleStarCount()))stamp(baseContext,s,s.opacity*.78);draw();};
  const tick=now=>{frame=0;if(document.hidden||paused()){last=null;return;}if(last!==null)elapsed+=Math.max(0,(now-last)/1000);last=now;if(now-lastDraw>=1000/30){draw();lastDraw=now;}frame=requestAnimationFrame(tick);};
  const update=()=>{cancelAnimationFrame(frame);frame=0;last=null;const still=paused();layer.dataset.motion=still?'paused':'playing';for(const [i,cloud] of cloudLayers.entries()){cloud.style.animation=still||flags.has('qa-freeze-clouds')||flags.has('qa-freeze-drift')?'none':`galaxy-smoke-stream19 13.333333s linear ${-i*3.333333}s infinite`;cloud.style.transform=still||flags.has('qa-freeze-drift')?'scale(1.15)':'';cloud.style.filter='url(#galaxy-smoke-morph)';}if(qaTime!==null)morph.setCurrentTime(qaTime);if(still||flags.has('qa-freeze-clouds'))morph.pauseAnimations();else morph.unpauseAnimations();draw();if(!document.hidden&&!still)frame=requestAnimationFrame(tick);};
  layer.dataset.fallbackCloudSource='translucent-gradient-and-filament-turbulence';new ResizeObserver(resize).observe(layer);resize();update();preference.addEventListener('change',update);document.addEventListener('visibilitychange',update);window.addEventListener('drawerchange',update);
 }
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
 const gl=flags.has('qa-fallback')?null:canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,preserveDrawingBuffer:true});if(!gl){fallback();return;}
 function shader(type,code){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 function program(vertex,fragment){const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
 try{
  const sky=program('attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}',`precision highp float;
   varying vec2 v_uv;uniform vec2 u_size;uniform float u_time;uniform float u_cloud_time;uniform float u_drift_scale;uniform sampler2D u_stars;
   const vec3 WINE=vec3(100.,30.,60.)/255.;const vec3 NAVY=vec3(30.,50.,100.)/255.;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
   float fbm(vec2 p){float n=0.,a=.5;mat2 r=mat2(.8,-.6,.6,.8);for(int i=0;i<5;i++){n+=a*noise(p);p=r*p*2.03+vec2(13.1,7.7);a*=.5;}return n;}
   float hash3(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
   float noise3(vec3 p){
    vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    float lower=mix(mix(hash3(i),hash3(i+vec3(1.,0.,0.)),f.x),mix(hash3(i+vec3(0.,1.,0.)),hash3(i+vec3(1.,1.,0.)),f.x),f.y);
    float upper=mix(mix(hash3(i+vec3(0.,0.,1.)),hash3(i+vec3(1.,0.,1.)),f.x),mix(hash3(i+vec3(0.,1.,1.)),hash3(i+vec3(1.,1.,1.)),f.x),f.y);
    return mix(lower,upper,f.z);
   }
   float volumeFbm(vec3 p){float n=0.,a=.5;mat2 r=mat2(.8,-.6,.6,.8);for(int i=0;i<5;i++){n+=a*noise3(p);p=vec3(r*p.xy*2.03+vec2(13.1,7.7),p.z*1.7);a*=.5;}return n;}
   // Analytic curl of a changing potential bends neighbouring wisps differently.
   // Unlike a screen translation, this deformation changes locally through time.
   vec2 cloudCurl(vec2 p,float time){
    float inner=p.x*.7+time*.17;
    float a=p.y*1.1+.65*sin(inner)+time*.4;
    float b=p.x*1.15-p.y*.6+time*.31;
    return vec2(.352*cos(a)-.114*cos(b),-.1456*cos(a)*cos(inner)-.2185*cos(b));
   }
   vec2 evolvingCloudField(vec2 field,float time){
    vec2 curl=cloudCurl(field*.72,time);
    vec2 soft=vec2(noise3(vec3(field*.55,time*.18)),noise3(vec3(field*.55+vec2(7.3,4.1),time*.145+13.7)))-.5;
    return field+curl*1.15+soft*.65;
   }
   void main(){
    vec2 uv=vec2(v_uv.x,1.-v_uv.y);vec2 q=uv-.5;q.x*=u_size.x/u_size.y;
    // Slow transport and faster local shape evolution have independent clocks.
    float cloudTime=u_cloud_time*12.6;float t=cloudTime*.035;
    // Two gently evolving depths advect together; avoid iso-noise contour rings.
    vec2 drift=vec2(-t*.16,-t*.012)*u_drift_scale;
    vec2 field=vec2(q.x*.94,q.y*1.28)*2.55+drift;
    float morphTime=u_cloud_time*.28;
    vec2 matter=evolvingCloudField(field,morphTime);
    vec2 farMatter=evolvingCloudField(field*.81+vec2(9.7,-5.3),morphTime*.73+4.2);
    float nearCloud=volumeFbm(vec3(matter,morphTime*.31));
    float farCloud=volumeFbm(vec3(farMatter,morphTime*.19+3.1));
    float fine=fbm(matter*2.4+cloudCurl(field,morphTime*.73)*.32+vec2(-morphTime*.035,morphTime*.017));
    float band=exp(-pow((q.y+.11*sin(q.x*.86-t*.14))/.48,2.));
    float density=mix(nearCloud,farCloud,.29);
    float diffuseA=pow(smoothstep(.20,.72,density),2.15)*band;
    // A second independent cloud stream adds wisps without raising the opacity ceiling.
    float densityB=volumeFbm(vec3(evolvingCloudField(field*.94+vec2(4.8,1.9),morphTime*.87+2.3),morphTime*.27+9.4));
    float bandB=exp(-pow((q.y-.13+.11*sin(q.x*.86-t*.14+2.1))/.48,2.));
    float diffuseB=pow(smoothstep(.20,.72,densityB),2.15)*bandB;
    float diffuse=1.-(1.-diffuseA)*(1.-diffuseB);
    float veil=pow(smoothstep(.11,.70,density),3.1)*band;
    float filaments=diffuse*pow(smoothstep(.16,.80,fine),1.8);
    float mixAmount=smoothstep(.03,.97,uv.x+.09*sin(q.y*1.6+t*.16));
    vec3 base=mix(WINE,NAVY,mixAmount);
    // Cloud emission is separate from the dark sky and transmitted starlight.
    // Sparse, bright wisps remain visible on both sides without a broad opaque veil.
    float cloudOpacity=clamp(diffuse*.63+filaments*.42+veil*.10,0.,.50)*mix(1.,.80,mixAmount);
    vec3 sky=base*.055;
    vec3 cloudLight=base*clamp(1.25+diffuse*.65+filaments*.65,0.,1.75);
    vec3 color=mix(sky,cloudLight,cloudOpacity)*.55;
    // Even the densest wisp transmits most starlight; brightness varies with depth.
    float light=texture2D(u_stars,v_uv).r;
    float transmission=1.-cloudOpacity*.12;
    color=mix(color,vec3(1.),min(light*transmission,.94)*.5);
    float edges=1.-smoothstep(.65,1.7,length(q));color*=mix(.68,1.,edges);
    color*=.85;gl_FragColor=vec4(color,1.);
   }`);
  const field=program(`attribute vec2 a_position;attribute vec2 a_appearance;attribute vec3 a_twinkle;uniform float u_time;uniform float u_scale;varying float v_light;void main(){gl_Position=vec4(a_position.x*2.-1.,1.-a_position.y*2.,0.,1.);gl_PointSize=max(1.,a_appearance.x*4.*u_scale);float glint=4.68*pow(max(0.,sin(u_time*a_twinkle.x+a_twinkle.y)),5.)*a_twinkle.z;v_light=a_appearance.y*(.78+glint);}`,`precision mediump float;varying float v_light;void main(){vec2 d=(gl_PointCoord-.5)*4.;float light=(exp(-dot(d,d))+.055*exp(-dot(d,d)*.7))*v_light;gl_FragColor=vec4(vec3(light),1.);}`);
  const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const starBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,starBuffer);gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const fbo=gl.createFramebuffer();
  const attributes=[['a_position',2,0],['a_appearance',2,8],['a_twinkle',3,16]].map(([name,count,offset])=>({location:gl.getAttribLocation(field,name),count,offset}));
  const qPosition=gl.getAttribLocation(sky,'a_position');
  const uniforms={time:gl.getUniformLocation(sky,'u_time'),cloudTime:gl.getUniformLocation(sky,'u_cloud_time'),driftScale:gl.getUniformLocation(sky,'u_drift_scale'),size:gl.getUniformLocation(sky,'u_size'),stars:gl.getUniformLocation(sky,'u_stars'),fieldTime:gl.getUniformLocation(field,'u_time'),scale:gl.getUniformLocation(field,'u_scale')};
  let frame=0,elapsed=qaTime??0,last=null,retired=false,frames=0,logicalSize={cssWidth:1,cssHeight:1};
  const draw=()=>{
   gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.useProgram(field);gl.bindBuffer(gl.ARRAY_BUFFER,starBuffer);
   for(const a of attributes){gl.enableVertexAttribArray(a.location);gl.vertexAttribPointer(a.location,a.count,gl.FLOAT,false,28,a.offset);}gl.uniform1f(uniforms.fieldTime,flags.has('qa-freeze-stars')?0:elapsed);gl.uniform1f(uniforms.scale,starScale(logicalSize));gl.drawArrays(gl.POINTS,0,visibleStarCount());
   gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.disable(gl.BLEND);gl.useProgram(sky);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(qPosition);gl.vertexAttribPointer(qPosition,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.uniform1i(uniforms.stars,0);gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.cloudTime,flags.has('qa-freeze-clouds')?0:elapsed);gl.uniform1f(uniforms.driftScale,flags.has('qa-freeze-drift')?0:1);gl.uniform2f(uniforms.size,logicalSize.cssWidth,logicalSize.cssHeight);gl.drawArrays(gl.TRIANGLES,0,6);frames++;mark(canvas,elapsed,frames);
  };
  const resize=()=>{logicalSize=capSize();canvas.width=logicalSize.width;canvas.height=logicalSize.height;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,canvas.width,canvas.height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Star framebuffer unavailable');draw();};
  const tick=now=>{frame=0;if(retired||document.hidden||paused()){last=null;return;}if(last!==null)elapsed+=Math.max(0,(now-last)/1000);last=now;draw();frame=requestAnimationFrame(tick);};
  const update=()=>{if(retired)return;cancelAnimationFrame(frame);frame=0;last=null;layer.dataset.motion=paused()?'paused':'playing';draw();if(!document.hidden&&!paused())frame=requestAnimationFrame(tick);};
  layer.append(canvas);layer.classList.add('smoke-ready');layer.dataset.renderer='webgl-galaxy';layer.dataset.starRender='seeded-point-buffer';new ResizeObserver(resize).observe(layer);resize();update();preference.addEventListener('change',update);document.addEventListener('visibilitychange',update);window.addEventListener('drawerchange',update);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();retired=true;cancelAnimationFrame(frame);canvas.remove();layer.classList.remove('smoke-ready');fallback();});
 }catch(error){canvas.remove();layer.classList.remove('smoke-ready');fallback();console.warn('Galaxy renderer unavailable: '+error.message);}
})();
