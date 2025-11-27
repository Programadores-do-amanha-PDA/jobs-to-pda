'use server'
import { supabase } from '@/lib/supabase'
import { JobT, JobWithApplicationsT } from '@/types/jobs/jobs'

export const getAllJobsWithApplications = async () => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*, applications:job_applications(*)')

        if (error) throw error

        return data as JobWithApplicationsT[]
    } catch (error) {
        console.error('Error fetching all jobs search:', error)
        return null
    }
}

export const createJob = async (
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
) => {
    try {
        if (
            !job.job_id ||
            !job.title ||
            !job.company ||
            !job.description ||
            !job.details ||
            !job.link ||
            !job.job_provider ||
            !job.source ||
            typeof job.is_verified !== 'boolean'
        )
            throw new Error('Job is required')

        const { data, error } = await supabase
            .from('jobs')
            .insert({ ...job })
            .select()

        if (error) throw error

        return data[0]
    } catch (error) {
        console.error('Error creating job:', error)
        return null
    }
}
