import React from 'react'

import { IconArrowRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import pdaJobsIcon from '@/assets/logos/pda-jobs-icon.png'
import Browser from 'webextension-polyfill'

export const JobsOnPlatformCard = () => {
    const PLATFORM_PATH = import.meta.env.VITE_PLATFORM_PATH
    return (
        <section className="w-full h-max flex items-center justify-between gap-2 border rounded-lg p-2">
            <figure className="size-24 min-w-24 flex items-center justify-center rounded-lg">
                <img
                    src={pdaJobsIcon}
                    alt="Vagas na plataforma. Logo"
                    className="size-20"
                />
            </figure>
            <main className="w-full flex flex-col items-center justify-center gap-2 px-2">
                <div className="w-full flex flex-col items-center justify-center py-2">
                    <p className="text-center text-base font-semibold">10</p>
                    <p className="text-center text-xs">Vagas na plataforma</p>
                </div>

                <Button
                    variant="link"
                    className="cursor-pointer p-0! w-auto! h-auto! text-primary-foreground"
                    onClick={() =>
                        Browser.tabs.create({
                            url: `${PLATFORM_PATH}/dashboard/jobs`,
                        })
                    }
                >
                    Ver vagas <IconArrowRight className="ml-2 -rotate-12" />
                </Button>
            </main>
        </section>
    )
}
