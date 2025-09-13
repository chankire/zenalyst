import { Outlet, Link, useLocation } from 'react-router-dom'
import { User } from '@supabase/supabase-js'
import { Home, Sparkles, LogOut, Settings, BarChart3 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface AppLayoutProps {
  user: User
}

const AppLayout = ({ user }: AppLayoutProps) => {
  const location = useLocation()
  const { signOut } = useAuth()
  
  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">
                Zenalyst Nexus
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground hidden sm:block">
                {user?.user_metadata?.full_name || user?.email || 'Demo User'}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout