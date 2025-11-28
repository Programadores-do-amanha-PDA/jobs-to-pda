import browser from 'webextension-polyfill'

import { handleMessage } from '@/features/background/message-handlers'
import type { Message } from '@/features/background/message-handlers'

// Background script to ensure content script is injected when navigating to LinkedIn
console.log('Jobs To PdA: 🎯 Background script initialized')

// Listen for messages from content scripts and popup
browser.runtime.onMessage.addListener((message: Message, sender) => {
    console.log('Jobs To PdA: 📬 Message received from:', sender.tab?.id)
    return handleMessage(message)
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
                        files: ['content/index.js'],
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
