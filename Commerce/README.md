# 🚀 Pro-Commerce Marketplace

Un marketplace multi-vendedor robusto y escalable construido con **Spring Boot 3**, **React** y **Mercado Pago**. Este proyecto permite a los usuarios comprar productos y a los vendedores gestionar su catálogo con analíticas en tiempo real.

## ✨ Características Principales
- **🛒 Marketplace Multi-vendedor:** Sistema de roles (Admin, Seller, User) con flujo de aprobación para empresas.
- **💳 Integración con Mercado Pago:** Pasarela de pagos real con gestión de preferencias y webhooks.
- **📊 Dashboard de Analíticas:** Visualización de ventas e ingresos diarios usando Recharts.
- **🛡️ Seguridad Avanzada:** Autenticación JWT y control de acceso por roles.
- **🐳 Dockerizado:** Entorno completo listo para producción con Docker Compose.
- **📧 Notificaciones:** Sistema de emails automáticos para confirmación de pedidos.

## 🛠️ Tecnologías
- **Backend:** Java 21, Spring Boot 3, Spring Security, JPA/Hibernate.
- **Frontend:** React 19, TailwindCSS, Lucide React, Recharts.
- **Base de Datos:** PostgreSQL.
- **Infraestructura:** Docker, Nginx.
- **Pagos:** Mercado Pago SDK.

## 🚀 Cómo ejecutar el proyecto (Docker)

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/commerce.git
   cd commerce
   ```

2. Configura las variables de entorno en el archivo `application.properties` del backend (puedes guiarte por `application.properties.example`).

3. Levanta la plataforma completa:
   ```bash
   docker-compose up --build
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8080`

## 📊 Datos de Prueba (Demo)
Para probar las analíticas de inmediato, puedes usar las siguientes credenciales:
- **Vendedor Demo:** `seller@demo.com` / `password`
- **Admin:** `admin@commerce.com` / `admin123`

---
Desarrollado con ❤️ por **Marcos Herrero**.
