import {
    getSession,
    getAuthUser,
    getProfileById,
    getPermissionsByRole,
    signOut,
} from '@/actions'
import type {
    AuthMessage,
    AuthMessageResponse,
    ErrorResponse,
} from '@/types/message-types'

/**
 * Handles authentication-related messages from content scripts
 */
export async function handleAuthMessage(
    message: AuthMessage
): Promise<AuthMessageResponse> {
    try {
        console.log(
            'Jobs To PdA: 📨 Background received auth message:',
            message.type
        )

        switch (message.type) {
            case 'GET_SESSION': {
                const session = await getSession()
                console.log(
                    'Jobs To PdA: ✅ Session retrieved:',
                    session ? 'authenticated' : 'not authenticated'
                )
                return {
                    success: true,
                    session: session || null,
                }
            }

            case 'GET_USER': {
                const user = await getAuthUser(message.jwt)
                console.log(
                    'Jobs To PdA: ✅ User retrieved:',
                    user ? user.email : 'not found'
                )
                return {
                    success: true,
                    user: user || null,
                }
            }

            case 'GET_PROFILE': {
                const profile = await getProfileById(message.userId)
                console.log(
                    'Jobs To PdA: ✅ Profile retrieved:',
                    profile ? 'found' : 'not found'
                )
                return {
                    success: true,
                    profile: profile || null,
                }
            }

            case 'GET_PERMISSIONS': {
                const permissions = await getPermissionsByRole(message.role)
                console.log(
                    'Jobs To PdA: ✅ Permissions retrieved:',
                    permissions.length
                )
                return {
                    success: true,
                    permissions,
                }
            }

            case 'SIGN_OUT': {
                const success = await signOut()
                console.log(
                    'Jobs To PdA: ✅ Sign out:',
                    success ? 'successful' : 'failed'
                )
                return {
                    success,
                }
            }

            default: {
                const errorResponse: ErrorResponse = {
                    success: false,
                    error: 'Unknown auth message type',
                }
                return errorResponse
            }
        }
    } catch (error) {
        console.error('Jobs To PdA: ❌ Error handling auth message:', error)
        const errorResponse: ErrorResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
        return errorResponse
    }
}
