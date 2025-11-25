import { supabase } from '@/lib/supabase'
import { UserAuthLoginT } from '@/types'

export async function signInWithPassword(userCredentials: UserAuthLoginT) {
    try {
        if (!userCredentials.email || !userCredentials.password)
            throw new Error('Invalid credentials')

        const { data, error } =
            await supabase.auth.signInWithPassword(userCredentials)
        if (error) throw error

        return { error: false, data }
    } catch (error) {
        if (
            error instanceof Error &&
            (error.message === 'Request failed with status code 403' ||
                error.message === 'Email not confirmed')
        ) {
            return { error: true, confirmation: true }
        } else {
            console.error('Error on signInWithPassword', error)
            return { error: true, confirmation: false }
        }
    }
}
