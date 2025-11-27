import React, { useEffect } from 'react'

import { CustomLoader, useAuthStore } from '@/features/popup'

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
