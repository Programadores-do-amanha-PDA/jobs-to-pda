import JobM from "../models/job.model";

class JobCardMonitor {
  private currentActiveJobCard: Element | null = null;
  private observer: MutationObserver | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Check for currently active Job
    this.checkActiveJob();

    // Observe changes in the aria-current attribute to detect when activeJobCard changes
    this.setupMutationObserver();
  }

  private checkActiveJob() {
    // Extract the current Job card
    const activeJobCard = document.querySelector('[aria-current="page"]');
    // Extract the current Job page
    const currentJobPage = document.querySelector(
      ".jobs-search__job-details--wrapper",
    );

    // Check if the active Job has changed
    if (activeJobCard && activeJobCard !== this.currentActiveJobCard) {
      console.log("Jobs To PdA:🎯 New active Job detected!");
      console.log("Jobs To PdA: Job card:", activeJobCard);
      console.log("Jobs To PdA: Job Page:", currentJobPage);

      this.currentActiveJobCard = activeJobCard;

      const jobId = activeJobCard.getAttribute("data-job-id");
      if (jobId && currentJobPage) {
        this.processJob(currentJobPage, jobId);
      }
    }
  }

  private processJob(jobPage: Element, jobId: string) {
    console.log("Jobs To PdA: 🎯 Processing job:", jobId);

    const jobModel = new JobM(jobId, jobPage);
    console.log("Jobs To PdA: Job Model:", jobModel);
  }

  private setupMutationObserver() {
    if (!document.body) {
      console.warn(
        "Jobs To PdA: ⚠️ document.body does not exist yet, waiting...",
      );
      setTimeout(() => this.setupMutationObserver(), 100);
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Detect changes in the aria-current attribute
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-current"
        ) {
          console.log("Jobs To PdA: Change in aria-current detected");
          this.checkActiveJob();
        }

        // Detect newly added elements that may have aria-current
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              if (
                node.getAttribute("aria-current") === "page" ||
                node.querySelector('[aria-current="page"]')
              ) {
                console.log(
                  "Jobs To PdA: New element with aria-current detected",
                );
                this.checkActiveJob();
              }
            }
          });
        }
      });
    });

    this.observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["aria-current"],
      childList: true,
      subtree: true,
    });

    console.log(
      "Jobs To PdA: 👀 MutationObserver active and monitoring changes in active Job",
    );
  }

  public getCurrentActiveJobCard() {
    return this.currentActiveJobCard;
  }
}

// Initializes the monitor when the DOM is ready
console.log("Jobs To PdA: 🚀 Starting extension...");
if (document.readyState === "loading") {
  console.log("Jobs To PdA: ⏳ Waiting for DOM to load...");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Jobs To PdA: ✅ DOM loaded! Starting monitor...");
    new JobCardMonitor();
  });
} else {
  console.log("Jobs To PdA: ✅ DOM is already ready! Starting monitor...");
  new JobCardMonitor();
}
