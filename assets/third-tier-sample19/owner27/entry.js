const reviewVersion=window.DSReviewVersion||'07nov-responsive-2';
const isBrand=!(new URLSearchParams(location.search).get('drawer'))||new URLSearchParams(location.search).get('drawer')==='brand-identity';document.write('<link rel="stylesheet" href="/asset-library/assets/third-tier-sample19/owner02nov/test.css?v=07nov-responsive-2"><script defer src="/asset-library/assets/third-tier-sample19/owner02nov/'+(isBrand?'test.js':'drawers/runtime.js')+'?v='+reviewVersion+'-layout-review"></'+'script>');
const indexScript=document.createElement('script');indexScript.src='/asset-library/owner-drawer-index04.js?v=04nov-heading-line';indexScript.defer=true;document.head.append(indexScript);

window.addEventListener('load',()=>{const s=document.createElement('script');s.src='/asset-library/library-live-updates05.js';document.head.append(s);});
