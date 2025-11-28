import { jobsModel } from '../models/jobs.model'
import { createLinkedinApplyToJobButton } from './components/apply-to-job-button'
import { createSendJobToPdAButton } from './components/send-job-to-pda-button'
import { LinkedinJobM } from './models/linkedin-job.model'
import { linkedInJobPageType } from './types'

class LinkedInJobs {
    private currentActiveJobCard: Element | null = null
    private buttonRenderObserver: MutationObserver | null = null
    private initRetryCount = 0
    private readonly MAX_RETRIES = 10
    private readonly RETRY_DELAY = 500

    constructor(type: linkedInJobPageType) {
        this.init(type)
    }

    private waitForElement(
        selector: string,
        timeout = 5000
    ): Promise<Element | null> {
        return new Promise((resolve) => {
            const element = document.querySelector(selector)
            if (element) {
                console.log(`Jobs To PdA: ✅ Found element: ${selector}`)
                return resolve(element)
            }

            // Check if body is available
            if (!document.body) {
                console.log('Jobs To PdA: ⚠️ document.body not available yet')
                setTimeout(() => {
                    this.waitForElement(selector, timeout).then(resolve)
                }, 100)
                return
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector)
                if (element) {
                    console.log(`Jobs To PdA: ✅ Found element: ${selector}`)
                    observer.disconnect()
                    resolve(element)
                }
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })

            setTimeout(() => {
                console.log(`Jobs To PdA: ⏱️ Timeout waiting for: ${selector}`)
                observer.disconnect()
                resolve(null)
            }, timeout)
        })
    }

    private init(type: linkedInJobPageType) {
        switch (type) {
            case 'search':
                this.initJobSearchAndCollectionsPage()
                break
            case 'collections':
                this.initJobSearchAndCollectionsPage()
                break
            case 'view':
                this.initJobViewPage()
                break
            default:
                break
        }
    }

    private async initJobSearchAndCollectionsPage() {
        console.log('Jobs To PdA: 🎯 Initializing Job Search Page')

        // Wait for essential elements to load
        const jobListContainer = await this.waitForElement(
            '.scaffold-layout__list'
        )
        const jobDetailsContainer = await this.waitForElement(
            '.job-view-layout.jobs-details'
        )

        if (!jobListContainer || !jobDetailsContainer) {
            console.log(
                'Jobs To PdA: ⚠️ Essential containers not found, retrying...'
            )
            if (this.initRetryCount < this.MAX_RETRIES) {
                this.initRetryCount++
                setTimeout(() => {
                    this.initJobSearchAndCollectionsPage()
                }, this.RETRY_DELAY)
            } else {
                console.log('Jobs To PdA: ❌ Max retries reached, giving up')
            }
            return
        }

        console.log('Jobs To PdA: ✅ Containers found, setting up observers')
        this.initRetryCount = 0

        // Check for currently active Job
        this.checkActiveJobCard()
    }

    private async initJobViewPage() {
        console.log('Jobs To PdA: 🎯 Initializing Job View Page')

        // Wait for the job page to load
        const currentJobPage = await this.waitForElement(
            '.job-view-layout.jobs-details'
        )

        if (!currentJobPage) {
            console.log('Jobs To PdA: ⚠️ Job view page not found, retrying...')
            if (this.initRetryCount < this.MAX_RETRIES) {
                this.initRetryCount++
                setTimeout(() => {
                    this.initJobViewPage()
                }, this.RETRY_DELAY)
            } else {
                console.log('Jobs To PdA: ❌ Max retries reached, giving up')
            }
            return
        }

        console.log('Jobs To PdA: ✅ Job view page found')
        this.initRetryCount = 0

        const jobId = LinkedinJobM.extractJobIdFromUrl()

        if (jobId) {
            // Setup observer for job view page
            this.setupButtonRenderObserver(currentJobPage, jobId)
        }
    }

    private checkActiveJobCard() {
        // Extract the current Job card
        const activeJobCard = document.querySelector('[aria-current="page"]')
        // Extract the current Job page
        const currentJobPage = document.querySelector(
            '.jobs-search__job-details--wrapper'
        )
        const jobId = activeJobCard?.getAttribute('data-job-id')

        console.log(
            activeJobCard &&
                activeJobCard !== this.currentActiveJobCard &&
                currentJobPage &&
                jobId
        )

        // Check if the active Job has changed
        if (
            activeJobCard &&
            activeJobCard !== this.currentActiveJobCard &&
            currentJobPage &&
            jobId
        ) {
            console.log('Jobs To PdA:🎯 New active Job detected!')

            this.currentActiveJobCard = activeJobCard

            // Setup observer for job view page
            this.setupButtonRenderObserver(currentJobPage, jobId)
        }
    }

    private async processJob(jobPage: Element, jobId: string) {
        console.log('Jobs To PdA: 🎯 Processing job')

        const jobModel = new LinkedinJobM(jobId, jobPage)
        console.log('Jobs To PdA: ✅ Job processed!', jobModel)

        await jobsModel.createJob({ job: jobModel })
        this.removeExistingButtons(jobPage)
        this.renderButtons({ jobPage, jobId })
        return
    }

    private removeExistingButtons(jobPage: Element): void {
        const existingButtons = jobPage.querySelectorAll(
            '[data-pda-button="true"]'
        )
        existingButtons.forEach((button) => {
            button.remove()
        })
    }

    public renderButtons({
        jobPage,
        jobId,
    }: {
        jobPage: Element
        jobId: string
    }): void {
        const allJobs = jobsModel.getJobs()
        const currentJob = allJobs?.find((job) => job?.job_id === jobId)

        console.log('currentJob', currentJob)

        // Remove existing buttons before rendering new ones
        this.removeExistingButtons(jobPage)

        if (!currentJob) {
            console.log('Jobs To PdA: ⚠️ Current job not found, skipping...')
            this.renderShareJobToPdAButton(jobPage, jobId)
            return
        } else if (
            !currentJob?.applications ||
            currentJob?.applications?.length === 0
        ) {
            console.log(
                'Jobs To PdA: ⚠️ Current job has no applications, rendering apply button...'
            )
            this.renderApplyToJobOnPdAButton(jobPage, jobId)
            return
        }

        // Job has applications, could render different UI here if needed
        console.log('Jobs To PdA: ✅ Job has applications')
    }

    public renderShareJobToPdAButton(jobPage: Element, jobId: string) {
        const jobSaveButtonElements =
            jobPage.querySelectorAll('.jobs-save-button')

        if (!jobSaveButtonElements.length) {
            console.log('Jobs To PdA: Save button not found, skipping...')
            return
        }

        jobSaveButtonElements.forEach((saveButton) => {
            const shareJobButton = createSendJobToPdAButton(() =>
                this.processJob(jobPage, jobId)
            )

            saveButton.parentNode?.insertBefore(
                shareJobButton,
                saveButton.nextSibling
            )
        })

        console.log('Jobs To PdA: ✅ Button inserted!')
    }

    public renderApplyToJobOnPdAButton(jobPage: Element, jobId: string) {
        const jobSaveButtonElements =
            jobPage.querySelectorAll('.jobs-save-button')

        if (!jobSaveButtonElements.length) {
            console.log('Jobs To PdA: Save button not found, skipping...')
            return
        }

        if (jobSaveButtonElements.length === 1) {
            // Check if button already exists to avoid duplicates
            const existingButton = jobPage.querySelector(
                '[data-pda-button="true"]'
            )
            if (existingButton) {
                console.log('Jobs To PdA: Button already exists, skipping...')
                return
            }

            const applyOnJobToPdAButton = createLinkedinApplyToJobButton(jobId)

            jobSaveButtonElements[0]?.parentNode?.insertBefore(
                applyOnJobToPdAButton,
                jobSaveButtonElements[0]?.nextSibling
            )
        } else if (jobSaveButtonElements.length > 1) {
            // Render button for each save button element
            jobSaveButtonElements.forEach((saveButton) => {
                // Check if button already exists to avoid duplicates
                const existingButton = saveButton.parentNode?.querySelector(
                    '[data-pda-button="true"]'
                )
                if (existingButton) {
                    return
                }

                const applyOnJobToPdAButton =
                    createLinkedinApplyToJobButton(jobId)

                saveButton.parentNode?.insertBefore(
                    applyOnJobToPdAButton,
                    saveButton.nextSibling
                )
            })
        }
        console.log('Jobs To PdA: ✅ Button inserted!')
    }

    private setupButtonRenderObserver(container: Element, jobId: string) {
        if (this.buttonRenderObserver) {
            this.buttonRenderObserver.disconnect()
        }

        console.log('Jobs To PdA: 🎯 Setting up button render observer')
        // Initial render - render button for current state
        this.renderButtons({ jobPage: container, jobId })

        this.buttonRenderObserver = new MutationObserver((mutations) => {
            // Check if save button was added/modified
            const hasSaveButtonChange = mutations.some((mutation) => {
                const addedNodes = Array.from(mutation.addedNodes)
                const hasRelevantChange = addedNodes.some((node) => {
                    if (node instanceof Element) {
                        return (
                            node.classList.contains('jobs-save-button') ||
                            node.querySelector('.jobs-save-button')
                        )
                    }
                    return false
                })
                return hasRelevantChange
            })

            if (hasSaveButtonChange) {
                console.log(
                    'Jobs To PdA: Save button detected in DOM changes, re-rendering...'
                )
                this.renderButtons({ jobPage: container, jobId })
            }
        })

        this.buttonRenderObserver.observe(container, {
            childList: true,
            subtree: true,
        })

        console.log('Jobs To PdA: 👀 Button render observer active')
    }

    public destroy() {
        if (this.buttonRenderObserver) {
            this.buttonRenderObserver.disconnect()
            this.buttonRenderObserver = null
        }
        console.log('Jobs To PdA: 🗑️ LinkedInJobMonitor destroyed')
    }
}

export default LinkedInJobs
