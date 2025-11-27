import React from 'react'

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

interface EmptyStateProps {
    title: string
    description: string
    action?: React.ReactNode
    icon?: React.ReactNode
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">{icon}</EmptyMedia>
                <EmptyTitle className="text-base font-bold">{title}</EmptyTitle>
                <EmptyDescription className="text-sm">
                    {description}
                </EmptyDescription>
            </EmptyHeader>
            {action && <EmptyContent>{action}</EmptyContent>}
        </Empty>
    )
}
export default EmptyState
