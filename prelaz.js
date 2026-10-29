(function(){
  if (window.__prelaz) return; window.__prelaz = true;
  var KEY = 'studiokosa-prelaz', IN = 700, HOLD = 600, OUT = 900;
  var css = document.createElement('style');
  css.textContent = "@keyframes prelazText{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes skShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@keyframes skImg{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}";
  document.head.appendChild(css);
  function build(visible){
    var o = document.createElement('div');
    o.setAttribute('aria-hidden','true');
    o.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#F5F1EA;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);transition:opacity '+IN+'ms ease;pointer-events:all;opacity:'+(visible?1:0);
    var left = document.createElement('div');
    left.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:0 clamp(16px,5vw,80px)';
    var t = document.createElement('div');
    t.textContent = window.SK_t ? window.SK_t('Spremni za promenu?') : 'Spremni za promenu?';
    t.style.cssText = "font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(34px,6vw,92px);line-height:1;color:#1C1815;text-wrap:balance;max-width:9ch;animation:prelazText 900ms ease both";
    left.appendChild(t);
    var right = document.createElement('div'); right.style.cssText = 'position:relative;overflow:hidden;background:#DCDCDC';
    var img = document.createElement('img');
    img.src = 'assets/prelaz.jpg'; img.alt = '';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 40%';
    right.appendChild(img);
    if (window.innerWidth < 700) { o.style.gridTemplateColumns = '1fr'; o.style.gridTemplateRows = '1fr 1fr'; }
    o.appendChild(left); o.appendChild(right);
    document.body.appendChild(o);
    return o;
  }
  function skeleton(){
    var seen = false; try { seen = sessionStorage.getItem(KEY + '-loaded') === '1'; sessionStorage.setItem(KEY + '-loaded','1'); } catch(e){}
    if (seen) return;
    var bar = 'background:linear-gradient(90deg,#E6DED2 0%,#F3EDE4 50%,#E6DED2 100%);background-size:200% 100%;animation:skShimmer 1.4s linear infinite';
    var o = document.createElement('div'); o.setAttribute('aria-hidden','true');
    o.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#F5F1EA;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);transition:opacity 800ms ease';
    var left = document.createElement('div');
    left.style.cssText = 'display:flex;flex-direction:column;justify-content:center;gap:18px;padding:0 clamp(20px,6vw,96px)';
    [['56px','56px'],['80%','clamp(28px,4vw,56px)'],['55%','clamp(28px,4vw,56px)'],['90%','14px'],['70%','14px'],['160px','46px']].forEach(function(d,i){
      var b = document.createElement('div'); b.style.cssText = bar + ';width:'+d[0]+';height:'+d[1]+';max-width:100%' + (i===0?';margin-bottom:20px':'') + (i===5?';margin-top:18px':''); left.appendChild(b);
    });
    var right = document.createElement('div'); right.style.cssText = 'position:relative;overflow:hidden;' + bar;
    var img = document.createElement('img'); img.src = 'assets/ucitavanje.jpg'; img.alt = '';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0';
    img.onload = function(){ img.style.animation = 'skImg 900ms ease forwards'; };
    right.appendChild(img); o.appendChild(left); o.appendChild(right);
    if (window.innerWidth < 700) { o.style.gridTemplateColumns = '1fr'; o.style.gridTemplateRows = '1fr 1fr'; left.style.order = 2; }
    document.body.appendChild(o);
    var t0 = Date.now(), done = false;
    function hide(){ if (done) return; done = true; setTimeout(function(){ o.style.opacity = 0; setTimeout(function(){ o.remove(); }, 850); }, Math.max(0, 1600 - (Date.now() - t0))); }
    if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
    setTimeout(hide, 4000);
  }
  function arrive(){
    var flag = false; try { flag = sessionStorage.getItem(KEY) === '1'; sessionStorage.removeItem(KEY); } catch(e){}
    if (!flag) return;
    try { sessionStorage.setItem(KEY + '-loaded','1'); } catch(e){}
    if (location.hash) setTimeout(function(){ var t = document.getElementById(location.hash.slice(1)); var nav = document.querySelector('nav'); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - (nav ? nav.offsetHeight + 16 : 0) }); }, 300);
    var o = build(true);
    setTimeout(function(){ o.style.transition = 'opacity '+OUT+'ms ease'; o.style.opacity = 0; }, 350);
    setTimeout(function(){ o.remove(); }, 350 + OUT + 50);
  }
  if (document.body) arrive(); else document.addEventListener('DOMContentLoaded', arrive);
  document.addEventListener('click', function(e){
    var h = e.target.closest && e.target.closest('a[href]');
    if (h && !e.defaultPrevented && e.button === 0) {
      var u = new URL(h.getAttribute('href'), location.href);
      if (u.hash && u.pathname === location.pathname) {
        var t = document.getElementById(decodeURIComponent(u.hash.slice(1)));
        if (t) { e.preventDefault(); var nav = document.querySelector('nav'); var off = nav ? nav.offsetHeight + 16 : 0;
          window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
          history.replaceState(null, '', u.hash); return; }
      }
    }
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank') return;
    var url = new URL(a.getAttribute('href'), location.href);
    if (url.origin !== location.origin || !/\.dc\.html$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return;
    try { sessionStorage.setItem(KEY + '-loaded','1'); } catch(e){}
  }, true);
  if (location.hash) setTimeout(function(){ var t = document.getElementById(location.hash.slice(1)); var nav = document.querySelector('nav'); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - (nav ? nav.offsetHeight + 16 : 0) }); }, 400);
})();
