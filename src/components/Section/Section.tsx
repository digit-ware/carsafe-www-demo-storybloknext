import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';
import { twJoin } from 'tailwind-merge';

type SectionBackground = 'white' | 'cream' | 'dark' | 'accent';
type SectionLayout = 'stacked' | 'split';
type SectionSpacing = 'default' | 'tight';

interface SectionBlok extends SbBlokData {
	/** A single `section_head` blok. Its own `mb-12` is the 48px gap to content. */
	head?: SbBlokData[];
	content?: SbBlokData[];
	/** Reference `.section--divider` — a top border rule between stacked sections. */
	divider?: boolean;
	/** Anchor target for header nav (e.g. #vantaggi). */
	anchor_id?: string;
	/** Surface fill. `dark`/`accent` also flip the subtree to light-on-dark. */
	background: SectionBackground;
	/** `split` puts the head left and the content right in one grid. */
	layout: SectionLayout;
	spacing: SectionSpacing;
}

interface SectionProps {
	blok: SectionBlok;
}

/**
 * Explicit lookups, never `bg-${blok.background}` — the whole class name has to
 * stay in the source for Tailwind's scanner to keep it.
 *
 *   white  → page ground (no fill)
 *   cream  → the `.section--cream` tint
 *   dark   → `.section--dark` ink fill
 *   accent → `.section--accent` solid accent fill
 */
const BACKGROUND_CLASSES: Record<SectionBackground, string> = {
	white: '',
	cream: 'bg-surface-cream',
	dark: 'bg-surface-dark',
	accent: 'bg-surface-accent',
};

/**
 * The `.on-dark` / `.on-accent` wrapper from the reference CSS, ported as a
 * `data-surface` attribute. globals.css remaps the brand tokens for the whole
 * subtree off this — the same mechanism as the global `[data-theme='dark']`
 * switch — so `section_head`, `card_group` and `feature_card` restyle for a
 * dark surface without any of them inspecting a prop or context.
 * `white`/`cream` keep the default tokens, so they get no attribute.
 */
const SURFACE_ATTR: Partial<Record<SectionBackground, 'dark' | 'accent'>> = {
	dark: 'dark',
	accent: 'accent',
};

const SPACING_CLASSES: Record<SectionSpacing, string> = {
	/** `.section` padding: 96px block (64px on mobile). */
	default: 'py-24 max-[760px]:py-16',
	/** `.section--tight` — the condensed rhythm (52px / 40px). */
	tight: 'py-13 max-[760px]:py-10',
};

const CONTAINER = 'mx-auto w-full max-w-page px-8 max-[760px]:px-5';

/**
 * `split` mirrors the reference `.section__split`: a single `.wrap` container
 * holding a 2-col grid, head on the left, content on the right. The children
 * (`section_head`, `card_group`) still bring their own `.wrap`, so inside the
 * grid we strip it back down — descendant selectors on `[data-part]` outrank the
 * child's own `mx-auto/max-w-page/px` utilities without needing `!important`.
 */
const SPLIT_RESET =
	'[&_[data-part]]:mx-0 [&_[data-part]]:max-w-none [&_[data-part]]:px-0 [&_[data-part=section-head]]:mb-0';

export default function Section({ blok }: SectionProps) {
	const background =
		BACKGROUND_CLASSES[blok.background] ?? BACKGROUND_CLASSES.white;
	const spacing = SPACING_CLASSES[blok.spacing] ?? SPACING_CLASSES.default;
	const isSplit = blok.layout === 'split';

	const head = blok.head?.map((nestedBlok) => (
		<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
	));
	const content = blok.content?.map((nestedBlok) => (
		<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
	));

	return (
		<section
			id={blok.anchor_id || undefined}
			data-surface={SURFACE_ATTR[blok.background]}
			className={twJoin(
				spacing,
				background,
				blok.divider && 'border-t border-line',
			)}
			{...storyblokEditable(blok)}
		>
			{isSplit ? (
				<div
					className={twJoin(
						CONTAINER,
						'grid items-start gap-14 min-[900px]:grid-cols-2',
						SPLIT_RESET,
					)}
				>
					<div>{head}</div>
					<div>{content}</div>
				</div>
			) : (
				<>
					{head}
					{content}
				</>
			)}
		</section>
	);
}
