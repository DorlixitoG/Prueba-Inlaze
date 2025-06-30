export interface User {
  _id: string
  id?: string
  email: string
  name: string
  role: "admin" | "member"
  createdAt: string
  updatedAt: string
}

export interface Project {
  _id: string
  id?: string
  name: string
  description: string
  ownerId: string
  members: string[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  _id: string
  id?: string
  title: string
  description: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  assignedTo: string[] | string 
  projectId: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Comment {
  _id: string
  id?: string
  content: string
  taskId: string
  userId: string
  userName: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  _id: string
  id?: string
  userId: string
  type: "comment" | "task_update" | "task_assigned"
  title: string
  message: string
  taskId?: string
  projectId?: string
  read: boolean
  createdAt: string
  updatedAt: string
}
