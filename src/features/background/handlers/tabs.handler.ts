import browser from 'webextension-polyfill'

export type TabsMessage = {
    type: 'CREATE_TAB'
    url: string
}

/**
 * Handle tab-related messages
 */
export async function handleTabsMessage(message: TabsMessage) {
    console.log('Jobs To PdA: 🔗 Tabs handler received:', message.type)

    switch (message.type) {
        case 'CREATE_TAB':
            try {
                const tab = await browser.tabs.create({ url: message.url })
                return {
                    success: true,
                    data: { tabId: tab.id },
                }
            } catch (error) {
                console.error('Jobs To PdA: ❌ Failed to create tab:', error)
                return {
                    success: false,
                    error: (error as Error).message,
                }
            }

        default:
            return {
                success: false,
                error: 'Unknown tabs message type',
            }
    }
}
