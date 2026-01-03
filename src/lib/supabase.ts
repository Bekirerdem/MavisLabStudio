import { createClient } from '@supabase/supabase-js'

// Supabase client for browser-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export interface Service {
  id: string
  name: string
  price: number
  duration: number // in minutes
}

export interface Customer {
  id: string
  phone: string
  name: string | null
  preferences: string | null
  last_visit: string | null
}

export interface Appointment {
  id: string
  customer_name: string
  service_id: string | null
  appointment_date: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}

// Helper functions
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching services:', error)
    return []
  }
  return data || []
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      customer_name: appointment.customer_name,
      service_id: appointment.service_id,
      appointment_date: appointment.appointment_date,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating appointment:', error)
    return null
  }
  return data
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching service:', error)
    return null
  }
  return data
}

export async function getServiceByName(name: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .ilike('name', `%${name}%`)
    .single()
  
  if (error) {
    console.error('Error fetching service by name:', error)
    return null
  }
  return data
}
