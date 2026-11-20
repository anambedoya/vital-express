# Front-end

Aplicación React para la interfaz operativa de Vital Express.

## Objetivo

- Mostrar el mapa interactivo con móviles y solicitudes
- Exponer paneles de control para despachadores y supervisores
- Permitir la confirmación de asignaciones
- Presentar métricas de tiempo de respuesta y costo del servicio

## Stack sugerido

- React
- Vite
- TypeScript (opcional)
- Zustand o Redux Toolkit
- Leaflet/Mapbox para visualización geográfica

## Estructura base

```text
front-end/
  src/
    app/
    components/
    features/
    hooks/
    services/
    store/
    types/
    utils/
```

## Siguiente paso

Se recomienda iniciar con la configuración base de React y luego conectar la UI con la API del back-end.

# Front-end móvil — paramédico

Aplicación React Native/Expo basada en el mockup de paramédico de Vital Express.

## Estado actual

Incluye una primera implementación visual y funcional con datos ficticios:

- servicio activo y avance operacional
- cola priorizada con filtros
- formulario de hallazgos
- historial de servicios finalizados
- estados disponibles y ocupados

## Ejecutar

```bash
cd front-end
npm start
```

Para dispositivos:

```bash
npm run android
npm run ios
npm run web
```

## Documentación

- [Índice de documentación del front-end](docs/README.md)
- [Plan de implementación](docs/plans/FRONTEND_PARAMEDICO_PLAN.md)
- [Feature de asignación paramédico](docs/features/F-03-app-paramedico-asignacion.md)
- [Arquitectura móvil](docs/architecture/08-mobile-architecture.md)
- [Documentación compartida](../docs/README.md)

## Próxima integración

- API FastAPI
- autenticación
- ubicación
- push notifications
- tiempo real
- persistencia offline

La referencia visual original se encuentra en `/Users/anambedoya/Downloads/vital-express-paramedico.html`.
