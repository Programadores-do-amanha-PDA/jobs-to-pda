import React from 'react'
import { IconFileCheck } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'

export const JobsApplicationsCard = ({
    applications,
    isLoading,
}: {
    applications: number
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
            <figure className="size-8 flex items-center justify-center rounded-full bg-secondary/35 dark:bg-primary">
                <IconFileCheck className="size-5 stroke-secondary-foreground" />
            </figure>
            <main>
                <p className="text-center text-base font-semibold">
                    {applications}
                </p>
                <p className="text-center text-xs">Vagas inscritas</p>
            </main>
        </section>
    )
}
