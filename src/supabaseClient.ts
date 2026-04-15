import { createClient } from '@supabase/supabase-js'

// These should come from environment variables
const supabaseUrl = 'https://xnrpuanrcmnmkhvhiqnb.supabase.co'
const supabaseAnonKey = 'sb_publishable_aWxkeFrMTqfLIPczx5UwHw_as-C_N0r'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
