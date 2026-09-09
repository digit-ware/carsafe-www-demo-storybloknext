/**
 * Loads the singleton `config` story from Storyblok and maps it to the shape
 * the theming layer wants. Fetched once per request via React `cache()`.
 *
 * The story is fetched with `version: 'draft'` to match the rest of the app
 * (see [[...slug]]/page.tsx) so edits show up on refresh inside the Visual
 * Editor without publishing. Colours aren't translated, so it's always read in
 * the space's default language.
 */

import { cache } from 'react';
import { getStoryblokApi } from './storyblok';
import type { PaletteSeed, ThemeSeeds } from './theme';

/** Slug of the singleton settings story. Not linked anywhere public. */
const CONFIG_SLUG = 'config';

interface PaletteBlok {
	primary?: string;
	text?: string;
	background?: string;
}

interface ConfigContent {
	palette_light?: PaletteBlok[];
	palette_dark?: PaletteBlok[];
}

/** A "Blocks" field with max 1 still comes back as an array. */
function firstBlok(field?: PaletteBlok[]): PaletteSeed | undefined {
	const blok = field?.[0];
	if (!blok) return undefined;
	return {
		primary: blok.primary,
		text: blok.text,
		background: blok.background,
	};
}

export const getConfigStory = cache(async (): Promise<ConfigContent | null> => {
	try {
		const storyblokApi = getStoryblokApi();
		const { data } = await storyblokApi.get(`cdn/stories/${CONFIG_SLUG}`, {
			version: 'draft',
		});
		return (data.story?.content as ConfigContent) ?? null;
	} catch {
		// No config story yet (or API error) — fall back to globals.css defaults.
		return null;
	}
});

export function themeSeedsFromConfig(content: ConfigContent | null): ThemeSeeds {
	if (!content) return {};
	return {
		light: firstBlok(content.palette_light),
		dark: firstBlok(content.palette_dark),
	};
}
