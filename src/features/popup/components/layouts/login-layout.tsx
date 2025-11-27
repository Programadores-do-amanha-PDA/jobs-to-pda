import React from 'react'

// Local imports
import { Header, LoginLayoutProps } from '@/features/popup'

export function LoginLayout({ children, ...props }: LoginLayoutProps) {
    return (
        <div
            {...props}
            className="h-full w-full flex flex-col items-center justify-center bg-primary p-2 gap-2"
        >
            <Header className="flex-col py-4 *:last:hidden **:text-xl **:[&_img]:size-10 h-max" />
            <main className="w-full h-max flex bg-background rounded-md p-3">
                {children}
            </main>
        </div>
    )
}
