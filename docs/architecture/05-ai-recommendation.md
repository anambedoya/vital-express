# Arquitectura: motor de recomendación

ESTADO: Propuesto — no constituye orientación clínica

## Objetivo

Ordenar móviles candidatas para cada solicitud y mostrar una recomendación explicable al despachador.

## Entradas iniciales

- nivel de urgencia;
- tipo de servicio;
- compatibilidad móvil-servicio;
- ubicación generalizada;
- ubicación de la móvil;
- disponibilidad;
- carga de trabajo activa;
- turno y base;
- tiempo estimado de ruta;
- costo estimado;
- disponibilidad prevista para servicios posteriores.

## Salida

- lista ordenada de candidatas;
- score o probabilidad por candidata;
- variables principales que impulsaron el ranking;
- alertas de incompatibilidad;
- confianza o nivel de incertidumbre si está disponible.

## Modelo

El diseño inicial considera una red neuronal supervisada o un ranking aprendido con datos históricos. La arquitectura exacta se decidirá después de validar calidad y volumen de datos.

## Reglas obligatorias

- una recomendación nunca asigna automáticamente;
- compatibilidad mínima debe resolverse con reglas deterministas antes del modelo;
- el despachador puede aceptar otra opción y debe registrarse el motivo;
- el sistema debe mostrar alternativa y costo/ETA comparables;
- el modelo no sustituye criterios clínicos ni protocolos institucionales.

## Evaluación

- comparación con asignación histórica;
- tiempo de llegada estimado frente a observado;
- costo estimado frente a observado;
- tasa de aceptación por el despachador;
- distribución de carga entre móviles;
- desempeño por urgencia y tipo de servicio;
- detección de sesgo y pruebas por segmentos.

## Despliegue

- entrenamiento fuera de los servicios de despacho;
- registro de versión del modelo;
- datos de inferencia anonimizados;
- mecanismo de degradación a reglas deterministas si el modelo falla;
- actualización o rollback de modelo versionado.
