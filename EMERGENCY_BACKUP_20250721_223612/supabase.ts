import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nleqplwwothhxgrovnjw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg'

// Check if environment variables are properly set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables not found. Using fallback values.')
  console.warn('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)

// Database types (you can generate these with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      loads: {
        Row: {
          id: string
          load_id: string
          origin: string
          destination: string
          weight: string
          rate: string
          status: string
          driver: string
          pickup_date: string
          delivery_date: string
          customer: string
          miles: string
          profit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          load_id: string
          origin: string
          destination: string
          weight: string
          rate: string
          status: string
          driver: string
          pickup_date: string
          delivery_date: string
          customer: string
          miles: string
          profit: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          load_id?: string
          origin?: string
          destination?: string
          weight?: string
          rate?: string
          status?: string
          driver?: string
          pickup_date?: string
          delivery_date?: string
          customer?: string
          miles?: string
          profit?: string
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          license_number: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          license_number: string
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          license_number?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          vehicle_id: string
          make: string
          model: string
          year: string
          vin: string
          license_plate: string
          status: string
          driver_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          make: string
          model: string
          year: string
          vin: string
          license_plate: string
          status: string
          driver_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          make?: string
          model?: string
          year?: string
          vin?: string
          license_plate?: string
          status?: string
          driver_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
