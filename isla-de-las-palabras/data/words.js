/*
 * data/words.js — Contenido inicial (~100 palabras) de "La Isla de las Palabras".
 *
 * Se carga como script clásico (NO se usa fetch de JSON, que el navegador bloquea en file://).
 * Define window.Isla.WORDS con la lista completa.
 *
 * Cada palabra: { id, text, level, sentence, tags }
 *   - level 1: cortas y fonéticas simples  -> modo de escritura GUÍA
 *   - level 2: más largas / más sílabas     -> modo DESVANECIDO
 *   - level 3: dificultades ortográficas    -> modo LIBRE
 */
(function () {
  window.Isla = window.Isla || {};

  function w(text, level, sentence, tags) {
    return { id: text, text: text, level: level, sentence: sentence, tags: tags || [] };
  }

  window.Isla.WORDS = [
    // ---------- NIVEL 1 ----------
    w('sol', 1, 'El sol calienta el día.'),
    w('casa', 1, 'Mi casa es grande.'),
    w('mesa', 1, 'La mesa está limpia.'),
    w('mano', 1, 'Levanta la mano.'),
    w('pato', 1, 'El pato nada en el lago.'),
    w('oso', 1, 'El oso come miel.'),
    w('luna', 1, 'La luna brilla de noche.'),
    w('pan', 1, 'Me gusta el pan caliente.'),
    w('pie', 1, 'Me duele el pie.'),
    w('flor', 1, 'La flor es bonita.'),
    w('gato', 1, 'El gato duerme.'),
    w('mar', 1, 'El mar es azul.'),
    w('pez', 1, 'El pez vive en el agua.'),
    w('uva', 1, 'La uva es dulce.'),
    w('ojo', 1, 'Cierra un ojo.'),
    w('dado', 1, 'Tira el dado.'),
    w('dedo', 1, 'Señala con el dedo.'),
    w('lobo', 1, 'El lobo aúlla.'),
    w('rana', 1, 'La rana salta.'),
    w('vaca', 1, 'La vaca da leche.'),
    w('nube', 1, 'La nube es blanca.'),
    w('rosa', 1, 'La rosa huele bien.'),
    w('sopa', 1, 'La sopa está rica.'),
    w('taza', 1, 'Bebo en una taza.'),
    w('lápiz', 1, 'Escribo con el lápiz.'),
    w('niño', 1, 'El niño juega.'),
    w('boca', 1, 'Abre la boca.'),
    w('cama', 1, 'Duermo en mi cama.'),
    w('foca', 1, 'La foca aplaude.'),
    w('rey', 1, 'El rey tiene corona.'),
    w('tren', 1, 'El tren es veloz.'),
    w('león', 1, 'El león ruge fuerte.'),
    w('pelo', 1, 'Me peino el pelo.'),
    w('vela', 1, 'Enciende la vela.'),
    w('sapo', 1, 'El sapo es verde.'),
    w('mono', 1, 'El mono come plátano.'),
    w('nido', 1, 'El pájaro hace un nido.'),
    w('miel', 1, 'La miel es dulce.'),
    w('codo', 1, 'Me golpeé el codo.'),
    w('toro', 1, 'El toro es fuerte.'),

    // ---------- NIVEL 2 ----------
    w('caballo', 2, 'El caballo corre rápido.', ['ll']),
    w('zapato', 2, 'Me pongo un zapato.'),
    w('ventana', 2, 'Abro la ventana.'),
    w('jirafa', 2, 'La jirafa tiene cuello largo.'),
    w('escuela', 2, 'Voy a la escuela.'),
    w('elefante', 2, 'El elefante es enorme.'),
    w('pelota', 2, 'La pelota es roja.'),
    w('camiseta', 2, 'Llevo una camiseta azul.'),
    w('manzana', 2, 'La manzana es jugosa.'),
    w('cocina', 2, 'Cocino en la cocina.'),
    w('pájaro', 2, 'El pájaro vuela alto.'),
    w('zapatos', 2, 'Limpio mis zapatos.'),
    w('mariposa', 2, 'La mariposa tiene alas.'),
    w('tortuga', 2, 'La tortuga es lenta.'),
    w('cuaderno', 2, 'Escribo en mi cuaderno.'),
    w('plátano', 2, 'El plátano es amarillo.'),
    w('camino', 2, 'Sigo el camino.'),
    w('castillo', 2, 'El castillo es muy alto.', ['ll']),
    w('montaña', 2, 'Subo la montaña.'),
    w('familia', 2, 'Quiero a mi familia.'),
    w('pescado', 2, 'Como pescado fresco.'),
    w('helado', 2, 'El helado está frío.'),
    w('ratón', 2, 'El ratón es pequeño.'),
    w('dinosaurio', 2, 'El dinosaurio es grande.'),
    w('bicicleta', 2, 'Monto en bicicleta.'),
    w('payaso', 2, 'El payaso me hace reír.'),
    w('semilla', 2, 'Planto una semilla.', ['ll']),
    w('caracol', 2, 'El caracol lleva su casa.'),
    w('naranja', 2, 'La naranja es ácida.'),
    w('serpiente', 2, 'La serpiente repta.'),
    w('comida', 2, 'La comida está lista.'),
    w('abuela', 2, 'Mi abuela cocina rico.'),
    w('chocolate', 2, 'Me gusta el chocolate.'),
    w('flores', 2, 'El jardín tiene flores.'),
    w('granja', 2, 'En la granja hay animales.'),

    // ---------- NIVEL 3 (dificultades ortográficas) ----------
    w('llave', 3, 'Abro la puerta con la llave.', ['ll']),
    w('lluvia', 3, 'La lluvia moja la calle.', ['ll']),
    w('gallina', 3, 'La gallina pone huevos.', ['ll']),
    w('estrella', 3, 'La estrella brilla.', ['ll']),
    w('perro', 3, 'El perro mueve la cola.', ['rr']),
    w('carro', 3, 'El carro es veloz.', ['rr']),
    w('gorra', 3, 'Llevo una gorra.', ['rr']),
    w('torre', 3, 'La torre es muy alta.', ['rr']),
    w('guitarra', 3, 'Toco la guitarra.', ['rr', 'gui']),
    w('guerra', 3, 'No me gusta la guerra.', ['rr', 'gue']),
    w('manguera', 3, 'Riego con la manguera.', ['gue']),
    w('juguete', 3, 'Tengo un juguete nuevo.', ['gue']),
    w('hoguera', 3, 'La hoguera da calor.', ['gue']),
    w('águila', 3, 'El águila vuela lejos.', ['gui']),
    w('pingüino', 3, 'El pingüino vive en el hielo.', ['gui']),
    w('cebra', 3, 'La cebra tiene rayas.', ['ce']),
    w('cielo', 3, 'El cielo está despejado.', ['ci']),
    w('cocinero', 3, 'El cocinero hace pan.', ['ci']),
    w('cigüeña', 3, 'La cigüeña trae sorpresas.', ['ci', 'gui']),
    w('cereza', 3, 'La cereza es roja.', ['ce']),
    w('girasol', 3, 'El girasol mira al sol.', ['gi']),
    w('gigante', 3, 'El gigante es enorme.', ['gi', 'ge']),
    w('gente', 3, 'Hay mucha gente.', ['ge']),
    w('magia', 3, 'El mago hace magia.', ['gi']),
    w('colegio', 3, 'Voy al colegio cada día.', ['gi']),
    w('gemelo', 3, 'Tengo un hermano gemelo.', ['ge'])
  ];

  // Mapea nivel -> modo de escritura (decisión: niveles bajos con guía, luego se desvanece, luego libre)
  window.Isla.LEVEL_MODE = { 1: 'guia', 2: 'desvanecido', 3: 'libre' };
})();
