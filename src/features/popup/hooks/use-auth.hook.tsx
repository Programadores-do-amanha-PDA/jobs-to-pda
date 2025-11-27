import { useNavigate } from 'react-router-dom'
import { signOut } from '@/actions'
import { useAuthStore } from '@/features/popup'

export const useAuth = () => {
    const store = useAuthStore()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        store.reset()
        navigate('/login', { replace: true })
    }

    const isLoggedIn = !!store.user

    return {
        ...store,
        handleSignOut,
        isLoggedIn,
    }
}
