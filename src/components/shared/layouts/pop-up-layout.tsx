import React from 'react'

// Local imports
import Header from '../header'

export default function PopupLayout({
    children,
}: {
    children: React.ReactElement
}) {
    return (
        <div className="h-full w-full flex flex-col items-center bg-primary p-2 gap-1">
            <Header />
            <main className="w-full h-full flex bg-background rounded-md p-3">
                {children}
            </main>
        </div>
    )
}
