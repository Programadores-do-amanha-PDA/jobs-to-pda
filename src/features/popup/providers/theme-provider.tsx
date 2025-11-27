import React, { useEffect, useState } from 'react'
import { useThemeStore } from '@/features/popup/stores/theme.store'

interface ThemeProviderProps {
    children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isReady, setIsReady] = useState(false)
    const initializeTheme = useThemeStore((state) => state.initializeTheme)
    const initialized = useThemeStore((state) => state.initialized)

    useEffect(() => {
        // Initialize theme asynchronously before rendering children
        const init = async () => {
            await initializeTheme()
        }
        init()
    }, [initializeTheme])

    useEffect(() => {
        // Mark as ready once theme is initialized
        if (initialized) {
            setIsReady(true)
        }
    }, [initialized])

    // Don't render children until theme is initialized
    if (!isReady) {
        return null
    }

    return <>{children}</>
}
