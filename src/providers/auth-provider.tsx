import { useEffect } from 'react'
import CustomLoader from '@/components/shared/custom-loader'
import { useAuthStore } from '@/stores/auth-store'
import React from 'react'

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const { loading, fetchSession, user } = useAuthStore()

    console.log(user)

    useEffect(() => {
        fetchSession()
    }, [])

    if (loading) {
        return <CustomLoader />
    }

    return children
}
