class JobM {
  public id: string;
  public title: string;
  public isVerified: boolean;
  public link: string;
  public description: string;
  public details: string[];
  public company: { name: string; img: string };

  constructor(jobId: string, jobPage: Element) {
    this.id = jobId;
    this.title = this.extractJobTitleByJobPage(jobPage);
    this.isVerified = this.extractIsJobVerifiedByJobPage(jobPage);
    this.link = this.generateJobLinkByJobId(jobId);
    this.description = this.extractJobDescriptionByJobPage(jobPage);
    this.details = this.extractJobDetailsByJobPage(jobPage);
    this.company = this.extractJobCompanyByJobPage(jobPage);
  }

  public extractJobTitleByJobPage(jobPage: Element): string {
    // Select title Element
    const jobTitleElement = jobPage.querySelector(
      "div.job-details-jobs-unified-top-card__job-title > h1 > a",
    );

    return jobTitleElement?.textContent?.trim() || "";
  }

  public extractIsJobVerifiedByJobPage(jobPage: Element): boolean {
    // Select verified icon element
    const jobDetailsTopCardElement = jobPage.querySelector(
      "div.job-details-jobs-unified-top-card__job-title use[href='#verified-medium']",
    );

    return jobDetailsTopCardElement !== null;
  }

  public generateJobLinkByJobId(jobId: string): string {
    return `https://www.linkedin.com/jobs/view/${jobId}`;
  }

  public extractJobCompanyByJobPage(jobPage: Element): {
    name: string;
    img: string;
  } {
    const jobCardTopContainerElement = jobPage.querySelector(
      ".job-details-jobs-unified-top-card__container--two-pane",
    );

    const companyElement = jobCardTopContainerElement?.querySelector(
      ".job-details-jobs-unified-top-card__company-name",
    );

    // Select company image element
    const companyImageElement = jobCardTopContainerElement?.querySelector(
      'img[alt*="Logo da empresa"]',
    );
    const companyImageLink = companyImageElement?.getAttribute("src") || "";

    // Extract company name
    const companyName = companyElement?.textContent?.trim() || "";

    return { name: companyName, img: companyImageLink };
  }

  public extractJobDetailsByJobPage(jobPage: Element): string[] {
    const jobUnifiedDetailsElements = Array.from(
      jobPage.querySelectorAll(
        ".job-details-jobs-unified-top-card__primary-description-container .tvm__text",
      ),
    );

    const jobDetailsFitLevelElements = Array.from(
      jobPage.querySelectorAll(".job-details-fit-level-preferences .tvm__text"),
    );

    const filteredJobLocaleElements = [
      ...jobUnifiedDetailsElements,
      ...jobDetailsFitLevelElements,
    ]
      .filter(
        (element) =>
          element.textContent?.trim() !== "" &&
          element.textContent?.trim() !== "·" &&
          !element.querySelector('svg[data-test-icon="skills-small"]'),
      )
      .flatMap((element) => element.textContent?.trim() || "");

    return filteredJobLocaleElements || [];
  }

  public extractJobDescriptionByJobPage(jobPage: Element): string {
    const jobTitleElement = jobPage.querySelector(
      ".jobs-description__container",
    );

    if (jobTitleElement) {
      const clonedElement = jobTitleElement.cloneNode(true) as Element;
      const h2Element = clonedElement.querySelector("h2.text-heading-large");
      if (h2Element) {
        h2Element.remove();
      }
      return clonedElement.textContent?.trim() || "";
    }

    return "";
  }
}

export default JobM;
