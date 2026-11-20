# Documentación del front-end

Documentación específica del cliente móvil de paramédicos.

## Índice

- [Plan de implementación](plans/FRONTEND_PARAMEDICO_PLAN.md)
- [Feature: app móvil y asignación](features/F-03-app-paramedico-asignacion.md)
- [Arquitectura móvil](architecture/08-mobile-architecture.md)
- [ADR-002: React Native](adr/002-front-end-movil-paramedico.md)

## Alcance compartido

Las decisiones generales permanecen en la documentación exterior:

- `../../docs/SDD.md`
- `../../docs/architecture/02-domain-model.md`
- `../../docs/architecture/03-api-and-integration.md`
- `../../docs/architecture/04-realtime-and-location.md`
- `../../docs/architecture/06-security-and-privacy.md`

La app móvil no decide asignaciones ni prioridad global. Consume contratos, estados y eventos definidos por el back-end y documentados en el SDD compartido.
