import React from 'react'
import ReactDOM from 'react-dom/client'

import PdASymbolWhiteBackground from '@/assets/logos/pda-symbol-white-background.png'
import { Button } from '@/components/ui/button'
import Browser from 'webextension-polyfill'

export const LinkedinApplyToJobButton = ({ jobId }: { jobId: string }) => {
    const PLATFORM_PATH = import.meta.env.VITE_PLATFORM_PATH

    const handleClick = async () => {
        try {
            await Browser.runtime.sendMessage({
                type: 'CREATE_TAB',
                url: `${PLATFORM_PATH}/dashboard/jobs/applications?new-application-by-job=${jobId}`,
            })
        } catch (error) {
            console.error('Jobs To PdA: ❌ Failed to create tab:', error)
        }
    }

    return (
        <Button
            id="job-to-pda"
            className="jobs-apply-button artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml2 bg-white! h-full flex items-center border! border-primary! text-primary-foreground!"
            onClick={handleClick}
            type="button"
            variant="outline"
        >
            <img src={PdASymbolWhiteBackground} className="size-8" />
            <span className="artdeco-button__text text-primary-foreground!">
                Candidatou-se?
            </span>
        </Button>
    )
}

// Helper function to render the React component into a DOM element
export const createLinkedinApplyToJobButton = (jobId: string): HTMLElement => {
    const container = document.createElement('div')
    container.setAttribute('data-pda-button', 'true')

    const root = ReactDOM.createRoot(container)
    root.render(<LinkedinApplyToJobButton jobId={jobId} />)

    return container
}
