'use client';

import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twJoin } from 'tailwind-merge';
import {
	LANGUAGES,
	languageHref,
	normalizeLanguage,
	splitLanguageFromSegments,
} from '@/lib/i18n';

interface LanguageToggleBlok extends SbBlokData {
	default_language: string;
	languages: string[];
}

interface LanguageToggleProps {
	blok: LanguageToggleBlok;
}

export default function LanguageToggle({ blok }: LanguageToggleProps) {
	const pathname = usePathname();
	const { language: currentLanguage, slugSegments } = splitLanguageFromSegments(
		pathname.split('/').filter(Boolean),
	);

	const languages = (blok.languages?.length ? blok.languages : LANGUAGES).map(
		normalizeLanguage,
	);

	return (
		<div
			className="flex items-center gap-0.5"
			role="group"
			aria-label="Lingua"
			{...storyblokEditable(blok)}
		>
			{languages.map((lang) => {
				const isActive = lang === currentLanguage;

				return (
					<Link
						key={lang}
						href={languageHref(lang, slugSegments)}
						hrefLang={lang}
						aria-current={isActive ? 'true' : undefined}
						className={twJoin(
							'px-1.5 py-1 text-[13.5px] font-extrabold uppercase leading-none tracking-[0.08em] transition-colors',
							isActive ? 'text-accent' : 'text-ink-faint hover:text-ink',
						)}
					>
						{lang.toUpperCase()}
					</Link>
				);
			})}
		</div>
	);
}
