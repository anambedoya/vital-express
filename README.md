# Vital Express

Sistema de centro de control y monitoreo para móviles y solicitudes de usuarios, con un mapa interactivo en tiempo real, priorización de servicios y recomendación asistida por IA para la asignación de ambulancias.

## Estructura del proyecto

- `front-end/`: aplicación React para la interfaz del sistema
- `back-end/`: API en Python con servicios de IA y lógica de negocio
- `docs/SDD.md`: documento de diseño de software (SDD)

## Visión general

El sistema centraliza la operación de servicios médicos de emergencia, mostrando en tiempo real la ubicación de móviles, el estado de cada solicitud y los tiempos relevantes para la toma de decisiones. La prioridad de cada servicio se gestiona mediante una cola reordenada por urgencia, y la recomendación de asignación se apoya en un modelo de redes neuronales entrenado con datos de la empresa prestadora de servicios médicos.

## Siguientes pasos

- Definir requisitos detallados de negocio
- Formalizar procesos de priorización y despacho
- Entrenar y validar el modelo de IA
- Conectar front-end y back-end con APIs y eventos en tiempo real
