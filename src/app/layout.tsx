import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Figtree } from 'next/font/google';
import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import { getConfigStory, themeSeedsFromConfig } from '@/lib/site-settings';
import { buildThemeCss } from '@/lib/theme';

const figtree = Figtree({
	subsets: ['latin'],
	variable: '--font-figtree',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'CarSafe — La rete di carrozzerie numero uno in Italia',
	description:
		'CarSafe collega automobilisti, assicurazioni e flotte a una rete nazionale di carrozzerie selezionate.',
};

interface RootLayoutProps {
	children: ReactNode;
}

/**
 * Runs before first paint: applies the stored theme choice (or the OS
 * preference when there's none) so dark-mode users never see a light flash.
 * ThemeToggle takes over from there.
 * 
 */
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var t=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default async function RootLayout({ children }: RootLayoutProps) {
	const themeCss = buildThemeCss(
		themeSeedsFromConfig(await getConfigStory()),
	);

	return (
		<StoryblokProvider>
			<html
				lang="it"
				data-theme="light"
				className={figtree.variable}
				suppressHydrationWarning
			>
				<head>
					<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
					{themeCss && (
						<style
							id="sb-theme"
							// Editor-controlled brand tokens; overrides the @theme defaults.
							dangerouslySetInnerHTML={{ __html: themeCss }}
						/>
					)}
				</head>
				<body>{children}</body>
			</html>
		</StoryblokProvider>
	);
}
