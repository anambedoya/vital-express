# Back-end

API central de Vital Express desarrollada en Python. Es responsable de gestionar solicitudes, móviles, asignaciones, prioridades, eventos y recomendaciones de IA.

## Clientes principales

- **App móvil**: núcleo operativo de la tripulación. Reporta ubicación y cambios de estado, recibe asignaciones y confirma aceptación o rechazo.
- **Portal React existente**: vista del despachador, integrada mediante contratos REST y eventos en tiempo real.

El back-end debe ser la fuente central de verdad y evitar duplicar reglas de prioridad o asignación en cualquiera de los clientes.

## Objetivos

- Gestionar solicitudes y asignaciones
- Priorizar servicios usando urgencia y reglas de compatibilidad
- Recomendar móviles apoyado por redes neuronales
- Mantener estados sincronizados con app móvil y portal
- Exponer métricas de respuesta, costo y carga
- Registrar auditoría de recomendaciones y decisiones humanas

## Stack propuesto

- Python
- FastAPI
- Pydantic
- SQLAlchemy / Alembic
- Redis para caché y estado frecuente
- WebSockets o SSE
- Pandas / NumPy
- TensorFlow o PyTorch
- Scikit-learn

## Estructura base propuesta

```text
back-end/
  app/
    ai/
    api/
    core/
    db/
    models/
    schemas/
    services/
    utils/
```

## Capacidades principales

- API REST versionada
- ingesta y validación de ubicación
- gestión de estados de móvil y solicitud
- cola priorizada por urgencia
- ranking de candidatos compatibles
- comparación de tiempo estimado y costo
- confirmación humana desde el portal
- eventos para sincronización móvil y web
- auditoría de asignaciones y cambios de modelo

## Enfoque de IA

El modelo recomienda un ranking de móviles disponibles según:

- nivel de urgencia y tipo de servicio
- compatibilidad determinista móvil-servicio
- ubicación generalizada
- carga de trabajo
- tiempo estimado de ruta
- costo estimado
- disponibilidad futura

La recomendación no debe asignar automáticamente. El despachador confirma la decisión y el sistema registra la versión del modelo y diferencias respecto a la recomendación.

## Integración

El back-end debe publicar contratos independientes de la implementación del portal React existente. Antes de implementar, se requiere documentación de autenticación, rutas API disponibles, eventos y formatos de datos del portal actual.

## Seguridad y datos

- no usar datos identificables de afiliados en el prototipo
- separar datos sintéticos de datos reales
- validar permisos por rol y recurso
- cifrar comunicaciones
- mantener secretos fuera del repositorio

## Documentación relacionada

- `docs/architecture/01-context-and-containers.md`
- `docs/architecture/03-api-and-integration.md`
- `docs/architecture/05-ai-recommendation.md`
- `docs/features/`
