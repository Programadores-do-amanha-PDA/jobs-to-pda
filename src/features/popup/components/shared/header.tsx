import React from 'react'
import { ThemeSwitcher } from './theme-switch'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import pdaSymbolYellowBackground from '@/assets/logos/pda-symbol-yellow-background.png'
import pdaSymbolPurpleBackground from '@/assets/logos/pda-symbol-purple-background.png'
import { getFirstLastInitials } from '@/utils/get-first-last-initials.utils'

import { useAuth } from '@/features/popup'

type HeaderProps = {
    className?: string
} & React.HTMLAttributes<HTMLDivElement>

export const Header = ({ className, ...props }: HeaderProps) => {
    const { user, handleSignOut } = useAuth()

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
                <ThemeSwitcher />
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-full!">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full! cursor-pointer"
                            >
                                <Avatar>
                                    {user.profile?.avatar_url && (
                                        <AvatarImage
                                            src={user.profile.avatar_url}
                                        />
                                    )}
                                    <AvatarFallback className="text-foreground">
                                        {getFirstLastInitials(
                                            user.profile?.full_name || ''
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-max" align="end">
                            <DropdownMenuLabel className="flex flex-col gap-1">
                                <p className="font-medium">
                                    {user.profile?.full_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {user.email}
                                </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleSignOut}
                                variant="destructive"
                                className="cursor-pointer"
                            >
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </figure>
        </header>
    )
}
