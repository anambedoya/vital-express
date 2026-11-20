# Arquitectura: APIs e integración

ESTADO: Propuesto

## Estilo

REST versionado sobre HTTP y eventos en tiempo real para cambios de estado.

## Clientes

- app móvil;
- portal web React existente;
- servicios internos de recomendación;
- integración simulada con datos de prueba.

## Dominio de recursos

```text
/v1/requests
/v1/units
/v1/assignments
/v1/routes
/v1/recommendations
/v1/dispatch/metrics
/v1/events
```

## Contratos mínimos

### Solicitud

- crear solicitud;
- consultar estado;
- consultar cola priorizada;
- cancelar o reasignar.

### Móvil

- actualizar disponibilidad;
- actualizar ubicación;
- consultar estado;
- consultar carga activa.

### Asignación

- calcular recomendación;
- confirmar asignación;
- aceptar, rechazar o reasignar desde app;
- consultar justificación y score.

## Integración con el portal existente

El contrato debe publicarse y convertirse en un adaptador independiente. El portal React no debe depender directamente de modelos, eventos internos ni estructuras de la base de datos.

Posibles adaptadores:

- API REST para estado inicial;
- WebSocket o SSE para cambios;
- webhook para integración externa simulada;
- BFF si el portal necesita datos agregados no compatibles con APIs generales.

## Principios de integración

- idempotencia en comandos de asignación;
- correlation ID en solicitudes y eventos;
- versionado para cambios incompatibles;
- tolerancia a reintentos;
- auditoría antes y después de confirmar;
- nunca usar el score de IA como decisión automática.

## Seguridad de integración

- autenticación fuerte para clientes;
- tokens separados por rol y tipo de cliente;
- autorización por solicitud y móvil;
- firma o verificación de webhooks;
- límites de frecuencia;
- secretos fuera del repositorio.
