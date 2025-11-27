import React from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/features/popup/stores/theme.store'

export const ThemeSwitcher: React.FC = () => {
    const isDarkMode = useThemeStore((state) => state.isDarkMode)
    const toggleTheme = useThemeStore((state) => state.toggleTheme)

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
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
