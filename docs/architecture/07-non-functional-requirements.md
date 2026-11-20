# Requisitos no funcionales

ESTADO: Propuesto — metas sujetas a validación

## RNF-01 Disponibilidad

El prototipo debe contar con health checks y recuperación ante reinicios. Las metas de producción deben acordarse antes de operar 24/7.

## RNF-02 Latencia

- actualización de estado visible sin demora operativa importante;
- recomendación disponible con tiempo definido por la experiencia del usuario;
- ubicación debe reflejar fecha y edad para evitar datos obsoletos;
- las metas numéricas exactas deben validarse con escenarios reales.

## RNF-03 Escalabilidad

Debe soportar crecimiento horizontal del API y de consumidores de eventos. La carga inicial estimada no se conoce: se requiere promedio diario real y horarios pico.

## RNF-04 Offline móvil

La app debe conservar eventos críticos mientras no exista conexión y volver a sincronizarlos sin duplicar cambios.

## RNF-05 Observabilidad

- logs estructurados;
- trazas correlacionadas;
- métricas de API y eventos;
- monitoreo de cola y recomendación;
- alertas ante degradación.

## RNF-06 Respaldo y recuperación

- copias de seguridad;
- política de retención;
- pruebas de restauración;
- estrategia de recuperación ante indisponibilidad del canal de tiempo real.

## RNF-07 Seguridad

- MFA o autenticación delegada, si está disponible;
- autorización por rol;
- validación estricta de entrada;
- protección contra abuso de ubicación y estados;
- gestión segura de secretos.

## RNF-08 Compatibilidad

El portal existente y la app móvil deben consumir contratos versionados sin conocer detalles internos del back-end.
