import { createClient } from '@supabase/supabase-js'
import browser from 'webextension-polyfill'

import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../.env.local.js'

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
