/**
 * Editor-controlled theming.
 *
 * Content editors set three "seed" colours per mode in the Storyblok `config`
 * story — primary, text, background. Every other brand token
 * (`--color-surface`, `--color-ink-soft`, `--color-accent-soft`, …) is derived
 * from those seeds here with CSS `color-mix()`, so the palette stays internally
 * consistent and we never ask an editor to pick a dozen colours by hand.
 *
 * `buildThemeCss` returns a CSS string that gets injected as a <style> after
 * globals.css (see layout.tsx). The selectors are `html:root` /
 * `html[data-theme='dark']` (specificity 0,1,1) purely so the block always wins
 * over the defaults baked into the `@theme` layer regardless of source order.
 */

export interface PaletteSeed {
	primary?: string;
	text?: string;
	background?: string;
}

export interface ThemeSeeds {
	light?: PaletteSeed;
	dark?: PaletteSeed;
}

const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Keep only well-formed hex strings; anything else falls back to the default. */
function hex(value?: string): string | undefined {
	const v = value?.trim();
	return v && HEX.test(v) ? v : undefined;
}

/**
 * Derived tokens for one mode. Only tokens whose seed is present get emitted,
 * so a half-filled `config` story degrades to the globals.css defaults for the
 * rest instead of breaking.
 */
function paletteVars(seed: PaletteSeed, mode: 'light' | 'dark'): string | null {
	const primary = hex(seed.primary);
	const text = hex(seed.text);
	const bg = hex(seed.background);
	if (!primary && !text && !bg) return null;

	const lines: string[] = [];
	const push = (name: string, value: string) =>
		lines.push(`  ${name}: ${value};`);

	if (bg) {
		push('--color-bg', bg);
		// Raised surfaces read *lighter* than the page in both modes, but the
		// second step reverses: darker than bg on light, lighter than bg on dark.
		if (mode === 'light') {
			push('--color-surface', `color-mix(in oklab, ${bg}, white 60%)`);
			push('--color-surface-2', `color-mix(in oklab, ${bg}, black 6%)`);
		} else {
			push('--color-surface', `color-mix(in oklab, ${bg}, white 6%)`);
			push('--color-surface-2', `color-mix(in oklab, ${bg}, white 12%)`);
		}
	}

	if (text) {
		push('--color-ink', text);
		const toward = bg ?? (mode === 'light' ? 'white' : 'black');
		push('--color-ink-soft', `color-mix(in oklab, ${text}, ${toward} 32%)`);
		push('--color-ink-faint', `color-mix(in oklab, ${text}, ${toward} 55%)`);
	}

	if (text && bg) {
		push('--color-line', `color-mix(in oklab, ${bg}, ${text} 15%)`);
	}

	if (primary) {
		push('--color-accent', primary);
		push(
			'--color-accent-strong',
			mode === 'light'
				? `color-mix(in oklab, ${primary}, black 20%)`
				: `color-mix(in oklab, ${primary}, white 18%)`,
		);
		const softBase = bg ?? (mode === 'light' ? 'white' : 'black');
		push(
			'--color-accent-soft',
			`color-mix(in oklab, ${primary}, ${softBase} 82%)`,
		);
		// Text that sits on top of a primary fill (buttons). Not derived from the
		// seed — a pale primary would need dark text and we don't do a contrast
		// pass here. Revisit if editors pick low-contrast primaries.
		push('--color-accent-ink', mode === 'light' ? '#ffffff' : '#08140f');
	}

	return lines.join('\n');
}

export function buildThemeCss(seeds: ThemeSeeds): string | null {
	const light = seeds.light ? paletteVars(seeds.light, 'light') : null;
	const dark = seeds.dark ? paletteVars(seeds.dark, 'dark') : null;
	if (!light && !dark) return null;

	const blocks: string[] = [];
	if (light) blocks.push(`html:root {\n${light}\n}`);
	if (dark) blocks.push(`html[data-theme='dark'] {\n${dark}\n}`);
	return blocks.join('\n');
}
