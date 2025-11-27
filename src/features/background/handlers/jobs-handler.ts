import { getAllJobsWithApplications } from '@/actions/jobs/jobs-with-applications'
import type { ErrorResponse } from '@/types/message-types'
import type { JobWithApplicationsT } from '@/types/jobs'

// Message types for jobs
export type JobsMessageType = 'GET_ALL_JOBS_WITH_APPLICATIONS'

export interface GetAllJobsWithApplicationsRequest {
    type: 'GET_ALL_JOBS_WITH_APPLICATIONS'
}

export type JobsMessage = GetAllJobsWithApplicationsRequest

export interface GetAllJobsWithApplicationsResponse {
    success: true
    jobs: JobWithApplicationsT[] | null
}

export type JobsMessageResponse =
    | GetAllJobsWithApplicationsResponse
    | ErrorResponse

/**
 * Handles jobs-related messages from content scripts
 */
export async function handleJobsMessage(
    message: JobsMessage
): Promise<JobsMessageResponse> {
    try {
        console.log(
            'Jobs To PdA: 📨 Background received jobs message:',
            message.type
        )

        switch (message.type) {
            case 'GET_ALL_JOBS_WITH_APPLICATIONS': {
                const jobs = await getAllJobsWithApplications()
                console.log(
                    'Jobs To PdA: ✅ Jobs with applications retrieved:',
                    jobs ? jobs.length : 'not found'
                )
                return {
                    success: true,
                    jobs: jobs || null,
                }
            }

            default: {
                const errorResponse: ErrorResponse = {
                    success: false,
                    error: 'Unknown jobs message type',
                }
                return errorResponse
            }
        }
    } catch (error) {
        console.error('Jobs To PdA: ❌ Error handling jobs message:', error)
        const errorResponse: ErrorResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
        return errorResponse
    }
}
