'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { Navbar } from '@/components/navbar'
import { ViewAttendance } from '@/components/view-attendance'

export default function ViewAttendancePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">View Attendance</h1>
          <ViewAttendance />
        </main>
      </div>
    </ProtectedRoute>
  )
}

