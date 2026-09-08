# Preguntados local

Juego de preguntas y respuestas tipo Preguntados / Trivial Pursuit, para jugar **en modo local** (varios jugadores por turnos, en el mismo dispositivo y navegador). Sin cuentas, sin internet y sin backend: todo corre en el cliente.

## Cómo se juega

- Entre 2 y 6 jugadores, cada uno con su nombre, avatar y color.
- El tablero es un circuito circular de casillas de seis categorías: Geografía, Entretenimiento, Historia, Arte y Literatura, Ciencia y Naturaleza, y Deportes y Ocio.
- En tu turno tiras el dado, avanzas y respondes una pregunta (con 20 segundos de tiempo) de la categoría de la casilla donde caigas.
- Si aciertas, vuelves a tirar; si fallas o se acaba el tiempo, pasa el turno al siguiente jugador.
- Las casillas marcadas con 🧀 son "quesito": si aciertas la pregunta ahí, ganas el quesito de esa categoría.
- Gana quien consiga los 6 quesitos primero.

## Cómo está construido

React + TypeScript + Vite, Tailwind CSS para estilos, y `vite-plugin-pwa` para poder instalarla como app. El tablero se dibuja en SVG y el banco de 180 preguntas (30 por categoría) vive en `src/data/questions.ts`.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
npm run lint      # oxlint
```
