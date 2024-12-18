import { useAuth } from "@/lib/auth-context";

const { usePathname } = require("next/navigation");
const { Header } = require("./Header");
const { SplashScreen } = require("./splash-screen");

export default function RootLayoutContent({ 
    children, 
    isLoading, 
    setIsLoading 
  }) {
    const pathname = usePathname()
    const { user } = useAuth();
  
    const getHeaderTitle = () => {
      if (pathname === '/login') return 'Login'
      
      if (!user) return 'ERP System'
  
      switch (pathname) {
        case `/${user.role}`:
          return 'Modules'
        case `/${user.role}/attendance`:
          return 'Attendance'
        case `/${user.role}/attendance/new`:
          return 'New Attendance'
        case `/${user.role}/attendance/update`:
          return 'Update Attendance'
        case `/${user.role}/profile`:
          return 'Profile'
        default:
          return 'ERP System'
      }
    }
  
    return isLoading ? (
      <SplashScreen finishLoading={() => setIsLoading(false)} />
    ) : (
      <div className="flex flex-col h-screen">
        {pathname !== '/login' && (
          <Header
            title={getHeaderTitle()}
            showBackButton={pathname !== `/${user?.role}`}
            user={user || null}
          />
        )}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    )
  }
  
  