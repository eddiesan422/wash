# Biker Wash

Sistema web para gestionar un lavadero de carros y motos. Incluye autenticación por roles (empleado, supervisor, gerente y administrador) y cubre registro de lavados, inventario, exportaciones y auditoría.

## Estructura del proyecto

- `backend/`: API en Node.js + Express + TypeORM. Se deja preparada para bases de datos locales Oracle o SQL Server (con SQLite para desarrollo rápido).

## Ejecución rápida (desarrollo)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

- Se genera automáticamente un usuario administrador por defecto: `admin / admin123` (configurable con `ADMIN_PASSWORD`).
- La API expone los endpoints bajo `/api` y un chequeo de salud en `/health`.

## Configuración de base de datos

La conexión se controla con las variables del archivo `.env`:

- `DB_TYPE`: `oracle`, `mssql` o `sqlite` (útil para probar sin dependencias adicionales).
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_SID`, `DB_SCHEMA`: datos de conexión para Oracle/SQL Server.
- `DB_PATH`: ruta del archivo SQLite en modo desarrollo.

Para usar Oracle o SQL Server instala el driver correspondiente (`oracledb` o `mssql`) en la máquina donde se ejecute el backend.

## Cobertura de requerimientos

- **Sesiones y roles:** autenticación JWT, perfiles de empleado, supervisor, gerente y administrador.
- **Empleado:** puede crear lavados, ver y actualizar el estado de sus asignaciones.
- **Supervisor:** además de lo anterior, puede marcar pagos, reasignar o eliminar lavados en espera.
- **Gerente:** acceso al historial filtrado por fecha, placeholder de exportación contable, gestión de inventario.
- **Administrador:** gestión de usuarios y visualización de logs de auditoría.

Se incluyeron modelos de datos para lavados, usuarios, inventario y auditoría, junto con rutas básicas para cada caso de uso. La exportación a Excel se deja como punto de integración futura para Cloudflare o una tarea por lotes.
