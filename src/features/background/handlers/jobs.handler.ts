import { getAllJobsWithApplications, createJob } from '@/actions'
import type {
    ErrorResponse,
    JobWithApplicationsT,
    CreateNewJobP,
} from '@/types'

// Message types for jobs
export type JobsMessageType =
    | 'GET_ALL_JOBS_WITH_APPLICATIONS'
    | 'GET_ALL_JOBS'
    | 'CREATE_JOB'

export interface GetAllJobsWithApplicationsRequest {
    type: 'GET_ALL_JOBS_WITH_APPLICATIONS'
}

export interface GetAllJobsRequest {
    type: 'GET_ALL_JOBS'
}

export interface CreateJobRequest {
    type: 'CREATE_JOB'
    job: CreateNewJobP['job']
}

export type JobsMessage =
    | GetAllJobsWithApplicationsRequest
    | GetAllJobsRequest
    | CreateJobRequest

export interface GetAllJobsWithApplicationsResponse {
    success: true
    jobs: JobWithApplicationsT[] | null
}

export interface GetAllJobsResponse {
    success: true
    jobs: JobWithApplicationsT[]
}

export interface CreateJobResponse {
    success: true
    job: JobWithApplicationsT
}

export type JobsMessageResponse =
    | GetAllJobsWithApplicationsResponse
    | GetAllJobsResponse
    | CreateJobResponse
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
                const response = await getAllJobsWithApplications()
                console.log(
                    'Jobs To PdA: ✅ Jobs with applications retrieved:',
                    response.jobs ? response.jobs.length : 'not found'
                )
                return {
                    success: true,
                    jobs: response.jobs || null,
                }
            }

            case 'GET_ALL_JOBS': {
                const response = await getAllJobsWithApplications()

                if (!response.success || !response.jobs) {
                    const errorResponse: ErrorResponse = {
                        success: false,
                        error: response.error || 'Failed to fetch jobs',
                    }
                    return errorResponse
                }

                console.log(
                    'Jobs To PdA: ✅ All jobs retrieved:',
                    response.jobs.length
                )
                return {
                    success: true,
                    jobs: response.jobs,
                }
            }

            case 'CREATE_JOB': {
                const { job } = message as CreateJobRequest
                const response = await createJob({ job })

                if (!response.success || !response.job) {
                    const errorResponse: ErrorResponse = {
                        success: false,
                        error: response.error || 'Failed to create job',
                    }
                    return errorResponse
                }

                console.log('Jobs To PdA: ✅ Job created successfully')
                return {
                    success: true,
                    job: response.job,
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
