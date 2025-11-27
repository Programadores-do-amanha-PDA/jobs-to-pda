import React from 'react'

import { ApplicationsMilestoneItem } from './applications-milestone-item'

export const ApplicationsMilestonesCard = ({
    milestones,
    currentApplications,
    goalApplications,
}: {
    milestones: number[]
    currentApplications: number
    goalApplications: number
}) => {
    return (
        <section className="w-full h-max flex flex-col gap-3 border border-border/50 rounded-xl p-4 bg-card/30">
            {/* Title */}
            <h3 className="text-base font-bold text-foreground">
                Meta mensal de aplicação
            </h3>

            {/* Progress Container */}
            <div className="w-full flex flex-col gap-3">
                {/* Progress Bar with Icons */}
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

                {/* Current Progress Text */}
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {currentApplications} / {goalApplications} CANDIDATURAS
                </p>
            </div>
        </section>
    )
}
