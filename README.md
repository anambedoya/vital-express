# Vital Express

Sistema cloud para apoyar el despacho inteligente de móviles y servicios médicos. La app móvil es el núcleo operativo de las tripulaciones; el portal web existente usado por el despachador se integra como vista externa de control.

## Estructura del proyecto

- `back-end/`: API Python y lógica central, incluyendo prioridad, asignación e IA
- `front-end/`: referencia de clientes web React; el portal operativo seguirá siendo la página existente
- `docs/`: SDD, arquitectura, feature specifications y decisiones técnicas

## Arquitectura principal

- App móvil: operaciones de disponibilidad, ubicación, asignación y estado del servicio
- Portal React existente: mapa, cola, cronograma y confirmación humana por el despachador
- Back-end FastAPI: fuente central de verdad, prioridad, recomendaciones y eventos
- IA: modelo auxiliar para ranking de móviles; no reemplaza la decisión del despachador

## Documentación

- Índice técnico: `docs/README.md`
- Documento de diseño: `docs/SDD.md`
- Contexto empresarial: `docs/sources/empresa-vitalexpress.md`
- Arquitectura: `docs/architecture/`
- Features: `docs/features/`
- Decisiones: `docs/adr/`

## Restricciones iniciales

El prototipo utiliza datos simulados o anonimizados y no integra ambientes institucionales de producción. No se deben incorporar datos reales de afiliados, historia clínica ni direcciones exactas.

## Próximos pasos

- Validar contratos del portal web existente
- Definir la plataforma móvil
- Documentar las features críticas
- Formalizar reglas de urgencia y compatibilidad móvil-servicio
- Entrenar y evaluar el modelo con datos validados por la empresa
