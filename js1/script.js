(function(){
  const container = document.getElementById('rootsContainer');
  function createWindow(n){
    const win = document.createElement('article');
    win.className = 'window floating';

    const title = document.createElement('div');
    title.className = 'title';
    title.innerHTML = `<div class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div><strong>Akar ${n}</strong>`;

    const content = document.createElement('div');
    content.className = 'content';
    const val = Math.sqrt(n);
    content.innerHTML = `<h2>√${n}</h2><p>Nilai: <span class="value">${val.toFixed(6)}</span></p>`;

    win.appendChild(title);
    win.appendChild(content);

    // make draggable by title
    makeDraggable(win, title);

    return win;
  }

  // generate roots 1..7
  for(let i=1;i<=7;i++){
    container.appendChild(createWindow(i));
  }

  // simple dragging implementation
  function makeDraggable(win, handle){
    let isDown=false, startX=0, startY=0, origX=0, origY=0, currentX=0, currentY=0;
    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, {passive:true});
    function start(e){
      isDown=true;
      handle.style.cursor='grabbing';
      const p = getPoint(e);
      startX = p.x; startY = p.y;
      const style = window.getComputedStyle(win);
      const matrix = new WebKitCSSMatrix(style.transform);
      origX = matrix.m41 || 0; origY = matrix.m42 || 0;
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
      document.addEventListener('touchmove', move, {passive:false});
      document.addEventListener('touchend', up);

      // pause float animation while dragging
      win.classList.remove('floating');
    }
    function move(e){
      if(!isDown) return;
      e.preventDefault();
      const p = getPoint(e);
      currentX = origX + (p.x - startX);
      currentY = origY + (p.y - startY);
      win.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
    function up(){
      isDown=false; handle.style.cursor='grab';
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
      // allow float to resume after brief delay
      setTimeout(()=>win.classList.add('floating'),2000);
    }
    function getPoint(e){
      if(e.touches && e.touches[0]) return {x:e.touches[0].clientX, y:e.touches[0].clientY};
      return {x:e.clientX, y:e.clientY};
    }
    // double click to reset
    handle.addEventListener('dblclick', ()=>{ win.style.transform=''; win.classList.add('floating'); });
  }
})();
