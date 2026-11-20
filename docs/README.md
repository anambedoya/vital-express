# Documentación técnica de Vital Express

Esta carpeta contiene la especificación arquitectónica y los documentos de diseño del sistema.

## Índice

- [Software Design Document](SDD.md)
- [Arquitectura y contexto](architecture/01-context-and-containers.md)
- [Modelo de dominio](architecture/02-domain-model.md)
- [Diseño de APIs e integración](architecture/03-api-and-integration.md)
- [Tiempo real y ubicación](architecture/04-realtime-and-location.md)
- [Motor de IA](architecture/05-ai-recommendation.md)
- [Seguridad y privacidad](architecture/06-security-and-privacy.md)
- [Requisitos no funcionales](architecture/07-non-functional-requirements.md)
- [Feature Specifications](features/README.md)
- [Architecture Decision Records](adr/README.md)
- [Resumen del reto empresarial](sources/empresa-vitalexpress.md)

## Documentación compartida

- `docs/` contiene SDD, arquitectura cross-cutting, modelo de dominio, integración, seguridad y datos compartidos.

## Documentación específica del front-end

- [Índice técnico de front-end móvil](../front-end/docs/README.md)
- [Plan frontend paramédico](../front-end/docs/plans/FRONTEND_PARAMEDICO_PLAN.md)
- [Arquitectura móvil](../front-end/docs/architecture/08-mobile-architecture.md)

## Convenciones

- Los documentos con `ESTADO: Propuesto` describen decisiones pendientes de validar.
- Las restricciones conocidas se distinguen de supuestos todavía por confirmar.
- Ningún documento puede publicar datos reales, personales, operadores, costos o pacientes.
- La app móvil es el núcleo operativo; la página web existente actúa como vista administrativa de despacho.
