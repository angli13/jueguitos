# 🏝️ La Isla de las Palabras

Juego educativo de **escritura manual y ortografía** para niños de 5 a 7 años.

El niño escucha una palabra, la escribe con el dedo o un lápiz digital, recibe
retroalimentación inmediata y siempre positiva, y con cada acierto **construye su propia
isla**. Sesiones cortas de 5–10 minutos pensadas para volver cada día.

## Cómo jugar

Abre **`index.html`** en cualquier navegador moderno (doble clic, no necesita servidor ni
conexión a Internet).

> 💡 Para escuchar las palabras, activa el sonido del dispositivo. La voz usa el sintetizador
> del navegador (Web Speech API); en español funciona en Chrome, Edge, Safari y la mayoría de
> navegadores móviles.

1. Pulsa **¡Jugar!**
2. Escucha la palabra (puedes repetirla con 🔊).
3. Escríbela en el recuadro con el dedo o el lápiz.
4. Pulsa **¡Listo!** para recibir tu recompensa y ver crecer la isla.

## Cómo funciona el aprendizaje

- **Escritura por niveles** (la dificultad de escritura sube con la de la palabra):
  - **Nivel 1 — Guía:** las letras aparecen como guía y el niño las traza.
  - **Nivel 2 — Desvanecido:** la guía es tenue y se desvanece al empezar a escribir.
  - **Nivel 3 — Libre:** sin guía; solo puntos que indican cuántas letras tiene la palabra.
- **Retroalimentación positiva:** nunca se muestra "Incorrecto". Siempre se anima y se da una
  pista útil ("Solo falta una letra", "¡Casi lo logras!").
- **Sistema adaptativo + repetición espaciada:** cada palabra guarda aciertos, errores y nivel
  de dominio. Las difíciles vuelven antes; las dominadas se espacian (10 min → 1 → 3 → 7 → 15 →
  30 días). El nivel se desbloquea de forma gradual.
- **Progreso visible y permanente:** cada acierto construye una pieza de la isla (árboles,
  casas, puente, molino, animales…).

## Panel para papás

Desde la pantalla de inicio → **Para papás** (protegido por una pequeña suma). Muestra tiempo
jugado, racha de días, palabras aprendidas, palabras difíciles, precisión y progreso general.

## Arquitectura

```
index.html        Pantallas y orden de carga de scripts
style.css         Estilos (botones grandes, colores vivos)
data/words.js     ~100 palabras en 3 niveles (como objeto JS, no JSON)
src/
  storage.js      Persistencia (localStorage + fallback en memoria)
  audio.js        Voz aislada (SpeechSynthesis; sustituible por audio pregrabado)
  feedback.js     Mensajes positivos por tipo de resultado
  scheduler.js    Adaptación + repetición espaciada
  canvas.js       Lienzo de escritura y máscara de cobertura por letra
  evaluator.js    Métricas del trazo -> resultado pedagógico (umbrales indulgentes)
  world.js        Isla SVG que se construye con cada acierto
  rewards.js      Confetti y cartel de "pieza nueva"
  dashboard.js    Estadísticas del panel de padres
  ui.js           Cambios de pantalla y render de paneles
  main.js         Bucle de juego, racha diaria y cableado de botones
```

### Decisiones técnicas

- **Scripts clásicos (sin ES-modules):** cada archivo adjunta su API al espacio de nombres
  global `window.Isla`. Así el juego funciona al abrir `index.html` con `file://` (los módulos
  ES se bloquearían por CORS).
- **Datos en `.js`, no en `.json`:** `fetch` de archivos locales también se bloquea en
  `file://`, por eso las palabras viven en `data/words.js`.
- **Persistencia tolerante a fallos:** `localStorage` con copia en memoria por si el navegador
  restringe el almacenamiento en `file://`.
- **Pensado para móvil:** Pointer Events (dedo / stylus / Apple Pencil), diseño a pantalla
  completa y arquitectura lista para empaquetar en un WebView.

## Fuera del MVP

Multijugador, tienda, anuncios, compras, cuentas, nube, backend, IA generativa, chat, editor de
niveles, múltiples mundos y logros complejos. (Ver roadmap del proyecto.)

## Notas de la evaluación del trazo

El reconocimiento se basa en **cobertura por letra** sobre la forma objetivo, con umbrales
deliberadamente **indulgentes** (principio "nunca castigar"). El modo libre es el más tolerante.
Es una aproximación pensada para validar el bucle de juego; un reconocimiento de escritura más
preciso queda para versiones futuras.
