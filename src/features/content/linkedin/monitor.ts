import { createLinkedinButton } from './components/send-button'
import JobM from './models/linkedin-job.model'

type linkedInJobPageType = 'search' | 'collections' | 'view'

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
                return resolve(element)
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector)
                if (element) {
                    observer.disconnect()
                    resolve(element)
                }
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })

            setTimeout(() => {
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

        const jobId = JobM.extractJobIdFromUrl()

        if (jobId) {
            this.processJob(currentJobPage, jobId)

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

    private processJob(jobPage: Element, jobId: string) {
        console.log('Jobs To PdA: 🎯 Processing job')

        const jobModel = new JobM(jobId, jobPage)
        return jobModel
    }

    public renderShareJobToPdAButton(jobPage: Element, jobId: string) {
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

            const shareJobButton = createLinkedinButton(() =>
                this.processJob(jobPage, jobId)
            )
            jobSaveButtonElements[0]?.parentNode?.insertBefore(
                shareJobButton,
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

                const shareJobButton = createLinkedinButton(() =>
                    this.processJob(jobPage, jobId)
                )

                saveButton.parentNode?.insertBefore(
                    shareJobButton,
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
                this.renderShareJobToPdAButton(container, jobId)
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
