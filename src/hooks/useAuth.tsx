import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  demoSignIn: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (demo mode)
    const savedUser = localStorage.getItem('zenalyst-demo-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, _password: string) => {
    try {
      // Demo authentication - accept any email/password
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: { full_name: email.split('@')[0] },
        identities: [],
        factors: []
      }
      
      localStorage.setItem('zenalyst-demo-user', JSON.stringify(demoUser))
      setUser(demoUser)
      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signUp = async (email: string, _password: string, fullName: string) => {
    try {
      // Demo signup
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: { full_name: fullName },
        identities: [],
        factors: []
      }
      
      localStorage.setItem('zenalyst-demo-user', JSON.stringify(demoUser))
      setUser(demoUser)
      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('zenalyst-demo-user')
    setUser(null)
  }

  const demoSignIn = async () => {
    const demoUser: User = {
      id: 'demo-user-123',
      email: 'demo@zenalyst.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { full_name: 'Demo User' },
      identities: [],
      factors: []
    }
    
    localStorage.setItem('zenalyst-demo-user', JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const contextValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    demoSignIn
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export { AuthContext }