import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// For development mode, use placeholder values if env vars are missing or placeholder
const isDevelopment = !supabaseUrl || !supabaseAnonKey || 
  supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')

const finalUrl = isDevelopment ? 'https://placeholder.supabase.co' : supabaseUrl
const finalKey = isDevelopment ? 'placeholder_anon_key' : supabaseAnonKey

// Export the development mode flag for use in components
export const isDevMode = isDevelopment

export const supabase = createClient<Database>(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'zenalyst-nexus@0.1.0'
    }
  }
})

// Helper functions for common operations
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with OAuth provider
  signInWithProvider: async (provider: 'github' | 'google' | 'microsoft') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  }
}

// Database helpers
export const db = {
  // Projects
  getProjects: async (userId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        dashboards (
          id,
          name,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    return { data, error }
  },

  createProject: async (project: {
    name: string
    description?: string
    settings?: any
    user_id: string
  }) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()
    
    return { data, error }
  },

  // Dashboards
  getDashboard: async (dashboardId: string) => {
    const { data, error } = await supabase
      .from('dashboards')
      .select(`
        *,
        components (
          *,
          charts (*)
        ),
        project:projects (
          id,
          name,
          user_id
        )
      `)
      .eq('id', dashboardId)
      .single()
    
    return { data, error }
  },

  createDashboard: async (dashboard: {
    name: string
    layout: any
    config?: any
    project_id: string
    user_id: string
  }) => {
    const { data, error } = await supabase
      .from('dashboards')
      .insert([dashboard])
      .select()
      .single()
    
    return { data, error }
  },

  updateDashboard: async (dashboardId: string, updates: any) => {
    const { data, error } = await supabase
      .from('dashboards')
      .update(updates)
      .eq('id', dashboardId)
      .select()
      .single()
    
    return { data, error }
  },

  // Datasets
  uploadDataset: async (file: File, projectId: string, userId: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${userId}/${projectId}/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('datasets')
      .upload(filePath, file)

    if (uploadError) {
      return { data: null, error: uploadError }
    }

    // Create dataset record
    const { data, error } = await supabase
      .from('datasets')
      .insert([{
        name: file.name,
        file_path: filePath,
        size: file.size,
        metadata: {},
        project_id: projectId,
        row_count: 0
      }])
      .select()
      .single()

    return { data, error }
  }
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to dashboard changes
  subscribeToDashboard: (dashboardId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`dashboard:${dashboardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboards',
          filter: `id=eq.${dashboardId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to project changes
  subscribeToProject: (projectId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`project:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        callback
      )
      .subscribe()
  }
}

export default supabase