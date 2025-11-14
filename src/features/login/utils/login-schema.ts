import { z } from 'zod'

/**
 * Login form validation schema
 * Ensures email format and password requirements
 */
export const loginSchema = z.object({
    email: z
        .email('Email deve ter um formato válido')
        .min(1, 'Email é obrigatório')
        .toLowerCase(),
    password: z
        .string()
        .min(1, 'Senha é obrigatória')
        .min(6, 'Senha deve ter pelo menos 6 caracteres'),
})
