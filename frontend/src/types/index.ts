export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "member"
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  ownerId: string
  members: string[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  assignedTo: string
  projectId: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  taskId: string
  userId: string
  createdAt: string
  updatedAt: string
}
