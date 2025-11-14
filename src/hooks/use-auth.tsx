import { redirect } from 'react-router'
import { signOut } from '@/actions'
import { useAuthStore } from '@/stores'

export default function useAuth() {
    const store = useAuthStore()

    const handleSignOut = async () => {
        await signOut()
        store.reset()
        return redirect('/login')
    }

    return {
        ...store,
        handleSignOut,
    }
}
