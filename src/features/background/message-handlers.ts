import { handleAuthMessage } from './handlers/auth.handler'
import { handleStatusMessage } from './handlers/status.handler'
import { handleJobsMessage } from './handlers/jobs.handler'
import { handleTabsMessage } from './handlers/tabs.handler'
import type { AuthMessage } from '@/types/message-types'
import type { JobsMessage } from './handlers/jobs.handler'
import type { TabsMessage } from './handlers/tabs.handler'

// Union type for all possible messages
export type Message =
    | AuthMessage
    | JobsMessage
    | TabsMessage
    | { type: 'STATUS' }

/**
 * Main message router that delegates to appropriate handlers
 */
export async function handleMessage(message: Message) {
    console.log('Jobs To PdA: 📨 Message router received:', message.type)

    // Route to appropriate handler based on message type
    switch (message.type) {
        // Auth messages
        case 'GET_SESSION':
        case 'GET_USER':
        case 'GET_PROFILE':
        case 'GET_PERMISSIONS':
        case 'SIGN_OUT':
            return handleAuthMessage(message as AuthMessage)

        // Status message
        case 'STATUS':
            return handleStatusMessage(message as { type: 'STATUS' })

        // Jobs messages
        case 'GET_ALL_JOBS_WITH_APPLICATIONS':
        case 'GET_ALL_JOBS':
        case 'CREATE_JOB':
            return handleJobsMessage(message as JobsMessage)

        // Tabs messages
        case 'CREATE_TAB':
            return handleTabsMessage(message as TabsMessage)

        default:
            return {
                success: false,
                error: 'Unknown message type',
            }
    }
}
