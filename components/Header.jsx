"use client"
import Image from 'next/image'
import { ArrowLeft, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/lib/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function Header({ title, showBackButton = false, user }) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
      </div>
      <h1 className="text-xl font-bold">{title}</h1>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
              
              <AvatarImage
                src={user.institute?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}` : '/placeholder.svg'}
                alt={user.name || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
               <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
           
              </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name || 'User'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/${user.role}/profile`)}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
