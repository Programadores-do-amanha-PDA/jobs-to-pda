import type { JobSourceT, JobProviderT } from '@/types'

export class LinkedinJobM {
    public job_id: string
    public title: string
    public is_verified: boolean
    public link: string
    public description: string
    public details: string[]
    public company: { name: string; img: string }
    public source: JobSourceT
    public job_provider: JobProviderT

    public static extractJobIdFromUrl(): string | null {
        if (!window) return null
        const urlMatch = window.location.href.match(/\/jobs\/view\/(\d+)/)
        return urlMatch ? urlMatch[1] : null
    }

    constructor(jobId: string, jobPage: Element) {
        this.job_id = jobId
        this.title = this.extractJobTitleByJobPage(jobPage)
        this.is_verified = this.extractIsJobVerifiedByJobPage(jobPage)
        this.link = this.generateJobLinkByJobId(jobId)
        this.description = this.extractJobDescriptionByJobPage(jobPage)
        this.details = this.extractJobDetailsByJobPage(jobPage)
        this.company = this.extractJobCompanyByJobPage(jobPage)
        this.source = 'jobs_to_pda'
        this.job_provider = 'linkedin'
    }

    public extractJobTitleByJobPage(jobPage: Element): string {
        // Select title Element
        const jobTitleElement = jobPage.querySelector(
            'div.job-details-jobs-unified-top-card__job-title > h1'
        )

        return jobTitleElement?.textContent?.trim() || ''
    }

    public extractIsJobVerifiedByJobPage(jobPage: Element): boolean {
        // Select verified icon element
        const jobDetailsTopCardElement = jobPage.querySelector(
            "div.job-details-jobs-unified-top-card__job-title use[href='#verified-medium']"
        )

        return jobDetailsTopCardElement !== null
    }

    public generateJobLinkByJobId(jobId: string): string {
        return `https://www.linkedin.com/jobs/view/${jobId}`
    }

    public extractJobCompanyByJobPage(jobPage: Element): {
        name: string
        img: string
        link: string
    } {
        const jobCardTopContainerElement = jobPage.querySelector(
            '.job-details-jobs-unified-top-card__container--two-pane'
        )

        const companyElement = jobCardTopContainerElement?.querySelector(
            '.job-details-jobs-unified-top-card__company-name > a'
        )

        // Select company image element
        const companyImageElement = jobCardTopContainerElement?.querySelector(
            'img[alt*="Logo da empresa"]'
        )
        const companyImageLink = companyImageElement?.getAttribute('src') || ''

        // Extract company name
        const companyName = companyElement?.textContent?.trim() || ''
        const companyLink = companyElement?.getAttribute('href') || ''

        return { name: companyName, img: companyImageLink, link: companyLink }
    }

    public extractJobDetailsByJobPage(jobPage: Element): string[] {
        const jobUnifiedDetailsElements = Array.from(
            jobPage.querySelectorAll(
                '.job-details-jobs-unified-top-card__primary-description-container .tvm__text'
            )
        )

        const jobDetailsFitLevelElements = Array.from(
            jobPage.querySelectorAll(
                '.job-details-fit-level-preferences .tvm__text'
            )
        )

        const filteredJobLocaleElements = [
            ...jobUnifiedDetailsElements,
            ...jobDetailsFitLevelElements,
        ]
            .filter(
                (element) =>
                    element.textContent?.trim() !== '' &&
                    element.textContent?.trim() !== '·' &&
                    !element.querySelector('svg[data-test-icon="skills-small"]')
            )
            .flatMap((element) => element.textContent?.trim() || '')

        return filteredJobLocaleElements || []
    }

    public extractJobDescriptionByJobPage(jobPage: Element): string {
        const jobDescriptionContainerElement = jobPage.querySelector(
            '.jobs-description__container'
        )

        if (jobDescriptionContainerElement) {
            const clonedElement = jobDescriptionContainerElement.cloneNode(
                true
            ) as Element
            const h2Element = clonedElement.querySelector(
                'h2.text-heading-large'
            )
            if (h2Element) {
                h2Element.remove()
            }
            return clonedElement.textContent?.trim() || ''
        }

        return ''
    }
}
