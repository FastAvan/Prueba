# ResiMadrid

App web (PWA) para estudiantes de residencias universitarias en Madrid.

## Funciones

- **Mapa**: puntos de interés (residencia, metro, supermercados, ocio...) sobre un mapa de Madrid, con posibilidad de añadir marcadores propios tocando el mapa.
- **Lavandería / cocina**: temporizadores por máquina (lavadoras, secadoras, horno) con aviso por notificación del navegador al terminar.
- **Menú semanal**: editor del menú de la residencia por día/comida, con selección personal de "voy a comer esto" y un botón para compartir/pegar el menú entre dispositivos.
- **Reservas**: calendario por franjas horarias para salas comunes y sala de cine.
- **Ajustes**: configuración de la residencia, gestión de máquinas/salas, y exportación/importación de todos los datos.

## Cómo está construido

React + TypeScript + Vite, Tailwind CSS para estilos, `react-leaflet`/OpenStreetMap para el mapa, y `vite-plugin-pwa` para que la app sea instalable en el móvil.

## Importante: no hay backend

Todos los datos (reservas, menú, lavadoras en marcha, puntos del mapa) se guardan solo en `localStorage`, en el navegador de cada persona. Esto significa que **las reservas y el menú no se sincronizan automáticamente entre estudiantes**: si dos personas reservan la misma sala desde dos móviles distintos, la app no lo detecta.

Para mitigarlo hay una función de exportar/importar datos en JSON (pantalla Ajustes) y un "compartir menú" por copiar/pegar (pantalla Menú), pero son soluciones manuales. Si más adelante se quiere que las reservas sean realmente compartidas en tiempo real entre todos los residentes, hace falta añadir un backend (por ejemplo Supabase: Postgres + tiempo real + autenticación).

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```
