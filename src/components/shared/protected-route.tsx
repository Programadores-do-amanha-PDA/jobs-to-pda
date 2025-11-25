import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import React from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuthStore()

    // Se ainda está carregando, o AuthProvider já mostra o loader
    // Então aqui só precisamos verificar se tem usuário
    if (!loading && !user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
