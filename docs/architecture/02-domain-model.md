# Arquitectura: modelo de dominio

ESTADO: Propuesto

## Entidades principales

### Solicitud

Representa una necesidad de servicio ya clasificada.

Campos conceptuales:

- identificador
- tipo de servicio
- nivel de urgencia
- ubicación generalizada
- estado
- fecha de solicitud
- fecha objetivo o de tiempo límite
- móvil asignada
- motivo de rechazo o reasignación

### Móvil

Representa una unidad ambulancia, médico domiciliario u otro recurso operativo.

Campos conceptuales:

- identificador anonimizado
- categoría o tipo de unidad
- capacidad
- base de origen
- turno
- disponibilidad
- ubicación actual
- carga de trabajo activa
- estado operativo
- costo estimado por distancia o tiempo

### Asignación

Registra la relación entre solicitud y móvil.

Campos conceptuales:

- solicitud
- móvil candidata o seleccionada
- recomendación generada
- score o explicación
- despachador que confirmó
- decisión final
- fecha de decisión
- motivo si difiere de la recomendación

### Evento operativo

Registro inmutable de cambios relevantes.

Ejemplos:

- solicitud creada
- prioridad recalculada
- ubicación recibida
- móvil asignada
- asignación aceptada
- móvil en tránsito
- móvil llegó
- servicio iniciado
- servicio cerrado

### Ruta estimada

Resultado de cálculo geográfico usado por recomendación y planificación.

Campos conceptuales:

- origen
- destino generalizado
- distancia
- duración estimada
- proveedor usado
- fecha de cálculo

## Estados principales

### Solicitud

```text
RECIBIDA -> PRIORIZADA -> RECOMENDADA -> ASIGNADA -> EN_ATENCION -> CERRADA
                     └──────────────> CANCELADA
                                      └> REASIGNADA
```

### Móvil

```text
DISPONIBLE <-> ASIGNADA -> EN_TRASLADO -> EN_ATENCION -> DISPONIBLE
       └──────> FUERA_DE_SERVICIO
```

Los estados exactos deben ajustarse según reglas del sistema institucional.

## Invariantes

- Una solicitud activa no debe quedar asignada a dos móviles simultáneamente.
- Una móvil no debe aceptar dos asignaciones simultáneas salvo regla operacional explícita.
- Todo cambio operativo produce un evento auditable.
- Una ubicación almacenada debe incluir precisión o zona generalizada y fecha de medición.
- La confirmación humana siempre prevalece sobre una recomendación automática.
