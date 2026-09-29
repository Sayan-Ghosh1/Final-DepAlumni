import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxuiikbyhwuzaljajbjo.supabase.co';
const supabaseAnonKey = 'sb_publishable_LiNqM88RwLOUeHhdFYqGdg_9LM2sone';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
