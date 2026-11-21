/* Colour-only preview adapter. No type, geometry, image, or asset-file changes. */
(() => {
  const themes = {
    obsidian: {name:'Brushed Titanium',base:'#12161b',left:'#30343b',right:'#30343b',a:'#30343b',b:'#30343b',accent:'#e8edf4',material:'titanium'},
    titanium: {name:'Black Anodised',base:'#0a0c10',left:'#292d34',right:'#292d34',a:'#292d34',b:'#292d34',accent:'#e8edf4',material:'anodised'},
    plum: {name:'Dark Bronze',base:'#171410',left:'#33302d',right:'#33302d',a:'#33302d',b:'#33302d',accent:'#eee9e3',material:'bronze'},
    chrome: {name:'Smoked Chrome',base:'#080a0d',left:'#343a42',right:'#343a42',a:'#343a42',b:'#343a42',accent:'#e8edf4',material:'chrome'},
    indigo: {name:'Hammered Gunmetal',base:'#15181d',left:'#30353b',right:'#30353b',a:'#30353b',b:'#30353b',accent:'#e8edf4',material:'gunmetal'},
    gentleman: {name:'Matte Black & Purple',base:'#08080a',left:'#2a2132',right:'#2a2132',a:'#2a2132',b:'#2a2132',accent:'#eee8f5',material:'gentleman'}
  };
  Object.assign(themes,{"gentleman": {"name": "Matte Black / Gunmetal", "base": "#070709", "left": "#17171b", "right": "#17171b", "a": "#17171b", "b": "#17171b", "accent": "#eeeaf2", "material": "matte-black-r02", "bar": "#452b59", "rim": "#656a74", "gunmetal": true, "lightDirection": "soft upper right"}, "m01": {"name": "Platinum Ice", "base": "#0d1219", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m01", "bar": "#203d59", "rim": "#6f7580", "lightDirection": "upper left"}, "m02": {"name": "Cobalt Chrome", "base": "#080e1c", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m02", "bar": "#254e89", "rim": "#6f7580", "lightDirection": "right"}, "m03": {"name": "Amethyst Steel", "base": "#100b19", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m03", "bar": "#634479", "rim": "#6f7580", "lightDirection": "upper right"}, "m04": {"name": "Petrol Titanium", "base": "#081517", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m04", "bar": "#24646b", "rim": "#6f7580", "lightDirection": "left"}, "m05": {"name": "Burgundy Chrome", "base": "#160a10", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m05", "bar": "#7a334d", "rim": "#6f7580", "lightDirection": "upper left"}, "m06": {"name": "Champagne Titanium", "base": "#14120e", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m06", "bar": "#6d5a37", "rim": "#6f7580", "lightDirection": "right"}, "m07": {"name": "Copper Alloy", "base": "#170d0b", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m07", "bar": "#84452f", "rim": "#6f7580", "lightDirection": "upper right"}, "m08": {"name": "Emerald Alloy", "base": "#09140f", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m08", "bar": "#28624b", "rim": "#6f7580", "lightDirection": "left"}, "m09": {"name": "Pearl Graphite", "base": "#0d1117", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m09", "bar": "#465970", "rim": "#6f7580", "lightDirection": "top"}, "m10": {"name": "Violet Blue Alloy", "base": "#0b0d1c", "left": "#24262d", "right": "#24262d", "a": "#24262d", "b": "#24262d", "accent": "#eef0f5", "material": "m10", "bar": "#454b84", "rim": "#6f7580", "lightDirection": "lower right"}});
  Object.assign(themes,{"b01": {"base": "#07090c", "left": "#151c24", "right": "#151c24", "a": "#151c24", "b": "#151c24", "controlFace": "#151c24", "materialURL": "/skins/materials/physical-black-titanium-r03.png", "material": "physical-black-titanium-r03", "accent": "#ffffff", "rim": "#d0d6df", "circleBase": "#1f2832", "rimFilter": "grayscale(1) brightness(1.35)", "physicalMaterial": true, "name": "Black Titanium / Polished Silver", "bar": "#294b60", "rimStops": ["#969fae", "#ffffff", "#a7b2c1", "#f4f7fc", "#8c96a5"]}, "b02": {"base": "#07090c", "left": "#151c24", "right": "#151c24", "a": "#bcc4ce", "b": "#bcc4ce", "controlFace": "#151c24", "materialURL": "/skins/materials/physical-black-titanium-r03.png", "material": "physical-black-titanium-r03", "accent": "#111820", "rim": "#d0d6df", "circleBase": "#29313b", "rimFilter": "grayscale(1) brightness(1.35)", "physicalMaterial": true, "name": "Black Titanium / Brushed Silver", "bar": "#354f62", "rimStops": ["#7d8896", "#d9dfe7", "#a4afbe", "#e4e9ef", "#7d8896"], "titleStops": ["#a1acb9", "#e0e6ed", "#8c98a8"]}, "b03": {"base": "#07090c", "left": "#151c24", "right": "#151c24", "a": "#20191c", "b": "#20191c", "controlFace": "#151c24", "materialURL": "/skins/materials/physical-black-titanium-r03.png", "material": "physical-black-titanium-r03", "accent": "#ffffff", "rim": "#d0d6df", "circleBase": "#30292c", "rimFilter": "grayscale(1) sepia(.22) saturate(.65) hue-rotate(300deg) brightness(1.25)", "physicalMaterial": true, "name": "Black Titanium / Blush Silver", "bar": "#643d49", "rimStops": ["#98838c", "#fae9eb", "#baa2ad", "#efdee3", "#8c7781"]}});
  // Brand-purple variant: inherited purple control face and original DS navy accent.
  themes.p01={...themes.b01,name:'DeepStack Brand Purple / Polished Silver',base:'#0b0810',left:'#3c2850',right:'#1b3661',a:'#3c2850',b:'#26182f',controlFace:'#3c2850',circleBase:'#3c2850',bar:'#1b3661',purpleMaterial:true,menuFillMatch:true};
  const purpleRimStops=['#9691a2','#ffffff','#b4a9c1','#ffffff','#8d839a'];
  const purpleRimFilter='grayscale(1) sepia(.1) saturate(.8) hue-rotate(220deg) brightness(1.55)';
  themes.p01={...themes.p01,rimStops:purpleRimStops,rimFilter:purpleRimFilter};
  themes.mb01={...themes.b01,name:'Metallic Black / Dark Purple Glass',base:'#080808',left:'#181818',right:'#181818',controlFace:'#242424',a:'#242424',b:'#000000',circleBase:'#281a33',menuFillMatch:true,neutralMetal:true,bar:'#202020'};
  themes.metal01={...themes.p01,name:'Matte Black & Purple Metal',purpleMaterial:false,blackPurpleMaterial:true};
  themes.sky01={...themes.p01,name:'Moving Starry Sky / Purple Metallic Rim',purpleMaterial:false,motionMaterial:true,base:'#050409'};
  // Owner16Nov: the shown photographic purple/starfield look replaces p01.
  // sky01 receives the authentic earlier enamel artwork; both retain the same geometry.
  themes.p01={...themes.sky01,name:'Purple Glass / Starry Sky'};
  themes.sky01={...themes.sky01,name:'Original Enamel / Starry Sky',originalFace:true,circleBase:null,menuFillMatch:false,a:'#641E3C',b:'#1E3264',controlFace:'#3c2850',accent:'#bee7f6'};
  // A viewer's explicit dot choice takes precedence over the default shared link.
  const skinURL=new URL(location);let savedSkin;
  try{savedSkin=localStorage.getItem('ds-asset-library-skin-v1')}catch{}
  if(['sky01','p01','mb01'].includes(savedSkin)){
    skinURL.searchParams.set('skin',savedSkin);history.replaceState(history.state,'',skinURL.href);
  }
  const key = skinURL.searchParams.get('skin') || 'sky01';
  const theme = themes[key] || themes.obsidian;
  const rgb = hex => hex.slice(1).match(/../g).map(x=>parseInt(x,16));
  window.DSSkin={...theme,key,cloudLeft:rgb(theme.left).map(x=>x+'.0'),cloudRight:rgb(theme.right).map(x=>x+'.0')};
  if(key==='source')return;
  document.documentElement.dataset.skin=key;
  const style = document.createElement('style');
  style.id='ds-colour-only-skin';
  style.textContent=`
    :root{--skin-base:${theme.base};--skin-a:${theme.a};--skin-b:${theme.b};--skin-accent:${theme.accent};--skin-bar:${theme.bar||'#452b59'};--skin-rim:${theme.rim||'#81838b'};--bg:${theme.base};--wine:${theme.left};--navy:${theme.right}}
    html,body,body[data-owner-tier=true],body[data-owner-mode]{background-color:var(--skin-base)!important}
    .ambient-smoke-layer{background:var(--skin-base) url('${theme.materialURL||('/skins/materials/'+theme.material+'.svg')}') center/cover no-repeat!important}
    .ambient-smoke-layer>canvas,.galaxy-fallback-plate,.galaxy-fallback-clouds{display:none!important}
    #Starfield-Background,#source-art>[id="_x30_1-Galaxy-background"]{visibility:hidden!important}
    .galaxy-fallback-plate{background:linear-gradient(90deg,${theme.left}0e,${theme.right}0e)!important}
    .galaxy-fallback-clouds{background:linear-gradient(90deg,${theme.left},${theme.right}99)!important}
    #grid .badge-title-svg{fill:var(--skin-accent)!important}
    .library-pdf-pages{background:var(--skin-bar)!important}
    .library-pdf-pages button{background:var(--skin-bar)!important;border-color:var(--skin-rim)!important}
  `;
  if(theme.purpleMaterial)style.textContent+=`.ambient-smoke-layer{background-image:linear-gradient(110deg,#3c2850,#402952 62%,#54396b),url('${theme.materialURL}')!important;background-blend-mode:color,normal!important}`;
  // Owner15Nov: preserve the photographed metal light and texture, remove its colour cast.
  if(theme.neutralMetal)style.textContent+=`.ambient-smoke-layer{background-image:linear-gradient(#000,#000),url('${theme.materialURL}')!important;background-blend-mode:saturation,normal!important}.layout #nav a:hover{background:linear-gradient(173deg,#242424,#000)!important}.badge-art image[href*="owner-exact-wing"]{filter:grayscale(1) contrast(1.2)!important}`;
  if(theme.matteMaterial)style.textContent+=`.ambient-smoke-layer{background-image:linear-gradient(110deg,rgba(0,0,0,.5),rgba(0,0,0,.64)),url('${theme.materialURL}')!important;background-blend-mode:normal!important}`;
  if(theme.blackPurpleMaterial)style.textContent+=`.ambient-smoke-layer{background-image:linear-gradient(110deg,rgba(0,0,0,.52),rgba(0,0,0,.12) 58%,rgba(0,0,0,.2)),linear-gradient(110deg,#1a1620,#402952 62%,#54396b),url('${theme.materialURL}')!important;background-blend-mode:normal,color,normal!important}`;
  if(theme.motionMaterial)style.textContent+=`.ambient-smoke-layer{background:#050409!important}.ambient-smoke-layer>canvas{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important}.galaxy-fallback-plate,.galaxy-fallback-clouds{display:block!important}`;
  // Extend the existing material beyond the viewport so its baked frame stays outside the page.
  if(theme.physicalMaterial&&!theme.motionMaterial)style.textContent+=`.ambient-smoke-layer{background-size:max(105.5vw,calc(100dvh * 1672 / 941 * 1.055)) auto!important;background-position:left top!important}`;
  // Owner15Nov: the authentic silver pixels retain their source light response.
  // Skin colours must not wash out the running white glare.
  if(theme.gunmetal)style.textContent+=`
    .asset-preview,.gallery-pdf-panel{border-color:var(--skin-rim)!important}
  `;
  // Still captures use the inherited QA clock and omit only the opening fade.
  if(new URL(location).searchParams.has('qa-time'))style.textContent+='html[data-library-ready="true"] body{animation:none!important}';
  document.head.append(style);

  let originalFaces=null;
  if(theme.originalFace)fetch('/skins/original-faces16.json').then(r=>{if(!r.ok)throw Error('Original drawer material unavailable');return r.json()}).then(data=>{originalFaces=data;scan(document.body)}).catch(console.error);
  function restoreOriginalFace(svg){
    if(!originalFaces||!svg.matches('.badge-art')||svg.dataset.originalFace16||svg.dataset.glass64!=='true')return;
    const clip=svg.querySelector('clipPath[id$="-face"]');if(!clip)return;
    const prefix=clip.id.slice(0,-5),card=svg.closest('.badge-drawer');
    const id=card?new URL(card.href,location.href).searchParams.get('drawer'):'brand-identity';
    const source=originalFaces[id]||originalFaces['brand-identity'];
    const groups=[...svg.querySelectorAll(':scope>g[clip-path]')].filter(g=>g.getAttribute('clip-path')==='url(#'+clip.id+')');
    if(!groups.length)return;svg.dataset.originalFace16='true';
    source.faces.forEach((raw,i)=>{const parsed=new DOMParser().parseFromString(raw.replaceAll(source.prefix,prefix),'image/svg+xml').documentElement;
      const face=document.importNode(parsed,true);if(groups[i])groups[i].replaceWith(face);else groups[0].after(face);
    });
  }
  function originalWing(svg){
    if(!svg.dataset.titleWingExtended||svg.querySelector('[data-original-wing16]'))return;
    const face=[...svg.querySelectorAll(':scope>g[data-native-upper-extension]')].find(g=>g.querySelector('rect[data-skin-wing]'));
    const clip=svg.querySelector('clipPath[id$="-fill"]'),gradient=svg.querySelector('linearGradient[id$="-colour"]');if(!face||!clip||!gradient)return;
    // One unsliced colour field prevents a gradient seam at the native extension join.
    const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.dataset.originalWing16='true';
    for(const[k,v]of Object.entries({x:500,y:218,width:1000,height:193,fill:'url(#'+gradient.id+')','clip-path':'url(#'+clip.id+')'}))rect.setAttribute(k,String(v));face.after(rect);
  }
  // Change only existing colour stops. Preserve native paths, metal rim and glare.
  function colour(svg){
    if(!(svg instanceof SVGElement))return;
    if(theme.originalFace){restoreOriginalFace(svg);if(svg.matches('.badge-art'))originalWing(svg);}
    if(theme.circleBase){
      const base=rgb(theme.circleBase);
      const tables=base.map(channel=>Array.from({length:257},(_,index)=>{const y=index/256,b=channel/255;return(y<=.25?b*Math.pow(y/.25,1.15):b+(1-b)*.7*Math.pow((y-.25)/.75,1.35)).toFixed(9)}).join(' '));
      svg.querySelectorAll('filter[id$="-owner-glass64"],filter[id$="-glass-front64"]').forEach(filter=>{
        if(filter.dataset.skinMaterial===key)return;
        ['R','G','B'].forEach((c,i)=>filter.querySelector('feFunc'+c)?.setAttribute('tableValues',tables[i]));
        filter.setAttribute('data-material-base',theme.circleBase);filter.dataset.skinMaterial=key;
      });
      svg.querySelectorAll('.glass64-skin').forEach(el=>el.setAttribute('fill',theme.circleBase));
    }
    if(theme.neutralMetal&&(svg.id==='menu-art-overlay'||svg.closest('.asset-tile,.gallery-pdf-panel,.gallery-action-dock,.inventory,#library-download-confirm'))){
      // Sharpen only the native silver border gradients; never grade the travelling glare.
      // Dark steel intervals retain contrast for the original white moving highlights.
      const silver=['#575b60','#ffffff','#91969d','#f5f7fa','#5e636a'];
      svg.querySelectorAll('linearGradient').forEach(g=>{
        if(g.dataset.neutralSilver)return;
        const rim=[...svg.querySelectorAll('path:not(.rim-flow-stroke)')].some(p=>getComputedStyle(p).stroke.includes('#'+g.id));
        if(!rim)return;
        [...g.querySelectorAll('stop')].forEach((stop,i)=>stop.style.stopColor=silver[i%silver.length]);
        g.dataset.neutralSilver='true';
      });
    }
    svg.querySelectorAll('linearGradient').forEach(g=>{
      // Native silver gradients and all glare layers are protected from skins.
      if(g.dataset.skinFill)return;
      const stops=[...g.querySelectorAll('stop')];
      const first=(stops[0]?.style.stopColor||stops[0]?.getAttribute('stop-color')||'').toLowerCase();
      if(/^button-b-.*-fill$/.test(g.id)){
        stops.forEach((s,i)=>{s.style.stopColor=i?'#000000':(theme.controlFace||theme.a)});g.dataset.skinFill='true';
      }else if(stops.length===6&&first==='#3c2850'){
        const levels=[1,.95,.82,.58,.25,0];
        stops.forEach((s,i)=>s.style.stopColor='rgb('+rgb(theme.controlFace||theme.a).map(v=>Math.round(v*levels[i])).join(',')+')');g.dataset.skinFill='true';
      }
    });
    svg.querySelectorAll('linearGradient[id$="-colour"],linearGradient[id$="-enamel"]').forEach(g=>{
      if(!g.closest('.badge-art')||g.dataset.menuMatch)return;
      if(theme.originalFace&&g.id.endsWith('-colour')){g.setAttribute('gradientUnits','userSpaceOnUse');g.setAttribute('x1','474.5');g.setAttribute('x2','1397.6');g.setAttribute('y1','0');g.setAttribute('y2','0');}
      if(theme.titleStops&&g.id.endsWith('-colour')){
        if(!g.dataset.physicalTitle){g.replaceChildren(...theme.titleStops.map((color,i)=>{const s=document.createElementNS('http://www.w3.org/2000/svg','stop');s.setAttribute('offset',String(i/(theme.titleStops.length-1)));s.setAttribute('stop-color',color);return s}));g.setAttribute('x1','0%');g.setAttribute('y1','0%');g.setAttribute('x2','0%');g.setAttribute('y2','100%');g.dataset.physicalTitle='true'}
        return;
      }
      [...g.querySelectorAll('stop')].forEach((s,i)=>s.setAttribute('stop-color',i?theme.b:theme.a));
    });
    if(theme.menuFillMatch){
      // Use the existing inner-menu control fill on each native homepage face.
      function matchMenu(g,top,bottom){
        if(g.dataset.menuMatch)return;
        g.setAttribute('gradientUnits','userSpaceOnUse');g.removeAttribute('gradientTransform');
        for(const [attr,value] of Object.entries({x1:'0',x2:'0',y1:String(top),y2:String(bottom)}))g.setAttribute(attr,value);
        g.replaceChildren(...[theme.controlFace||theme.a,'#000000'].map((color,i)=>{
          const stop=document.createElementNS('http://www.w3.org/2000/svg','stop');stop.setAttribute('offset',String(i));stop.setAttribute('stop-color',color);return stop;
        }));g.dataset.menuMatch='purple-menu-fill';
      }
      if(svg.matches('.badge-art')){
        const g=svg.querySelector('linearGradient[id$="-colour"]');if(g)matchMenu(g,218,411);
      }
      if(svg.closest('.inventory')){
        let g=svg.querySelector('#owner-total-menu-fill15');
        if(!g){g=document.createElementNS('http://www.w3.org/2000/svg','linearGradient');g.id='owner-total-menu-fill15';svg.querySelector('defs').append(g);}
        matchMenu(g,145.5354,207.8514);svg.querySelector(':scope>path')?.setAttribute('fill','url(#owner-total-menu-fill15)');
      }
    }
    if(svg.matches('.badge-art')&&!svg.querySelector('[data-owner-native-rim]')){
      const ns='http://www.w3.org/2000/svg',defs=svg.querySelector('defs');
      const sourceClip=svg.querySelector('clipPath[id$="-source"]');
      const original=svg.querySelector(':scope>image'),gradient=svg.querySelector('linearGradient[id$="-colour"]');
      if(defs&&sourceClip&&original&&gradient){
        // The owner's actual contour clips the colour, with no replacement trapezoid path.
        const face=document.createElementNS(ns,'rect');face.dataset.skinWing='true';
        face.setAttribute('x','0');face.setAttribute('y','218');face.setAttribute('width','1390');face.setAttribute('height','193');
        face.setAttribute('fill','url(#'+gradient.id+')');face.setAttribute('clip-path','url(#'+sourceClip.id+')');original.after(face);
        // Recover the original metallic rim pixels over the new face colour.
        // Only luminance is used to isolate the rim; no outline is redrawn or expanded.
        const prefix=gradient.id+'-native-rim-',filter=document.createElementNS(ns,'filter');
        filter.id=prefix+'luma';filter.setAttribute('color-interpolation-filters','sRGB');
        const gray=document.createElementNS(ns,'feColorMatrix');gray.setAttribute('type','saturate');gray.setAttribute('values','0');filter.append(gray);
        const transfer=document.createElementNS(ns,'feComponentTransfer');
        for(const channel of ['R','G','B']){const f=document.createElementNS(ns,'feFunc'+channel);f.setAttribute('type','linear');f.setAttribute('slope','5');f.setAttribute('intercept','-1.1');transfer.append(f)}
        filter.append(transfer);defs.append(filter);
        const mask=document.createElementNS(ns,'mask');mask.id=prefix+'mask';mask.setAttribute('maskUnits','userSpaceOnUse');
        for(const[k,v]of Object.entries({x:'0',y:'0',width:'1390',height:'682'}))mask.setAttribute(k,v);
        const rimPixels=original.cloneNode(true);rimPixels.setAttribute('filter','url(#'+filter.id+')');rimPixels.style.setProperty('filter','url(#'+filter.id+')','important');mask.append(rimPixels);
        const faceClip=svg.querySelector('clipPath[id$="-face"] circle');
        if(faceClip){const interior=faceClip.cloneNode(true);interior.setAttribute('r',String(Number(faceClip.getAttribute('r'))+1));interior.setAttribute('fill','black');mask.append(interior)}
        defs.append(mask);const rim=original.cloneNode(true);rim.dataset.ownerNativeRim='true';rim.setAttribute('mask','url(#'+mask.id+')');const glare=svg.querySelector(':scope>.badge-glare');if(glare)glare.before(rim);else svg.append(rim);
      }
    }
  }

  function scan(node){
    if(node.nodeType!==1)return;
    if(node.matches?.('svg'))colour(node);
    else if(node.closest?.('svg'))colour(node.closest('svg'));
    node.querySelectorAll?.('svg').forEach(colour);
  }
  new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)scan(n)}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>scan(document.body));
  if(theme.motionMaterial){
    const startSky=()=>{
      const layer=document.querySelector('.ambient-smoke-layer');if(!layer)return false;
      if(layer.dataset.skinMotionBoot)return true;
      layer.dataset.skinMotionBoot='true';
      const script=document.createElement('script');script.src=document.body.dataset.view==='overview'?'/skins/motion-home15.js':'/skins/motion-inner15.js';document.body.append(script);return true;
    };
    const watch=new MutationObserver(()=>{if(startSky())watch.disconnect()});
    document.addEventListener('DOMContentLoaded',()=>{if(!startSky())watch.observe(document.body,{childList:true,subtree:true})});
  }

  document.addEventListener('click',event=>{
    const a=event.target.closest?.('a[href]');if(!a)return;
    const target=new URL(a.href,location.href);
    if(target.origin===location.origin&&target.pathname.startsWith('/asset-library/')&&target.pathname.endsWith('.html')){
      target.searchParams.set('skin',key);a.href=target.href;
    }
  },true);
})();
