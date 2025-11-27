import browser from 'webextension-polyfill'
import JobsSitesSupported from './jobs-sites-supported'
import { authModel } from './models/auth.model'
import '@/styles/input.css'

function content() {
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

            console.log(
                `Jobs To PdA: ✅ User authenticated: ${user.profile?.full_name || user.email}`
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
            console.error(
                'Jobs To PdA: ❌ Error initializing extension:',
                error
            )
        }
    }

    // Inicializa a extensão
    initializeExtension()
}

export default content()
