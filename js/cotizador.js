/* UPT — Cotizador por pasos. Guarda el avance en localStorage. */
(function () {
  var C = window.UPT_CONFIG, P = window.UPT_PRODUCTOS, esc = window.uptEsc, store = window.uptStore;
  var root = document.getElementById('wiz');
  if (!root) return;

  var KEY = 'upt_cot_borrador';
  var PASOS = ['Institución', 'Prendas', 'Cantidades', 'Personalización', 'Contacto', 'Resumen'];
  var TIPOS = [
    ['Colegio', 'Uniformes, promociones y deportes'],
    ['Universidad', 'Facultades, selecciones y egresados'],
    ['Empresa', 'Equipos de trabajo y eventos'],
    ['Equipo', 'Clubes, ligas y selecciones'],
    ['Otro', 'Fundaciones, iglesias, academias']
  ];
  var DISENO = [
    ['Ya tenemos diseño', 'Tenemos escudo, logo o arte listo para aplicar'],
    ['Necesitamos que nos lo diseñen', 'Creamos con ustedes la marca y el diseño de cada prenda']
  ];
  var UBIC = ['Pecho izquierdo', 'Pecho centro', 'Espalda', 'Manga', 'Cuello', 'Capota / gorro'];
  var TECNICAS = ['Bordado', 'Sublimado', 'Estampado', 'Que UPT recomiende'];

  var blank = function () {
    return { step: 0, max: 0, tipo: '', diseno: '', prendas: [], items: {}, ubic: [], tecnica: '', notasPers: '', archivo: null,
      c: { nombre: '', institucion: '', cargo: '', correo: '', telefono: '', ciudad: '', fecha: '', comentarios: '' }, tc: false, pr: false };
  };
  var S = Object.assign(blank(), store(KEY) || {});
  S.c = Object.assign(blank().c, S.c || {});

  // ?producto=slug llega marcado
  var qs = new URLSearchParams(location.search).get('producto');
  if (qs && window.uptProducto(qs) && S.prendas.indexOf(qs) < 0) { S.prendas.push(qs); }
  if (qs && window.uptProducto(qs)) {
    var aviso = document.getElementById('avisoProducto');
    if (aviso) { aviso.hidden = false; aviso.querySelector('b').textContent = window.uptProducto(qs).nombre; }
  }

  var dir = 'fwd';
  function save() { var copy = JSON.parse(JSON.stringify(S)); try { store(KEY, copy); } catch (e) { if (copy.archivo) copy.archivo.dataUrl = null; store(KEY, copy); } }

  function item(slug) { if (!S.items[slug]) S.items[slug] = { cant: '', colores: '', tallas: '' }; return S.items[slug]; }

  /* ── Render ───────────────────────────────────────────── */
  var body = root.querySelector('.wiz-body');
  var bar = root.querySelector('.progress-bar');
  var meta = root.querySelector('.wiz-meta');
  var dots = root.querySelector('.wiz-dots');
  var btnPrev = root.querySelector('[data-prev]');
  var btnNext = root.querySelector('[data-next]');

  dots.innerHTML = PASOS.map(function (p, i) { return '<button type="button" class="wiz-dot" data-go="' + i + '">' + (i + 1) + '. ' + p + '</button>'; }).join('');

  function radio(name, val, title, sub, checked) {
    return '<label class="choice"><input type="radio" name="' + name + '" value="' + esc(val) + '"' + (checked ? ' checked' : '') + '><b>' + esc(title) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</label>';
  }
  function checkbox(name, val, title, checked) {
    return '<label class="choice"><input type="checkbox" name="' + name + '" value="' + esc(val) + '"' + (checked ? ' checked' : '') + '><b>' + esc(title) + '</b></label>';
  }
  function field(id, label, input, req, err) {
    return '<div class="field" data-f="' + id + '"><label for="' + id + '">' + label + (req ? ' <span class="req" aria-hidden="true">*</span>' : '') + '</label>' + input + '<span class="err" id="' + id + '-err">' + (err || '') + '</span></div>';
  }

  var views = [
    function () {
      return '<h2 tabindex="-1">¿Quiénes son?</h2><p class="muted">Cuéntanos qué tipo de institución representan y en qué punto está el diseño.</p>' +
        '<fieldset class="q" data-q="tipo"><legend>Tipo de institución <span class="req" aria-hidden="true">*</span></legend><div class="choices">' +
        TIPOS.map(function (t) { return radio('tipo', t[0], t[0] === 'Equipo' ? 'Equipo deportivo' : t[0], t[1], S.tipo === t[0]); }).join('') +
        '</div><span class="err">Elige el tipo de institución.</span></fieldset>' +
        '<fieldset class="q" data-q="diseno"><legend>¿Ya tienen el diseño? <span class="req" aria-hidden="true">*</span></legend><div class="choices choices-2">' +
        DISENO.map(function (d) { return radio('diseno', d[0], d[0] === 'Ya tenemos diseño' ? 'Sí, ya tenemos diseño' : 'No, necesitamos que nos lo diseñen', d[1], S.diseno === d[0]); }).join('') +
        '</div><span class="err">Cuéntanos si ya tienen diseño.</span></fieldset>';
    },
    function () {
      return '<h2 tabindex="-1">Elige las prendas</h2><p class="muted">Marca todas las que quieras cotizar. Puedes combinar varias en una misma dotación.</p>' +
        '<fieldset class="q" data-q="prendas"><legend class="sr-only">Prendas</legend><div class="pick-grid">' +
        P.map(function (p) {
          return '<label class="pick"><input type="checkbox" name="prendas" value="' + p.slug + '"' + (S.prendas.indexOf(p.slug) >= 0 ? ' checked' : '') + '>' +
            '<span class="pick-img"><img src="' + p.foto + '" alt="" width="300" height="300" loading="lazy"></span><b>' + esc(p.nombre) + '</b></label>';
        }).join('') + '</div><span class="err">Elige al menos una prenda.</span></fieldset>';
    },
    function () {
      return '<h2 tabindex="-1">Cantidades, colores y tallas</h2><p class="muted">Una idea aproximada basta. El pedido mínimo es de ' + C.pedido.minimo + ' unidades por prenda.</p>' +
        S.prendas.map(function (slug) {
          var p = window.uptProducto(slug), it = item(slug);
          return '<div class="line-item"><img src="' + p.foto + '" alt="" width="88" height="110"><div><h3>' + esc(p.nombre) + '</h3><div class="line-fields">' +
            field('cant-' + slug, 'Cantidad', '<input type="number" inputmode="numeric" min="1" step="1" id="cant-' + slug + '" data-item="' + slug + '" data-k="cant" value="' + esc(it.cant) + '" placeholder="Ej: 120">', true) +
            field('col-' + slug, 'Colores', '<input type="text" id="col-' + slug + '" data-item="' + slug + '" data-k="colores" value="' + esc(it.colores) + '" placeholder="Ej: ' + esc(p.colores[0]) + ' y blanco">') +
            field('tal-' + slug, 'Tallas', '<input type="text" id="tal-' + slug + '" data-item="' + slug + '" data-k="tallas" value="' + esc(it.tallas) + '" placeholder="' + esc(p.tallas) + '">') +
            '</div></div></div>';
        }).join('');
    },
    function () {
      var a = S.archivo;
      return '<h2 tabindex="-1">Personalización</h2><p class="muted">Dónde va el escudo o logo y, si lo tienen, el archivo para verlo.</p>' +
        '<fieldset class="q" data-q="ubic"><legend>Ubicación del escudo o logo <span class="req" aria-hidden="true">*</span></legend><div class="choices">' +
        UBIC.map(function (u) { return checkbox('ubic', u, u, S.ubic.indexOf(u) >= 0); }).join('') + '</div><span class="err">Elige al menos una ubicación.</span></fieldset>' +
        '<fieldset class="q" data-q="tecnica"><legend>Técnica preferida</legend><div class="choices">' +
        TECNICAS.map(function (t) { return radio('tecnica', t, t, '', S.tecnica === t); }).join('') + '</div></fieldset>' +
        '<div class="q"><span class="q-label" id="archivoLbl">Escudo, logo o referencia</span>' +
        '<p class="q-hint">' + (S.diseno === 'Ya tenemos diseño' ? 'Súbelo para que lo veamos con la cotización.' : 'Opcional: una foto o boceto nos ayuda a diseñar.') + ' Solo se muestra aquí, en tu navegador.</p>' +
        '<label class="drop" id="drop"><input type="file" id="archivo" class="sr-only" accept="image/*,.pdf,.svg,.ai,.eps" aria-labelledby="archivoLbl">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
        '<b>Arrastra el archivo o haz clic para elegirlo</b><small>PNG, JPG, SVG o PDF · hasta 10 MB</small></label>' +
        '<div id="prev">' + (a ? previewHTML(a) : '') + '</div></div>' +
        field('notasPers', 'Indicaciones de personalización', '<textarea id="notasPers" data-s="notasPers" placeholder="Ej: nombre del estudiante en la espalda, año de promoción en la manga">' + esc(S.notasPers) + '</textarea>');
    },
    function () {
      var c = S.c, hoy = new Date(); hoy.setDate(hoy.getDate() + 1);
      var min = hoy.toISOString().slice(0, 10);
      return '<h2 tabindex="-1">Tus datos</h2><p class="muted">Para enviarte la propuesta. No compartimos tus datos con terceros.</p>' +
        '<div class="form-row">' +
        field('c-nombre', 'Nombre y apellido', '<input type="text" id="c-nombre" data-c="nombre" autocomplete="name" value="' + esc(c.nombre) + '">', true) +
        field('c-institucion', 'Institución', '<input type="text" id="c-institucion" data-c="institucion" autocomplete="organization" value="' + esc(c.institucion) + '" placeholder="Nombre del colegio, universidad, equipo o empresa">', true) +
        field('c-cargo', 'Cargo', '<input type="text" id="c-cargo" data-c="cargo" autocomplete="organization-title" value="' + esc(c.cargo) + '" placeholder="Ej: Coordinadora administrativa">') +
        field('c-ciudad', 'Ciudad o provincia', '<input type="text" id="c-ciudad" data-c="ciudad" autocomplete="address-level2" value="' + esc(c.ciudad) + '" placeholder="Ej: Santiago">') +
        field('c-correo', 'Correo electrónico', '<input type="email" id="c-correo" data-c="correo" autocomplete="email" value="' + esc(c.correo) + '" placeholder="nombre@institucion.edu.do">', true) +
        field('c-telefono', 'Teléfono o WhatsApp', '<input type="tel" id="c-telefono" data-c="telefono" autocomplete="tel" value="' + esc(c.telefono) + '" placeholder="809 000 0000">', true) +
        '</div>' +
        field('c-fecha', 'Fecha deseada de entrega', '<input type="date" id="c-fecha" data-c="fecha" min="' + min + '" value="' + esc(c.fecha) + '">') +
        field('c-comentarios', 'Comentarios', '<textarea id="c-comentarios" data-c="comentarios" placeholder="Algo más que debamos saber">' + esc(c.comentarios) + '</textarea>') +
        '<div class="q" data-q="legal" style="margin-bottom:0">' +
        '<label class="check"><input type="checkbox" id="tc"' + (S.tc ? ' checked' : '') + '><span>He leído y acepto los <a href="terminos.html" target="_blank" rel="noopener">Términos y condiciones</a>. <span class="req">*</span></span></label>' +
        '<label class="check"><input type="checkbox" id="pr"' + (S.pr ? ' checked' : '') + '><span>Acepto la <a href="privacidad.html" target="_blank" rel="noopener">Política de privacidad</a> y autorizo el tratamiento de mis datos según la Ley 172-13. <span class="req">*</span></span></label>' +
        '<span class="err">Debes aceptar los términos y la política de privacidad para continuar.</span></div>';
    },
    function () {
      var c = S.c;
      function block(title, step, rows) {
        return '<div class="sum-block"><div class="sum-head"><h3>' + title + '</h3><button type="button" class="sum-edit" data-go="' + step + '">Editar<span class="sr-only"> ' + title + '</span></button></div><dl>' +
          rows.filter(function (r) { return r[1]; }).map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl></div>';
      }
      var items = S.prendas.map(function (slug) {
        var p = window.uptProducto(slug), it = item(slug);
        return [p.nombre, it.cant + ' und.' + (it.colores ? ' · ' + it.colores : '') + (it.tallas ? ' · Tallas: ' + it.tallas : '')];
      });
      return '<h2 tabindex="-1">Revisa y envía</h2><p class="muted">Si algo no está bien, toca “Editar” en ese bloque.</p><div class="summary">' +
        block('Institución', 0, [['Tipo', S.tipo], ['Diseño', S.diseno]]) +
        block('Prendas y cantidades', 2, items.concat([['Total aproximado', totalUnidades() + ' unidades']])) +
        block('Personalización', 3, [['Ubicación', S.ubic.join(', ')], ['Técnica', S.tecnica], ['Archivo', S.archivo ? S.archivo.name : 'Sin archivo'], ['Indicaciones', S.notasPers]]) +
        block('Contacto', 4, [['Nombre', c.nombre], ['Institución', c.institucion], ['Cargo', c.cargo], ['Correo', c.correo], ['Teléfono', c.telefono], ['Ciudad', c.ciudad], ['Fecha deseada', fmtFecha(c.fecha)], ['Comentarios', c.comentarios]]) +
        '</div>';
    }
  ];

  function totalUnidades() { return S.prendas.reduce(function (t, s) { return t + (parseInt(item(s).cant, 10) || 0); }, 0); }
  function fmtFecha(f) { if (!f) return ''; var d = new Date(f + 'T12:00:00'); return d.toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function previewHTML(a) {
    var kb = a.size > 1048576 ? (a.size / 1048576).toFixed(1) + ' MB' : Math.round(a.size / 1024) + ' KB';
    var thumb = a.dataUrl ? '<img src="' + a.dataUrl + '" alt="Vista previa del archivo">' : '<span class="file-ico">' + esc((a.name.split('.').pop() || 'ARCH').toUpperCase().slice(0, 4)) + '</span>';
    return '<div class="preview">' + thumb + '<div><b>' + esc(a.name) + '</b><span class="muted">' + kb + ' · solo en tu navegador</span></div><button type="button" class="btn btn-secondary btn-sm" data-quitar>Quitar</button></div>';
  }

  function render(focus) {
    var i = S.step;
    body.innerHTML = '<div class="wiz-step' + (dir === 'back' ? ' back' : '') + '">' + views[i]() + '</div>';
    bar.style.transform = 'scaleX(' + ((i + 1) / PASOS.length) + ')';
    root.querySelector('.progress').setAttribute('aria-valuenow', String(i + 1));
    meta.innerHTML = '<strong>' + PASOS[i] + '</strong><span>Paso ' + (i + 1) + ' de ' + PASOS.length + '</span>';
    dots.querySelectorAll('.wiz-dot').forEach(function (d, k) {
      d.classList.toggle('done', k < i);
      d.disabled = k > S.max;
      if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
    });
    btnPrev.disabled = i === 0;
    btnNext.innerHTML = i === PASOS.length - 1
      ? 'Enviar cotización <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>'
      : 'Siguiente <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    if (i === 3) bindFile();
    if (focus) {
      var h = body.querySelector('h2'); if (h) h.focus({ preventScroll: true });
      var top = root.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.4) root.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
  }

  /* ── Captura de datos ─────────────────────────────────── */
  body.addEventListener('input', onChange);
  body.addEventListener('change', onChange);
  function onChange(e) {
    var t = e.target;
    if (t.name === 'tipo') S.tipo = t.value;
    else if (t.name === 'diseno') S.diseno = t.value;
    else if (t.name === 'tecnica') S.tecnica = t.value;
    else if (t.name === 'prendas') {
      S.prendas = Array.prototype.map.call(body.querySelectorAll('input[name="prendas"]:checked'), function (x) { return x.value; });
      // conserva el orden del catálogo
      S.prendas.sort(function (a, b) { return P.findIndex(function (p) { return p.slug === a; }) - P.findIndex(function (p) { return p.slug === b; }); });
    } else if (t.name === 'ubic') S.ubic = Array.prototype.map.call(body.querySelectorAll('input[name="ubic"]:checked'), function (x) { return x.value; });
    else if (t.dataset.item) item(t.dataset.item)[t.dataset.k] = t.value;
    else if (t.dataset.c) S.c[t.dataset.c] = t.value;
    else if (t.dataset.s) S[t.dataset.s] = t.value;
    else if (t.id === 'tc') S.tc = t.checked;
    else if (t.id === 'pr') S.pr = t.checked;
    var holder = t.closest('.has-error'); if (holder) { holder.classList.remove('has-error'); t.removeAttribute('aria-invalid'); }
    save();
  }

  function bindFile() {
    var input = body.querySelector('#archivo'), drop = body.querySelector('#drop'), prev = body.querySelector('#prev');
    function take(f) {
      if (!f) return;
      if (f.size > 10 * 1048576) { prev.innerHTML = '<p class="alert" role="alert">El archivo pesa más de 10 MB. Prueba con uno más liviano.</p>'; return; }
      var a = { name: f.name, size: f.size, type: f.type, dataUrl: null };
      if (/^image\//.test(f.type) && f.size < 2 * 1048576) {
        var r = new FileReader();
        r.onload = function () { a.dataUrl = r.result; S.archivo = a; save(); prev.innerHTML = previewHTML(a); };
        r.readAsDataURL(f);
      } else if (/^image\//.test(f.type)) {
        a.dataUrl = URL.createObjectURL(f); S.archivo = a; prev.innerHTML = previewHTML(a); a.dataUrl = null; save();
      } else { S.archivo = a; save(); prev.innerHTML = previewHTML(a); }
    }
    input.addEventListener('change', function () { take(input.files[0]); });
    ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function (e) { take(e.dataTransfer.files[0]); });
    prev.addEventListener('click', function (e) { if (e.target.closest('[data-quitar]')) { S.archivo = null; input.value = ''; save(); prev.innerHTML = ''; } });
  }

  /* ── Validación ───────────────────────────────────────── */
  function setErr(sel, msg) {
    var el = body.querySelector(sel); if (!el) return null;
    el.classList.add('has-error');
    var e = el.querySelector('.err'); if (e && msg) e.textContent = msg;
    var inp = el.querySelector('input,select,textarea'); if (inp) { inp.setAttribute('aria-invalid', 'true'); if (e && e.id) inp.setAttribute('aria-describedby', e.id); }
    return el;
  }
  function validate() {
    body.querySelectorAll('.has-error').forEach(function (x) { x.classList.remove('has-error'); });
    body.querySelectorAll('[aria-invalid]').forEach(function (x) { x.removeAttribute('aria-invalid'); });
    var bad = [];
    var i = S.step;
    if (i === 0) {
      if (!S.tipo) bad.push(setErr('[data-q="tipo"]'));
      if (!S.diseno) bad.push(setErr('[data-q="diseno"]'));
    } else if (i === 1) {
      if (!S.prendas.length) bad.push(setErr('[data-q="prendas"]'));
    } else if (i === 2) {
      S.prendas.forEach(function (slug) {
        var n = parseInt(item(slug).cant, 10);
        if (!item(slug).cant) bad.push(setErr('[data-f="cant-' + slug + '"]', 'Escribe una cantidad aproximada.'));
        else if (isNaN(n) || n < 1) bad.push(setErr('[data-f="cant-' + slug + '"]', 'La cantidad debe ser un número mayor que cero.'));
        else if (n < C.pedido.minimo) bad.push(setErr('[data-f="cant-' + slug + '"]', 'El pedido mínimo es de ' + C.pedido.minimo + ' unidades por prenda.'));
      });
    } else if (i === 3) {
      if (!S.ubic.length) bad.push(setErr('[data-q="ubic"]'));
    } else if (i === 4) {
      var c = S.c;
      if (!c.nombre.trim()) bad.push(setErr('[data-f="c-nombre"]', 'Escribe tu nombre.'));
      if (!c.institucion.trim()) bad.push(setErr('[data-f="c-institucion"]', 'Escribe el nombre de la institución.'));
      if (!c.correo.trim()) bad.push(setErr('[data-f="c-correo"]', 'Escribe tu correo.'));
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.correo.trim())) bad.push(setErr('[data-f="c-correo"]', 'Revisa el correo; parece incompleto (ej: nombre@dominio.com).'));
      var dig = c.telefono.replace(/\D/g, '');
      if (!dig) bad.push(setErr('[data-f="c-telefono"]', 'Escribe un teléfono o WhatsApp.'));
      else if (dig.length < 10) bad.push(setErr('[data-f="c-telefono"]', 'El teléfono debe tener al menos 10 dígitos.'));
      if (c.fecha) { var d = new Date(c.fecha + 'T12:00:00'); if (d <= new Date()) bad.push(setErr('[data-f="c-fecha"]', 'Elige una fecha a partir de mañana.')); }
      if (!S.tc || !S.pr) bad.push(setErr('[data-q="legal"]'));
    }
    bad = bad.filter(Boolean);
    var old = body.querySelector('.alert'); if (old) old.remove();
    if (bad.length) {
      var al = document.createElement('p'); al.className = 'alert'; al.setAttribute('role', 'alert');
      al.textContent = bad.length === 1 ? 'Falta un dato por completar. Revísalo abajo.' : 'Faltan ' + bad.length + ' datos por completar. Revísalos abajo.';
      body.querySelector('.wiz-step').insertBefore(al, body.querySelector('.wiz-step h2').nextSibling.nextSibling);
      var f = bad[0].querySelector('input,select,textarea'); if (f) f.focus();
      return false;
    }
    return true;
  }

  function go(n) {
    if (n === S.step) return;
    dir = n > S.step ? 'fwd' : 'back';
    S.step = n; S.max = Math.max(S.max, n); save(); render(true);
  }

  btnNext.addEventListener('click', function () {
    if (!validate()) return;
    if (S.step === PASOS.length - 1) { enviar(); return; }
    go(S.step + 1);
  });
  btnPrev.addEventListener('click', function () { if (S.step > 0) go(S.step - 1); });
  root.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]'); if (!g || g.disabled) return;
    var n = parseInt(g.dataset.go, 10);
    if (n > S.step && !validate()) return;
    go(n);
  });

  /* ── Envío ────────────────────────────────────────────── */
  function enviar() {
    var year = new Date().getFullYear();
    var seq = (parseInt(store('upt_ref_seq'), 10) || 0) + 1; store('upt_ref_seq', seq);
    var ref = 'UPT-' + year + '-' + String(seq).padStart(4, '0');
    var reg = {
      ref: ref, fecha: new Date().toISOString(), tipo: S.tipo, diseno: S.diseno,
      prendas: S.prendas.map(function (s) { var it = item(s); return { slug: s, nombre: window.uptProducto(s).nombre, cant: parseInt(it.cant, 10) || 0, colores: it.colores, tallas: it.tallas }; }),
      total: totalUnidades(), ubic: S.ubic, tecnica: S.tecnica, archivo: S.archivo ? S.archivo.name : '', notasPers: S.notasPers,
      contacto: S.c, estado: 'Nueva'
    };
    var all = store('upt_cotizaciones') || []; all.push(reg); store('upt_cotizaciones', all);
    var cons = store('upt_cons') || []; cons.push({ fecha: reg.fecha, ref: ref, nombre: S.c.nombre, correo: S.c.correo, institucion: S.c.institucion, tc: S.tc, pr: S.pr, vTC: 'Términos v2.0 (nov-2026)', vPr: 'Privacidad v2.0 (nov-2026)' }); store('upt_cons', cons);
    try { localStorage.removeItem(KEY); } catch (e) {}

    var msg = 'Hola UPT, envié la cotización ' + ref + '.\n\n' +
      'Institución: ' + S.c.institucion + ' (' + S.tipo + ')\n' +
      'Diseño: ' + S.diseno + '\n\nPrendas:\n' +
      reg.prendas.map(function (p) { return '• ' + p.nombre + ': ' + p.cant + ' und.' + (p.colores ? ' (' + p.colores + ')' : ''); }).join('\n') +
      '\n\nTotal aprox.: ' + reg.total + ' unidades' +
      '\nLogo en: ' + S.ubic.join(', ') +
      (S.c.fecha ? '\nFecha deseada: ' + fmtFecha(S.c.fecha) : '') +
      '\n\nContacto: ' + S.c.nombre + ' · ' + S.c.telefono + ' · ' + S.c.correo;

    root.innerHTML = '<div class="done" role="status"><div class="done-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></div>' +
      '<h2 class="h2" tabindex="-1">¡Cotización recibida!</h2><p class="lead" style="margin:12px auto 0">Gracias, ' + esc(S.c.nombre.split(' ')[0]) + '. Te escribimos en menos de ' + esc(C.pedido.respuesta) + ' con la propuesta. Guarda tu número de referencia:</p>' +
      '<div class="ref" id="refNum">' + ref + '</div>' +
      '<p class="muted">¿Quieres adelantar la conversación? Envíanos el resumen por WhatsApp.</p>' +
      '<div class="done-actions"><a class="btn btn-wa" id="waResumen" href="' + window.uptWaLink(msg) + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.14.563 4.148 1.549 5.886L0 24l6.302-1.526A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.001-1.372l-.359-.214-3.72.976.994-3.636-.234-.373A9.78 9.78 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>Enviar resumen por WhatsApp</a>' +
      '<a class="btn btn-secondary" href="cotizacion.html">Hacer otra cotización</a><a class="btn btn-secondary" href="catalogo.html">Volver al catálogo</a></div></div>';
    var h = root.querySelector('h2'); h.focus({ preventScroll: true });
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render(false);
})();
