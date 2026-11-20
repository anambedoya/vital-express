# ADR-002: React Native para el front-end móvil de paramédicos

Estado: Propuesto

## Contexto

El mockup HTML representa el flujo operativo de la tripulación: asignación activa, estados de servicio, cola, historial y hallazgos. La app móvil es el núcleo operativo y debe soportar ubicación, push y conectividad intermitente.

## Decisión

Usar React Native con Expo como plataforma inicial, salvo que una evaluación técnica de autenticación, ubicación o distribución demuestre una limitación relevante.

## Alternativas

### Mantener el HTML como app móvil

Rechazada: no ofrece integración nativa suficiente para permisos, notificaciones, ubicación, almacenamiento y distribución robusta.

### React Native sin Expo

Posible, pero requiere mayor configuración inicial de herramientas nativas. Se pospone hasta validar necesidades específicas.

### Flutter

No seleccionada inicialmente porque React Native mantiene mayor continuidad con el ecosistema React previsto para los clientes web.

## Consecuencias

- una única mentalidad React en app y web;
- interfaz portable a iOS y Android;
- dependencia de módulos nativos compatibles;
- necesidad de configurar servicios push y ubicación;
- posibilidad de usar Expo EAS en prototipo y builds internos.

## Revisión pendiente

- soporte institucional de dispositivos;
- distribución interna;
- autenticación;
- módulos nativos obligatorios;
- consumo de batería;
- integración con Android/iOS específicos.
