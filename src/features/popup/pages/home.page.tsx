import React from 'react'

import { IconFileCheck, IconSend } from '@tabler/icons-react'
import { ApplicationsMilestonesCard, JobsOnPlatformCard } from '../components'

export function HomePage() {
    const currentApplications = 35
    const goalApplications = 50

    return (
        <div className="w-full h-max flex flex-col gap-4">
            <div className="flex gap-4">
                <section className="w-1/2 h-max flex flex-col items-center justify-center gap-2 border rounded-lg p-2">
                    <figure className="size-8 flex items-center justify-center rounded-full bg-primary/35 dark:bg-secondary/35">
                        <IconSend className="size-5 stroke-primary-foreground" />
                    </figure>
                    <main>
                        <p className="text-center text-base font-semibold">
                            10
                        </p>
                        <p className="text-center text-xs">Vagas enviadas</p>
                    </main>
                </section>
                <section className="w-1/2 h-max flex flex-col items-center justify-center gap-2 border rounded-lg p-2">
                    <figure className="size-8 flex items-center justify-center rounded-full bg-secondary/35 dark:bg-primary">
                        <IconFileCheck className="size-5 stroke-secondary-foreground" />
                    </figure>
                    <main>
                        <p className="text-center text-base font-semibold">
                            10
                        </p>
                        <p className="text-center text-xs">Vagas inscritas</p>
                    </main>
                </section>
            </div>

            <ApplicationsMilestonesCard
                milestones={Array.from(
                    { length: goalApplications / 10 },
                    (_, i) => (i + 1) * 10
                )}
                currentApplications={currentApplications}
                goalApplications={goalApplications}
            />

            <JobsOnPlatformCard />
        </div>
    )
}
