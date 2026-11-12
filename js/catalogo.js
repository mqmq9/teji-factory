/* UPT — Catálogo: filtros, buscador y detalle (?producto=slug) */
(function () {
  var P = window.UPT_PRODUCTOS, CATS = window.UPT_CATEGORIAS, esc = window.uptEsc;
  var params = new URLSearchParams(location.search);
  var slug = params.get('producto');
  var listView = document.getElementById('vistaLista');
  var detailView = document.getElementById('vistaDetalle');
  var prod = slug && window.uptProducto(slug);

  if (prod) { renderDetail(prod); return; }
  if (slug && !prod) {
    var nf = document.getElementById('noEncontrado'); if (nf) nf.hidden = false;
  }

  /* ── Lista ── */
  var state = { cat: params.get('cat') || 'todos', q: '' };
  if (state.cat !== 'todos' && !CATS.some(function (c) { return c.id === state.cat; })) state.cat = 'todos';
  var chips = document.getElementById('chips');
  var grid = document.getElementById('catGrid');
  var count = document.getElementById('resCount');
  var input = document.getElementById('buscar');

  function n(cat) { return cat === 'todos' ? P.length : P.filter(function (p) { return p.categoria === cat; }).length; }
  chips.innerHTML = [{ id: 'todos', nombre: 'Todas' }].concat(CATS).map(function (c) {
    return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' + esc(c.nombre) + '<span class="n">' + n(c.id) + '</span></button>';
  }).join('');

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function matches(p, q) {
    if (!q) return true;
    var hay = norm([p.nombre, p.resumen, p.descripcion, p.ref, window.uptCategoria(p.categoria)].concat(p.specs.map(function (s) { return s.join(' '); })).join(' '));
    return norm(q).split(/\s+/).filter(Boolean).every(function (w) { return hay.indexOf(w) >= 0; });
  }

  function render() {
    var list = P.filter(function (p) { return (state.cat === 'todos' || p.categoria === state.cat) && matches(p, state.q); });
    chips.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cat === state.cat)); });
    count.textContent = list.length === 1 ? '1 prenda' : list.length + ' prendas';
    if (!list.length) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><b>No encontramos prendas con “' + esc(state.q) + '”.</b>Prueba con otra palabra, como “chaqueta”, “bordado” o “dryfit”.<br><button type="button" class="btn btn-secondary btn-sm" id="limpiar" style="margin-top:16px">Ver todas las prendas</button></div>';
      document.getElementById('limpiar').addEventListener('click', function () { state.q = ''; state.cat = 'todos'; input.value = ''; sync(); render(); input.focus(); });
      return;
    }
    grid.innerHTML = list.map(function (p) { return window.uptCard(p); }).join('');
  }
  function sync() {
    var u = new URL(location.href);
    if (state.cat === 'todos') u.searchParams.delete('cat'); else u.searchParams.set('cat', state.cat);
    history.replaceState(null, '', u.pathname.split('/').pop() + u.search);
  }

  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    state.cat = b.dataset.cat; sync(); render();
  });
  var t;
  input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = input.value.trim(); render(); }, 120); });
  document.getElementById('formBuscar').addEventListener('submit', function (e) { e.preventDefault(); state.q = input.value.trim(); render(); });
  render();

  /* ── Detalle ── */
  function renderDetail(p) {
    listView.hidden = true; detailView.hidden = false;
    document.title = p.nombre + ' · Catálogo UPT';
    var meta = document.querySelector('meta[name="description"]'); if (meta) meta.setAttribute('content', p.resumen);
    var rel = P.filter(function (x) { return x.slug !== p.slug && x.categoria === p.categoria; })
      .concat(P.filter(function (x) { return x.slug !== p.slug && x.categoria !== p.categoria; })).slice(0, 3);
    var wa = window.uptWaLink('Hola UPT, quiero información sobre ' + p.nombre + ' (Ref. ' + p.ref + ').');
    detailView.innerHTML =
      '<section class="sec-tight"><div class="wrap">' +
      '<p class="crumbs" style="color:var(--muted)"><a href="index.html" style="color:var(--azul)">Inicio</a> / <a href="catalogo.html" style="color:var(--azul)">Catálogo</a> / ' + esc(p.nombre) + '</p>' +
      '<div class="detail">' +
      '<div class="detail-media enter"><div class="main"><img src="' + p.foto + '" alt="' + esc(p.nombre) + '" width="500" height="625"></div>' +
      (p.fotoAlt ? '<div class="alt"><img src="' + p.fotoAlt + '" alt="' + esc(p.nombre) + ' en sus opciones de color" width="528" height="351"></div>' : '') + '</div>' +
      '<div class="enter">' +
      '<p class="eyebrow">' + esc(window.uptCategoria(p.categoria)) + ' · Ref. ' + esc(p.ref) + '</p>' +
      '<h1>' + esc(p.nombre) + '</h1>' +
      '<p class="lead">' + esc(p.descripcion) + '</p>' +
      '<div class="detail-cta"><a class="btn btn-primary" href="cotizacion.html?producto=' + p.slug + '#cotizador">Cotizar esta prenda <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
      '<a class="btn btn-secondary" href="' + wa + '" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div>' +
      '<h2>Especificaciones</h2><table class="spec-table"><tbody>' +
      p.specs.map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td></tr>'; }).join('') +
      '</tbody></table>' +
      '<h2>Personalización</h2><div class="tags">' + p.personalizacion.map(function (x) { return '<span class="tag">' + esc(x) + '</span>'; }).join('') + '</div>' +
      '<h2>Tallas</h2><p style="margin-top:8px;color:var(--tinta);font-weight:600">' + esc(p.tallas) + '</p>' +
      '<h2>Colores</h2><div class="tags">' + p.colores.map(function (x) { return '<span class="tag">' + esc(x) + '</span>'; }).join('') + '</div>' +
      '</div></div></div></section>' +
      '<section class="sec bg-hueso"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">Combínala</p><h2 class="h2">Completa la dotación</h2></div>' +
      '<a href="catalogo.html" class="btn btn-secondary">Ver todo el catálogo</a></div>' +
      '<div class="prod-grid">' + rel.map(function (x) { return window.uptCard(x, 'rv'); }).join('') + '</div></div></section>';
  }
})();
