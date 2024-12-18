'use client'
 import { UpdateAttendanceSystem } from "@/components/attendance/Update-Attendance"
 
export default function UpdateAttendancePage() {
  return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Update Attendance</h1>
          <UpdateAttendanceSystem/>
        </main>
      </div>
  )
}

