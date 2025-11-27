import React from 'react'

import { createMemoryRouter } from 'react-router-dom'

import {
    DefaultLayout,
    LoginLayout,
    LoginPage,
    HomePage,
} from '@/features/popup'

export const router = createMemoryRouter(
    [
        {
            path: '/login',
            element: (
                <LoginLayout>
                    <LoginPage />
                </LoginLayout>
            ),
        },
        {
            path: '/home',
            element: (
                <DefaultLayout>
                    <HomePage />
                </DefaultLayout>
            ),
        },
    ],
    {
        initialEntries: ['/home'],
    }
)
