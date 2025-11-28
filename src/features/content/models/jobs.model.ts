// Global imports
import browser from 'webextension-polyfill'

// Types
import type { JobWithApplicationsT, CreateNewJobP } from '@/types'

/**
 * JobsModel - Classe para gerenciar o estado de jobs no content script
 *
 * Esta classe replica a funcionalidade da jobs.store.ts, mas é projetada
 * para funcionar no contexto isolado do content script, onde Zustand não pode ser usado.
 */
export class JobsModel {
    private jobs: JobWithApplicationsT[] = []
    private listeners: Set<() => void> = new Set()

    constructor() {
        this.reset()
    }

    /**
     * Envia mensagem com retry para lidar com background script não inicializado
     */
    private async sendMessageWithRetry(
        message: unknown,
        maxRetries = 3,
        delayMs = 200
    ): Promise<unknown> {
        let lastError: Error | null = null

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await browser.runtime.sendMessage(message)
                return response
            } catch (error) {
                lastError = error as Error
                const errorMessage = lastError.message || String(error)

                // Se o erro é "Receiving end does not exist", tenta novamente
                if (
                    errorMessage.includes('Receiving end does not exist') ||
                    errorMessage.includes('Could not establish connection')
                ) {
                    if (attempt < maxRetries) {
                        console.log(
                            `Jobs To PdA: ⏳ Background script not ready, retrying (${attempt}/${maxRetries})...`
                        )
                        await new Promise((resolve) =>
                            setTimeout(resolve, delayMs)
                        )
                        continue
                    }
                }

                // Para outros erros, lança imediatamente
                throw error
            }
        }

        // Se chegou aqui, esgotou todas as tentativas
        throw lastError || new Error('Failed to send message after retries')
    }

    /**
     * Obtém todos os jobs
     */
    getJobs(): JobWithApplicationsT[] {
        return this.jobs
    }

    /**
     * Define os jobs
     */
    setJobs(jobs: JobWithApplicationsT[]): void {
        this.jobs = jobs
        this.notifyListeners()
    }

    /**
     * Busca todos os jobs com aplicações
     */
    async getAllJobs(): Promise<boolean> {
        try {
            console.log('Jobs To PdA: 📤 Requesting all jobs')

            const response = await this.sendMessageWithRetry({
                type: 'GET_ALL_JOBS',
            })

            if (!response) {
                throw new Error('No jobs response')
            }

            const jobsResponse = response as {
                success: boolean
                jobs?: JobWithApplicationsT[]
                error?: string
            }

            if (!jobsResponse.success || !jobsResponse.jobs) {
                throw new Error(jobsResponse.error || 'Failed to fetch jobs')
            }

            console.log(
                'Jobs To PdA: ✅ Jobs received:',
                jobsResponse.jobs.length
            )
            this.setJobs(jobsResponse.jobs)
            return true
        } catch (error) {
            console.error('Error fetching jobs:', error)
            return false
        }
    }

    /**
     * Cria um novo job
     */
    async createJob({ job }: CreateNewJobP): Promise<boolean> {
        try {
            console.log('Jobs To PdA: 📤 Creating new job')

            const response = await this.sendMessageWithRetry({
                type: 'CREATE_JOB',
                job,
            })

            const jobResponse = response as {
                success: boolean
                job?: JobWithApplicationsT
                error?: string
            }

            if (!jobResponse.success || !jobResponse.job) {
                throw new Error(
                    jobResponse.error || 'Job is not created successfully'
                )
            }

            console.log('Jobs To PdA: ✅ Job created successfully')
            this.setJobs([...this.jobs, jobResponse.job])
            return true
        } catch (error) {
            console.error('Error creating job:', error)
            return false
        }
    }

    /**
     * Reseta o estado para o inicial
     */
    reset(): void {
        this.jobs = []
        this.notifyListeners()
    }

    /**
     * Adiciona um listener para mudanças de estado
     */
    subscribe(listener: () => void): () => void {
        this.listeners.add(listener)
        // Retorna função para remover o listener
        return () => {
            this.listeners.delete(listener)
        }
    }

    /**
     * Notifica todos os listeners sobre mudanças
     */
    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener())
    }

    /**
     * Serializa o estado para armazenamento ou transmissão
     */
    toJSON(): {
        jobs: JobWithApplicationsT[]
    } {
        return {
            jobs: this.jobs,
        }
    }

    /**
     * Carrega o estado a partir de um objeto serializado
     */
    fromJSON(data: { jobs: JobWithApplicationsT[] }): void {
        this.jobs = data.jobs
        this.notifyListeners()
    }
}

// Exporta uma instância singleton para uso no content script
export const jobsModel = new JobsModel()
