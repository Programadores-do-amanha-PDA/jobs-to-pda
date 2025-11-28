import React, { useEffect, useMemo } from 'react'

import {
    ApplicationsMilestonesCard,
    JobsOnPlatformCard,
    JobsSentCard,
} from '../components'
import { JobsApplicationsCard } from '../components/home/jobs-applications-card'
import { useJobStore } from '../stores/jobs.store'
import EmptyState from '../components/shared/empty-state'
import { IconArrowRight, IconFileSad } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import Browser from 'webextension-polyfill'

export function HomePage() {
    const [goalApplications, setGoalApplications] = React.useState(0)

    const { getAllJobs, jobs, isLoading } = useJobStore()

    const applications = useMemo(
        () => jobs?.flatMap((job) => job.applications),
        [jobs]
    )

    useEffect(() => {
        setGoalApplications(40)

        const handleGetJobs = async () => {
            await getAllJobs()
            console.log(jobs)
        }

        handleGetJobs()
    }, [])

    if (isLoading && jobs.length === 0)
        return (
            <EmptyState
                title="Nenhuma vaga encontrada"
                description="Infelizmente não temos nenhuma vaga para disponibilizar"
                icon={<IconFileSad />}
                action={
                    <Button
                        variant="link"
                        className="text-primary-foreground"
                        onClick={() =>
                            Browser.tabs.create({
                                url: 'https://linkedin.com/jobs',
                            })
                        }
                    >
                        Comece a buscar vagas
                        <IconArrowRight className="-rotate-12" />
                    </Button>
                }
            />
        )

    return (
        <div className="w-full h-max flex flex-col gap-4">
            <div className="flex gap-4">
                <JobsSentCard jobsSended={jobs.length} isLoading={isLoading} />
                <JobsApplicationsCard
                    applications={applications.length || 0}
                    isLoading={isLoading}
                />
            </div>

            <ApplicationsMilestonesCard
                milestones={Array.from(
                    { length: goalApplications / 10 },
                    (_, i) => (i + 1) * 10
                )}
                currentApplications={applications.length || 0}
                goalApplications={goalApplications}
                isLoading={isLoading}
            />

            <JobsOnPlatformCard allJobs={jobs.length} />
        </div>
    )
}
