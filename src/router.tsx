import LoginPage from '@/features/popus/login/page'
import { createMemoryRouter } from 'react-router-dom'
import HomePage from './features/popus/home/page'
import ProtectedRoute from './components/shared/protected-route'
import React from 'react'

export const router = () => {
    return createMemoryRouter(
        [
            {
                path: '/login',
                Component: LoginPage,
            },
            {
                path: '/home',
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                ),
            },
        ],
        {
            initialEntries: ['/home'],
        }
    )
}
