# Back-end

API y lógica de negocio de Vital Express desarrollada en Python.

## Objetivo

- Gestionar solicitudes y asignaciones
- Priorizar servicios usando una cola por urgencia
- Ejecutar recomendaciones de asignación apoyadas por IA
- Exponer endpoints para el consumo del front-end

## Stack sugerido

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Pandas / NumPy
- TensorFlow / PyTorch / Scikit-learn

## Estructura base

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

## Enfoque de IA

Se planea construir un modelo de redes neuronales para recomendar la mejor móvil disponible según:

- categoría del caso
- ubicación geográfica
- carga de trabajo
- tiempo de ruta
- disponibilidad del recurso

## Siguiente paso

Definir los modelos, el dataset base y la API inicial para pruebas de integración.
