import { Session, User } from '@supabase/supabase-js'
import { ProfileT, PermissionT, RolesT } from '@/types'

// Message types for communication between content script and background script

export type AuthMessageType =
    | 'GET_SESSION'
    | 'GET_USER'
    | 'GET_PROFILE'
    | 'GET_PERMISSIONS'
    | 'SIGN_OUT'

// Request messages
export interface GetSessionRequest {
    type: 'GET_SESSION'
}

export interface GetUserRequest {
    type: 'GET_USER'
    jwt: string
}

export interface GetProfileRequest {
    type: 'GET_PROFILE'
    userId: string
}

export interface GetPermissionsRequest {
    type: 'GET_PERMISSIONS'
    role: RolesT
}

export interface SignOutRequest {
    type: 'SIGN_OUT'
}

export interface StatusRequest {
    type: 'STATUS'
}

export type AuthMessage =
    | GetSessionRequest
    | GetUserRequest
    | GetProfileRequest
    | GetPermissionsRequest
    | SignOutRequest

// Response messages
export interface GetSessionResponse {
    success: true
    session: Session | null
}

export interface GetUserResponse {
    success: true
    user: User | null
}

export interface GetProfileResponse {
    success: true
    profile: ProfileT | null
}

export interface GetPermissionsResponse {
    success: true
    permissions: PermissionT[]
}

export interface SignOutResponse {
    success: boolean
}

export interface StatusResponse {
    status: 'running'
}

export interface ErrorResponse {
    success: false
    error: string
}

export type AuthMessageResponse =
    | GetSessionResponse
    | GetUserResponse
    | GetProfileResponse
    | GetPermissionsResponse
    | SignOutResponse
    | ErrorResponse
