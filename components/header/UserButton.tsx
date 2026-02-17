'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

/* ---------------- ZOD ---------------- */

const schema = z.object({
	email: z.string().trim().min(1, 'Введите email').email('Некорректный email'),
	password: z.string().trim().min(6, 'Минимум 6 символов'),
})

type FormValues = z.infer<typeof schema>
type Provider = 'mail' | 'yandex' | 'google'

/* ---------------- COMPONENT ---------------- */

export function UserButton() {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [popoverOpen, setPopoverOpen] = useState(false)
	const [isPending, startTransition] = useTransition()

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		mode: 'onChange',
	})

	const openDialog = () => {
		setPopoverOpen(false)
		setDialogOpen(true)
	}

	const onSubmit = (data: FormValues) => {
		startTransition(async () => {
			console.log(data)
			reset()
			setDialogOpen(false)
		})
	}

	const handleSocial = (provider: Provider) => {
		startTransition(async () => {
			console.log(provider)
			setDialogOpen(false)
		})
	}

	return (
		<>
			{/* POPOVER */}
			<Popover
				open={popoverOpen}
				onOpenChange={setPopoverOpen}
			>
				<PopoverTrigger asChild>
					<Button
						variant='none'
						size='none'
						onMouseEnter={() => setPopoverOpen(true)}
						onMouseLeave={() => setPopoverOpen(false)}
						onClick={openDialog}
						className='hover:text-chart-1 flex-col items-center gap-1'
					>
						<User2 className='size-8' />
						<span className='text-xs font-light'>Войти</span>
					</Button>
				</PopoverTrigger>

				<PopoverContent
					sideOffset={0}
					className='bg-accent text-accent w-72 rounded-xl p-4'
					onMouseEnter={() => setPopoverOpen(true)}
					onMouseLeave={() => setPopoverOpen(false)}
				>
					<p className='text-primary mb-4 text-sm'>
						Войдите, чтобы делать покупки и отслеживать заказы.
					</p>
					<Button
						className='w-full'
						onClick={openDialog}
					>
						Войти или зарегистрироваться
					</Button>
				</PopoverContent>
			</Popover>

			{/* DIALOG */}
			<Dialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			>
				<DialogContent className='rounded-3xl p-6 sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Вход в аккаунт</DialogTitle>
						<DialogDescription>Используйте почту и пароль или соцсети.</DialogDescription>
					</DialogHeader>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<Field data-invalid={!!errors.email}>
							<FieldLabel htmlFor='email'>Почта</FieldLabel>
							<Input
								id='email'
								type='email'
								autoComplete='email'
								placeholder='Укажите email'
								{...register('email')}
							/>
							<FieldDescription>Используется для входа и уведомлений.</FieldDescription>
							<FieldError>{errors.email?.message}</FieldError>
						</Field>

						<Field data-invalid={!!errors.password}>
							<FieldLabel htmlFor='password'>Пароль</FieldLabel>
							<Input
								id='password'
								type='password'
								autoComplete='current-password'
								placeholder='Введите пароль'
								{...register('password')}
							/>
							<FieldDescription>Минимум 6 символов.</FieldDescription>
							<FieldError>{errors.password?.message}</FieldError>
						</Field>

						<Button
							type='submit'
							className='w-full'
							disabled={isPending || !isDirty || !isValid}
						>
							{isPending ? 'Входим...' : 'Войти с почтой'}
						</Button>

						<FieldSeparator>или войти через</FieldSeparator>

						{(['mail', 'yandex', 'google'] as const).map((provider) => (
							<Button
								key={provider}
								type='button'
								variant='outline'
								className='w-full'
								disabled={isPending}
								onClick={() => handleSocial(provider)}
							>
								{provider === 'mail' ? 'Mail.ru' : provider === 'yandex' ? 'Yandex' : 'Google'}
							</Button>
						))}
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}
