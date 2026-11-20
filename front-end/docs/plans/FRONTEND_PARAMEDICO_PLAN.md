# Plan de implementación: front-end de paramédico

ESTADO: Propuesto — listo para refinamiento en implementación

## 1. Objetivo

Convertir el mockup `vital-express-paramedico.html` en la interfaz de una app móvil real para tripulaciones, alineada con el SDD de Vital Express.

El objetivo inicial no es reemplazar el portal web existente, sino implementar el cliente operativo de paramédicos que consume el back-end y permite actualizar estados de servicio.

## 2. Alcance visual confirmado por el mockup

### Header operacional

- identidad Vital Express;
- unidad móvil, por ejemplo TAM-03;
- base de operación;
- estado disponible/uocupada y asignación activa.

### Navegación principal

- Mi servicio;
- Cola;
- Terminados;
- contador de elementos relevantes en la cola.

### Pantalla Mi servicio

- disponibilidad sin asignación;
- servicio asignado con triage I, II o III;
- tipo de servicio, comuna generalizada e identificador;
- hora de asignación;
- meta de llegada para triage I;
- flujo operacional: asignado, en camino, en sitio, traslado, clínica, recepción y cierre;
- botones de avance de estado.

### Pantalla Cola

- cola priorizada por urgencia y orden de llegada;
- filtros: Todos, Para mi móvil y Sin asignar;
- identificador, nivel, tipo, ubicación generalizada y tiempo en cola;
- lectura según restricciones: el despacho decide la asignación.

### Pantalla Terminados

- servicios cerrados en el día;
- tiempos de llegada y duración total;
- traslado o atención en sitio;
- impresión diagnóstica, procedimiento, desenlace y re-triage;
- hallazgos clínicos operativos, sin datos identificables.

### Hallazgos del servicio

- signos vitales opcionales;
- impresión diagnóstica;
- procedimientos realizados;
- desenlace;
- triage confirmado en el sitio;
- observaciones limitadas y mensajes de privacidad.

## 3. Decisión tecnológica de front-end

Usar React Native con Expo como implementación móvil, reutilizando patrones React y permitiendo integración futura con componentes React del web.

Razones:

- coincide con la tecnología React propuesta;
- permite iOS y Android con una base compartida;
- facilita actualizaciones OTA durante el prototipo;
- separa la UI de la lógica del back-end;
- permite notificaciones push y ubicación nativa.

Alternativa descartada para el alcance inicial: ejecutar el HTML como WebView. No provee una base suficientemente robusta para permisos, notificaciones, ubicación, reconexión ni distribución móvil.

## 4. Arquitectura frontend

```text
app/
  app/                    # rutas y navegación
  components/
    header/
    navigation/
    service/
    queue/
    history/
    findings/
    common/
  features/
    auth/
    assignment/
    service-flow/
    queue/
    history/
    location/
  services/
    api/
    realtime/
    push/
    location/
    storage/
  store/
  types/
  utils/
  theme/
```

### Responsabilidades

- `app`: navegación y composición de pantallas.
- `components`: componentes presentacionales y accesibles.
- `features`: casos de uso por dominio.
- `services`: API, ubicación, push y persistencia.
- `store`: estado operacional de sesión y sincronización.
- `theme`: colores, tipografía, espaciado y componentes visuales.

## 5. Estado global mínimo

### Sesión

- usuario autenticado;
- unidad asignada;
- base;
- rol;
- token y expiración.

### Asignación activa

- solicitud;
- nivel de triage;
- estado;
- timestamps;
- destino;
- indicadores de recepción clínica.

### Cola

- solicitudes priorizadas;
- filtros;
- tiempo de espera calculado;
- asignación por móvil.

### Sincronización

- estado de conexión;
- eventos pendientes;
- última sincronización;
- versiones locales y servidor;
- errores recuperables.

## 6. Navegación

Usar navegación por pestañas:

- `Mi servicio`;
- `Cola`;
- `Terminados`.

Usar rutas adicionales para:

- autenticación;
- permisos de ubicación;
- detalle de hallazgos;
- pantalla offline;
- confirmación de acciones críticas.

En móvil se debe conservar el estado al cambiar de pestaña, sin recargar datos innecesariamente.

## 7. Máquina de estados

```text
ASIGNADO
  -> EN_CAMINO
  -> EN_SITIO
  -> TRASLADO
  -> EN_CLINICA
  -> PACIENTE_RECIBIDO
  -> HALLAZGOS
  -> CERRADO

EN_SITIO
  -> HALLAZGOS
  -> CERRADO
```

La app debe validar transiciones disponibles y permitir una degradación controlada si la red o el servidor no responde.

### Reglas UI

- no permitir cerrar desde clínica antes de confirmar recepción;
- mostrar reloj de espera en clínica;
- habilitar cierre por atención en sitio sin traslado;
- conservar borradores de hallazgos;
- mostrar re-triage comparado con el nivel recibido;
- impedir envío sin impresión diagnóstica, desenlace y triage confirmado.

## 8. Integración propuesta con API

Los contratos exactos se definirán en OpenAPI.

Recursos iniciales:

- `POST /v1/mobile/auth/refresh`;
- `GET /v1/mobile/session`;
- `GET /v1/mobile/assignments/current`;
- `GET /v1/dispatch/queue`;
- `POST /v1/mobile/location-reports`;
- `POST /v1/mobile/assignments/{id}/accept`;
- `POST /v1/mobile/assignments/{id}/reject`;
- `POST /v1/mobile/services/{id}/state-transitions`;
- `POST /v1/mobile/services/{id}/findings`;
- `POST /v1/mobile/services/{id}/close`;
- `GET /v1/mobile/services/history`.

El cliente debe usar idempotency keys en cambios de estado y cierre.

## 9. Tiempo real y ubicación

### Tiempo real

Opciones iniciales:

- push notification para nueva asignación;
- canal WebSocket/SSE para cambios de servicio y cola;
- polling de respaldo con intervalo limitado.

El modelo final se debe validar con back-end y portal existente.

### Ubicación

- solicitar permiso en contexto y explicar el uso operativo;
- transmitir reportes sólo mientras el usuario o unidad está activa;
- usar precisión mínima suficiente para despacho;
- guardar eventos pendientes si no hay conexión;
- mostrar la última actualización y no inventar una posición actual;
- permitir revocar permisos y comunicar limitaciones.

## 10. Offline

La app debe soportar:

- cola local de cambios de estado;
- borrador local de hallazgos;
- visualización del último estado conocido;
- reconcilicación por correlación de eventos;
- indicadores de sincronización pendiente;
- evitar duplicados mediante IDs y claves idempotentes.

No se debe presentar la app como operativa con datos completos si no existe confirmación reciente del servidor.

## 11. Accesibilidad y UX móvil

- objetivos táctiles de al menos 44 px;
- contraste suficiente;
- navegación compatible con lector de pantalla;
- etiquetas claras para todas las acciones;
- botones críticos separados visualmente;
- formularios con validación visible;
- estados de carga, éxito, error y offline;
- orientación vertical prioritaria;
- evitar depender sólo de color para triage o estado.

## 12. Diseño visual basado en el mockup

Extraer y formalizar:

- paleta y contraste;
- tipografía;
- tarjetas;
- chips de estado;
- indicadores I/II/III;
- elementos de cola;
- barra inferior de navegación;
- estados vacíos;
- alertas y toast;
- cronología de avance.

El prototipo HTML puede usarse como referencia visual, no como fuente de lógica ni contratos.

## 13. Fases de implementación

### Fase 1: base de app

- configurar Expo/React Native;
- navegación por pestañas;
- tema y componentes base;
- variables de entorno;
- mock service de API;
- tipos de dominio;
- pruebas unitarias iniciales.

Entregable: shell navegable con pantallas y datos mock.

### Fase 2: servicio activo

- sesión y unidad;
- obtener asignación actual;
- flujo de estados;
- confirmaciones de acciones;
- sincronización con API;
- pantallas de carga y error.

Entregable: un servicio completo desde asignado hasta cierre.

### Fase 3: cola e historial

- cola priorizada;
- filtros;
- conteo y estado;
- historial cerrado;
- resumen de tiempos y hallazgos.

Entregable: operatividad completa de consulta.

### Fase 4: ubicación y tiempo real

- permisos de ubicación;
- reportes periódicos;
- push notifications;
- eventos en tiempo real;
- polling de respaldo.

Entregable: sincronización móvil con despacho.

### Fase 5: hallazgos y cierre

- formulario completo;
- validaciones;
- borrador;
- re-triage;
- idempotencia de cierre;
- auditoría.

Entregable: cierre operativo auditable.

### Fase 6: offline y robustez

- persistencia local;
- cola de eventos;
- reconcilicación;
- pruebas de interrupciones;
- observabilidad.

Entregable: app tolerante a conectividad limitada.

### Fase 7: calidad y preparación

- pruebas E2E;
- seguridad;
- accesibilidad;
- perfiles de batería;
- CI/CD;
- builds internos;
- documentación de distribución.

Entregable: build candidato para pruebas internas.

## 14. Datos de prueba

El prototipo HTML puede proporcionar fixtures sintéticas para:

- unidad TAM-03;
- servicio asignado;
- cola con niveles I, II y III;
- estados de progreso;
- clínica y recepción;
- hallazgos sin datos personales;
- historial cerrado;
- llegada de servicios simulada.

## 15. Criterios de aceptación globales

- CA-01: la app muestra el servicio asignado y su estado actual.
- CA-02: la tripulación puede avanzar estados permitidos.
- CA-03: no puede cerrar un servicio en clínica antes de recepción.
- CA-04: puede finalizar atención en sitio sin traslado.
- CA-05: la cola muestra nivel, tiempo y asignación general.
- CA-06: el formulario exige campos mínimos definidos.
- CA-07: el re-triage queda registrado y comparado.
- CA-08: la app conserva borradores y eventos ante pérdida de red.
- CA-09: no aparecen nombres, documentos ni direcciones exactas.
- CA-10: todas las acciones críticas tienen confirmación, loading y error.

## 16. Riesgos

- diferencias con el portal React existente;
- permisos de ubicación en iOS/Android;
- consumo de batería;
- pérdida de eventos durante reconexión;
- uso de datos clínicos fuera del alcance;
- complejidad de estados institucionales no definidos;
- conflicto entre una asignación y disponibilidad local.

## 17. Próxima decisión necesaria

Antes de iniciar código, confirmar:

1. Expo/React Native o Flutter;
2. autenticación disponible;
3. contratos API del portal;
4. proveedor de notificaciones;
5. frecuencia de ubicación;
6. estados oficiales del flujo institucional;
7. campos clínicos permitidos;
8. reglas exactas de validación del cierre.
