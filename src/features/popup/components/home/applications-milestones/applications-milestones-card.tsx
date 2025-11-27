import React from 'react'

import { ApplicationsMilestoneItem } from './applications-milestone-item'
import { Skeleton } from '@/components/ui/skeleton'

export const ApplicationsMilestonesCard = ({
    milestones,
    currentApplications,
    goalApplications,
    isLoading,
}: {
    milestones: number[]
    currentApplications: number
    goalApplications: number
    isLoading: boolean
}) => {
    if (isLoading) {
        return (
            <section className="w-full h-max flex flex-col gap-3 border border-border/50 rounded-xl p-4 bg-card/30">
                <Skeleton className="w-full h-3" />

                <div className="w-full flex flex-col gap-3">
                    <div className="w-full relative flex items-center gap-1 flex-wrap py-2">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                    </div>

                    <Skeleton className="w-full h-3" />
                </div>
            </section>
        )
    }

    return (
        <section className="w-full h-max flex flex-col gap-3 border border-border/50 rounded-xl p-4 bg-card/30">
            <h3 className="text-base font-bold text-foreground">
                Meta mensal de aplicação
            </h3>

            <div className="w-full flex flex-col gap-3">
                <div className="w-full relative flex items-center gap-1 flex-wrap py-2">
                    {/* Segments */}
                    {milestones.length > 0 &&
                        milestones.map((milestone, index) => {
                            return (
                                <ApplicationsMilestoneItem
                                    key={`milestone-${index}`}
                                    index={index}
                                    milestone={milestone}
                                    milestones={milestones}
                                    currentApplications={currentApplications}
                                />
                            )
                        })}
                </div>

                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {currentApplications} / {goalApplications} CANDIDATURAS
                </p>
            </div>
        </section>
    )
}
