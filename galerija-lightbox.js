(function(){
  if (window.__skLightbox) return; window.__skLightbox = true;
  var css = document.createElement('style');
  css.textContent = "@keyframes lbIn{from{opacity:0}to{opacity:1}}@keyframes lbImg{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}";
  document.head.appendChild(css);
  function srcOf(slot){
    var img = slot.shadowRoot && slot.shadowRoot.querySelector('img[part="image"]');
    return img && img.getAttribute('src') && img.style.display !== 'none' ? img.getAttribute('src') : null;
  }
  function items(){
    return Array.prototype.slice.call(document.querySelectorAll('main image-slot[id^="gal-"]'))
      .map(function(s){ var f = s.closest('figure'); var cap = f && f.querySelector('figcaption'); return { slot: s, src: srcOf(s), label: cap ? cap.textContent.trim() : '' }; })
      .filter(function(x){ return x.src; });
  }
  var o, imgEl, capEl, list = [], idx = 0, lastFocus;
  function btn(label, txt, css){
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', label); b.textContent = txt;
    b.style.cssText = 'position:absolute;background:#F5F1EA;color:#1C1815;border:0;width:48px;height:48px;font-size:22px;line-height:1;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;' + css;
    b.onmouseenter = function(){ b.style.background = '#D2BDA6'; }; b.onmouseleave = function(){ b.style.background = '#F5F1EA'; };
    return b;
  }
  function show(i){
    idx = (i + list.length) % list.length; var it = list[idx];
    imgEl.style.animation = 'none'; void imgEl.offsetWidth; imgEl.style.animation = 'lbImg .45s ease both';
    imgEl.src = it.src; capEl.textContent = (it.label ? it.label + '   ' : '') + (idx + 1) + ' / ' + list.length;
    prev.style.display = next.style.display = list.length > 1 ? 'flex' : 'none';
  }
  var prev, next;
  function build(){
    o = document.createElement('div'); o.setAttribute('role','dialog'); o.setAttribute('aria-modal','true');
    o.style.cssText = 'position:fixed;inset:0;z-index:9000;background:rgba(28,24,21,.92);display:flex;align-items:center;justify-content:center;padding:clamp(16px,6vw,96px);box-sizing:border-box;animation:lbIn .3s ease both';
    imgEl = document.createElement('img'); imgEl.alt = '';
    imgEl.style.cssText = 'max-width:100%;max-height:calc(100vh - 140px);object-fit:contain;display:block;box-shadow:0 30px 80px rgba(0,0,0,.45)';
    capEl = document.createElement('div');
    capEl.style.cssText = "position:absolute;left:0;right:0;bottom:24px;text-align:center;color:#F5F1EA;font-family:'Jost',sans-serif;font-size:12px;letter-spacing:.18em;white-space:pre";
    var close = btn('Zatvori', '×', 'top:20px;right:20px;font-size:28px');
    prev = btn('Prethodna', '‹', 'left:clamp(8px,2vw,28px);top:50%;transform:translateY(-50%)');
    next = btn('Sledeća', '›', 'right:clamp(8px,2vw,28px);top:50%;transform:translateY(-50%)');
    close.onclick = hide; prev.onclick = function(e){ e.stopPropagation(); show(idx - 1); }; next.onclick = function(e){ e.stopPropagation(); show(idx + 1); };
    o.onclick = function(e){ if (e.target === o) hide(); };
    var sx = null;
    o.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, { passive: true });
    o.addEventListener('touchend', function(e){ if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); sx = null; });
    o.append(imgEl, capEl, close, prev, next);
    document.body.appendChild(o); document.body.style.overflow = 'hidden'; close.focus();
  }
  function hide(){ if (!o) return; o.remove(); o = null; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  document.addEventListener('keydown', function(e){
    if (!o) return;
    if (e.key === 'Escape') hide(); else if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1);
  });
  document.addEventListener('click', function(e){
    if (o || e.button !== 0 || e.detail > 1) return;
    var slot = e.target.closest && e.target.closest('main image-slot[id^="gal-"]');
    if (!slot || slot.hasAttribute('data-reframing')) return;
    list = items(); var i = list.findIndex(function(x){ return x.slot === slot; });
    if (i < 0) return;
    lastFocus = document.activeElement; build(); show(i);
  });
})();
