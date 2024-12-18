"use client"
import React from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

// Import SVG illustrations
import AttendanceIllustration from '@/public/illustrations/attendance.svg'
import FeedbackIllustration from '@/public/illustrations/feedback.svg'
import Image from 'next/image'
// import ProfileIllustration from '@/public/illustrations/profile.svg'

export default function ModuleSelectionPage() {
  const { user } = useAuth()
  const router = useRouter() 

  const modules = [
    { 
      name: 'Attendance', 
      path: '/faculty/attendance',
      description: 'Manage and track daily attendance',
      illustration: AttendanceIllustration,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      name: 'FeedBack', 
      path: '/faculty/feedback',
      description: 'Collect and analyze student feedback',
      illustration: FeedbackIllustration,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    // { 
    //   name: 'Profile', 
    //   path: '/profile',
    //   description: 'View and update your profile',
    //   illustration: ProfileIllustration,
    //   bgColor: 'bg-purple-50',
    //   textColor: 'text-purple-600'
    // }
  ]

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Welcome, {user?.name}
      </h1>
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card 
            key={module.name} 
            className={`
              ${module.bgColor} 
              border-2 border-transparent 
              hover:border-primary 
              transition-all 
              duration-300 
              hover:shadow-xl 
              transform 
              hover:-translate-y-2
              flex flex-col
            `}
          >
            <CardHeader className="pb-2 flex-grow-0">
              <div className="flex justify-center mb-4 h-48">
                <Image src={module.illustration} alt={module.name} className="max-h-full max-w-full object-contain" />
              </div>
              <CardTitle className={`text-xl text-center ${module.textColor}`}>
                {module.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow justify-end">
              <p className="text-muted-foreground mb-4 text-center">
                {module.description}
              </p>
              <Button
                variant="outline"
                className={`
                  w-full 
                  ${module.textColor} 
                  hover:bg-primary 
                  hover:text-primary-foreground
                `}
                onClick={() => router.push(module.path)}
              >
                Open Module
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}