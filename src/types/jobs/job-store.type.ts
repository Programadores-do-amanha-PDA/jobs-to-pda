import { JobT, JobWithApplicationsT } from './'

export interface JobState {
    jobs: JobWithApplicationsT[]
    isLoading: boolean
}

export interface JobActions {
    setJobs: (jobs: JobWithApplicationsT[]) => void
    getAllJobs: () => Promise<boolean>
    createJob: (job: Partial<JobT>) => Promise<boolean>
    reset: () => void
}
