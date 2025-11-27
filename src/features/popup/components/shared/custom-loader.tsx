import React from 'react'

import pdaSymbolYellowBackground from '@/assets/logos/pda-symbol-yellow-background.png'
import pdaSymbolPurpleBackground from '@/assets/logos/pda-symbol-purple-background.png'

export const CustomLoader = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <img
                src={pdaSymbolYellowBackground}
                alt="Programadores do Amanhã. Logo"
                className="animate-spin dark:hidden size-20"
            />
            <img
                src={pdaSymbolPurpleBackground}
                alt="Programadores do Amanhã. Logo"
                className="animate-spin not-dark:hidden size-20"
            />
        </div>
    )
}
