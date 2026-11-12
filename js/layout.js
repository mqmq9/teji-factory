/* UPT — header, footer, menú móvil, cookies, revelado al hacer scroll.
   Se incluye en todas las páginas. Requiere js/config.js antes. */
(function () {
  var C = window.UPT_CONFIG;
  var page = document.body.getAttribute('data-page') || '';
  var waLink = 'https://wa.me/' + C.contacto.whatsapp;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  window.uptEsc = esc;
  window.uptWaLink = function (texto) { return waLink + (texto ? '?text=' + encodeURIComponent(texto) : ''); };
  window.uptStore = function (k, v) {
    try {
      if (v !== undefined) { localStorage.setItem(k, JSON.stringify(v)); return v; }
      var r = localStorage.getItem(k); return r ? JSON.parse(r) : null;
    } catch (e) { return v !== undefined ? v : null; }
  };

  var NAV = [
    { href: 'index.html', id: 'inicio', txt: 'Inicio' },
    { href: 'catalogo.html', id: 'catalogo', txt: 'Catálogo' },
    { href: 'proceso.html', id: 'proceso', txt: 'Proceso' },
    { href: 'nosotros.html', id: 'nosotros', txt: 'Nosotros' },
    { href: 'contacto.html', id: 'contacto', txt: 'Contacto' }
  ];

  var logo = '<a href="index.html" class="logo" aria-label="UPT, Uniformes Para Todos. Ir al inicio">' +
    '<span class="logo-mark" aria-hidden="true">UP<b>T</b></span>' +
    '<span class="logo-txt" aria-hidden="true"><span class="logo-name">Uniformes Para Todos</span><span class="logo-by">by TejiFactory</span></span></a>';

  var navLinks = NAV.map(function (n) {
    return '<a href="' + n.href + '"' + (n.id === page ? ' aria-current="page"' : '') + '>' + n.txt + '</a>';
  }).join('');

  var header = document.createElement('header');
  header.className = 'hdr';
  header.innerHTML =
    '<div class="wrap hdr-row">' + logo +
    '<nav class="nav" aria-label="Principal">' + navLinks + '</nav>' +
    '<a href="cotizacion.html" class="btn btn-primary hdr-cta"' + (page === 'cotizacion' ? ' aria-current="page"' : '') + '>Cotizar</a>' +
    '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="menuMovil" aria-label="Abrir menú"><span></span><span></span></button>' +
    '</div>' +
    '<div class="menu-movil" id="menuMovil" hidden><nav aria-label="Menú móvil">' + navLinks +
    '<a href="cotizacion.html"' + (page === 'cotizacion' ? ' aria-current="page"' : '') + '>Cotización</a></nav>' +
    '<a href="cotizacion.html" class="btn btn-primary btn-block">Armar mi cotización</a></div>';

  var skip = document.createElement('a');
  skip.href = '#main'; skip.className = 'skip'; skip.textContent = 'Saltar al contenido';
  document.body.insertBefore(header, document.body.firstChild);
  document.body.insertBefore(skip, header);

  var btn = header.querySelector('.menu-btn');
  var menu = header.querySelector('.menu-movil');
  // fuera del header: su backdrop-filter atraparía el position:fixed
  header.parentNode.insertBefore(menu, header.nextSibling);
  function setMenu(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    header.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('no-scroll', open);
    if (open) { menu.hidden = false; requestAnimationFrame(function () { if (header.classList.contains('menu-open')) menu.classList.add('on'); }); }
    else { menu.classList.remove('on'); setTimeout(function () { if (!menu.classList.contains('on')) menu.hidden = true; }, 220); }
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); btn.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 900 && header.classList.contains('menu-open')) setMenu(false); });

  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Footer */
  var footer = document.createElement('footer');
  footer.className = 'ftr';
  footer.innerHTML =
    '<div class="wrap">' +
    '<div class="ftr-grid">' +
    '<div class="ftr-brand">' + logo +
    '<p>Dotación institucional 100% personalizada para colegios, universidades, equipos y empresas en República Dominicana. ' + esc(C.marca) + ', ' + esc(C.respaldo) + '.</p></div>' +
    '<div class="ftr-col"><h2>Explora</h2><ul>' +
    '<li><a href="index.html">Inicio</a></li><li><a href="catalogo.html">Catálogo</a></li><li><a href="proceso.html">Proceso</a></li><li><a href="nosotros.html">Nosotros</a></li><li><a href="contacto.html">Contacto</a></li><li><a href="cotizacion.html">Cotización</a></li></ul></div>' +
    '<div class="ftr-col"><h2>Contacto</h2><ul>' +
    '<li><a href="' + waLink + '" target="_blank" rel="noopener">WhatsApp ' + esc(C.contacto.whatsappVisible) + '</a></li>' +
    '<li><a href="mailto:' + esc(C.contacto.correo) + '">' + esc(C.contacto.correo) + '</a></li>' +
    '<li><span>' + esc(C.contacto.ciudad) + '</span></li><li><span>' + esc(C.contacto.horario) + '</span></li></ul></div>' +
    '<div class="ftr-col"><h2>Legal</h2><ul>' +
    '<li><a href="terminos.html">Términos y condiciones</a></li><li><a href="privacidad.html">Política de privacidad</a></li><li><a href="cookies.html">Política de cookies</a></li>' +
    '<li><a href="mailto:' + esc(C.contacto.correoDatos) + '">Derechos ARCO</a></li><li><a href="admin.html">Área privada</a></li></ul></div>' +
    '</div>' +
    '<div class="ftr-base"><span>© 2026 ' + esc(C.marca) + ' · ' + esc(C.empresa) + ' · RNC ' + esc(C.contacto.rnc) + '</span>' +
    '<span>Hecho para instituciones de República Dominicana</span></div>' +
    '</div>';
  document.body.appendChild(footer);

  /* WhatsApp flotante */
  if (page !== 'admin') {
    var fab = document.createElement('a');
    fab.className = 'wa-fab'; fab.href = waLink; fab.target = '_blank'; fab.rel = 'noopener';
    fab.setAttribute('aria-label', 'Escribir a UPT por WhatsApp');
    fab.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.14.563 4.148 1.549 5.886L0 24l6.302-1.526A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.001-1.372l-.359-.214-3.72.976.994-3.636-.234-.373A9.78 9.78 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>';
    document.body.appendChild(fab);
  }

  /* Cookies */
  if (page !== 'admin' && !window.uptStore('upt_ck_ok')) {
    var ck = document.createElement('div');
    ck.className = 'ck'; ck.setAttribute('role', 'region'); ck.setAttribute('aria-label', 'Aviso de cookies');
    ck.innerHTML = '<p>Usamos cookies esenciales y, si aceptas, de análisis. <a href="cookies.html">Política de cookies</a></p>' +
      '<div class="ck-btns"><button type="button" class="btn btn-ghost-light" data-ck="esenciales">Solo esenciales</button><button type="button" class="btn btn-light" data-ck="todas">Aceptar</button></div>';
    document.body.appendChild(ck);
    setTimeout(function () { ck.classList.add('on'); }, 1200);
    ck.addEventListener('click', function (e) {
      var d = e.target.getAttribute && e.target.getAttribute('data-ck'); if (!d) return;
      var r = window.uptStore('upt_ck') || []; r.push({ fecha: new Date().toISOString(), decision: d });
      window.uptStore('upt_ck', r); window.uptStore('upt_ck_ok', d);
      ck.classList.remove('on'); setTimeout(function () { ck.remove(); }, 400);
    });
  }

  /* Revelado al hacer scroll (solo bloques marcados con .rv) */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.uptReveal = function (root) {
    var els = (root || document).querySelectorAll('.rv:not(.in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  };
  document.addEventListener('DOMContentLoaded', function () { window.uptReveal(); });

  /* Rellena datos de configuración marcados con data-cfg="ruta.al.valor" */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var v = el.getAttribute('data-cfg').split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, C);
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-wa]').forEach(function (el) { el.href = waLink; });
    /* Acordeones */
    document.querySelectorAll('.faq-q').forEach(function (q, i) {
      var a = q.nextElementSibling, id = 'faq-a-' + i;
      a.id = id; q.setAttribute('aria-controls', id);
      q.addEventListener('click', function () {
        var open = q.getAttribute('aria-expanded') !== 'true';
        q.setAttribute('aria-expanded', open ? 'true' : 'false');
        q.parentElement.classList.toggle('open', open);
      });
    });
  });
})();
