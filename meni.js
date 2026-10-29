(() => {
  const css = `
html,body{overflow-x:clip}
[data-burger],[data-drawer]{display:none}
@media (hover:none){html,body,body *,a,button{cursor:auto!important}}
@media (max-width:860px){
  nav[data-meni]{grid-template-columns:auto 1fr!important;padding:10px 16px!important;gap:10px!important}
  nav[data-meni]>div:first-child{display:none!important}
  nav[data-meni]>a img{height:42px!important}
  nav[data-meni]>div:last-child{gap:12px!important;flex-wrap:nowrap!important}
  nav[data-meni]>div:last-child>a{padding:9px 14px!important;font-size:11px!important}
  [data-burger]{display:flex;flex-direction:column;justify-content:center;gap:6px;width:44px;height:44px;padding:0 10px;margin-right:-10px;background:transparent;border:0;box-sizing:border-box}
  [data-burger] span{display:block;height:1px;background:#1C1815;transition:transform .3s,opacity .3s}
  nav[data-open] [data-burger] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  nav[data-open] [data-burger] span:nth-child(2){opacity:0}
  nav[data-open] [data-burger] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
  [data-drawer]{display:flex;flex-direction:column;position:absolute;left:0;right:0;top:100%;background:#F5F1EA;border-bottom:1px solid rgba(28,24,21,.12);padding:0 16px;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s ease}
  nav[data-open] [data-drawer]{max-height:420px;padding:8px 16px 20px}
  [data-drawer] a{display:block;padding:16px 0;border-bottom:1px solid rgba(28,24,21,.1);font-size:14px;letter-spacing:.16em;text-transform:uppercase}
  [data-drawer] a:last-child{border-bottom:0}
}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function setup() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const cols = [...nav.children].filter(c => !c.hasAttribute('data-drawer'));
    if (cols.length < 3) return;
    const links = cols[0], right = cols[cols.length - 1];
    if (!nav.hasAttribute('data-meni')) nav.setAttribute('data-meni', '');
    if (!right.querySelector('[data-burger]')) {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('data-burger', ''); b.setAttribute('aria-label', 'Meni');
      b.innerHTML = '<span></span><span></span><span></span>';
      b.onclick = () => nav.toggleAttribute('data-open');
      right.appendChild(b);
    }
    let d = nav.querySelector(':scope > [data-drawer]');
    if (!d) {
      d = document.createElement('div'); d.setAttribute('data-drawer', '');
      d.onclick = e => { if (e.target.closest('a')) nav.removeAttribute('data-open'); };
      nav.appendChild(d);
    }
    const items = [...links.querySelectorAll('a')].map(x => [x.getAttribute('href'), x.textContent]);
    const key = JSON.stringify(items);
    if (d.dataset.k !== key) {
      d.dataset.k = key; d.textContent = '';
      items.forEach(([h, t]) => { const x = document.createElement('a'); x.href = h; x.textContent = t; d.appendChild(x); });
    }
  }
  setInterval(() => { try { setup(); } catch (e) {} }, 700);
})();
