import { Header } from '@/components/header/Header'
import { Toaster } from '@/components/ui/sonner'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<body className={` ${nunito.variable} antialiased`}>
				<Header />
				{children}
				<Toaster
					position='top-center'
					richColors
				/>
			</body>
		</html>
	)
}
