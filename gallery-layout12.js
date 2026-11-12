(() => {
  const wide = matchMedia('(min-width: 600px) and (orientation: landscape), (min-width: 1200px)');
  const make = (tag, className) => Object.assign(document.createElement(tag), {className});

  window.DSGalleryLayout = function (stage) {
    stage.dataset.galleryLayout = '';
    const actionDock = make('div', 'gallery-action-dock');
    actionDock.hidden = true;
    stage.append(actionDock);
    let dockFrame;
    function sizeDock() {
      cancelAnimationFrame(dockFrame);
      dockFrame = requestAnimationFrame(() => {
        const scroll = stage.querySelector('.asset-scroll');
        const tile = scroll?.querySelector('.gallery-card');
        if (!tile || actionDock.hidden) return;
        const bounds = scroll.getBoundingClientRect();
        stage.style.setProperty('--gallery-thumbnail-action-gap', (tile.getBoundingClientRect().height / 4) + 'px');
        actionDock.style.left = bounds.left + 'px';
        actionDock.style.width = bounds.width + 'px';
        const rowWidth = Math.min(bounds.width - 1, tile.getBoundingClientRect().width * 3);
        actionDock.style.setProperty('--gallery-dock-row-width', rowWidth + 'px');
        const actions = actionDock.querySelector('.section-actions');
        const gap = parseFloat(getComputedStyle(actions).columnGap);
        const buttonWidth = (rowWidth - 2 * gap) / 3;
        stage.style.setProperty('--gallery-dock-height', (buttonWidth * 38.073029 / 190.220215) + 'px');
      });
    }
    new ResizeObserver(sizeDock).observe(stage);
    window.addEventListener('resize', sizeDock);
    function resetActions() {
      actionDock.replaceChildren();
      actionDock.hidden = true;
      stage.removeAttribute('data-gallery-actions');
      stage.removeAttribute('data-gallery-pdf');
    }
    function mountActions(actions) {
      if (!wide.matches) return false;
      if (actionDock.parentElement !== stage) stage.append(actionDock);
      actionDock.replaceChildren(actions);
      actionDock.hidden = false;
      stage.dataset.galleryActions = '';
      sizeDock();
      return true;
    }
    function wideLayout() {
      stage.toggleAttribute('data-gallery-wide', wide.matches);
      stage.style.setProperty('--gallery-proportion-unit', Math.min(innerWidth / 1440, innerHeight / 900) + 'px');
      return wide.matches;
    }

    const dialog = make('dialog', 'gallery-viewer');
    dialog.setAttribute('aria-label', 'Asset preview');
    const controls = make('div', 'gallery-viewer-controls');
    const symbols = {
      previous: '<path d="M27 4 5 16l22 12"/>',
      select: '<rect x="5" y="5" width="22" height="22" rx="4"/><path class="viewer-check-mark" d="m10 16 4 4 8-9"/>',
      close: '<path d="m5 5 22 22M27 5 5 27"/>',
      next: '<path d="m5 4 22 12L5 28"/>',
    };
    const button = (label, name) => {
      const control = make('button', 'gallery-viewer-' + name);
      control.type = 'button';
      control.setAttribute('aria-label', label);
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 32 32');
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = symbols[name];
      control.append(icon);
      return control;
    };
    const previous = button('Previous asset', 'previous');
    const select = button('Select this file for download', 'select');
    select.setAttribute('aria-pressed', 'false');
    const close = button('Close preview', 'close');
    const next = button('Next asset', 'next');
    controls.append(previous, select, close, next);
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
      select.disabled = tile.getAttribute('role') !== 'checkbox';
      select.setAttribute('aria-pressed', String(tile.getAttribute('aria-checked') === 'true'));
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
    select.onclick = () => {
      const {tile} = items[index];
      tile.click();
      select.setAttribute('aria-pressed', String(tile.getAttribute('aria-checked') === 'true'));
    };
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

    let pdfPanel;
    const isPdf = asset => /\.pdf$/i.test(asset.extension || asset.filename || '');
    function enablePdfPreview() {
      stage.dataset.galleryPdf = '';
      if (pdfPanel) return;
      pdfPanel = make('section', 'gallery-pdf-panel');
      pdfPanel.setAttribute('aria-label', 'PDF preview');
      stage.append(pdfPanel);
      const native = stage.querySelector('#panel-rims-overlay > :nth-child(2)');
      if (native) {
        const rim = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        rim.classList.add('gallery-pdf-rim');
        rim.setAttribute('preserveAspectRatio', 'none');
        rim.setAttribute('aria-hidden', 'true');
        const artwork = native.cloneNode(true);
        artwork.removeAttribute('id');
        // Reuse the native silver treatment with unique local gradient IDs.
        for (const node of artwork.querySelectorAll('[id]')) {
          const old = node.id, id = old + '-pdf-preview';
          for (const paint of artwork.querySelectorAll('*')) {
            for (const attr of [...paint.attributes]) {
              if (attr.value.includes('#' + old)) paint.setAttribute(attr.name, attr.value.replaceAll('#' + old, '#' + id));
            }
          }
          node.id = id;
        }
        for (const path of artwork.querySelectorAll('path')) {
          path.setAttribute('vector-effect', 'non-scaling-stroke');
          path.style.strokeWidth = '.65px';
        }
        rim.append(artwork);pdfPanel.append(rim);
        const box = artwork.getBBox();
        rim.setAttribute('viewBox', `${box.x - 1} ${box.y - 1} ${box.width + 2} ${box.height + 2}`);
      }
      for (const selector of ['.asset-preview', '.preview-filename', '.preview-select-hit']) {
        const element = stage.querySelector(selector);
        if (element) pdfPanel.append(element);
      }
      stage.append(pdfPanel);
    }

    function addTiles(grid, assets, makeTile) {
      if (assets.some(isPdf)) enablePdfPreview();
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
        const pdf = isPdf(asset);
        open.onpointerenter = pdf ? () => { tile.onpointerenter?.(); tile.dispatchEvent(new MouseEvent('mouseenter')); } : tile.onpointerenter;
        if (pdf) open.onfocus = () => { tile.onfocus?.(); tile.dispatchEvent(new FocusEvent('focus')); };
        open.onpointerleave = tile.onpointerleave;
        const entry = {asset, tile};
        previewEntries.set(open, entry);
        open.onclick = () => {
          if (pdf) { open.onpointerenter(); return; }
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
      const x = width * .027;
      const y = height * .34;
      const scale = Math.min(width * .132 / logo.w, (height - y - 15) / 390);
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

    return {wideLayout, addTiles, prepareSection, projectMenu, resetActions, mountActions};
  };
})();
