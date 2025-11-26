import browser from 'webextension-polyfill'
import { handleAuthMessage } from './message-handlers'
import type { AuthMessage } from '@/types/message-types'

// Background script to ensure content script is injected when navigating to LinkedIn
console.log('Jobs To PdA: 🎯 Background script initialized')

// Listen for authentication messages from content scripts
browser.runtime.onMessage.addListener((message: AuthMessage, sender) => {
    console.log('Jobs To PdA: 📬 Message received from:', sender.tab?.id)
    return handleAuthMessage(message)
})

// Helper function to check if content script is already running
async function isContentScriptRunning(tabId: number): Promise<boolean> {
    try {
        const response = await browser.tabs.sendMessage(tabId, {
            type: 'STATUS',
        })
        return response?.status === 'running'
    } catch {
        return false
    }
}

// Listen for tab updates (when URL changes)
browser.tabs.onUpdated.addListener(
    async (
        tabId: number,
        changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
        tab: browser.Tabs.Tab
    ) => {
        // Only act when the page has finished loading and has a URL
        if (changeInfo.status === 'complete' && tab.url) {
            const url = tab.url

            // Check if it's a LinkedIn URL
            if (url.includes('linkedin.com')) {
                console.log(
                    'Jobs To PdA: 🔄 LinkedIn page detected, checking content script...'
                )

                // Check if content script is already running
                const isRunning = await isContentScriptRunning(tabId)

                if (isRunning) {
                    console.log(
                        'Jobs To PdA: ✅ Content script already running'
                    )
                    return
                }

                // Inject the content script only if not running
                try {
                    await browser.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['dist/content/index.js'],
                    })
                    console.log('Jobs To PdA: ✅ Content script injected')
                } catch (error) {
                    console.log(
                        'Jobs To PdA: ⚠️ Content script injection failed:',
                        (error as Error).message
                    )
                }
            }
        }
    }
)
