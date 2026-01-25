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
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    role: 'user' | 'admin'
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role?: 'user' | 'admin'
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role?: 'user' | 'admin'
                    created_at?: string
                }
                Relationships: []
            }
            semesters: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    price: number
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    price: number
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    price?: number
                    image_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            subjects: {
                Row: {
                    id: string
                    semester_id: string
                    title: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    semester_id: string
                    title: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    semester_id?: string
                    title?: string
                    description?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "subjects_semester_id_fkey"
                        columns: ["semester_id"]
                        referencedRelation: "semesters"
                        referencedColumns: ["id"]
                    }
                ]
            }
            documents: {
                Row: {
                    id: string
                    subject_id: string
                    title: string
                    file_url: string
                    type: 'pdf' | 'video'
                    created_at: string
                }
                Insert: {
                    id?: string
                    subject_id: string
                    title: string
                    file_url: string
                    type: 'pdf' | 'video'
                    created_at?: string
                }
                Update: {
                    id?: string
                    subject_id?: string
                    title?: string
                    file_url?: string
                    type?: 'pdf' | 'video'
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "documents_subject_id_fkey"
                        columns: ["subject_id"]
                        referencedRelation: "subjects"
                        referencedColumns: ["id"]
                    }
                ]
            }
            purchases: {
                Row: {
                    id: string
                    user_id: string
                    semester_id: string
                    status: 'pending' | 'completed' | 'failed'
                    payment_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    semester_id: string
                    status?: 'pending' | 'completed' | 'failed'
                    payment_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    semester_id?: string
                    status?: 'pending' | 'completed' | 'failed'
                    payment_id?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "purchases_semester_id_fkey"
                        columns: ["semester_id"]
                        referencedRelation: "semesters"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "purchases_user_id_fkey"
                        columns: ["user_id"]
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
