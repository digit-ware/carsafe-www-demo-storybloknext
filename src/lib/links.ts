/** Storyblok multilink ("Link") field. */
export interface StoryblokLink {
	linktype?: 'story' | 'url' | 'email' | 'asset';
	url?: string;
	cached_url?: string;
	email?: string;
	anchor?: string;
	target?: '_blank' | '_self' | '';
}

/** Turn a Storyblok multilink field into a usable href. */
export function resolveHref(link: StoryblokLink | undefined): string {
	if (!link) return '#';

	if (link.linktype === 'email') {
		return link.email ? `mailto:${link.email}` : '#';
	}

	if (link.linktype === 'url' || link.linktype === 'asset') {
		return link.url || link.cached_url || '#';
	}

	// story links come through as a slug in `cached_url` / `url`
	const raw = link.url || link.cached_url || '';
	if (!raw) return '#';

	const isAbsolute = /^https?:\/\//.test(raw) || raw.startsWith('/');
	const href = isAbsolute ? raw : `/${raw}`;

	return link.anchor ? `${href}#${link.anchor}` : href;
}

export function isExternalHref(href: string): boolean {
	return /^(https?:|mailto:|tel:)/.test(href);
}
