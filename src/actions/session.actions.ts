import { supabase } from '@/lib/supabase'

export const getAuthUser = async (jwt: string) => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser(jwt)

        if (!user) throw 'user not found'
        return user
    } catch (error) {
        console.error('Error fetching auth user:', error)
        return null
    }
}

export const getSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        return data.session
    } catch (error) {
        console.error('Error fetching session:', error)
        return false
    }
}

export const setSession = async (
    access_token: string,
    refresh_token: string
) => {
    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        })
        if (error) throw { error: error }
        return { session: session }
    } catch (error) {
        console.error(error)
        return { error: error }
    }
}

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut()

        if (error) throw error

        return true
    } catch (error) {
        console.error(error)

        return false
    }
}
