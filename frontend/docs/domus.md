# Domus · Documento de alcance · Demo académica

## 1. Descripción general

Domus es una plataforma digital orientada a conectar clientes que necesitan servicios de mantenimiento
y reparación del hogar con profesionales especializados. El objetivo de esta propuesta es desarrollar
una demo web que permita visualizar y recorrer el funcionamiento principal de la plataforma de manera
clara durante una presentación académica.

La versión contemplada en este documento será una demo 100% frontend. Esto significa que la
información utilizada para la demostración será simulada y gestionada dentro de la propia aplicación, sin
necesidad de un backend o una base de datos productiva.

## 2. Objetivo de la demo

- Presentar visualmente la propuesta de valor de Domus.
- Demostrar el flujo completo de contratación de un servicio.
- Mostrar las interfaces correspondientes a Cliente, Profesional y Administrador.
- Permitir una navegación interactiva durante la exposición.
- Simular cambios de estado, solicitudes, calificaciones y pagos.
- Contar con una interfaz responsive y coherente con la referencia visual proporcionada.

## 3. Tipos de usuario

| Usuario | Objetivo | Funciones principales |
| --- | --- | --- |
| Cliente | Solicitar y contratar servicios. | Buscar categorías y profesionales, crear solicitudes, consultar estados, calificar y simular el pago. |
| Profesional | Ofrecer y gestionar servicios. | Recibir solicitudes, aceptar/rechazar trabajos, actualizar estados, finalizar trabajos y consultar ganancias. |
| Administrador | Gestionar la plataforma. | Visualizar estadísticas, usuarios, profesionales, solicitudes, finanzas y configuración. |

## 4. Flujo principal de trabajo

El flujo principal que se demostrará durante la presentación será:

1. **Selección del servicio:** El cliente ingresa a la plataforma y selecciona la categoría del servicio que
   necesita.
2. **Selección del profesional:** Se muestra una lista de profesionales relacionados con la categoría,
   incluyendo calificación, experiencia y precio referencial.
3. **Solicitud:** El cliente completa la información del problema, ubicación, fecha, horario y descripción.
4. **Recepción:** El profesional visualiza la nueva solicitud y puede aceptarla o rechazarla.
5. **Seguimiento:** La solicitud cambia de estado para representar el avance del servicio.
6. **Finalización:** El profesional marca el trabajo como terminado.
7. **Confirmación:** El cliente confirma que el servicio fue realizado correctamente.
8. **Calificación:** El cliente califica al profesional y puede dejar un comentario.
9. **Pago simulado:** Se presenta un resumen del servicio y un pago ficticio para completar la
   demostración.

## 5. Pantallas contempladas

### 5.1 Cliente

- Inicio / Dashboard del cliente
- Categorías de servicios
- Listado de profesionales
- Detalle del profesional
- Nueva solicitud de servicio
- Mis solicitudes
- Seguimiento del servicio
- Trabajo terminado / confirmación
- Calificación del profesional
- Resumen y pago simulado

### 5.2 Profesional

- Inicio del profesional
- Solicitudes nuevas
- Detalle del trabajo
- Trabajo en proceso
- Ganancias
- Perfil profesional

### 5.3 Administrador

- Dashboard
- Gestión de usuarios
- Gestión de profesionales
- Gestión de solicitudes
- Finanzas
- Configuración

## 6. Funcionamiento de la demo

Para permitir una demostración fluida sin depender de servicios externos, la aplicación utilizará datos
simulados (mock data). La interacción entre pantallas permitirá representar el comportamiento de los
distintos roles.

- Usuarios de prueba para Cliente, Profesional y Administrador.
- Datos precargados de categorías y profesionales.
- Solicitudes de servicio de ejemplo.
- Cambios de estado simulados.
- Calificaciones y comentarios simulados.
- Información financiera y ganancias calculadas para fines demostrativos.
- Pago simulado, sin procesamiento monetario real.

## 7. Alcance técnico

| Incluido | No incluido |
| --- | --- |
| Aplicación web frontend | Backend/API productiva |
| Diseño responsive | Base de datos real |
| Navegación entre pantallas | Autenticación real |
| Componentes reutilizables | Pasarela de pagos |
| Datos simulados | Google Maps u otras APIs externas |
| Simulación de roles y estados | Notificaciones push reales |
| Formularios y validaciones básicas | Chat en tiempo real |
| Deploy de la demo para presentación | Publicación en Play Store/App Store |
| | Infraestructura y seguridad de producción |
| | Mantenimiento posterior no contemplado en el alcance |

## 8. Entregables

- Aplicación web demo funcional.
- Código fuente del frontend.
- Interfaces correspondientes a los tres tipos de usuario.
- Flujo de contratación de servicio completo para demostración.
- Datos de prueba necesarios para la exposición.
- Versión desplegada accesible para realizar la presentación.

## 9. Consideraciones del proyecto

- La aplicación está orientada a una demostración académica y no a un lanzamiento comercial.
- El alcance se basa en la referencia visual proporcionada por el cliente.
- Los datos mostrados en la demo son ficticios y tienen únicamente finalidad demostrativa.
- Los cambios que impliquen nuevas funcionalidades fuera del alcance deberán evaluarse por
  separado.
- La prioridad será que el flujo principal pueda demostrarse de principio a fin de forma estable.

## 10. Plan de trabajo propuesto

| Fase | Actividad | Descripción |
| --- | --- | --- |
| Fase 1 | Definición y estructura | Revisión de pantallas, flujo y componentes principales. |
| Fase 2 | Diseño e implementación | Construcción de interfaces, navegación y componentes. |
| Fase 3 | Integración del flujo | Mock data, roles, estados y simulación del proceso. |
| Fase 4 | Ajustes y presentación | Responsive, correcciones visuales y preparación de la demo. |

## 11. Presupuesto de referencia

**Desarrollo de la demo frontend:** Gs. 1.800.000

El presupuesto corresponde al alcance definido en este documento. El desarrollo contempla una demo
académica interactiva y no una solución productiva.

Cualquier funcionalidad adicional que implique backend, servicios externos, persistencia real de datos o
nuevas pantallas deberá presupuestarse de forma independiente.

## 12. Criterio de finalización

El proyecto se considerará listo cuando el flujo principal de la demo pueda ejecutarse de forma continua
desde la selección de un servicio hasta su finalización, calificación y pago simulado, y cuando las
interfaces principales de Cliente, Profesional y Administrador se encuentren navegables.
