import LinkedInJobs from '@/features/content/linkedin/monitor'

type LinkedInJobPageType = 'search' | 'collections' | 'view'

interface RouteConfig {
    pattern: string
    type: LinkedInJobPageType
}

export class JobsSitesSupported {
    private currentMonitor: LinkedInJobs | null = null
    private currentRoute: string = ''
    private observer: MutationObserver | null = null

    private routes: RouteConfig[] = [
        { pattern: 'linkedin.com/jobs/search', type: 'search' },
        { pattern: 'linkedin.com/jobs/collections/', type: 'collections' },
        { pattern: 'linkedin.com/jobs/view', type: 'view' },
    ]

    constructor() {
        this.init()
    }

    private init() {
        console.log('Jobs To PdA: 🔄 Initializing route monitor...')

        // Verifica a rota inicial
        this.checkRoute()

        // Configura o MutationObserver para detectar mudanças na URL
        this.setupRouteObserver()

        // Também escuta eventos de navegação do histórico
        this.setupHistoryListener()
    }

    private checkRoute() {
        if (!window) return console.log('Jobs To PdA: ⚠️ Window not found')

        const currentUrl = window.location.href

        console.log('Jobs To PdA: 🔍 Current URL:', currentUrl)

        // Evita reprocessar a mesma rota
        if (currentUrl === this.currentRoute) {
            return
        }

        console.log('Jobs To PdA: 🔍 Checking route')

        // Encontra a rota correspondente
        const matchedRoute = this.routes.find((route) =>
            currentUrl.includes(route.pattern)
        )

        if (matchedRoute) {
            console.log(`Jobs To PdA: ✅ Route matched`)

            // Atualiza a rota atual
            this.currentRoute = currentUrl

            // Destrói o monitor anterior se existir
            if (this.currentMonitor) {
                console.log('Jobs To PdA: 🗑️ Destroying previous monitor...')
                if (typeof this.currentMonitor.destroy === 'function') {
                    this.currentMonitor.destroy()
                }
                this.currentMonitor = null
            }

            // Cria um novo monitor para a rota atual
            this.currentMonitor = new LinkedInJobs(matchedRoute.type)
        } else {
            console.log('Jobs To PdA: ⚠️ No matching route found')
            this.currentRoute = currentUrl
            this.currentMonitor = null
        }
    }

    private setupRouteObserver() {
        // Observa mudanças no título e no body que podem indicar navegação SPA
        this.observer = new MutationObserver(() => {
            this.checkRoute()
        })

        // Observa mudanças no título da página (comum em SPAs)
        const titleElement = document.querySelector('title')
        if (titleElement) {
            this.observer.observe(titleElement, {
                childList: true,
                characterData: true,
                subtree: true,
            })
        }

        console.log('Jobs To PdA: 👀 Route MutationObserver active')
    }

    private setupHistoryListener() {
        // Intercepta pushState e replaceState para detectar navegação SPA
        const originalPushState = history.pushState
        const originalReplaceState = history.replaceState

        history.pushState = (...args) => {
            originalPushState.apply(history, args)
            console.log('Jobs To PdA: 🔄 pushState detected')
            this.checkRoute()
        }

        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args)
            console.log('Jobs To PdA: 🔄 replaceState detected')
            this.checkRoute()
        }

        // Escuta eventos de popstate (botão voltar/avançar)
        window.addEventListener('popstate', () => {
            console.log('Jobs To PdA: 🔄 popstate detected')
            this.checkRoute()
        })

        console.log('Jobs To PdA: 👀 History listener active')
    }

    public getCurrentMonitor(): LinkedInJobs | null {
        return this.currentMonitor
    }

    public destroy() {
        if (this.observer) {
            this.observer.disconnect()
            this.observer = null
        }
        this.currentMonitor = null
        console.log('Jobs To PdA: 🗑️ LinkedInJobsSitesSupported destroyed')
    }
}
