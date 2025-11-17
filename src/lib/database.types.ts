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
            employees: {
                Row: {
                    id: number
                    first_name: string
                    last_name: string
                    email: string
                    role: string
                    phone: string
                    joined_at: string
                    created_at: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    id?: number
                    first_name: string
                    last_name: string
                    email: string
                    role: string
                    phone: string
                    joined_at?: string
                    created_at?: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    id?: number
                    first_name?: string
                    last_name?: string
                    email?: string
                    role?: string
                    phone?: string
                    joined_at?: string
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                }
            }
            tasks: {
                Row: {
                    id: number
                    title: string
                    description: string | null
                    status: 'todo' | 'in-progress' | 'done'
                    priority: 'low' | 'medium' | 'high'
                    due_date: string
                    assigned_to: number
                    created_at: string
                    updated_at: string
                    user_id: string
                    parent_task_id: number | null
                    extended_data: Json | null
                }
                Insert: {
                    id?: number
                    title: string
                    description?: string | null
                    status?: 'todo' | 'in-progress' | 'done'
                    priority?: 'low' | 'medium' | 'high'
                    due_date: string
                    assigned_to: number
                    created_at?: string
                    updated_at?: string
                    user_id: string
                    parent_task_id?: number | null
                    extended_data?: Json | null
                }
                Update: {
                    id?: number
                    title?: string
                    description?: string | null
                    status?: 'todo' | 'in-progress' | 'done'
                    priority?: 'low' | 'medium' | 'high'
                    due_date?: string
                    assigned_to?: number
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                    parent_task_id?: number | null
                    extended_data?: Json | null
                }
            }
        }
    }
}
