'use client';

import { useEffect, useState } from 'react';
import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeToggleBlok extends SbBlokData {
	label?: string;
}

interface ThemeToggleProps {
	blok: ThemeToggleBlok;
}

/**
 * Round icon button that flips `data-theme` on <html> and remembers the choice
 * in localStorage. The pre-hydration script in layout.tsx sets the initial
 * value (stored choice → OS preference), so this component only handles clicks.
 *
 * Which glyph shows is left to the `dark:` variant (ancestor
 * `[data-theme='dark']`) — pure CSS, so it's right on first paint with no
 * hydration juggling. React state here only drives `aria-pressed`.
 */
export default function ThemeToggle({ blok }: ThemeToggleProps) {
	const [isDark, setIsDark] = useState<boolean | null>(null);

	useEffect(() => {
		setIsDark(document.documentElement.dataset.theme === 'dark');
	}, []);

	function toggleTheme() {
		const next: Theme =
			document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {
			// storage blocked (private mode etc.) — toggle still works for this session
		}
		setIsDark(next === 'dark');
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={blok.label || ''}
			aria-pressed={isDark ?? undefined}
			suppressHydrationWarning
			className="flex size-8 flex-none items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink [&_svg]:h-3.5 [&_svg]:w-3.5"
			{...storyblokEditable(blok)}
		>
			<Moon className="dark:hidden" aria-hidden="true" />
			<Sun className="hidden dark:block" aria-hidden="true" />
		</button>
	);
}
