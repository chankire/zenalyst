export interface Database {
  public: {
    Tables: {
      // Users table (extends Supabase auth.users)
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'professional' | 'enterprise' | 'strategic'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'professional' | 'enterprise' | 'strategic'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'professional' | 'enterprise' | 'strategic'
          updated_at?: string
        }
      }

      // Projects table
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          settings: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          settings?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          settings?: any | null
          updated_at?: string
        }
      }

      // Dashboards table
      dashboards: {
        Row: {
          id: string
          project_id: string
          user_id: string
          name: string
          layout: any
          config: any | null
          is_public: boolean
          shared_with: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          name: string
          layout: any
          config?: any | null
          is_public?: boolean
          shared_with?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          layout?: any
          config?: any | null
          is_public?: boolean
          shared_with?: string[] | null
          updated_at?: string
        }
      }

      // Components table (dashboard elements)
      components: {
        Row: {
          id: string
          dashboard_id: string
          type: 'chart' | 'kpi' | 'text' | 'filter' | 'ai-insight'
          config: any
          data_bindings: any | null
          position: any
          styling: any | null
          created_at: string
        }
        Insert: {
          id?: string
          dashboard_id: string
          type: 'chart' | 'kpi' | 'text' | 'filter' | 'ai-insight'
          config: any
          data_bindings?: any | null
          position: any
          styling?: any | null
          created_at?: string
        }
        Update: {
          type?: 'chart' | 'kpi' | 'text' | 'filter' | 'ai-insight'
          config?: any
          data_bindings?: any | null
          position?: any
          styling?: any | null
        }
      }

      // Charts table (specific chart configurations)
      charts: {
        Row: {
          id: string
          component_id: string
          chart_type: string
          data_config: any
          style_config: any | null
          interactions: any | null
        }
        Insert: {
          id?: string
          component_id: string
          chart_type: string
          data_config: any
          style_config?: any | null
          interactions?: any | null
        }
        Update: {
          chart_type?: string
          data_config?: any
          style_config?: any | null
          interactions?: any | null
        }
      }

      // Datasets table
      datasets: {
        Row: {
          id: string
          project_id: string
          name: string
          file_path: string
          size: number
          schema: any | null
          metadata: any | null
          row_count: number
          uploaded_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          file_path: string
          size: number
          schema?: any | null
          metadata?: any | null
          row_count: number
          uploaded_at?: string
        }
        Update: {
          name?: string
          schema?: any | null
          metadata?: any | null
          row_count?: number
        }
      }

      // Data points table (processed data)
      data_points: {
        Row: {
          id: string
          dataset_id: string
          data: any
          processed_at: string
        }
        Insert: {
          id?: string
          dataset_id: string
          data: any
          processed_at?: string
        }
        Update: {
          data?: any
        }
      }

      // Filters table
      filters: {
        Row: {
          id: string
          dashboard_id: string
          name: string
          type: string
          config: any
          applies_to: string[]
        }
        Insert: {
          id?: string
          dashboard_id: string
          name: string
          type: string
          config: any
          applies_to: string[]
        }
        Update: {
          name?: string
          type?: string
          config?: any
          applies_to?: string[]
        }
      }

      // AI Insights table
      ai_insights: {
        Row: {
          id: string
          dashboard_id: string
          persona: 'phd_analyst' | 'ceo_narrative' | 'manager_actions'
          insight_type: 'correlation' | 'causation' | 'anomaly' | 'prediction' | 'recommendation'
          content: string
          confidence_score: number
          data_sources: string[]
          created_at: string
        }
        Insert: {
          id?: string
          dashboard_id: string
          persona: 'phd_analyst' | 'ceo_narrative' | 'manager_actions'
          insight_type: 'correlation' | 'causation' | 'anomaly' | 'prediction' | 'recommendation'
          content: string
          confidence_score: number
          data_sources: string[]
          created_at?: string
        }
        Update: {
          content?: string
          confidence_score?: number
          data_sources?: string[]
        }
      }

      // Action Plans table (implementation tracking)
      action_plans: {
        Row: {
          id: string
          insight_id: string
          user_id: string
          title: string
          description: string
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'critical'
          assigned_to: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          insight_id: string
          user_id: string
          title: string
          description: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          assigned_to?: string | null
          due_date?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'free' | 'professional' | 'enterprise' | 'strategic'
      component_type: 'chart' | 'kpi' | 'text' | 'filter' | 'ai-insight'
      insight_persona: 'phd_analyst' | 'ceo_narrative' | 'manager_actions'
      insight_type: 'correlation' | 'causation' | 'anomaly' | 'prediction' | 'recommendation'
      action_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
      priority_level: 'low' | 'medium' | 'high' | 'critical'
    }
  }
}