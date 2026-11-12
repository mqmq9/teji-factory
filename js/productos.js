/* ════════════════════════════════════════════════════════════
   UPT — Catálogo
   Especificaciones tomadas de los flyers de producto.
   Las marcadas "ejemplo" en el reporte son de demostración.
   ════════════════════════════════════════════════════════════ */
window.UPT_CATEGORIAS = [
  { id: 'chaquetas', nombre: 'Chaquetas' },
  { id: 'abrigos',   nombre: 'Abrigos' },
  { id: 'deportivo', nombre: 'Deportivo' },
  { id: 'calzado',   nombre: 'Calzado' }
];

window.UPT_PRODUCTOS = [
  {
    slug: 'waterproof-vision-del-saber',
    nombre: 'Waterproof Vision Del Saber',
    corto: 'Waterproof',
    ref: 'VDS-004',
    categoria: 'chaquetas',
    foto: 'img/productos/waterproof-vision-del-saber.jpg',
    resumen: 'Chaqueta impermeable deportiva, liviana y de secado rápido.',
    descripcion: 'La chaqueta para la temporada de lluvias. Tela liviana que resiste el agua y seca rápido, con el escudo tejido de tu institución en el pecho. Aquí la ves con la identidad del Centro Educativo Visión Del Saber; la tuya sale con tus colores.',
    specs: [
      ['Textil', 'Antifluido deportivo de 135 g'],
      ['Protección', 'Lluvia ligera y salpicaduras'],
      ['Escudo', 'Tejido en alta definición'],
      ['Cremallera', 'Marca YKK'],
      ['Ajuste', 'Puños elásticos y cordón en el ruedo']
    ],
    personalizacion: ['Escudo tejido en pecho', 'Marquilla institucional', 'Colores de franjas y vivos', 'Nombre bordado'],
    tallas: '4 a 16 infantil · XS a XXL adulto',
    colores: ['Azul marino', 'Negro', 'Vino', 'A tu medida']
  },
  {
    slug: 'varsity-premium',
    nombre: 'Varsity Premium dotacional',
    corto: 'Varsity',
    ref: 'CLRD-002',
    categoria: 'chaquetas',
    foto: 'img/productos/varsity-premium.jpg',
    resumen: 'Varsity jacket 100% personalizada, fleece deportivo y jacquard.',
    descripcion: 'La chaqueta que se vuelve recuerdo. Cuello, puños y ruedo en tejido jacquard con el nombre y el año de tu institución, escudo bordado y marquilla propia. Disponible en la combinación de colores que represente a tu gente.',
    specs: [
      ['Textil', 'Fleece deportivo de 220 g'],
      ['Cuello y puños', 'Tejido jacquard 100% nylon'],
      ['Bordados', '100% personalizados'],
      ['Cremallera', 'Marca YKK'],
      ['Acabados', 'Premium, máximo confort y durabilidad']
    ],
    personalizacion: ['Escudo bordado en pecho', 'Nombre y año en el cuello', 'Marquilla con bandera', 'Combinación de colores'],
    tallas: '4 a 16 infantil · XS a XXL adulto',
    colores: ['Gris', 'Vino', 'Azul marino', 'A tu medida']
  },
  {
    slug: 'zapatilla-premium',
    nombre: 'Zapatilla Premium',
    corto: 'Zapatilla',
    ref: 'ZAP-010',
    categoria: 'calzado',
    foto: 'img/productos/zapatilla-premium.jpg',
    resumen: 'Zapatilla deportiva ergonómica, diseñada a medida para tu institución.',
    descripcion: 'El uniforme completo, de pies a cabeza. Una zapatilla deportiva ergonómica con el escudo o la mascota de tu institución. Elige entre tres combinaciones base y la ajustamos a tus colores.',
    specs: [
      ['Tipo', 'Zapatilla deportiva premium'],
      ['Horma', 'Ergonómica y cómoda'],
      ['Material', 'Sintético 100% garantizado'],
      ['Fabricación', 'Maquila especializada en calzado'],
      ['Diseño', 'Exclusivo para tu institución, 3 opciones base']
    ],
    personalizacion: ['Escudo o mascota lateral', 'Colores de capellada', 'Logo en lengüeta', 'Plantilla con nombre'],
    tallas: '28 a 45',
    colores: ['Blanco y negro', 'Negro', 'Negro y blanco', 'A tu medida']
  },
  {
    slug: 'sueter-dryfit-premium',
    nombre: 'Suéter Dryfit Premium',
    corto: 'Dryfit',
    ref: 'DRY-021',
    categoria: 'deportivo',
    foto: 'img/productos/sueter-dryfit-premium.jpg',
    resumen: 'Suéter deportivo con control de humedad, 100% sublimado.',
    descripcion: 'Para educación física, entrenos y días de competencia. Tela ligera y flexible que saca el sudor y seca rápido, con tu diseño sublimado de lado a lado y el escudo bordado.',
    specs: [
      ['Textil', '98% algodón, 2% spandex · 135 g/m²'],
      ['Control', 'Humedad y olor'],
      ['Cuidado', 'Fácil secado y fácil lavado'],
      ['Estampado', 'Sublimación 100%, colores que no se van'],
      ['Logos', 'Institucionales bordados en alta definición']
    ],
    personalizacion: ['Diseño sublimado completo', 'Escudo bordado', 'Número y nombre', 'Marquilla institucional'],
    tallas: '4 a 16 infantil · XS a XXL adulto',
    colores: ['Sublimado a todo color']
  },
  {
    slug: 'rompevientos-premium',
    nombre: 'Rompevientos Premium',
    corto: 'Rompevientos',
    ref: 'RVP-031',
    categoria: 'abrigos',
    foto: 'img/productos/rompevientos-premium.jpg',
    resumen: 'Abrigo en textil antifluido con recubrimiento interior en malla dryfit.',
    descripcion: 'Liviano, resistente y fresco por dentro. Por fuera, textil antifluido que frena la lluvia ligera; por dentro, malla deportiva que deja respirar. Marquillas y logos 100% personalizados.',
    specs: [
      ['Textil', 'Antifluido de 140 g'],
      ['Interior', 'Malla deportiva dryfit de 135 g'],
      ['Control', 'Humedad y olor'],
      ['Protección', 'Lluvia ligera y salpicaduras'],
      ['Marquillas', '100% personalizadas']
    ],
    personalizacion: ['Escudo bordado en pecho', 'Nombre grande en espalda', 'Franjas en mangas', 'Marquilla institucional'],
    tallas: '4 a 16 infantil · XS a XXL adulto',
    colores: ['Vino', 'Azul marino', 'Negro', 'A tu medida']
  },
  {
    slug: 'hoodie-premium',
    nombre: 'Hoodie Premium',
    corto: 'Hoodie',
    ref: 'HOD-040',
    categoria: 'abrigos',
    foto: 'img/productos/hoodie-premium.jpg',
    resumen: 'Abrigo cerrado en algodón/poliéster, 100% bordado y personalizado.',
    descripcion: 'El favorito de los pasillos. Algodón y poliéster de buen peso, bordado frontal de alta definición, capota con forro en color contrastante y fajones tejidos en jacquard con tus colores.',
    specs: [
      ['Textil', 'Algodón y poliéster · 270 g/m²'],
      ['Gráfica', 'Bordado frontal 100%, alta definición'],
      ['Fajones', 'Tejido jacquard con combinación de colores'],
      ['Capota', 'Forro interno en color contrastante'],
      ['Marquillas', 'Personalizadas con logo']
    ],
    personalizacion: ['Bordado frontal', 'Color del forro de capota', 'Fajones con tus colores', 'Marquilla institucional'],
    tallas: '4 a 16 infantil · XS a XXL adulto',
    colores: ['Azul marino', 'Negro', 'Gris jaspe', 'A tu medida']
  },
  {
    slug: 'rompevientos-doble-faz',
    nombre: 'Rompevientos Doble Faz',
    corto: 'Doble Faz',
    ref: 'RDF-032',
    categoria: 'abrigos',
    foto: 'img/productos/rompevientos-doble-faz.jpg',
    resumen: 'Abrigo ligero reversible, 100% personalizado con elementos gráficos.',
    descripcion: 'Dos chaquetas en una. Úsala por un lado con el color institucional y por el otro con la gráfica de tu promoción, equipo o mascota. Ligera para el día a día.',
    specs: [
      ['Construcción', 'Reversible, dos caras de uso'],
      ['Textil', 'Liviano antifluido de 120 g'],
      ['Gráfica', 'Elementos sublimados y bordados'],
      ['Cremallera', 'Doble deslizador'],
      ['Marquillas', '100% personalizadas']
    ],
    personalizacion: ['Gráfica en espalda', 'Escudo en pecho', 'Color distinto por cara', 'Nombre y año'],
    tallas: '4 a 16 infantil · XS a XXL adulto',
    colores: ['Vino y blanco', 'Azul y gris', 'A tu medida']
  }
];

window.uptProducto = function (slug) {
  return window.UPT_PRODUCTOS.find(function (p) { return p.slug === slug; });
};
window.uptCategoria = function (id) {
  var c = window.UPT_CATEGORIAS.find(function (c) { return c.id === id; });
  return c ? c.nombre : id;
};

/* Tarjeta de producto compartida (inicio y catálogo) */
window.uptCard = function (p, extra) {
  var esc = window.uptEsc;
  return '<article class="prod' + (extra ? ' ' + extra : '') + '">' +
    '<div class="prod-media"><img src="' + p.foto + '" alt="' + esc(p.nombre) + '" width="500" height="625" loading="lazy" decoding="async">' +
    '<span class="prod-cat">' + esc(window.uptCategoria(p.categoria)) + '</span></div>' +
    '<div class="prod-body"><span class="prod-ref">Ref. ' + esc(p.ref) + '</span>' +
    '<h3 class="prod-name"><a href="catalogo.html?producto=' + p.slug + '">' + esc(p.nombre) + '</a></h3>' +
    '<p class="prod-sum">' + esc(p.resumen) + '</p></div>' +
    '<div class="prod-foot"><a class="btn btn-primary btn-sm" href="cotizacion.html?producto=' + p.slug + '#cotizador">Cotizar<span class="sr-only"> ' + esc(p.nombre) + '</span></a>' +
    '<a class="btn btn-secondary btn-sm" href="catalogo.html?producto=' + p.slug + '">Ver detalle<span class="sr-only"> de ' + esc(p.nombre) + '</span></a></div>' +
    '</article>';
};
