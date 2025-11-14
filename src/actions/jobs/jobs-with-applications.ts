import { supabase } from '@/lib/supabase'
import { JobWithApplicationsT } from '@/types/jobs'

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
