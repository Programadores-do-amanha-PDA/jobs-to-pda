import { supabase } from '@/lib/supabase'
import { RolesT } from '@/types'

export const getPermissionsByRole = async (role: RolesT) => {
    try {
        const { data, error } = await supabase
            .from('role_permissions')
            .select('permission')
            .eq('role', role)

        if (error) throw error

        return data.map((item) => item.permission)
    } catch (error) {
        console.error('SELECT -> role_permissions by role', error)
        return []
    }
}
