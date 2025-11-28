// Global imports
import { jwtDecode } from 'jwt-decode'
import browser from 'webextension-polyfill'

// Types
import type {
    GetSessionResponse,
    GetUserResponse,
    GetProfileResponse,
    GetPermissionsResponse,
    ErrorResponse,
} from '@/types/message-types'

// Types
import {
    JwtPayloadT,
    ProfileT,
    AuthUserWithProfileT,
    PermissionT,
    RolesT,
} from '@/types'

/**
 * AuthModel - Classe para gerenciar o estado de autenticação no content script
 *
 * Esta classe replica a funcionalidade da auth-store.ts, mas é projetada
 * para funcionar no contexto isolado do content script, onde Zustand não pode ser usado.
 */
export class AuthModel {
    private user: AuthUserWithProfileT | null = null
    private permissions: PermissionT[] = []
    private loading: boolean = true
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
     * Obtém o usuário atual
     */
    getUser(): AuthUserWithProfileT | null {
        return this.user
    }

    /**
     * Obtém as permissões do usuário
     */
    getPermissions(): PermissionT[] {
        return this.permissions
    }

    /**
     * Verifica se está carregando
     */
    isLoading(): boolean {
        return this.loading
    }

    /**
     * Define o usuário
     */
    setUser(user: AuthUserWithProfileT | null): void {
        this.user = user
        this.notifyListeners()
    }

    /**
     * Define as permissões
     */
    setPermissions(permissions: PermissionT[]): void {
        this.permissions = permissions
        this.notifyListeners()
    }

    /**
     * Define o estado de carregamento
     */
    setLoading(loading: boolean): void {
        this.loading = loading
        this.notifyListeners()
    }

    /**
     * Busca as permissões do usuário baseado no role
     */
    async fetchUserPermissions(role: RolesT): Promise<void> {
        try {
            console.log(
                'Jobs To PdA: 📤 Requesting permissions for role:',
                role
            )
            const response = (await this.sendMessageWithRetry({
                type: 'GET_PERMISSIONS',
                role,
            })) as GetPermissionsResponse | ErrorResponse

            if ('success' in response && response.success) {
                const permissionsResponse = response as GetPermissionsResponse
                this.setPermissions(permissionsResponse.permissions)
            } else {
                const errorResponse = response as ErrorResponse
                console.error(
                    'Error fetching permissions:',
                    errorResponse.error
                )
                this.setPermissions([])
            }
        } catch (error) {
            console.error('Error fetching permissions:', error)
            this.setPermissions([])
        }
    }

    /**
     * Busca o perfil do usuário usando o JWT
     */
    async getUserProfile(jwt: string): Promise<void> {
        try {
            console.log('Jobs To PdA: 📤 Requesting user data')
            const userResponse = (await this.sendMessageWithRetry({
                type: 'GET_USER',
                jwt,
            })) as GetUserResponse | ErrorResponse

            if (!('success' in userResponse) || !userResponse.success) {
                const errorResponse = userResponse as ErrorResponse
                console.error('Error fetching user:', errorResponse.error)
                this.updateAuthState({ user: null, loading: false })
                return
            }

            const { user } = userResponse as GetUserResponse
            if (!user?.id) {
                this.updateAuthState({ user: null, loading: false })
                return
            }

            console.log('Jobs To PdA: 📤 Requesting profile for user:', user.id)
            const profileResponse = (await this.sendMessageWithRetry({
                type: 'GET_PROFILE',
                userId: user.id,
            })) as GetProfileResponse | ErrorResponse

            if (!('success' in profileResponse) || !profileResponse.success) {
                const errorResponse = profileResponse as ErrorResponse
                console.error('Error fetching profile:', errorResponse.error)
                this.updateAuthState({ user: null, loading: false })
                return
            }

            const { profile } = profileResponse as GetProfileResponse
            if (profile) {
                this.updateAuthState({
                    user: {
                        ...user,
                        profile: {
                            ...(profile as ProfileT),
                        },
                    },
                    loading: false,
                })
            } else {
                this.updateAuthState({ user: null, loading: false })
            }
        } catch (error) {
            console.error('Error in getUserProfile:', error)
            this.updateAuthState({
                user: null,
                permissions: [],
                loading: false,
            })
        }
    }

    /**
     * Atualiza o estado de autenticação baseado na sessão
     */
    async updateAuthStateFromSession(
        session: { access_token: string } | null
    ): Promise<void> {
        try {
            if (!session) {
                this.reset()
                return
            }

            const jwt = jwtDecode<JwtPayloadT>(session.access_token)
            if (!jwt?.user_role) {
                this.reset()
                return
            }

            // Fetch user profile and permissions in parallel
            await Promise.all([
                this.getUserProfile(session.access_token),
                this.fetchUserPermissions(jwt.user_role),
            ])
        } catch {
            this.reset()
        }
    }

    /**
     * Busca a sessão atual e atualiza o estado
     */
    async fetchSession(): Promise<void> {
        try {
            console.log('Jobs To PdA: 📤 Requesting session from background')
            const response = (await this.sendMessageWithRetry({
                type: 'GET_SESSION',
            })) as GetSessionResponse | ErrorResponse

            if (!('success' in response) || !response.success) {
                const errorResponse = response as ErrorResponse
                console.error('Error fetching session:', errorResponse.error)
                throw new Error('No session found')
            }

            const { session } = response as GetSessionResponse
            if (!session) throw new Error('No session found')

            console.log('Jobs To PdA: ✅ Session received from background')
            await this.updateAuthStateFromSession(session)
        } catch (error) {
            console.error('Error in fetchSession:', error)
            this.reset()
        }
    }

    /**
     * Realiza logout do usuário
     */
    async logout(): Promise<boolean> {
        try {
            console.log('Jobs To PdA: 📤 Requesting sign out')
            const response = (await this.sendMessageWithRetry({
                type: 'SIGN_OUT',
            })) as { success: boolean } | ErrorResponse

            if ('success' in response && response.success) {
                console.log('Jobs To PdA: ✅ Sign out successful')
                this.reset()
                return true
            } else {
                throw new Error('Logout failed')
            }
        } catch (error) {
            console.error('Error during logout:', error)
            return false
        }
    }

    /**
     * Atualiza o estado completo de autenticação
     */
    updateAuthState(data: {
        user?: AuthUserWithProfileT | null
        permissions?: PermissionT[]
        loading?: boolean
    }): void {
        if (data.user !== undefined) {
            this.user = data.user
        }
        if (data.permissions !== undefined) {
            this.permissions = data.permissions
        }
        if (data.loading !== undefined) {
            this.loading = data.loading
        }
        this.notifyListeners()
    }

    /**
     * Verifica se o usuário tem uma permissão específica
     */
    hasPermission(permission: string): boolean {
        return this.permissions.includes(permission as PermissionT)
    }

    /**
     * Verifica se o usuário tem pelo menos uma das permissões fornecidas
     */
    hasAnyPermission(permissions: string[]): boolean {
        return permissions.some((permission) =>
            this.permissions.includes(permission as PermissionT)
        )
    }

    /**
     * Verifica se o usuário tem todas as permissões fornecidas
     */
    hasAllPermissions(permissions: string[]): boolean {
        return permissions.every((permission) =>
            this.permissions.includes(permission as PermissionT)
        )
    }

    /**
     * Reseta o estado para o inicial
     */
    reset(): void {
        this.user = null
        this.permissions = []
        this.loading = false
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
        user: AuthUserWithProfileT | null
        permissions: PermissionT[]
        loading: boolean
    } {
        return {
            user: this.user,
            permissions: this.permissions,
            loading: this.loading,
        }
    }

    /**
     * Carrega o estado a partir de um objeto serializado
     */
    fromJSON(data: {
        user: AuthUserWithProfileT | null
        permissions: PermissionT[]
        loading: boolean
    }): void {
        this.user = data.user
        this.permissions = data.permissions
        this.loading = data.loading
        this.notifyListeners()
    }
}

// Exporta uma instância singleton para uso no content script
export const authModel = new AuthModel()
