import type { StatusRequest, StatusResponse } from '@/types/message-types'

/**
 * Handles status-related messages from content scripts
 */
export async function handleStatusMessage(
    message: StatusRequest
): Promise<StatusResponse> {
    console.log(
        'Jobs To PdA: 📨 Background received status message:',
        message.type
    )

    return {
        status: 'running',
    }
}
