# Task Management System - Microservices Architecture (Sin Docker)

Sistema completo de gestión de tareas con arquitectura de microservicios, desarrollado con NestJS para el backend y Next.js para el frontend.

## 🏗️ Arquitectura

### Microservicios Backend (NestJS)
- **Auth Service** (Puerto 3001): Autenticación y autorización
- **Projects Service** (Puerto 3002): Gestión de proyectos  
- **Tasks Service** (Puerto 3003): Gestión de tareas
- **Comments Service** (Puerto 3004): Sistema de comentarios
- **API Gateway** (Puerto 4000): Punto de entrada único que centraliza todas las comunicaciones

### Frontend (Next.js)
- **Frontend App** (Puerto 3000): Interfaz de usuario que se comunica únicamente con el API Gateway

### Base de Datos
- **MongoDB Atlas**: Base de datos en la nube compartida por todos los microservicios

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta en MongoDB Atlas

### 1. Configuración de MongoDB Atlas

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un nuevo cluster gratuito
3. Configura un usuario de base de datos
4. Obtén la cadena de conexión
5. Agrega tu IP a la lista blanca (0.0.0.0/0 para desarrollo)

### 2. Configuración de Variables de Entorno

Crea un archivo `.env` en cada servicio con la siguiente configuración:

**auth-service/.env**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
\`\`\`

**projects-service/.env**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
PORT=3002
\`\`\`

**tasks-service/.env**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
PORT=3003
\`\`\`

**comments-service/.env**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
PORT=3004
\`\`\`

**api-gateway/.env**
\`\`\`env
AUTH_SERVICE_URL=http://localhost:3001
PROJECTS_SERVICE_URL=http://localhost:3002
TASKS_SERVICE_URL=http://localhost:3003
COMMENTS_SERVICE_URL=http://localhost:3004
PORT=4000
\`\`\`

**frontend/.env.local**
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:4000
\`\`\`

### 3. Instalación de Dependencias

Instala las dependencias en cada servicio:

\`\`\`bash
# Auth Service
cd auth-service
npm install

# Projects Service  
cd ../projects-service
npm install

# Tasks Service
cd ../tasks-service
npm install

# Comments Service
cd ../comments-service
npm install

# API Gateway
cd ../api-gateway
npm install

# Frontend
cd ../frontend
npm install
\`\`\`

### 4. Ejecución de los Servicios

**IMPORTANTE**: Debes ejecutar los servicios en el siguiente orden y en terminales separadas:

**Terminal 1 - Auth Service:**
\`\`\`bash
cd auth-service
npm run start:dev
\`\`\`

**Terminal 2 - Projects Service:**
\`\`\`bash
cd projects-service
npm run start:dev
\`\`\`

**Terminal 3 - Tasks Service:**
\`\`\`bash
cd tasks-service
npm run start:dev
\`\`\`

**Terminal 4 - Comments Service:**
\`\`\`bash
cd comments-service
npm run start:dev
\`\`\`

**Terminal 5 - API Gateway:**
\`\`\`bash
cd api-gateway
npm run start:dev
\`\`\`

**Terminal 6 - Frontend:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

### 5. Verificación

Una vez que todos los servicios estén ejecutándose, verifica:

- Auth Service: http://localhost:3001
- Projects Service: http://localhost:3002  
- Tasks Service: http://localhost:3003
- Comments Service: http://localhost:3004
- API Gateway: http://localhost:4000
- Frontend: http://localhost:3000

## 📱 Uso de la Aplicación

1. Abre tu navegador en `http://localhost:3000`
2. Regístrate con un nuevo usuario o inicia sesión
3. Comienza a crear proyectos y tareas

## 🔧 Flujo de Comunicación

\`\`\`
Frontend (3000) 
    ↓
API Gateway (4000)
    ↓
┌─────────────────────────────────────┐
│  Auth Service (3001)                │
│  Projects Service (3002)            │  
│  Tasks Service (3003)               │
│  Comments Service (3004)            │
└─────────────────────────────────────┘
    ↓
MongoDB Atlas
\`\`\`

### Características del API Gateway

- **Autenticación centralizada**: Valida tokens JWT antes de reenviar requests
- **Enrutamiento inteligente**: Dirige cada request al microservicio correcto
- **Propagación de headers**: Envía información del usuario a cada microservicio
- **Manejo de errores**: Centraliza el manejo de errores de todos los servicios

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS**: Framework de Node.js para cada microservicio
- **MongoDB Atlas**: Base de datos NoSQL en la nube
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación basada en tokens
- **Axios**: Cliente HTTP para comunicación entre servicios

### Frontend
- **Next.js 14**: Framework de React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de CSS
- **Radix UI**: Componentes de UI

## 🔒 Seguridad

- **JWT Tokens**: Autenticación stateless
- **Validación de entrada**: En todos los endpoints
- **Autorización por roles**: Admin y Member
- **Headers de usuario**: Propagación segura de información del usuario

## 🚨 Solución de Problemas

### Error: Puerto en uso
\`\`\`bash
# Ver qué proceso usa el puerto
lsof -i :3001
# Matar el proceso
kill -9 PID
\`\`\`

### Error: MongoDB Connection
- Verifica la cadena de conexión en `.env`
- Asegúrate de que tu IP esté en la whitelist
- Verifica usuario y contraseña

### Error: Cannot connect to service
- Asegúrate de que todos los microservicios estén ejecutándose
- Verifica que los puertos estén correctos
- Revisa los logs de cada servicio

## 📈 Funcionalidades Implementadas

✅ **Gestión de Proyectos**: Crear, ver, editar, eliminar proyectos  
✅ **Gestión de Tareas**: CRUD completo con estados y prioridades  
✅ **Sistema de Comentarios**: Comentarios en tareas  
✅ **Filtros y Búsqueda**: Por estado, responsable, palabras clave  
✅ **Autenticación JWT**: Con roles (admin/member)  
✅ **API Gateway**: Centralización de comunicaciones  
✅ **UI Responsiva**: Diseño moderno con Tailwind CSS  

## 🎯 Ventajas de esta Arquitectura

1. **Separación de responsabilidades**: Cada servicio maneja una funcionalidad específica
2. **Escalabilidad independiente**: Cada microservicio puede escalarse por separado
3. **Tecnologías heterogéneas**: Cada servicio puede usar diferentes tecnologías
4. **Desarrollo en equipo**: Equipos pueden trabajar independientemente en cada servicio
5. **Tolerancia a fallos**: Si un servicio falla, los otros siguen funcionando
6. **API Gateway centralizado**: Punto único de entrada que simplifica el frontend

## 📞 Contacto

Para dudas o soporte, contacta al desarrollador del proyecto.
