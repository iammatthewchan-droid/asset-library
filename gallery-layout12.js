(() => {
  const wide = matchMedia('(min-width: 600px) and (orientation: landscape), (min-width: 1200px)');
  const make = (tag, className) => Object.assign(document.createElement(tag), {className});

  window.DSGalleryLayout = function (stage) {
    stage.dataset.galleryLayout = '';
    function wideLayout() {
      stage.toggleAttribute('data-gallery-wide', wide.matches);
      return wide.matches;
    }

    const dialog = make('dialog', 'gallery-viewer');
    dialog.setAttribute('aria-label', 'Asset preview');
    const controls = make('div', 'gallery-viewer-controls');
    const button = (label, name) => {
      const control = make('button', 'gallery-viewer-' + name);
      control.type = 'button';
      control.setAttribute('aria-label', label);
      control.append(make('span', ''));
      return control;
    };
    const previous = button('Previous asset', 'previous');
    const close = button('Close preview', 'close');
    const next = button('Next asset', 'next');
    controls.append(previous, close, next);
    const media = make('div', 'gallery-viewer-media');
    const caption = make('p', 'gallery-viewer-caption');
    caption.setAttribute('aria-live', 'polite');
    dialog.append(controls, media, caption);
    document.body.append(dialog);
    let items = [], index = 0, opener;
    const previewEntries = new WeakMap();

    function show() {
      const {asset, tile} = items[index];
      const thumb = tile.querySelector('.tile-image').src;
      const ext = asset.extension || asset.filename.slice(asset.filename.lastIndexOf('.'));
      const movie = /\.(mp4|mov|m4v|webm)$/i.test(ext) && asset.download_url;
      const sourceImage = /\.(png|jpe?g|webp|svg|gif|avif)$/i.test(ext) && asset.download_url;
      const image = make('img', '');
      image.alt = asset.filename;
      image.src = sourceImage || thumb;
      if (sourceImage) image.addEventListener('error', () => { image.src = thumb; }, {once:true});
      if (movie) {
        const video = make('video', '');
        video.src = asset.download_url;
        video.poster = thumb;
        video.controls = true;
        video.playsInline = true;
        video.setAttribute('aria-label', asset.filename);
        video.addEventListener('error', () => { if (video.isConnected) video.replaceWith(image); }, {once:true});
        media.replaceChildren(video);
      } else {
        media.replaceChildren(image);
      }
      caption.textContent = asset.filename;
      previous.disabled = index === 0;
      next.disabled = index === items.length - 1;
    }

    function step(delta) {
      const target = index + delta;
      if (target < 0 || target >= items.length) return;
      index = target;
      show();
      if (document.activeElement === document.body) close.focus({preventScroll:true});
    }
    previous.onclick = () => step(-1);
    next.onclick = () => step(1);
    close.onclick = () => dialog.close();
    dialog.addEventListener('keydown', event => {
      if (event.target.closest('video')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        step(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    dialog.addEventListener('close', () => {
      media.replaceChildren();
      if (opener?.isConnected) opener.focus({preventScroll:true});
    });

    function addTiles(grid, assets, makeTile) {
      assets.forEach(asset => {
        const tile = makeTile(asset);
        const card = make('div', 'gallery-card');
        tile.removeAttribute('aria-describedby');
        const open = make('button', 'tile-open-preview');
        open.type = 'button';
        open.setAttribute('aria-label', 'Preview ' + asset.filename);
        if (tile.getAttribute('role') === 'button') {
          tile.tabIndex = -1;
          tile.setAttribute('aria-hidden', 'true');
          card.dataset.previewOnly = '';
        }
        open.onpointerenter = tile.onpointerenter;
        open.onpointerleave = tile.onpointerleave;
        const entry = {asset, tile};
        previewEntries.set(open, entry);
        open.onclick = () => {
          const collection = grid.closest('.asset-scroll');
          items = [...collection.querySelectorAll('.tile-open-preview')].map(button => previewEntries.get(button));
          index = items.indexOf(entry);
          opener = open;
          show();
          dialog.showModal();
          close.focus({preventScroll:true});
        };
        card.append(tile, open);
        grid.append(card);
      });
      grid.tabIndex = 0;
      grid.setAttribute('aria-label', 'Asset thumbnails');
    }

    function prepareSection(section, heading, count, grid) {
      const toolbar = make('div', 'gallery-toolbar');
      const context = make('div', 'gallery-context');
      context.append(heading);
      if (count) context.append(count);
      toolbar.append(context);
      section.append(toolbar, grid);
      return toolbar;
    }

    function projectMenu(logo, overlay, assembly) {
      const {width, height} = stage.getBoundingClientRect();
      const x = Math.max(15, width * .027);
      const y = Math.min(390, Math.max(113, height * .34));
      const scale = Math.min(.9, Math.max(.36, width * (width < 1200 ? .15 : .132) / logo.w), (height - y - 15) / 390);
      overlay.setAttribute('viewBox', `0 0 ${width} ${height}`);
      assembly.setAttribute('transform', `translate(${x} ${y}) scale(${scale}) translate(${-logo.x} ${-logo.y})`);
      const project = box => ({
        left: x + (box.x - logo.x) * scale,
        top: y + (box.y - logo.y) * scale,
        width: box.w * scale,
        height: box.h * scale,
      });
      project.scale = scale;
      return project;
    }

    return {wideLayout, addTiles, prepareSection, projectMenu};
  };
})();
