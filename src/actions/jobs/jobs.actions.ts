'use server'
import { supabase } from '@/lib/supabase'
import {
    JobWithApplicationsT,
    createJobP,
    createJobR,
    getAllJobsWithApplicationsR,
} from '@/types'

export const getAllJobsWithApplications =
    async (): Promise<getAllJobsWithApplicationsR> => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*, applications:job_applications(*)')

            if (error) throw error

            return { success: true, jobs: data as JobWithApplicationsT[] }
        } catch (error) {
            console.error('Error fetching all jobs search:', error)
            return { success: false, error: error as string }
        }
    }

export const createJob = async ({ job }: createJobP): Promise<createJobR> => {
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
            .single()

        if (error) throw error

        return { success: true, job: data }
    } catch (error) {
        console.error('Error creating job:', error)
        return { success: false, error: error as string }
    }
}
