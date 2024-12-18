'use client'
import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProtectedRoute } from "@/components/protected-route"
import { 
  FilePlus, 
  FileEdit 
} from 'lucide-react'

export default function AttendancePage() {
  const attendanceOptions = [
    {
      name: 'New Attendance',
      path: '/faculty/attendance/new',
      icon: FilePlus,
      description: 'Create a new attendance record for your class',
      color: 'text-green-500'
    },
    {
      name: 'Update Attendance',
      path: '/faculty/attendance/update',
      icon: FileEdit,
      description: 'Modify existing attendance entries',
      color: 'text-blue-500'
    }
  ]

  return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Attendance Module
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {attendanceOptions.map((option) => {
            const Icon = option.icon
            return (
              <Link 
                href={option.path} 
                key={option.name} 
                className="block"
              >
                <Card 
                  className="hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border-2 border-gray-100 h-full"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-10 h-10 ${option.color}`} />
                      <CardTitle className="text-xl">{option.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-600 mb-4">
                      {option.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      Proceed
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
  )
}