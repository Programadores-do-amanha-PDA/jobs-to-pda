import React from 'react'

// Local imports
import { DefaultLayoutProps, ProtectedRoute, Header } from '@/features/popup'

export function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <ProtectedRoute className="h-full w-full flex flex-col items-center bg-primary p-2 gap-1">
            <Header />
            <div className="w-full h-full flex bg-background rounded-md p-3">
                {children}
            </div>
        </ProtectedRoute>
    )
}
