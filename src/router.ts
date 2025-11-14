import LoginPage from '@/features/login/page'
import { createMemoryRouter } from 'react-router'

export const routers = createMemoryRouter(
    [
        {
            path: '/',
            Component: LoginPage,
        },
        {
            path: '/login',
            Component: LoginPage,
        },
    ],
    {
        initialEntries: ['/login'],
        initialIndex: 0,
    }
)
