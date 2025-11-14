import { createClient } from '@supabase/supabase-js'

// env js file
// import {} from "../../.env.local.js";

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
