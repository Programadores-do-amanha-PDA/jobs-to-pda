import browser from 'webextension-polyfill'
import { JobsSitesSupported, authModel } from '@/features/content'
import '@/styles/input.css'
import { jobsModel } from '@/features/content/models/jobs.model'

// Listen for STATUS messages from background script
browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'STATUS') {
        return Promise.resolve({ status: 'running' })
    }
})

/**
 * Inicializa o monitor de jobs após verificar autenticação
 */
async function initializeExtension() {
    console.log('Jobs To PdA: 🚀 Starting extension...')

    try {
        // Busca a sessão do usuário
        console.log('Jobs To PdA: 🔐 Checking authentication...')
        await authModel.fetchSession()

        // Verifica se o usuário está autenticado
        const user = authModel.getUser()

        if (!user) {
            console.log(
                'Jobs To PdA: ❌ User not authenticated. Extension will not start.'
            )
            return
        }

        await jobsModel.getAllJobs()
        console.log(
            'Jobs To PdA: ✅ Jobs fetched successfully!',
            jobsModel.getJobs()
        )

        // Inicializa o monitor de jobs
        const startMonitor = () => {
            console.log('Jobs To PdA: ✅ Starting jobs monitor...')
            new JobsSitesSupported()
        }

        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            console.log('Jobs To PdA: ⏳ Waiting for DOM to load...')
            document.addEventListener('DOMContentLoaded', startMonitor)
        } else {
            console.log('Jobs To PdA: ✅ DOM is already ready!')
            startMonitor()
        }
    } catch (error) {
        console.error('Jobs To PdA: ❌ Error initializing extension:', error)
    }
}

// Inicializa a extensão
initializeExtension()
