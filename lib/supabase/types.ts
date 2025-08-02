export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cv_uploads: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          original_text: string
          feedback: Json | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          original_text: string
          feedback?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          original_text?: string
          feedback?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type CVUpload = Database['public']['Tables']['cv_uploads']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export interface CVFeedback {
  overall_score: number
  summary: string
  strengths: string[]
  areas_for_improvement: string[]
  specific_suggestions: {
    section: string
    suggestion: string
    impact: 'high' | 'medium' | 'low'
  }[]
  formatting_feedback: string
  keyword_analysis: {
    missing_keywords: string[]
    suggested_additions: string[]
  }
}