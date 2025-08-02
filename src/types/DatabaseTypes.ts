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
      entities: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: number
          name: string
          slug: string
          status: Database["public"]["Enums"]["current_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: never
          name: string
          slug: string
          status?: Database["public"]["Enums"]["current_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: never
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["current_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      keep_alive: {
        Row: {
          is_set: boolean
        }
        Insert: {
          is_set: boolean
        }
        Update: {
          is_set?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          mode: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id: string
          mode?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          mode?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      sub_entities: {
        Row: {
          created_at: string
          description: string
          due_date: string | null
          entity_id: number | null
          id: number
          name: string
          profile_id: string
          status: Database["public"]["Enums"]["current_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description: string
          due_date?: string | null
          entity_id?: number | null
          id?: never
          name: string
          profile_id: string
          status?: Database["public"]["Enums"]["current_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          due_date?: string | null
          entity_id?: number | null
          id?: never
          name?: string
          profile_id?: string
          status?: Database["public"]["Enums"]["current_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_entities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_entities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          id: string
          name: string
          workplace_type: "hospital" | "factory" | "police_fire"
          shift_pattern: Json
          credit_settings: Json | null
          skill_categories: string[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          workplace_type: "hospital" | "factory" | "police_fire"
          shift_pattern: Json
          credit_settings?: Json | null
          skill_categories?: string[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          workplace_type?: "hospital" | "factory" | "police_fire"
          shift_pattern?: Json
          credit_settings?: Json | null
          skill_categories?: string[]
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          id: string
          profile_id: string
          organization_id: string
          role: "superuser" | "manager" | "employee"
          position: string | null
          skills: string[]
          credits: number
          status: "pending_approval" | "approved" | "rejected"
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          organization_id: string
          role: "superuser" | "manager" | "employee"
          position?: string | null
          skills?: string[]
          credits?: number
          status?: "pending_approval" | "approved" | "rejected"
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          organization_id?: string
          role?: "superuser" | "manager" | "employee"
          position?: string | null
          skills?: string[]
          credits?: number
          status?: "pending_approval" | "approved" | "rejected"
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      sites: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          default_staffing: Json | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          default_staffing?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          default_staffing?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      shifts: {
        Row: {
          id: string
          organization_id: string
          site_id: string
          date: string
          shift_type: string
          start_time: string
          end_time: string
          required_staffing: Json
          assigned_employees: string[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          site_id: string
          date: string
          shift_type: string
          start_time: string
          end_time: string
          required_staffing: Json
          assigned_employees?: string[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          site_id?: string
          date?: string
          shift_type?: string
          start_time?: string
          end_time?: string
          required_staffing?: Json
          assigned_employees?: string[]
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          }
        ]
      }
      preferences: {
        Row: {
          id: string
          employee_id: string
          date: string
          preference_type: "unavailable" | "preferred" | "avoid"
          shift_type: string | null
          is_vacation: boolean
          credit_used: number
          reason: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          date: string
          preference_type: "unavailable" | "preferred" | "avoid"
          shift_type?: string | null
          is_vacation?: boolean
          credit_used?: number
          reason?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string
          preference_type?: "unavailable" | "preferred" | "avoid"
          shift_type?: string | null
          is_vacation?: boolean
          credit_used?: number
          reason?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preferences_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      schedules: {
        Row: {
          id: string
          organization_id: string
          title: string
          start_date: string
          end_date: string
          status: "draft" | "published" | "archived"
          ai_solver_result: Json | null
          manual_adjustments: Json | null
          statistics: Json | null
          created_by: string
          published_by: string | null
          published_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          title: string
          start_date: string
          end_date: string
          status?: "draft" | "published" | "archived"
          ai_solver_result?: Json | null
          manual_adjustments?: Json | null
          statistics?: Json | null
          created_by: string
          published_by?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          title?: string
          start_date?: string
          end_date?: string
          status?: "draft" | "published" | "archived"
          ai_solver_result?: Json | null
          manual_adjustments?: Json | null
          statistics?: Json | null
          created_by?: string
          published_by?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      credit_transactions: {
        Row: {
          id: string
          employee_id: string
          amount: number
          transaction_type: "used" | "refunded" | "granted"
          reference_id: string | null
          reference_type: string | null
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          amount: number
          transaction_type: "used" | "refunded" | "granted"
          reference_id?: string | null
          reference_type?: string | null
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          amount?: number
          transaction_type?: "used" | "refunded" | "granted"
          reference_id?: string | null
          reference_type?: string | null
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      coalesce_updated_at_or_created_at_sort: {
        Args: {
          target_table: string
          selected_columns?: string
          sort_direction?: string
          nulls_position?: string
        }
        Returns: Json[]
      }
    }
    Enums: {
      current_status: "todo" | "in-progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
