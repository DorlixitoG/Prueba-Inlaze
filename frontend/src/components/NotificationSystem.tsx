"use client"

import { useState, useEffect } from "react"
import { Bell, X, MessageCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Notification } from "@/types"

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { token, user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])


  const fetchNotifications = async () => {
    if (!token) return

    try {
      console.log("📡 Fetching notifications...")

      const response = await fetch("http://localhost:4000/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("📡 Respuesta de /notifications:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Notificaciones recibidas:", data.length)
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      } else {
        const errorText = await response.text()
        console.error("❌ Error HTTP al obtener notificaciones:", errorText)
      }
    } catch (error) {
      console.error("💥 Error en fetchNotifications:", error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setNotifications(notifications.map((n) => (n._id === notificationId ? { ...n, read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("http://localhost:4000/notifications/mark-all-read", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
        toast({
          title: "Éxito",
          description: "Todas las notificaciones marcadas como leídas",
        })
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const notification = notifications.find((n) => n._id === notificationId)
        setNotifications(notifications.filter((n) => n._id !== notificationId))
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageCircle className="h-4 w-4" />
      case "task_update":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No hay notificaciones</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                  onClick={() => !notification.read && markAsRead(notification._id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification._id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
