import React from 'react'
import { RouterProvider } from 'react-router/dom'
import { createRoot } from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner'
import { routers } from '@/router'
import '@/styles/input.css'
import AuthProvider from '@/providers/auth-provider'
import PopupLayout from '@/components/shared/layouts/pop-up-layout'

const root = document.getElementById('app')
if (root) {
    createRoot(root).render(
        <>
            <PopupLayout>
                <AuthProvider>
                    <RouterProvider router={routers} />
                </AuthProvider>
            </PopupLayout>
            <Toaster />
        </>
    )
}
