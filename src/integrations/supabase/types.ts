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
          weight?: number | null
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
      scheduled_activities: {
        Row: {
          activity_id: string
          completed: boolean
          completed_at: string | null
          completion_notes: string | null
          created_at: string
          dog_id: string
          id: string
          notes: string | null
          reminder_enabled: boolean | null
          scheduled_date: string
          scheduled_time: string
          updated_at: string
          user_selected_time: string | null
        }
        Insert: {
          activity_id: string
          completed?: boolean
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          dog_id: string
          id?: string
          notes?: string | null
          reminder_enabled?: boolean | null
          scheduled_date: string
          scheduled_time: string
          updated_at?: string
          user_selected_time?: string | null
        }
        Update: {
          activity_id?: string
          completed?: boolean
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          dog_id?: string
          id?: string
          notes?: string | null
          reminder_enabled?: boolean | null
          scheduled_date?: string
          scheduled_time?: string
          updated_at?: string
          user_selected_time?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
