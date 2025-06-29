// Tipos compartidos entre microservicios
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "member"
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  ownerId: string
  members: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: Date
  assignedTo: string
  projectId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  content: string
  taskId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface JwtPayload {
  sub: string
  email: string
  role: string
}
