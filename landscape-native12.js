(() => {
  const landscape = matchMedia('(max-width:1199px) and (orientation:landscape)');
  const svgNS = 'http://www.w3.org/2000/svg';

  function attach() {
    const stage = document.getElementById('layout-stage');
    const source = document.getElementById('source-art');
    const header = stage?.querySelector('.mobile-library-header');
    const rims = document.getElementById('panel-rims-overlay');
    if (!source || !header || !rims) return false;

    const signature = source.querySelector('[id$="-DeepStack-signature"]');
    const title = source.querySelector('[id$="-Editable-headings"]');
    const needle = source.querySelector(':scope > path');
    const titleRule = source.querySelector(':scope > [data-native-index="5"]');
    if (!signature || !title || !needle) return false;

    const art = document.createElementNS(svgNS, 'svg');
    art.setAttribute('viewBox', '90 129 1800 166');
    art.setAttribute('aria-hidden', 'true');
    for (const part of [signature, needle, title, titleRule].filter(Boolean)) {
      const copy = part.cloneNode(true);
      copy.removeAttribute('id');
      art.append(copy);
    }
    // Give the cloned local clip paths their own IDs so the logo paints
    // independently of the hidden desktop SVG.
    const ids = new Map();
    for (const part of art.querySelectorAll('[id]')) {
      const id = part.id;
      part.id = 'landscape-' + id;
      ids.set(id, part.id);
    }
    for (const part of art.querySelectorAll('*')) {
      for (const attr of part.attributes) {
        const value = attr.value.replace(/url\(#([^)]*)\)/g, (ref, id) => ids.has(id) ? `url(#${ids.get(id)})` : ref);
        attr.value = value.startsWith('#') && ids.has(value.slice(1)) ? '#' + ids.get(value.slice(1)) : value;
      }
    }
    const home = document.createElement('a');
    home.className = 'landscape-masthead';
    home.href = '/asset-library/next19.html?drawer=all';
    home.setAttribute('aria-label', 'DEEPSTACK Asset Library, all drawers');
    home.append(art);
    header.append(home);

    const sourceViewBox = rims.getAttribute('viewBox');
    const panels = [...rims.children].slice(0, 2).map((node, i) => ({
      node,
      box: node.querySelector('path').getBBox(),
      region: stage.querySelector(i === 0 ? '.asset-scroll' : '.asset-preview'),
    }));

    function fit() {
      if (stage.hasAttribute('data-gallery-layout')) {
        art.setAttribute('viewBox', stage.hasAttribute('data-gallery-wide') ? '90 129 1800 166' : '90 129 1080 166');
      }
      if (!landscape.matches) {
        delete stage.dataset.nativeLandscape;
        rims.setAttribute('viewBox', sourceViewBox);
        for (const {node} of panels) {
          node.removeAttribute('transform');
          node.removeAttribute('visibility');
        }
        return;
      }

      const stageBox = stage.getBoundingClientRect();
      rims.setAttribute('viewBox', `0 0 ${stageBox.width} ${stageBox.height}`);
      for (const {node, box, region} of panels) {
        const {x,y,width,height} = region.getBoundingClientRect();
        node.setAttribute('visibility', width && height ? 'visible' : 'hidden');
        if (width && height) {
          node.setAttribute('transform', `translate(${x-stageBox.x} ${y-stageBox.y}) scale(${width/box.width} ${height/box.height}) translate(${-box.x} ${-box.y})`);
        }
      }
      stage.dataset.nativeLandscape = 'true';
    }
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    for (const {region} of panels) observer.observe(region);
    landscape.addEventListener('change', fit);
    fit();
    return true;
  }

  if (attach()) return;
  const ready = new MutationObserver(() => {
    if (attach()) ready.disconnect();
  });
  ready.observe(document.documentElement, {childList: true, subtree: true});
})();
