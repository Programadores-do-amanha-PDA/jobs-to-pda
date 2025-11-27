import { createClient } from '@supabase/supabase-js'
import browser from 'webextension-polyfill'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const extensionStorageAdapter = {
    async getItem(key: string): Promise<string | null> {
        const result = await browser.storage.local.get(key)
        return result[key] ?? null
    },
    async setItem(key: string, value: string): Promise<void> {
        await browser.storage.local.set({ [key]: value })
    },
    async removeItem(key: string): Promise<void> {
        await browser.storage.local.remove(key)
    },
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    auth: {
        storage: extensionStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
    },
})
