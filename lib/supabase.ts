import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations (API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Database types (based on our schema)
export interface Driver {
  id: string
  name: string
  email?: string
  phone: string
  license_number: string
  assigned_truck_id?: string
  dispatcher_id?: string
  dispatcher_name?: string
  dispatcher_phone?: string
  dispatcher_email?: string
  current_location?: string
  eld_status?: string
  hours_remaining?: number
  auth_uid?: string
  created_at: string
  updated_at: string
}

export interface Load {
  id: string
  broker_name: string
  dispatcher_id?: string
  assigned_driver_id?: string
  origin: string
  destination: string
  rate: number
  distance?: string
  weight?: string
  equipment: string
  status: 'Available' | 'Assigned' | 'In Transit' | 'Delivered'
  pickup_date: string
  delivery_date: string
  special_instructions?: string
  created_at: string
  updated_at: string
}

export interface LoadConfirmation {
  id: string
  load_id: string
  driver_id: string
  confirmed_at: string
  driver_signature?: string
  notes?: string
  created_at: string
}

export interface Delivery {
  id: string
  load_id: string
  driver_id: string
  receiver_name?: string
  receiver_signature?: string
  delivery_time?: string
  notes?: string
  status: 'pending' | 'completed'
  created_at: string
}

export interface FileRecord {
  id: string
  load_id?: string
  driver_id?: string
  confirmation_id?: string
  delivery_id?: string
  file_type: 'confirmation_photo' | 'pickup_photo' | 'delivery_photo'
  file_url: string
  cloudinary_id?: string
  file_size?: number
  metadata?: any
  uploaded_at: string
}

export interface Notification {
  id: string
  driver_id?: string
  message: string
  type: 'load_assignment' | 'dispatch_update' | 'system_alert'
  read_at?: string
  metadata?: any
  created_at: string
}
