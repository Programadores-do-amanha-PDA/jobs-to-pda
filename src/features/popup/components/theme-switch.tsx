import React, { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const ThemeSwitcher: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark')
        } else {
            setIsDarkMode(false)
        }
    }, [])

    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', isDarkMode)
        localStorage.setItem('theme', theme)
    }, [isDarkMode])

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="rounded-full!"
        >
            {isDarkMode ? (
                <Sun className="size-5" />
            ) : (
                <Moon className="size-5" />
            )}
        </Button>
    )
}
