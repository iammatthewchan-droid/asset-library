'use strict';
// Owner-directed orb material: sRGB 60/40/80, applied inside inherited geometry.
(() => {
  const grid = document.getElementById('grid');
  const ns = 'http://www.w3.org/2000/svg';
  const base = [60, 40, 80];
  const node = (name, attributes = {}) => {
    const el = document.createElementNS(ns, name);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, String(value)));
    return el;
  };
  const curve = channel => Array.from({ length: 257 }, (_, index) => {
    const y = index / 256, b = channel / 255;
    // The quarter-luminance body is the exact owner material base. A restrained
    // white-light response retains the photographic reflections and icon contrast.
    return (y <= .25 ? b * Math.pow(y / .25, 1.15) : b + (1 - b) * .5 * Math.pow((y - .25) / .75, 1.35)).toFixed(9);
  }).join(' ');
  const tables = base.map(curve);
  function apply() {
    for (const card of grid.querySelectorAll('.badge-drawer')) {
      const svg = card.querySelector('.badge-art');
      if (!svg || svg.dataset.glass64 === 'true') continue;
      const faceClip = Array.from(svg.querySelectorAll('clipPath')).find(clip => clip.id.endsWith('-face'));
      if (!faceClip) continue;
      const prefix = faceClip.id.slice(0, -5);
      const faces = Array.from(svg.querySelectorAll('g[clip-path]')).filter(el => el.getAttribute('clip-path') === `url(#${prefix}-face)`);
      if (!faces.length) continue;
      const filter = node('filter', { id: `${prefix}-owner-glass64`, x: 0, y: 0, width: 1, height: 1, 'color-interpolation-filters': 'sRGB', 'data-material-base': '#3c2850' });
      filter.append(node('feColorMatrix', { type: 'matrix', values: '.2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0' }));
      const transfer = node('feComponentTransfer');
      ['R', 'G', 'B'].forEach((channel, index) => transfer.append(node(`feFunc${channel}`, { type: 'table', tableValues: tables[index] })));
      filter.append(transfer);
      svg.querySelector('defs').append(filter);
      const icons = Array.from(faces[0].children).filter(el => el.tagName.toLowerCase() === 'g' && el.hasAttribute('transform'));
      const scale = 209 / 210;
      const texture = node('image', { href: 'assets/glass-63/owner-glass-reference.png', x: 349.5 - 306 * scale, y: 365 - 267 * scale, width: 584 * scale, height: 568 * scale, preserveAspectRatio: 'xMidYMid meet', filter: `url(#${prefix}-owner-glass64)`, class: 'owner-glass64-texture' });
      // The face is assembled back-to-front: body, authentic icon, translucent
      // glass skin and photographic highlights. The original rim follows it.
      const frontFilter = node('filter', { id: `${prefix}-glass-front64`, x: 0, y: 0, width: 1, height: 1, 'color-interpolation-filters': 'sRGB' });
      frontFilter.append(node('feColorMatrix', { type: 'matrix', values: '.2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0' }));
      const frontTransfer = node('feComponentTransfer');
      ['R', 'G', 'B'].forEach((channel, index) => frontTransfer.append(node(`feFunc${channel}`, { type: 'table', tableValues: tables[index] })));
      frontTransfer.append(node('feFuncA', { type: 'table', tableValues: Array.from({ length: 257 }, (_, i) => (.74 * Math.pow(Math.max(0, (i / 256 - .32) / .68), 1.1)).toFixed(9)).join(' ') }));
      frontFilter.append(frontTransfer);
      svg.querySelector('defs').append(frontFilter);
      const skin = node('circle', { cx: 349.5, cy: 365, r: 209, fill: '#3c2850', opacity: .17, class: 'glass64-skin' });
      const front = texture.cloneNode(false);
      front.setAttribute('filter', `url(#${prefix}-glass-front64)`);
      front.setAttribute('class', 'glass64-front-reflection');
      front.dataset.glassLayer = 'above-icons';
      faces[0].replaceChildren(texture, ...icons, skin, front);
      faces.slice(1).forEach(face => face.setAttribute('display', 'none'));
      const rim = Array.from(svg.children).find(el => el.tagName.toLowerCase() === 'image' && el.getAttribute('clip-path') === `url(#${prefix}-rim)`);
      if (rim) {
        // Original silver/lilac pixels stay above the complete orb and icon.
        // Existing running reflections remain above the border they illuminate.
        svg.insertBefore(rim, svg.querySelector(':scope > .badge-glare'));
        rim.dataset.rimLayer = 'above-orb';
      }
      svg.dataset.glass64 = 'true';
      card.dataset.glass64 = 'true';
    }
  }
  new MutationObserver(apply).observe(grid, { childList: true, subtree: true });
  window.addEventListener('drawerchange', apply);
  apply();
})();
