import React from 'react'
import { cn } from '@/lib/utils'
import { IconCheck } from '@tabler/icons-react'

export const ApplicationsMilestoneItem = ({
    milestones,
    currentApplications,
    index,
    milestone,
}: {
    milestones: number[]
    currentApplications: number
    index: number
    milestone: number
}) => {
    const isFilled = currentApplications >= milestone
    const isFirst = index === 0
    const previousMilestone = isFirst ? 0 : milestones[index - 1]
    const isSegmentComplete = currentApplications >= milestone

    // Calculate partial progress for current segment
    const isInProgress =
        !isFirst &&
        currentApplications > previousMilestone &&
        currentApplications < milestone
    const progressPercentage = isInProgress
        ? ((currentApplications - previousMilestone) /
              (milestone - previousMilestone)) *
          100
        : 0

    return (
        <>
            {!isFirst && (
                <div
                    key={`progress-segment-${index}`}
                    className="h-6 min-w-8 flex-1 rounded-sm bg-muted overflow-hidden"
                    style={
                        isInProgress
                            ? {
                                  background: `linear-gradient(to right, var(--primary) ${progressPercentage}%, var(--muted) ${progressPercentage}%)`,
                              }
                            : isSegmentComplete
                              ? {
                                    background: 'var(--primary)',
                                }
                              : undefined
                    }
                />
            )}

            <div
                key={`progress-marker-${index}`}
                className={cn(
                    'shrink-0 size-8 rounded-md flex items-center justify-center z-10',
                    isFilled
                        ? 'bg-primary'
                        : 'bg-primary/20 border-primary-foreground/30 border-2'
                )}
            >
                {isFilled ? (
                    <IconCheck className="size-5 stroke-3 text-primary-foreground" />
                ) : (
                    <span className="text-sm font-bold text-primary-foreground">
                        {milestone}
                    </span>
                )}
            </div>
        </>
    )
}
