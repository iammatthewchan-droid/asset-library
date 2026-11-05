"use strict";
// Owner-approved Safari proportions, shared by every browser.
// Numeric pixel tokens avoid viewport-unit font scaling differences under zoom.
function syncLayoutScale(){
 const width=document.documentElement.clientWidth;
 const desktop=width>=1000;
 const fittedWidth=desktop?Math.min(width,window.innerHeight*2880/1540):width;
 document.documentElement.style.setProperty('--reference-unit',(desktop?fittedWidth/2127:1)+'px');
 document.documentElement.style.setProperty('--type-unit',(desktop?fittedWidth/2880:1)+'px');
}
syncLayoutScale();
window.addEventListener('resize',syncLayoutScale);

const categoryAliases={"graphic-overlays": "overlays", "campaigns-social": "advertisements", "print-signage": "advertisements", "poker-gaming": "for-the-table", "stage-events": "spatial-design", "interior-spatial": "spatial-design", "guidelines-templates": "guidelines"};
const initialParams=new URLSearchParams(location.search);const legacyId=initialParams.get('drawer');if(categoryAliases[legacyId]){initialParams.set('drawer',categoryAliases[legacyId]);history.replaceState(null,'','?'+initialParams.toString());}
const categories=[{"number": "01", "id": "brand-identity", "name": "Brand Identity", "description": "Logos, fonts and the DeepStack colour system.", "includes": ["Logos", "Fonts", "Colors"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "02", "id": "overlays", "name": "Overlays", "description": "Graphics for footage and live content.", "includes": ["Player Panels", "Scoreboards", "Frames & Captions"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "03", "id": "for-the-table", "name": "For the Table", "description": "The objects and surfaces of the game.", "includes": ["Cards", "Chips", "Buttons", "Felt"], "guidance": "Poker-game accessories require higher clearance from Matthew. This includes chips, plaques, cards, dealer buttons, table felt and related production files. The restriction follows the asset, including previews and PNG exports, even when it is filed in another drawer.", "asset_count": 0, "access_classification": "RESTRICTED", "clearance_authority": "OWNER", "default_access": "OWNER_ONLY_PENDING_EXPLICIT_CLEARANCE"}, {"number": "04", "id": "spatial-design", "name": "Spatial Design", "description": "Spaces, interiors and stage environments.", "includes": ["Interiors", "Stage"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "05", "id": "merchandise", "name": "Merchandise", "description": "Objects to wear, carry and collect.", "includes": ["Clothing", "Accessories", "Jewellery"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "06", "id": "advertisements", "name": "Advertisements", "description": "Campaign artwork and advertisements.", "includes": ["Campaigns", "Print", "Digital"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "07", "id": "music", "name": "Music", "description": "Music, stems and sound recordings.", "includes": ["Tracks", "Stems", "Sound Design"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "08", "id": "mvs", "name": "MVs", "description": "Music videos and their working projects.", "includes": ["Videos", "Edits", "Project Files"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "09", "id": "episodes", "name": "Episodes", "description": "Episode outputs and work in progress.", "includes": ["Episodes", "Drafts", "Production Files"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "10", "id": "codings", "name": "PDFs", "description": "Documents and design PDFs.", "includes": ["Documents", "Design"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "11", "id": "guidelines", "name": "Guidelines", "description": "Instructions for using brand assets.", "includes": ["Brand Guidelines", "Usage Rules", "Production Guides"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}, {"number": "12", "id": "templates", "name": "Templates", "description": "Reusable starting points for new work.", "includes": ["Layouts", "Presentations", "Documents"], "guidance": "STORE adds files. SHOP collects final assets. BROWSE shows references and work in progress.", "asset_count": 0}];
const $=id=>document.getElementById(id);
const nav=$('nav'),grid=$('grid');
$('asset-total').textContent=String(categories.reduce((sum,c)=>sum+c.asset_count,0));
// Keep the last two words together so a wrapped description cannot end with one orphan word.
// This helper is reused by every existing or future drawer description.
function withoutOrphan(text){return text.replace(/\s+(\S+)\s*$/, '\u00a0$1');}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=(tag==='p'||tag==='h3')?withoutOrphan(text):text;return n;}
const all=el('a','', 'All drawers');all.href='?drawer=all';all.dataset.category='all';nav.append(all);
for(const c of categories){
 const n=el('a');n.href='?drawer='+c.id;n.dataset.category=c.id;n.append(el('span','',c.number),document.createTextNode(c.name));nav.append(n);
 const card=el('a','drawer'+(c.id==='to-sort'?' inbox':''));card.href='?drawer='+c.id;card.setAttribute('aria-label',c.name+', 0 assets'+(c.access_classification==='RESTRICTED'?', restricted':''));
 {
  const needle=el('span','drawer-needle');needle.setAttribute('aria-hidden','true');
  const artwork=el('img');artwork.src='assets/DS-Silver-Needle-Bubble-Studio-source.svg';artwork.alt='';needle.append(artwork);card.append(needle);
 }
 const top=el('div','drawer-top');top.append(el('span','',c.number),el('span','',c.access_classification==='RESTRICTED'?'RESTRICTED':'0 ASSETS'));card.append(top,el('h3','',c.name),el('p','',c.description),el('span','handle'));grid.append(card);
}
function render(){
 const c=categories.find(x=>x.id===(new URLSearchParams(location.search).get('drawer')||location.hash.slice(1)));
 $('overview').hidden=!!c;$('detail').hidden=!c;
 document.body.dataset.view=c?'detail':'overview';
 $('title').textContent=c?c.name:'Brand Asset by Category';
 $('intro').textContent=c?withoutOrphan(c.description):'';
 $('intro').hidden=!c;
 $('eyebrow').textContent=c?'DEEPSTACK / DRAWER '+c.number:'';
 $('eyebrow').hidden=!c;
 document.querySelector('.inventory').hidden=!!c;
 document.title=c?c.name+' · DS Asset Library':'DS Asset Library';
 for(const a of nav.children){if(a.dataset.category===(c?c.id:'all'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
 $('access-note').hidden=!(c&&c.access_classification==='RESTRICTED');
 window.dispatchEvent(new CustomEvent('drawerchange',{detail:c||null}));
 if(c){$('includes').replaceChildren(...c.includes.map(s=>el('li','',s)));$('guidance').textContent=withoutOrphan(c.guidance);}
}

window.addEventListener('hashchange',()=>{render();$('title').setAttribute('tabindex','-1');$('title').focus({preventScroll:true});window.scrollTo(0,0);});render();
