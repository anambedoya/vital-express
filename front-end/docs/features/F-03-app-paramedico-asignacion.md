# FEAT-03: App móvil de paramédico y asignación activa

ESTADO: Propuesto

## Resumen

Permite a una tripulación ver su asignación activa, avanzar el estado del servicio, consultar la cola, registrar hallazgos y cerrar el servicio desde una app móvil.

## Objetivos

- mostrar disponibilidad y asignación actual;
- permitir avance operativo controlado;
- registrar tiempos relevantes;
- sincronizar cambios con el despacho;
- preservar borradores y eventos ante pérdida de red.

## Fuera de alcance

- asignación autónoma por la app;
- orientación clínica;
- integración con producción institucional;
- datos identificables de pacientes;
- reemplazo del portal React existente.

## Actores

- paramédico o tripulación;
- móvil asignada;
- despachador;
- sistema de sincronización;
- clínica, si se simula recepción.

## Estados

```text
DISPONIBLE
ASIGNADO -> EN_CAMINO -> EN_SITIO -> ATENDIDO_EN_SITIO -> CERRADO
                                  └-> TRASLADO -> EN_CLINICA -> RECEPCION -> HALLAZGOS -> CERRADO
```

## Reglas de negocio

- RB-01: una móvil activa puede tener una asignación principal.
- RB-02: la app muestra la asignación aprobada por el despacho.
- RB-03: no se permite salto operacional de asignado a clínica.
- RB-04: la recepción clínica debe confirmarse antes de cierre por traslado.
- RB-05: atención en sitio permite cerrar sin traslado.
- RB-06: el cierre requiere impresión diagnóstica, desenlace y triage confirmado.
- RB-07: el re-triage se registra aunque no coincida con el triage recibido.
- RB-08: los hallazgos no deben contener nombres, documentos ni direcciones.

## Flujo principal: atención activa

1. la app obtiene la asignación vigente;
2. muestra unidad, nivel, ubicación generalizada y tiempos;
3. la tripulación confirma salida;
4. confirma llegada al sitio;
5. decide traslado o atención en sitio;
6. si hay traslado, confirma llegada y recepción;
7. registra hallazgos y cierre;
8. el servidor actualiza disponibilidad y historial;
9. la app obtiene la siguiente asignación si existe.

## Cola

La app puede consultar:

- Todos;
- Para mi móvil;
- Sin asignar.

La orden visual es urgencia y luego orden de llegada. La app no decide ni modifica asignaciones.

## Contratos de API iniciales

- `GET /v1/mobile/assignments/current`
- `GET /v1/dispatch/queue`
- `POST /v1/mobile/services/{id}/state-transitions`
- `POST /v1/mobile/services/{id}/findings`
- `POST /v1/mobile/services/{id}/close`
- `POST /v1/mobile/location-reports`

Todos los comandos deben incluir:

- identificador de correlación;
- identificador de evento local;
- clave idempotente;
- timestamp del dispositivo;
- versión del contrato.

## Pantallas

### Mi servicio

- servicio activo;
- progreso;
- acciones permitidas;
- aviso de espera en clínica;
- estado vacío disponible.

### Cola

- filtros;
- tiempo en cola;
- nivel;
- asignación;
- urgencia visual accesible.

### Terminados

- resumen del día;
- tiempos;
- hallazgos;
- re-triage;
- observaciones autorizadas.

## Seguridad y privacidad

- autenticación por móvil;
- autorización por unidad y rol;
- ubicación con permisos explícitos;
- cifrado de transporte;
- almacenamiento local cifrado si contiene borradores;
- borrado ante cierre de sesión o según retención;
- auditoría de cambios.

## Métricas

- tiempo desde asignación hasta salida;
- tiempo desde asignación hasta llegada;
- duración total del servicio;
- tasa de re-triage;
- tasa de sincronización fallida;
- eventos offline pendientes;
- acciones rechazadas por transición inválida.

## Criterios de aceptación

- CA-01: se muestra estado disponible sin asignación.
- CA-02: se muestra asignación activa y siguiente paso permitido.
- CA-03: se pueden confirmar estados operativos válidos.
- CA-04: no se puede cerrar desde clínica sin recepción.
- CA-05: se puede atender y cerrar sin traslado.
- CA-06: no se puede cerrar sin los campos mínimos.
- CA-07: el re-triage queda registrado.
- CA-08: los datos aparecen anonimizado y generalizados.
- CA-09: una acción repetida no genera un segundo evento.
- CA-10: los cambios se conservan ante pérdida temporal de red.

## Pruebas

- servicio asignado;
- salida y llegada;
- traslado y recepción;
- atención en sitio;
- re-triage coincidente y divergente;
- campos faltantes;
- transición inválida;
- pérdida de red;
- reconexión;
- doble clic;
- cierre repetido;
- revocación de ubicación;
- push recibido en segundo plano.

## Dependencias

- autenticación;
- API de asignaciones;
- API de estados;
- canal push;
- canal de tiempo real;
- almacenamiento local;
- permisos de ubicación.

## Decisiones pendientes

- React Native/Expo definitivo;
- plataforma iOS/Android;
- autenticación disponible;
- estados exactos institucionales;
- campos clínicos definitivos;
- proveedor push;
- proveedor de ubicación y rutas;
- SLA de sincronización.
