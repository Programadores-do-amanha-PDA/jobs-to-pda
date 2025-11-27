export interface JobT {
    id: string
    job_id: string
    title: string
    company: CompanyT
    description?: string
    link: string
    details?: string[]
    source?: JobSourceT
    job_provider?: JobProviderT
    is_verified?: boolean
    is_curated?: boolean
    is_archived?: boolean
    messages_sent_discord?: { message_id: string; sent_at: string }[]
    created_at?: string
    updated_at?: string
    deleted_at?: string
}

export type JobSourceT = 'jobs_to_pda' | 'pda_platform'
export type JobProviderT = 'linkedin'

export interface CompanyT {
    name: string
    logo: string
    url?: string
}

export type JobApplicationStatusT = 'applied' | 'rejected' | 'accepted'

export interface JobApplicationT {
    id: number
    job_id: string
    user_id?: string
    status: JobApplicationStatusT
    created_at: string
    updated_at?: string
}

export type JobApplicationWithJobT = JobApplicationT & { jobs?: JobT }

export type JobWithApplicationsT = JobT & { applications?: JobApplicationT[] }
