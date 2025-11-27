import React from 'react'
import { ThemeSwitcher } from './theme-switch'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { AuthUserWithProfileT } from '@/types'

import pdaSymbolYellowBackground from '@/assets/logos/pda-symbol-yellow-background.png'
import pdaSymbolPurpleBackground from '@/assets/logos/pda-symbol-purple-background.png'

type HeaderProps = {
    className?: string
    user?: AuthUserWithProfileT | null
} & React.HTMLAttributes<HTMLDivElement>

export const Header = ({ className, user, ...props }: HeaderProps) => {
    return (
        <header
            className={cn(
                'flex justify-between items-center w-full h-10 p-2',
                className
            )}
            {...props}
        >
            <section className="flex gap-1 items-center">
                <h1 className="font-bold text-foreground text-base">Jobs to</h1>
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

            <figure className="w-max flex gap-2 items-center">
                {user && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full!"
                    >
                        <Avatar>
                            <AvatarImage src={user.profile?.avatar_url || ''} />
                            <AvatarFallback>
                                {user.user_metadata.name
                                    .charAt(0)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                )}
                <ThemeSwitcher />
            </figure>
        </header>
    )
}
