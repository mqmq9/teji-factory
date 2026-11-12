/* UPT — Área privada: registros en localStorage y exportación CSV */
(function () {
  var C = window.UPT_CONFIG, esc = window.uptEsc, store = window.uptStore;
  var login = document.getElementById('login'), panel = document.getElementById('panel');
  var tabActual = 'cot';

  function fecha(f) { try { return new Date(f).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return f; } }
  function fdia(f) { if (!f) return '—'; return new Date(f + 'T12:00:00').toLocaleDateString('es-DO', { dateStyle: 'medium' }); }

  function abrir() { login.hidden = true; panel.hidden = false; cargar(); }
  try { if (sessionStorage.getItem('upt_admin') === '1') abrir(); } catch (e) {}

  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = document.getElementById('passField'), p = document.getElementById('pass');
    if (p.value === C.admin.clave) { try { sessionStorage.setItem('upt_admin', '1'); } catch (x) {} f.classList.remove('has-error'); abrir(); }
    else { f.classList.add('has-error'); p.setAttribute('aria-invalid', 'true'); p.setAttribute('aria-describedby', 'pass-err'); p.select(); }
  });
  document.getElementById('salir').addEventListener('click', function () { try { sessionStorage.removeItem('upt_admin'); } catch (e) {} location.reload(); });

  function cargar() {
    var cot = store('upt_cotizaciones') || [], cons = store('upt_cons') || [], ck = store('upt_ck') || [];
    document.getElementById('resumen').textContent = cot.length + ' cotizaciones · ' + cons.length + ' consentimientos · ' + ck.length + ' registros de cookies';
    document.getElementById('tb-cot').innerHTML = cot.length ? cot.slice().reverse().map(function (r) {
      var c = r.contacto || {};
      return '<tr><td><b>' + esc(r.ref) + '</b><br><span class="badge">' + esc(r.estado || 'Nueva') + '</span></td><td>' + fecha(r.fecha) + '</td><td>' + esc(c.institucion) + (c.ciudad ? '<br><span class="muted">' + esc(c.ciudad) + '</span>' : '') + '</td><td>' + esc(r.tipo) + '</td>' +
        '<td>' + esc(c.nombre) + (c.cargo ? ' · ' + esc(c.cargo) : '') + '<br><a class="link" href="mailto:' + esc(c.correo) + '">' + esc(c.correo) + '</a><br>' + esc(c.telefono) + '</td>' +
        '<td style="min-width:220px">' + (r.prendas || []).map(function (p) { return esc(p.nombre) + ': <b>' + p.cant + '</b>' + (p.colores ? ' · ' + esc(p.colores) : '') + (p.tallas ? ' · ' + esc(p.tallas) : ''); }).join('<br>') + '</td>' +
        '<td><b>' + (r.total || 0) + '</b></td><td>' + esc(r.diseno) + (r.archivo ? '<br><span class="muted">Archivo: ' + esc(r.archivo) + '</span>' : '') + '</td><td>' + esc((r.ubic || []).join(', ')) + (r.tecnica ? '<br><span class="muted">' + esc(r.tecnica) + '</span>' : '') + '</td><td>' + fdia(c.fecha) + '</td></tr>';
    }).join('') : '<tr><td colspan="10" class="vacia">Aún no hay cotizaciones. Haz una en <a class="link" href="cotizacion.html">el cotizador</a>.</td></tr>';
    document.getElementById('tb-cons').innerHTML = cons.length ? cons.slice().reverse().map(function (r) {
      return '<tr><td>' + fecha(r.fecha) + '</td><td>' + esc(r.ref) + '</td><td>' + esc(r.nombre) + '</td><td>' + esc(r.correo) + '</td><td>' + esc(r.institucion) + '</td><td><span class="badge">' + (r.tc ? 'Sí' : 'No') + '</span></td><td><span class="badge">' + (r.pr ? 'Sí' : 'No') + '</span></td><td class="muted">' + esc(r.vTC) + '<br>' + esc(r.vPr) + '</td></tr>';
    }).join('') : '<tr><td colspan="8" class="vacia">Sin consentimientos registrados.</td></tr>';
    document.getElementById('tb-ck').innerHTML = ck.length ? ck.slice().reverse().map(function (r) {
      return '<tr><td>' + fecha(r.fecha) + '</td><td><span class="badge' + (r.decision === 'todas' ? '' : ' gris') + '">' + (r.decision === 'todas' ? 'Aceptó todas' : 'Solo esenciales') + '</span></td></tr>';
    }).join('') : '<tr><td colspan="2" class="vacia">Sin registros de cookies.</td></tr>';
  }

  /* Pestañas accesibles */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  function sel(t) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
    tabActual = t.id.replace('tab-', '');
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { sel(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
      var n = tabs[(i + k + tabs.length) % tabs.length]; sel(n); n.focus();
    });
  });

  /* CSV de la pestaña activa */
  function csv(rows) { return rows.map(function (r) { return r.map(function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n'); }
  document.getElementById('exportar').addEventListener('click', function () {
    var data, name;
    if (tabActual === 'cot') {
      var cot = store('upt_cotizaciones') || [];
      data = [['Referencia', 'Fecha', 'Institución', 'Tipo', 'Nombre', 'Cargo', 'Correo', 'Teléfono', 'Ciudad', 'Prendas', 'Total', 'Diseño', 'Ubicación logo', 'Técnica', 'Archivo', 'Fecha deseada', 'Comentarios']]
        .concat(cot.map(function (r) { var c = r.contacto || {}; return [r.ref, r.fecha, c.institucion, r.tipo, c.nombre, c.cargo, c.correo, c.telefono, c.ciudad, (r.prendas || []).map(function (p) { return p.nombre + ' x' + p.cant; }).join(' | '), r.total, r.diseno, (r.ubic || []).join(' | '), r.tecnica, r.archivo, c.fecha, c.comentarios]; }));
      name = 'cotizaciones';
    } else if (tabActual === 'cons') {
      data = [['Fecha', 'Referencia', 'Nombre', 'Correo', 'Institución', 'Términos', 'Privacidad', 'Versión términos', 'Versión privacidad']]
        .concat((store('upt_cons') || []).map(function (r) { return [r.fecha, r.ref, r.nombre, r.correo, r.institucion, r.tc ? 'SÍ' : 'NO', r.pr ? 'SÍ' : 'NO', r.vTC, r.vPr]; }));
      name = 'consentimientos';
    } else {
      data = [['Fecha', 'Decisión']].concat((store('upt_ck') || []).map(function (r) { return [r.fecha, r.decision]; }));
      name = 'cookies';
    }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv(data)], { type: 'text/csv;charset=utf-8;' }));
    a.download = 'upt_' + name + '_' + new Date().toLocaleDateString('sv') + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* Borrar con doble confirmación (sin diálogos del navegador) */
  var b = document.getElementById('borrar'), armado = false, tm;
  b.addEventListener('click', function () {
    if (!armado) { armado = true; b.textContent = '¿Seguro? Toca otra vez'; b.classList.add('btn-primary'); tm = setTimeout(function () { armado = false; b.textContent = 'Borrar datos de prueba'; b.classList.remove('btn-primary'); }, 4000); return; }
    clearTimeout(tm);
    ['upt_cotizaciones', 'upt_cons', 'upt_ck', 'upt_ref_seq', 'upt_cot_borrador'].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
    armado = false; b.textContent = 'Borrar datos de prueba'; b.classList.remove('btn-primary'); cargar();
  });
})();
