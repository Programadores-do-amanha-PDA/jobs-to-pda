import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import Browser from 'webextension-polyfill'

type Theme = 'light' | 'dark'

interface ThemeState {
    isDarkMode: boolean
    theme: Theme
    initialized: boolean
}

interface ThemeActions {
    toggleTheme: () => Promise<void>
    setTheme: (theme: Theme) => Promise<void>
    initializeTheme: () => Promise<void>
}

const initialState: ThemeState = {
    isDarkMode: false,
    theme: 'light',
    initialized: false,
}

export const useThemeStore = create<ThemeState & ThemeActions>()(
    devtools(
        (set) => ({
            ...initialState,

            toggleTheme: async () => {
                const state = useThemeStore.getState()
                const newIsDarkMode = !state.isDarkMode
                const newTheme: Theme = newIsDarkMode ? 'dark' : 'light'

                // Apply theme to DOM
                document.documentElement.classList.toggle('dark', newIsDarkMode)
                await Browser.storage.local.set({ theme: newTheme })

                set({
                    isDarkMode: newIsDarkMode,
                    theme: newTheme,
                })
            },

            setTheme: async (theme: Theme) => {
                const isDarkMode = theme === 'dark'

                // Apply theme to DOM
                document.documentElement.classList.toggle('dark', isDarkMode)
                await Browser.storage.local.set({ theme })

                set({
                    isDarkMode,
                    theme,
                })
            },

            initializeTheme: async () => {
                const result = await Browser.storage.local.get({
                    theme: 'light',
                })
                const theme: Theme = (result.theme as Theme) || 'light'
                const isDarkMode = theme === 'dark'

                // Apply theme to DOM immediately
                document.documentElement.classList.toggle('dark', isDarkMode)

                set({
                    isDarkMode,
                    theme,
                    initialized: true,
                })
            },
        }),
        { name: 'ThemeStore' }
    )
)
