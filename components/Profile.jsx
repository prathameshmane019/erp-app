'use client'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from './protected-route'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>{user?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Department:</strong> {user?.department}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Semester:</strong> {user?.sem}</p>
              <p><strong>Current Year:</strong> {user?.currentYear}</p>
              <p><strong>Institute:</strong> {user?.institute.name}</p>
              <p><strong>Institute Address:</strong> {user?.institute.address}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

