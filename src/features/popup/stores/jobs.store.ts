import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { toast } from 'sonner'

import { createJob, getAllJobsWithApplications } from '@/actions'
import { CreateNewJobP, JobState, JobActions } from '@/types'

const initialState: JobState = {
    jobs: [],
    isLoading: false,
}

export const useJobStore = create<JobState & JobActions>()(
    devtools(
        (set, get) => ({
            ...initialState,

            setJobs: (jobs) => set({ jobs }),

            getAllJobs: async () => {
                try {
                    set({ isLoading: true })
                    const jobsResponse = await getAllJobsWithApplications()
                    if (!jobsResponse) throw 'no jobs response'
                    set({ jobs: jobsResponse })
                    return true
                } catch (error) {
                    console.error(error)
                    toast.error(
                        'Erro ao buscar as vagas. Tente novamente mais tarde!'
                    )
                    return false
                } finally {
                    set({ isLoading: false })
                }
            },

            createJob: async ({ job }: CreateNewJobP) => {
                try {
                    const jobCreated = await createJob({ job })

                    if (!jobCreated) throw 'job is not created successfully'

                    set({ jobs: [...get().jobs, jobCreated] })
                    toast.success('Sucesso ao criar a vaga!')
                    return true
                } catch (error) {
                    console.error(error)
                    toast.error(
                        'Erro ao criar a vaga. Tente novamente mais tarde!'
                    )
                    return false
                }
            },

            reset: () => {
                set(initialState)
            },
        }),
        { name: 'JobStore' }
    )
)
