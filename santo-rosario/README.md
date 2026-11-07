# ✝ Sanctum Rosarium

App web para rezar el **Santo Rosario por el método tradicional latín–castellano**,
basada en el folleto *Sanctum Rosarium*.

## Qué hace

- **Sugiere los misterios del día** según el día de la semana (como indica el folleto):
  - Gozosos — lunes y jueves (*in feria secunda et in feria quinta*)
  - Dolorosos — martes y viernes (*in feria tertia et in feria sexta*)
  - Gloriosos — domingo, miércoles y sábado (*in Dominica, in feria quarta et in sabbato*)

  Siempre se puede elegir otro grupo de misterios.
- **Idioma**: Español, Latín o Ambos (latín y castellano lado a lado, como en el folleto).
  Se puede cambiar en cualquier momento durante el rezo.
- Guía paso a paso todo el rosario: oraciones iniciales, los 5 misterios
  (Padre Nuestro, 10 Ave Marías con cuentas visuales, Gloria y jaculatorias),
  las cuatro Ave Sanctíssima y la Salve, Letanía Lauretana, antífonas, oración
  final, por el Papa, por los difuntos, preces finales y el *Memorare*.
- Intención particular opcional, que se inserta en el Ofrecimiento.
- Índice para saltar a cualquier parte, tamaño de letra ajustable y tema claro/oscuro.
- Recuerda por dónde ibas (durante 12 h) y mantiene la pantalla encendida mientras rezas.
- Navegación con botones, deslizando el dedo, tocando el texto del Ave María o con el teclado (← →, espacio).
- Funciona sin conexión y se puede instalar en el móvil («Añadir a pantalla de inicio»).

## Estructura

```
santo-rosario/
├── index.html
├── style.css
├── manifest.webmanifest   # instalación como app
├── sw.js                  # caché offline
├── data/oraciones.js      # todos los textos (latín y castellano)
├── src/app.js             # lógica
└── assets/                # iconos y fuentes (EB Garamond, UnifrakturMaguntia — OFL)
```

Los textos están en `data/oraciones.js`. El nombre del Papa para la oración
*pro Pontifice* (en el folleto, «N.») está en la constante `PONTIFEX`.
Si se modifica algún archivo, conviene subir la versión de `CACHE` en `sw.js`.
