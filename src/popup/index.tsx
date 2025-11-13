import React from 'react'
import { createRoot } from 'react-dom/client'
import PopupPage from '@/features/popup/page'
import '@/css/input.css'

const root = document.getElementById('app')
if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <PopupPage />
        </React.StrictMode>
    )
}
