import React from 'react'
import ReactDOM from 'react-dom/client'

import PdASymbolYellowBackground from '@/assets/logos/pda-symbol-yellow-background.png'
import { Button } from '@/components/ui/button'
import { LinkedinButtonPropsT } from '../types'

export const LinkedinButton: React.FC<LinkedinButtonPropsT> = ({ onClick }) => {
    return (
        <Button
            id="job-to-pda"
            className="jobs-apply-button artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml2 bg-[#eddc11]! hover:bg-[#ddcc10]! h-full flex items-center"
            onClick={onClick}
            type="button"
        >
            <img src={PdASymbolYellowBackground} className="size-8" />
            <span className="artdeco-button__text">Salvar</span>
        </Button>
    )
}

// Helper function to render the React component into a DOM element
export const createLinkedinButton = (onClick?: () => void): HTMLElement => {
    const container = document.createElement('div')
    container.setAttribute('data-pda-button', 'true')

    const root = ReactDOM.createRoot(container)
    root.render(<LinkedinButton onClick={onClick} />)

    return container
}
