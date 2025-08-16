export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          age_group: string | null
          approved: boolean | null
          benefits: string | null
          created_at: string
          difficulty: string
          discovered_at: string | null
          dog_id: string | null
          duration: number
          emotional_goals: string[] | null
          energy_level: string | null
          id: string
          instructions: string[] | null
          is_custom: boolean | null
          is_public: boolean
          materials: string[] | null
          pillar: string
          quality_score: number | null
          source: string
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          age_group?: string | null
          approved?: boolean | null
          benefits?: string | null
          created_at?: string
          difficulty: string
          discovered_at?: string | null
          dog_id?: string | null
          duration: number
          emotional_goals?: string[] | null
          energy_level?: string | null
          id: string
          instructions?: string[] | null
          is_custom?: boolean | null
          is_public?: boolean
          materials?: string[] | null
          pillar: string
          quality_score?: number | null
          source: string
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          age_group?: string | null
          approved?: boolean | null
          benefits?: string | null
          created_at?: string
          difficulty?: string
          discovered_at?: string | null
          dog_id?: string | null
          duration?: number
          emotional_goals?: string[] | null
          energy_level?: string | null
          id?: string
          instructions?: string[] | null
          is_custom?: boolean | null
          is_public?: boolean
          materials?: string[] | null
          pillar?: string
          quality_score?: number | null
          source?: string
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      "Activities Library": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      activity_completions: {
        Row: {
          activity_id: string
          activity_type: string
          completed_date: string
          completion_time: string
          created_at: string
          dog_id: string
          duration_minutes: number | null
          id: string
          notes: string | null
          pillar: Database["public"]["Enums"]["pillar_type"] | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          activity_id: string
          activity_type?: string
          completed_date: string
          completion_time?: string
          created_at?: string
          dog_id: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          pillar?: Database["public"]["Enums"]["pillar_type"] | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          activity_id?: string
          activity_type?: string
          completed_date?: string
          completion_time?: string
          created_at?: string
          dog_id?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          pillar?: Database["public"]["Enums"]["pillar_type"] | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_completions_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_feedback: {
        Row: {
          activity_id: string
          activity_type: string
          created_at: string
          difficulty_rating: number | null
          dog_id: string | null
          engagement_rating: number | null
          enjoyment_rating: number | null
          feedback_text: string | null
          id: string
          rating: number | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
          would_recommend: boolean | null
        }
        Insert: {
          activity_id: string
          activity_type: string
          created_at?: string
          difficulty_rating?: number | null
          dog_id?: string | null
          engagement_rating?: number | null
          enjoyment_rating?: number | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          activity_id?: string
          activity_type?: string
          created_at?: string
          difficulty_rating?: number | null
          dog_id?: string | null
          engagement_rating?: number | null
          enjoyment_rating?: number | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_feedback_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          content_type: string
          created_at: string
          id: string
          template: string
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          id?: string
          template: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          id?: string
          template?: string
          updated_at?: string
        }
        Relationships: []
      }
      discovered_activities: {
        Row: {
          age_group: Database["public"]["Enums"]["age_group"] | null
          benefits: string | null
          confidence_score: number | null
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          discovered_at: string
          discovery_method: string | null
          dog_id: string
          duration: number
          emotional_goals: string[] | null
          energy_level: Database["public"]["Enums"]["energy_level"] | null
          id: string
          instructions: string[] | null
          is_approved: boolean | null
          is_rejected: boolean | null
          materials: string[] | null
          pillar: Database["public"]["Enums"]["pillar_type"]
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          age_group?: Database["public"]["Enums"]["age_group"] | null
          benefits?: string | null
          confidence_score?: number | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          discovered_at?: string
          discovery_method?: string | null
          dog_id: string
          duration?: number
          emotional_goals?: string[] | null
          energy_level?: Database["public"]["Enums"]["energy_level"] | null
          id?: string
          instructions?: string[] | null
          is_approved?: boolean | null
          is_rejected?: boolean | null
          materials?: string[] | null
          pillar: Database["public"]["Enums"]["pillar_type"]
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          age_group?: Database["public"]["Enums"]["age_group"] | null
          benefits?: string | null
          confidence_score?: number | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          discovered_at?: string
          discovery_method?: string | null
          dog_id?: string
          duration?: number
          emotional_goals?: string[] | null
          energy_level?: Database["public"]["Enums"]["energy_level"] | null
          id?: string
          instructions?: string[] | null
          is_approved?: boolean | null
          is_rejected?: boolean | null
          materials?: string[] | null
          pillar?: Database["public"]["Enums"]["pillar_type"]
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovered_activities_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_configs: {
        Row: {
          breed_specific: boolean
          created_at: string
          dog_id: string
          enabled: boolean
          frequency: string
          id: string
          last_discovery_run: string | null
          max_activities_per_discovery: number
          quality_threshold: number
          target_sources: string[]
          updated_at: string
        }
        Insert: {
          breed_specific?: boolean
          created_at?: string
          dog_id: string
          enabled?: boolean
          frequency?: string
          id?: string
          last_discovery_run?: string | null
          max_activities_per_discovery?: number
          quality_threshold?: number
          target_sources?: string[]
          updated_at?: string
        }
        Update: {
          breed_specific?: boolean
          created_at?: string
          dog_id?: string
          enabled?: boolean
          frequency?: string
          id?: string
          last_discovery_run?: string | null
          max_activities_per_discovery?: number
          quality_threshold?: number
          target_sources?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_configs_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: true
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dogs: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"]
          age: number
          breed: string
          breed_group: string | null
          created_at: string
          date_added: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          image: string | null
          last_updated: string
          mobility_issues: string[] | null
          name: string
          notes: string | null
          quiz_results: Json | null
          special_needs: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: Database["public"]["Enums"]["activity_level"]
          age?: number
          breed?: string
          breed_group?: string | null
          created_at?: string
          date_added?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          image?: string | null
          last_updated?: string
          mobility_issues?: string[] | null
          name: string
          notes?: string | null
          quiz_results?: Json | null
          special_needs?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"]
          age?: number
          breed?: string
          breed_group?: string | null
          created_at?: string
          date_added?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          image?: string | null
          last_updated?: string
          mobility_issues?: string[] | null
          name?: string
          notes?: string | null
          quiz_results?: Json | null
          special_needs?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      favourites: {
        Row: {
          activity_id: string
          activity_type: string
          created_at: string
          dog_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          activity_type?: string
          created_at?: string
          dog_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          activity_type?: string
          created_at?: string
          dog_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourites_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_content: {
        Row: {
          content_type: string
          created_at: string
          generated_text: string
          id: string
          topic: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content_type: string
          created_at?: string
          generated_text: string
          id?: string
          topic: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string
          generated_text?: string
          id?: string
          topic?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          behaviors: string[]
          created_at: string
          date: string
          dog_id: string
          entry_timestamp: string | null
          id: string
          mood: string
          notes: string
          prompt: string
          response: string
          updated_at: string
        }
        Insert: {
          behaviors?: string[]
          created_at?: string
          date: string
          dog_id: string
          entry_timestamp?: string | null
          id?: string
          mood?: string
          notes?: string
          prompt: string
          response?: string
          updated_at?: string
        }
        Update: {
          behaviors?: string[]
          created_at?: string
          date?: string
          dog_id?: string
          entry_timestamp?: string | null
          id?: string
          mood?: string
          notes?: string
          prompt?: string
          response?: string
          updated_at?: string
        }
        Relationships: []
      }
      kajabi_courses: {
        Row: {
          course_description: string | null
          course_name: string
          created_at: string
          id: string
          kajabi_course_id: string
          last_synced_at: string | null
          lessons_count: number | null
          modules_count: number | null
          sync_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          course_description?: string | null
          course_name: string
          created_at?: string
          id?: string
          kajabi_course_id: string
          last_synced_at?: string | null
          lessons_count?: number | null
          modules_count?: number | null
          sync_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          course_description?: string | null
          course_name?: string
          created_at?: string
          id?: string
          kajabi_course_id?: string
          last_synced_at?: string | null
          lessons_count?: number | null
          modules_count?: number | null
          sync_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_base_files: {
        Row: {
          content_extracted: string
          course_reference: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          kajabi_course_id: string | null
          kajabi_lesson_id: string | null
          kajabi_module_id: string | null
          source: string | null
          storage_path: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_extracted: string
          course_reference?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          kajabi_course_id?: string | null
          kajabi_lesson_id?: string | null
          kajabi_module_id?: string | null
          source?: string | null
          storage_path: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_extracted?: string
          course_reference?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          kajabi_course_id?: string | null
          kajabi_lesson_id?: string | null
          kajabi_module_id?: string | null
          source?: string | null
          storage_path?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_metrics: {
        Row: {
          calculated_at: string
          calculation_data: Json | null
          confidence_level: number | null
          dog_id: string | null
          id: string
          metric_type: string
          metric_value: number
          user_id: string | null
        }
        Insert: {
          calculated_at?: string
          calculation_data?: Json | null
          confidence_level?: number | null
          dog_id?: string | null
          id?: string
          metric_type: string
          metric_value: number
          user_id?: string | null
        }
        Update: {
          calculated_at?: string
          calculation_data?: Json | null
          confidence_level?: number | null
          dog_id?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_metrics_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_logs: {
        Row: {
          algorithm_version: string | null
          context_data: Json | null
          created_at: string
          dog_id: string | null
          id: string
          recommendation_type: string
          recommended_activities: string[]
          user_action: string | null
          user_id: string | null
        }
        Insert: {
          algorithm_version?: string | null
          context_data?: Json | null
          created_at?: string
          dog_id?: string | null
          id?: string
          recommendation_type: string
          recommended_activities: string[]
          user_action?: string | null
          user_id?: string | null
        }
        Update: {
          algorithm_version?: string | null
          context_data?: Json | null
          created_at?: string
          dog_id?: string | null
          id?: string
          recommendation_type?: string
          recommended_activities?: string[]
          user_action?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_logs_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_activities: {
        Row: {
          activity_id: string
          completed: boolean
          completed_at: string | null
          completion_notes: string | null
          created_at: string
          day_of_week: number | null
          dog_id: string
          id: string
          notes: string | null
          reminder_enabled: boolean | null
          scheduled_date: string
          scheduled_time: string | null
          source: string | null
          status: string | null
          updated_at: string
          user_selected_time: string | null
          week_number: number | null
        }
        Insert: {
          activity_id: string
          completed?: boolean
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          day_of_week?: number | null
          dog_id: string
          id?: string
          notes?: string | null
          reminder_enabled?: boolean | null
          scheduled_date: string
          scheduled_time?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          user_selected_time?: string | null
          week_number?: number | null
        }
        Update: {
          activity_id?: string
          completed?: boolean
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          day_of_week?: number | null
          dog_id?: string
          id?: string
          notes?: string | null
          reminder_enabled?: boolean | null
          scheduled_date?: string
          scheduled_time?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          user_selected_time?: string | null
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_activities_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_activity_audit_log: {
        Row: {
          created_at: string
          id: string
          new_values: Json | null
          notes: string | null
          old_values: Json | null
          operation: string
          scheduled_activity_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          operation: string
          scheduled_activity_id: string
        }
        Update: {
          created_at?: string
          id?: string
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          operation?: string
          scheduled_activity_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          age_group: Database["public"]["Enums"]["age_group"] | null
          benefits: string | null
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          dog_id: string
          duration: number
          emotional_goals: string[] | null
          energy_level: Database["public"]["Enums"]["energy_level"] | null
          id: string
          instructions: string[] | null
          is_custom: boolean
          materials: string[] | null
          pillar: Database["public"]["Enums"]["pillar_type"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          age_group?: Database["public"]["Enums"]["age_group"] | null
          benefits?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          dog_id: string
          duration?: number
          emotional_goals?: string[] | null
          energy_level?: Database["public"]["Enums"]["energy_level"] | null
          id?: string
          instructions?: string[] | null
          is_custom?: boolean
          materials?: string[] | null
          pillar: Database["public"]["Enums"]["pillar_type"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          age_group?: Database["public"]["Enums"]["age_group"] | null
          benefits?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          dog_id?: string
          duration?: number
          emotional_goals?: string[] | null
          energy_level?: Database["public"]["Enums"]["energy_level"] | null
          id?: string
          instructions?: string[] | null
          is_custom?: boolean
          materials?: string[] | null
          pillar?: Database["public"]["Enums"]["pillar_type"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          activity_id: string | null
          activity_type: string | null
          context_data: Json | null
          created_at: string
          dog_id: string | null
          id: string
          interaction_type: string
          pillar: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          activity_type?: string | null
          context_data?: Json | null
          created_at?: string
          dog_id?: string | null
          id?: string
          interaction_type: string
          pillar?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          activity_type?: string | null
          context_data?: Json | null
          created_at?: string
          dog_id?: string | null
          id?: string
          interaction_type?: string
          pillar?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          confidence_score: number | null
          dog_id: string | null
          id: string
          last_updated: string
          preference_data: Json
          preference_type: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          dog_id?: string | null
          id?: string
          last_updated?: string
          preference_data?: Json
          preference_type: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          dog_id?: string | null
          id?: string
          last_updated?: string
          preference_data?: Json
          preference_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          setting_data: Json
          setting_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_data?: Json
          setting_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_data?: Json
          setting_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_pillar_preferences: {
        Args: { p_dog_id: string; p_user_id: string }
        Returns: {
          confidence: number
          pillar: string
          preference_score: number
        }[]
      }
      enable_rls_for_table: {
        Args: { table_name: string }
        Returns: undefined
      }
      generate_smart_recommendations: {
        Args: {
          p_dog_id: string
          p_limit?: number
          p_recommendation_type?: string
          p_user_id: string
        }
        Returns: {
          activity_id: string
          reason: string
          recommendation_score: number
        }[]
      }
      get_kajabi_settings: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_subscription_status: {
        Args: { p_user_id: string }
        Returns: {
          subscribed: boolean
          subscription_end: string
          subscription_status: string
          subscription_tier: string
        }[]
      }
      resolve_scheduled_activity_duplicates: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          resolved_count: number
        }[]
      }
      safe_upsert_scheduled_activity: {
        Args: {
          p_activity_id: string
          p_completion_notes?: string
          p_day_of_week?: number
          p_dog_id: string
          p_notes?: string
          p_reminder_enabled?: boolean
          p_scheduled_date: string
          p_source?: string
          p_week_number?: number
        }
        Returns: string
      }
      search_knowledge_base_files: {
        Args: { p_limit?: number; p_search_terms: string; p_user_id: string }
        Returns: {
          content_excerpt: string
          file_name: string
          file_type: string
          id: string
          relevance_score: number
          tags: string[]
        }[]
      }
      search_knowledge_base_with_courses: {
        Args: {
          p_content_type?: string
          p_limit?: number
          p_search_terms: string
          p_user_id: string
        }
        Returns: {
          content_excerpt: string
          course_reference: string
          file_name: string
          file_type: string
          id: string
          relevance_score: number
          source: string
          tags: string[]
        }[]
      }
      user_owns_dog: {
        Args: { dog_uuid: string }
        Returns: boolean
      }
      user_owns_dog_by_text_id: {
        Args: { dog_text_id: string }
        Returns: boolean
      }
      validate_subscription: {
        Args: { p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      activity_level: "low" | "moderate" | "high"
      age_group: "Puppy" | "Adult" | "Senior" | "All Ages"
      difficulty_level: "Easy" | "Medium" | "Hard"
      energy_level: "Low" | "Medium" | "High"
      gender: "Male" | "Female" | "Unknown"
      pillar_type:
        | "mental"
        | "physical"
        | "social"
        | "environmental"
        | "instinctual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_level: ["low", "moderate", "high"],
      age_group: ["Puppy", "Adult", "Senior", "All Ages"],
      difficulty_level: ["Easy", "Medium", "Hard"],
      energy_level: ["Low", "Medium", "High"],
      gender: ["Male", "Female", "Unknown"],
      pillar_type: [
        "mental",
        "physical",
        "social",
        "environmental",
        "instinctual",
      ],
    },
  },
} as const
