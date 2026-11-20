# ADR-001: Arquitectura cloud con app móvil, portal existente y back-end Python

Estado: Propuesto

## Contexto

La solución requiere coordinar operaciones de despacho y tripulaciones en tiempo real. El portal web de despacho ya existe y no puede ser reemplazado inicialmente. La app móvil será la principal interfaz usada por las tripulaciones. El núcleo de lógica y IA se implementará en Python.

## Decisión

Construir una plataforma con:

- app móvil como cliente operativo principal;
- portal React existente como cliente del despachador sin implementación duplicada de reglas;
- API Python/FastAPI como punto central de lógica de negocio;
- persistencia transaccional central;
- canal de eventos para tiempo real;
- modelo de recomendación desplegado como servicio interno.

## Alternativas consideradas

### Integrar toda la lógica en el portal React existente

Rechazada: duplica reglas, expone lógica sensible y dificulta el uso de la app móvil.

### Construir dos back-ends independientes

Rechazada: fragmenta estados, prioridades, auditoría y contratos.

### Iniciar una integración directa con producción

Rechazada para el prototipo: el alcance utiliza simulación independiente y datos anonimizados.

## Consecuencias positivas

- fuente central de verdad;
- misma lógica para app móvil y portal;
- auditoría única;
- escalabilidad independiente de clientes;
- recomendación desacoplada de interfaces.

## Consecuencias negativas

- requiere definir contratos de integración;
- existe complejidad adicional de sincronización y tiempo real;
- la app móvil debe manejar conectividad limitada.

## Revisión pendiente

- framework móvil definitivo;
- mecanismo de autenticación compartido;
- tecnología de tiempo real;
- forma de integración con el portal existente;
- alcance de integración con el sistema institucional.
