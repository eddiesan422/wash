# Biker Wash

Proyecto base para un sistema de gestión de lavadero de carros y motos con despliegue web (Cloudflare) y base de datos local (Oracle o SQL Server). Incluye una API en Node.js/Express lista para integrarse con un frontend o Worker.

## Carpetas

- `backend/`: API REST con TypeScript, TypeORM y autenticación JWT. Soporta roles de empleado, supervisor, gerente y administrador.

## Cómo usar el backend

Consulta `backend/README.md` para instrucciones detalladas de instalación, variables de entorno y scripts de ejecución. El backend genera un usuario administrador inicial (`admin / admin123`) para que puedas iniciar sesión y registrar más usuarios.
