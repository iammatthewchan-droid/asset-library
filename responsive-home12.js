(()=>{
  document.body.dataset.homeFit='';
  const grid=document.querySelector('#grid');
  let frame;
  function fit(){
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      if(document.body.dataset.view!=='overview'||!grid.children.length)return;
      const cols=innerHeight>innerWidth?2:4;
      const rows=Math.ceil(grid.children.length/cols);
      [...grid.children].forEach((card,i)=>card.classList.toggle('badge-home-last-row',i>=cols*(rows-1)));
      grid.style.setProperty('--home-cols',cols);
      grid.style.setProperty('--home-rows',rows);
      const style=getComputedStyle(grid);
      const rowGap=parseFloat(style.rowGap)||0,colGap=parseFloat(style.columnGap)||0;
      const cellWidth=(grid.clientWidth-(cols-1)*colGap)/cols;
      const cellHeight=(grid.clientHeight-(rows-1)*rowGap)/rows;
      const svg=grid.querySelector('.badge-art');
      const ratio=svg?.viewBox.baseVal.width/svg?.viewBox.baseVal.height||1150/565;
      const width=Math.max(1,Math.min(cellWidth,cellHeight*ratio));
      const value=width.toFixed(3)+'px';
      if(grid.style.getPropertyValue('--home-badge-width')!==value)grid.style.setProperty('--home-badge-width',value);
      document.documentElement.dataset.homeFitReady='true';
    });
  }
  for(const e of ['resize','orientationchange','ownerlayoutready','drawerchange'])addEventListener(e,fit);
  new ResizeObserver(fit).observe(grid);
  new MutationObserver(fit).observe(grid,{childList:true});
  document.fonts.ready.then(fit);fit();
})();
