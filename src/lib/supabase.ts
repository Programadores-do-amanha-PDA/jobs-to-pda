import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
        global: {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
        auth: {
            autoRefreshToken: true,
            persistSession: true,
        },
    }
)
