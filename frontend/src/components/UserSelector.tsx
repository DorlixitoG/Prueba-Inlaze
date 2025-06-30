"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"

interface User {
  _id: string
  name: string
  email: string
  role: string
}

interface UserSelectorProps {
  selectedUsers: string[]
  onUsersChange: (users: string[]) => void
  placeholder?: string
}

export function UserSelector({
  selectedUsers,
  onUsersChange,
  placeholder = "Seleccionar usuarios...",
}: UserSelectorProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await fetch("http://localhost:4000/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onUsersChange(selectedUsers.filter((id) => id !== userId))
    } else {
      onUsersChange([...selectedUsers, userId])
    }
  }

  const removeUser = (userId: string) => {
    onUsersChange(selectedUsers.filter((id) => id !== userId))
  }

  const getSelectedUserNames = () => {
    return selectedUsers.map((userId) => {
      const user = users.find((u) => u._id === userId)
      return user ? user.name : userId
    })
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {selectedUsers.length === 0 ? placeholder : `${selectedUsers.length} usuario(s) seleccionado(s)`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar usuarios..." />
            <CommandList>
              <CommandEmpty>{loading ? "Cargando usuarios..." : "No se encontraron usuarios."}</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem key={user._id} value={user.name} onSelect={() => handleUserSelect(user._id)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedUsers.includes(user._id) ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Mostrar usuarios seleccionados */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((userId) => {
            const user = users.find((u) => u._id === userId)
            return (
              <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                {user ? user.name : userId}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeUser(userId)} />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
