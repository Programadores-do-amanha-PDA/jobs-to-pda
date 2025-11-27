import React from 'react'

// Global imports
import Browser from 'webextension-polyfill'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

// Actions
import { signInWithPassword } from '@/actions'

// Types
import { LoginFormDataT, LoginResponseT } from '@/types'

// UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

// Local imports
import { useAuth, loginSchema } from '@/features/popup'

export function LoginPage() {
    const navigate = useNavigate()
    const { updateAuthState } = useAuth()

    const PLATFORM_PATH = import.meta.env.VITE_PLATFORM_PATH

    const form = useForm<LoginFormDataT>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    })

    const {
        handleSubmit,
        formState: { isSubmitting, errors },
        setError,
    } = form

    const onSubmit = async (data: LoginFormDataT) => {
        try {
            const response: LoginResponseT = await signInWithPassword(data)

            console.log(response)

            if (response.error && response.confirmation) {
                toast.error('Confirme seu email para continuar.')
                Browser.tabs.create({
                    url: `${PLATFORM_PATH}/resend-confirmation?email=${encodeURIComponent(
                        data.email
                    )}`,
                })
                return
            }

            if (response.error && response.confirmation === false) {
                setError('root', {
                    type: 'manual',
                    message: response.message || 'Credenciais inválidas',
                })
                toast.error('Email ou senha incorretos.')
                return
            }

            if (!response.error && response.data?.session) {
                await updateAuthState(response.data.session)
                toast.success('Login realizado com sucesso!')
                navigate('/home')
                return
            }

            throw new Error(response.message || 'Erro desconhecido')
        } catch (error) {
            console.error('Erro no login:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Erro ao fazer login. Verifique suas credenciais.'

            toast.error(errorMessage)
            setError('root', {
                type: 'manual',
                message: errorMessage,
            })
        }
    }

    return (
        <div className="w-full mx-auto flex flex-col gap-4 justify-center">
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <p className="text-base font-bold">Entrar</p>
                    <p className="text-sm text-muted-foreground">
                        Use suas credenciais para acessar sua conta
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-sm font-semibold">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="seu@email.com"
                                            autoComplete="email"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="font-semibold text-sm">
                                            Senha
                                        </FormLabel>
                                        <Button
                                            type="button"
                                            variant="link"
                                            onClick={() => {
                                                Browser.tabs.create({
                                                    url: `${PLATFORM_PATH}/reset-password`,
                                                    active: true,
                                                })
                                            }}
                                            className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors p-0! w-max! h-max!"
                                        >
                                            Esqueceu a senha?
                                        </Button>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            autoComplete="current-password"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {errors.root && (
                            <div className="text-sm text-destructive font-medium">
                                {errors.root.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-semibold mt-2 cursor-pointer"
                            size="lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
