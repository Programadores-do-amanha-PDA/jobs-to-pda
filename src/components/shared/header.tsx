import { LifeBuoy } from 'lucide-react'
import React from 'react'
import ThemeSwitcher from './theme-switch'

import pdaSymbolYellowBackground from '@/assets/logos/pda-symbol-yellow-background.png'
import pdaSymbolPurpleBackground from '@/assets/logos/pda-symbol-purple-background.png'
import { Button } from '../ui/button'

const Header = () => {
    return (
        <header className="flex justify-between items-center w-full h-10 p-2">
            <section className="flex gap-1 items-center">
                <h1 className="font-semibold text-foreground">Jobs to</h1>
                <img
                    src={pdaSymbolYellowBackground}
                    alt="PdA"
                    className="size-7 dark:hidden"
                />
                <img
                    src={pdaSymbolPurpleBackground}
                    alt="PdA"
                    className="size-7 not-dark:hidden"
                />
            </section>

            <figure className="flex gap-4 items-center">
                <Button variant="ghost" size="icon" className="rounded-full!">
                    <LifeBuoy className="size-5" />
                </Button>
                <ThemeSwitcher />
            </figure>
        </header>
    )
}

export default Header
