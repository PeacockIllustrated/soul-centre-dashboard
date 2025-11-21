export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            clients: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    first_name: string
                    last_name: string
                    email: string | null
                    phone: string | null
                    preferred_contact_method: 'email' | 'phone' | null
                    source: string | null
                    notes: string | null
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    first_name: string
                    last_name: string
                    email?: string | null
                    phone?: string | null
                    preferred_contact_method?: 'email' | 'phone' | null
                    source?: string | null
                    notes?: string | null
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    first_name?: string
                    last_name?: string
                    email?: string | null
                    phone?: string | null
                    preferred_contact_method?: 'email' | 'phone' | null
                    source?: string | null
                    notes?: string | null
                    is_active?: boolean
                }
            }
            services: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    category: 'energy_healing' | 'counselling' | 'coaching' | 'other' | null
                    description: string | null
                    duration_minutes: number
                    base_price: number
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    category?: 'energy_healing' | 'counselling' | 'coaching' | 'other' | null
                    description?: string | null
                    duration_minutes: number
                    base_price: number
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    category?: 'energy_healing' | 'counselling' | 'coaching' | 'other' | null
                    description?: string | null
                    duration_minutes?: number
                    base_price?: number
                    is_active?: boolean
                }
            }
            event_templates: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    default_description: string | null
                    default_duration_minutes: number | null
                    default_price: number | null
                    default_capacity: number | null
                    default_location: string | null
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    default_description?: string | null
                    default_duration_minutes?: number | null
                    default_price?: number | null
                    default_capacity?: number | null
                    default_location?: string | null
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    default_description?: string | null
                    default_duration_minutes?: number | null
                    default_price?: number | null
                    default_capacity?: number | null
                    default_location?: string | null
                    is_active?: boolean
                }
            }
            event_instances: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    event_template_id: string | null
                    title: string
                    description: string | null
                    start_time: string
                    end_time: string
                    location: string | null
                    capacity: number | null
                    price: number | null
                    status: 'scheduled' | 'completed' | 'cancelled'
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    event_template_id?: string | null
                    title: string
                    description?: string | null
                    start_time: string
                    end_time: string
                    location?: string | null
                    capacity?: number | null
                    price?: number | null
                    status?: 'scheduled' | 'completed' | 'cancelled'
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    event_template_id?: string | null
                    title?: string
                    description?: string | null
                    start_time?: string
                    end_time?: string
                    location?: string | null
                    capacity?: number | null
                    price?: number | null
                    status?: 'scheduled' | 'completed' | 'cancelled'
                }
            }
            event_attendees: {
                Row: {
                    id: string
                    created_at: string
                    event_instance_id: string | null
                    client_id: string | null
                    status: 'booked' | 'cancelled' | 'attended' | 'no_show'
                    payment_status: 'unpaid' | 'paid' | 'comped'
                    amount_paid: number | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    event_instance_id?: string | null
                    client_id?: string | null
                    status?: 'booked' | 'cancelled' | 'attended' | 'no_show'
                    payment_status?: 'unpaid' | 'paid' | 'comped'
                    amount_paid?: number | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    event_instance_id?: string | null
                    client_id?: string | null
                    status?: 'booked' | 'cancelled' | 'attended' | 'no_show'
                    payment_status?: 'unpaid' | 'paid' | 'comped'
                    amount_paid?: number | null
                }
            }
            sessions: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    client_id: string | null
                    service_id: string | null
                    start_time: string
                    end_time: string
                    location: string | null
                    status: 'booked' | 'completed' | 'cancelled' | 'no_show'
                    payment_status: 'unpaid' | 'paid' | 'comped'
                    amount_paid: number | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    client_id?: string | null
                    service_id?: string | null
                    start_time: string
                    end_time: string
                    location?: string | null
                    status?: 'booked' | 'completed' | 'cancelled' | 'no_show'
                    payment_status?: 'unpaid' | 'paid' | 'comped'
                    amount_paid?: number | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    client_id?: string | null
                    service_id?: string | null
                    start_time?: string
                    end_time?: string
                    location?: string | null
                    status?: 'booked' | 'completed' | 'cancelled' | 'no_show'
                    payment_status?: 'unpaid' | 'paid' | 'comped'
                    amount_paid?: number | null
                }
            }
            session_notes: {
                Row: {
                    id: string
                    created_at: string
                    session_id: string | null
                    note_type: 'pre' | 'post' | 'general' | null
                    content: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    session_id?: string | null
                    note_type?: 'pre' | 'post' | 'general' | null
                    content?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    session_id?: string | null
                    note_type?: 'pre' | 'post' | 'general' | null
                    content?: string | null
                }
            }
            brand_settings: {
                Row: {
                    id: string
                    primary_quote: string | null
                    primary_color: string | null
                    accent_color: string | null
                }
                Insert: {
                    id?: string
                    primary_quote?: string | null
                    primary_color?: string | null
                    accent_color?: string | null
                }
                Update: {
                    id?: string
                    primary_quote?: string | null
                    primary_color?: string | null
                    accent_color?: string | null
                }
            }
        }
    }
}
