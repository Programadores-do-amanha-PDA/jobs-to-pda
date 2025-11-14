import React from 'react'

import logo_symbol from '@/assets/logos/simbole-pda-horizontal-white-background.png'

const Loader = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center justify-center rounded-md text-primary-foreground">
                    <img
                        src={logo_symbol}
                        alt="Programadores do Amanhã. Logo"
                        width={200}
                        height={200}
                        className="animate-spin"
                    />
                </div>
            </div>
        </div>
    )
}

export default Loader
