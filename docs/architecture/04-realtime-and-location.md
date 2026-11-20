# Arquitectura: tiempo real y ubicación

ESTADO: Propuesto

## Objetivo

Mantener sincronizados mapa, cola, estado de móviles y asignaciones en el portal y la app móvil.

## Flujos

### Ubicación

1. La app obtiene la ubicación autorizada del dispositivo.
2. La app aplica una política de frecuencia y precisión.
3. El back-end valida zona, edad y motivo del reporte.
4. La ubicación se persiste como evento y se actualiza en caché.
5. El portal recibe un evento de actualización.

### Cambio de estado

1. Tripulación o despachador emite un cambio.
2. El back-end valida transición permitida.
3. Se registra evento inmutable.
4. Se actualizan agregados operativos.
5. Se publica evento a clientes interesados.

## Estrategia propuesta

- WebSocket o SSE para el portal web.
- push notifications para asignaciones móviles.
- polling de respaldo si la conexión es inestable.
- cola interna o broker en caso de escala.

## Política móvil

- reintentos locales ante pérdida de conexión;
- cola offline temporal para eventos;
- resolución de conflictos con identificador de evento;
- manejo explícito de permisos de ubicación;
- minimización de precisión según el producto y el usuario.

## Mapa

- las ubicaciones pueden estar generalizadas para solicitudes;
- la vista del despachador puede mostrar una posición más precisa de móviles según autorización;
- no se almacenan direcciones exactas en el prototipo.
