
# 🧩 TareApp - Arquitectura de Microservicios

Aplicación completa construida con una arquitectura basada en microservicios. Backend desarrollado en **NestJS**, frontend en **Next.js**, y base de datos en **MongoDB Atlas**.

---

## 🏗️ Arquitectura

### 🔧 Microservicios Backend (NestJS)

| Servicio             | Puerto | Descripción                    |
|----------------------|--------|--------------------------------|
| Auth Service         | 3001   | Autenticación y autorización   |
| Projects Service     | 3002   | Gestión de proyectos           |
| Tasks Service        | 3003   | Gestión de tareas              |
| Comments Service     | 3004   | Comentarios en tareas          |
| Notifications Service| 3005   | Notificaciones de usuario      |
| API Gateway          | 4000   | Punto único de entrada         |

### 💻 Frontend (Next.js)
- **Puerto 3000**  
- Interfaz que se comunica únicamente con el API Gateway.

### 🗄️ Base de Datos
- **MongoDB Atlas** (compartida por todos los servicios)

---

## 🚀 Instalación y Configuración

### 🔹 Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas)

---

### 1️⃣ Configuración de MongoDB Atlas

1. Crea una cuenta
2. Crea un cluster gratuito
3. Crea un usuario con acceso a la base
4. Obtén la URI de conexión
5. Añade tu IP en la whitelist (`0.0.0.0/0` para desarrollo)

---

### 2️⃣ Variables de Entorno

Crea un archivo `.env` en cada servicio con la siguiente estructura:

#### 📁 `auth-service/.env`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

#### 📁 `projects-service/.env`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
PORT=3002
```

#### 📁 `tasks-service/.env`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
PORT=3003
```

#### 📁 `comments-service/.env`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
PORT=3004
```

#### 📁 `notifications-service/.env`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
PORT=3005
```

#### 📁 `api-gateway/.env`
```env
AUTH_SERVICE_URL=http://localhost:3001
PROJECTS_SERVICE_URL=http://localhost:3002
TASKS_SERVICE_URL=http://localhost:3003
COMMENTS_SERVICE_URL=http://localhost:3004
NOTIFICATIONS_SERVICE_URL=http://localhost:3005
PORT=4000
```

#### 📁 `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### 3️⃣ Instalación de Dependencias

Ejecuta lo siguiente en cada carpeta:

```bash
# Auth
cd auth-service && npm install

# Projects
cd ../projects-service && npm install

# Tasks
cd ../tasks-service && npm install

# Comments
cd ../comments-service && npm install

# Notifications
cd ../notifications-service && npm install

# API Gateway
cd ../api-gateway && npm install

# Frontend
cd ../frontend && npm install
```

---

### 4️⃣ Ejecución de los Servicios

Usa **terminales separadas** y sigue este orden:

```bash
# Terminal 1 - Auth
cd auth-service
npm run start:dev

# Terminal 2 - Projects
cd ../projects-service
npm run start:dev

# Terminal 3 - Tasks
cd ../tasks-service
npm run start:dev

# Terminal 4 - Comments
cd ../comments-service
npm run start:dev

# Terminal 5 - Notifications
cd ../notifications-service
npm run start:dev

# Terminal 6 - API Gateway
cd ../api-gateway
npm run start:dev

# Terminal 7 - Frontend
cd ../frontend
npm run dev
```

---

### ✅ Verificación

- Auth: http://localhost:3001  
- Projects: http://localhost:3002  
- Tasks: http://localhost:3003  
- Comments: http://localhost:3004  
- Notifications: http://localhost:3005  
- Gateway: http://localhost:4000  
- Frontend: http://localhost:3000

---

## 📱 Uso de la Aplicación

1. Abre `http://localhost:3000`
2. Regístrate o inicia sesión
3. Crea proyectos, tareas, comentarios y revisa notificaciones

---

## 🔄 Flujo de Comunicación

```
Frontend (3000) 
    ↓
API Gateway (4000)
    ↓
┌────────────────────────────────────────────┐
│ Auth         (3001)                        │
│ Projects     (3002)                        │
│ Tasks        (3003)                        │
│ Comments     (3004)                        │
│ Notifications(3005)                        │
└────────────────────────────────────────────┘
    ↓
MongoDB Atlas
```

---

### 🌉 Características del API Gateway

- Validación JWT centralizada
- Enrutamiento inteligente
- Propagación de headers
- Manejo global de errores

---

## 🛠️ Tecnologías Utilizadas

### Backend
- NestJS
- MongoDB Atlas + Mongoose
- JWT
- Axios

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Radix UI

---

## 🔒 Seguridad

- Tokens JWT
- Validaciones por DTOs
- Roles: `admin`, `member`
- Headers seguros entre servicios

---

## 🧪 Solución de Problemas

### 🔸 Puerto en uso
```bash
lsof -i :3001
kill -9 <PID>
```

### 🔸 Error de conexión a MongoDB
- Verifica `.env`
- Asegura IP en whitelist
- Revisa usuario/contraseña

### 🔸 No se conecta un servicio
- Revisa que todos estén corriendo
- Verifica puertos y logs

---

## 📈 Funcionalidades Implementadas

- ✅ CRUD de proyectos y tareas
- ✅ Sistema de comentarios por tarea
- ✅ Notificaciones por tarea
- ✅ Filtros de búsqueda y estado
- ✅ Autenticación JWT con roles
- ✅ Comunicación centralizada vía API Gateway
- ✅ UI responsiva y moderna

---

## 🎯 Ventajas de la Arquitectura

1. Separación clara de responsabilidades
2. Escalabilidad por servicio
3. Uso de tecnologías variadas por microservicio
4. Trabajo colaborativo por áreas
5. Tolerancia a fallos
6. Centralización del acceso con API Gateway

---

## 📬 Contacto

Para soporte o colaboración, contacta al desarrollador del proyecto.
