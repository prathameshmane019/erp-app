'use client'

import { useAuth } from '../../lib/auth-context'
import { ProtectedRoute } from '../../components/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function ModuleSelectionPage() {
  const { user } = useAuth()
  const router = useRouter()

  const modules = [
    { name: 'Attendance', path: '/attendance' },
    { name: 'Grades', path: '/grades' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Profile', path: '/profile' },
  ]

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
        <div className="grid grid-cols-2 gap-4">
          {modules.map((module) => (
            <Card key={module.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  className="w-full h-full text-left justify-start"
                  onClick={() => router.push(module.path)}
                >
                  {module.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}

