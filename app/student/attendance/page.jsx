import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AttendancePage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/auth/signin')
  }

  const isFaculty = session.user.role === 'faculty'

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Module</h1>
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Attendance</h2>
          {/* Here you would fetch and display the student's attendance */}
          <p>Attendance data would be displayed here.</p>
        </div>
     
    </div>
  )
}

