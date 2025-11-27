import React from 'react'

import { Navigate } from 'react-router-dom'

import { useAuthStore, ProtectedRouteProps } from '@/features/popup'

export function ProtectedRoute({ children, ...props }: ProtectedRouteProps) {
    const { user, loading } = useAuthStore()

    // Se ainda está carregando, o AuthProvider já mostra o loader
    // Então aqui só precisamos verificar se tem usuário
    if (!loading && !user) {
        return <Navigate to="/login" replace />
    }

    return <div {...props}>{children}</div>
}
