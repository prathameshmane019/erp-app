"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Import SVG illustrations
import StudentIllustration from '@/public/illustrations/secure-login.svg'
import FacultyIllustration from '@/public/illustrations/secure-login.svg'
import Image from 'next/image'

const API_URL = process.env.API_URL || 'https://erp-attendance.vercel.app'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
const {user} = useAuth()

useEffect(()=>{
  if(user){
    router.push(`/${user?.role}`)
    }

},[user])
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/applogin`, { _id: id, password, role })
      const { user, token } = response.data
      
      login(user, token)
      
      toast.success('Login Successful', {
        description: `Welcome back, ${user.name}!`,
        duration: 2000,
      })

      // Delay to show toast before navigation
      setTimeout(() => {
        router.push(role === 'student' ? '/student' : '/faculty')
      }, 500)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.'
      
      toast.error('Login Failed', {
        description: errorMessage,
        duration: 3000,
      })
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Dynamically select illustration based on role
  const LoginIllustration = role === 'student' ? StudentIllustration : FacultyIllustration

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Illustration Section */}
        <div className="flex justify-center">
          <Image 
            src={LoginIllustration} 
            alt={role} 
            className="w-full max-w-[200px] md:max-w-[250px]max-h-[250px] h-auto"
          />
        </div>

        {/* Login Form Section */}
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-8 text-center text-primary">ERP System</h1>
          
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">ID</Label>
                <Input
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  `Sign In as ${role === 'student' ? 'Student' : 'Faculty'}`
                )}
              </Button>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

