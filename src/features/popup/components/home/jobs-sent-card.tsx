import React from 'react'
import { IconSend } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'

export const JobsSentCard = ({
    jobsSended,
    isLoading,
}: {
    jobsSended: number
    isLoading: boolean
}) => {
    if (isLoading)
        return (
            <section className="w-1/2 h-max flex flex-col items-center justify-center gap-2 border rounded-lg p-2">
                <figure className="size-8 flex items-center justify-center rounded-full bg-muted">
                    <Skeleton className="size-5" />
                </figure>
                <main>
                    <Skeleton className="size-5" />
                    <Skeleton className="size-5" />
                </main>
            </section>
        )

    return (
        <section className="w-1/2 h-max flex flex-col items-center justify-center gap-2 border rounded-lg p-2">
            <figure className="size-8 flex items-center justify-center rounded-full bg-primary/35 dark:bg-secondary/35">
                <IconSend className="size-5 stroke-primary-foreground" />
            </figure>
            <main>
                <p className="text-center text-base font-semibold">
                    {jobsSended}
                </p>
                <p className="text-center text-xs">Vagas enviadas</p>
            </main>
        </section>
    )
}
