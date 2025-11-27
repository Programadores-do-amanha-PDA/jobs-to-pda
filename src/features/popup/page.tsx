import React from 'react'
import { RouterProvider } from 'react-router/dom'
import { createRoot } from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/features/popup/router'
import '@/styles/input.css'
import { AuthProvider } from '@/features/popup'
import { ThemeProvider } from '@/features/popup/providers/theme-provider'

function Page() {
    const root = document.getElementById('app')
    if (root) {
        return createRoot(root).render(
            <>
                <ThemeProvider>
                    <AuthProvider>
                        <RouterProvider router={router} />
                    </AuthProvider>
                    <Toaster />
                </ThemeProvider>
            </>
        )
    }
}

export default Page()
