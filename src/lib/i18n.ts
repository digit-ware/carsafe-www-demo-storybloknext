/**
 * Storyblok i18n helpers.
 *
 * The space's default language is served from unprefixed URLs (`/`, `/about`),
 * every translation lives behind its language prefix (`/en`, `/en/about`).
 * Storyblok itself always calls the default language `default`, so the code
 * below maps our public prefix onto that.
 */
export const DEFAULT_LANGUAGE = 'it';

export const TRANSLATED_LANGUAGES = ['en'] as const;

export const LANGUAGES = [DEFAULT_LANGUAGE, ...TRANSLATED_LANGUAGES];

const LANGUAGE_ALIASES: Record<string, string> = {
	english: 'en',
	italian: 'it',
};

export function normalizeLanguage(language: string) {
	const normalizedLanguage = language.trim().toLowerCase().replaceAll('-', '_');

	return LANGUAGE_ALIASES[normalizedLanguage] ?? normalizedLanguage;
}

export function isTranslatedLanguage(segment?: string) {
	return (
		!!segment &&
		(TRANSLATED_LANGUAGES as readonly string[]).includes(segment.toLowerCase())
	);
}

/** Splits a URL path into its language and the remaining content slug. */
export function splitLanguageFromSegments(segments: string[]) {
	if (isTranslatedLanguage(segments[0])) {
		return {
			language: segments[0].toLowerCase(),
			slugSegments: segments.slice(1),
		};
	}

	return { language: DEFAULT_LANGUAGE, slugSegments: segments };
}

/** Storyblok expects `default` rather than the real code for the space default. */
export function toStoryblokLanguage(language: string) {
	return language === DEFAULT_LANGUAGE ? 'default' : language;
}

export function languageHref(language: string, slugSegments: string[]) {
	const segments =
		language === DEFAULT_LANGUAGE ? slugSegments : [language, ...slugSegments];

	return `/${segments.join('/')}`;
}
