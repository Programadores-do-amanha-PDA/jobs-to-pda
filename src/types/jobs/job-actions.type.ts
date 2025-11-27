import { JobT, JobWithApplicationsT } from './job.type'

export type GetAllJobsWithApplicationsR = {
    success: boolean
    jobs?: JobWithApplicationsT[]
    error?: string
}

export type CreateNewJobP = {
    job: Omit<
        JobT,
        | 'id'
        | 'created_at'
        | 'updated_at'
        | 'deleted_at'
        | 'messages_sent_discord'
        | 'is_curated'
        | 'is_archived'
    >
}

export type CreateNewJobR = {
    success: boolean
    job?: JobWithApplicationsT
    error?: string
}
