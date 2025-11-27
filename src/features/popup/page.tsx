import React from 'react'
import { RouterProvider } from 'react-router/dom'
import { createRoot } from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/features/popup/router'
import '@/styles/input.css'
import { AuthProvider } from '@/features/popup'

function Page() {
    const root = document.getElementById('app')
    if (root) {
        return createRoot(root).render(
            <>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
                <Toaster />
            </>
        )
    }
}

export default Page()
