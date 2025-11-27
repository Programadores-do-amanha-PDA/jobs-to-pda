import React from 'react'

// Local imports
import {
    DefaultLayoutProps,
    ProtectedRoute,
    Header,
    useAuth,
} from '@/features/popup'

export function DefaultLayout({ children }: DefaultLayoutProps) {
    const { user } = useAuth()
    return (
        <div className="h-full w-full flex flex-col items-center bg-primary p-2 gap-1">
            <Header user={user} />
            <ProtectedRoute className="w-full h-full flex bg-background rounded-md p-3">
                {children}
            </ProtectedRoute>
        </div>
    )
}
