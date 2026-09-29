import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mxuiikbyhwuzaljajbjo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LiNqM88RwLOUeHhdFYqGdg_9LM2sone';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
