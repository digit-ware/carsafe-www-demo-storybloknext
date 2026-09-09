import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';
import { twJoin } from 'tailwind-merge';

type SectionHeadAlignment = 'left' | 'center';
type SectionHeadSize = 'default' | 'small';
type SectionHeadVariant = 'inherit' | 'default' | 'on_dark';
type SectionHeadLayout = 'stacked' | 'split';

interface SectionHeadBlok extends SbBlokData {
	/** Small uppercase label above the headline (reference `.eyebrow`). */
	eyebrow?: string;
	headline: string;
	intro?: string;
	alignment: SectionHeadAlignment;
	size: SectionHeadSize;
	variant: SectionHeadVariant;
	/** `split` sends the intro to a second column beside the headline. */
	layout: SectionHeadLayout;
	/** Optional single `cta` shown next to the headline (reference `.section-head--action`). */
	action?: SbBlokData[];
}

interface SectionHeadProps {
	blok: SectionHeadBlok;
}

/**
 * Explicit lookups, not template-string concatenation — the full class names
 * stay greppable so they survive static extraction (Tailwind, future codemods).
 */
const ALIGNMENT_CLASSES: Record<SectionHeadAlignment, string> = {
	left: '',
	center: 'mx-auto max-w-[60ch] text-center',
};

const SIZE_CLASSES: Record<SectionHeadSize, string> = {
	/** `.h-section` in the reference: clamp(30px, 4.2vw, 48px). */
	default: 'text-[clamp(1.875rem,4.2vw,3rem)]',
	/** `.h-small` — the partners / smaller headings. */
	small: 'text-[clamp(1.5rem,2.6vw,1.875rem)]',
};

/**
 * `inherit` (the schema default) leans on the token remap the parent Section
 * does for a dark/accent surface — `text-ink` / `text-ink-soft` already resolve
 * light there, so nothing extra is needed. `on_dark` is the manual override for
 * a dark area that *isn't* a `data-surface` section. `default` pins the
 * light-surface treatment regardless of context.
 */
const HEADLINE_CLASSES: Record<SectionHeadVariant, string> = {
	inherit: 'text-ink',
	default: 'text-ink',
	on_dark: 'text-white',
};

const INTRO_CLASSES: Record<SectionHeadVariant, string> = {
	inherit: 'text-ink-soft',
	default: 'text-ink-soft',
	on_dark: 'text-white/70',
};

export default function SectionHead({ blok }: SectionHeadProps) {
	const alignment = ALIGNMENT_CLASSES[blok.alignment] ?? ALIGNMENT_CLASSES.left;
	const size = SIZE_CLASSES[blok.size] ?? SIZE_CLASSES.default;
	const headline = HEADLINE_CLASSES[blok.variant] ?? HEADLINE_CLASSES.inherit;
	const intro = INTRO_CLASSES[blok.variant] ?? INTRO_CLASSES.inherit;
	const isSplit = blok.layout === 'split';
	const isCenter = blok.alignment === 'center';
	const action = blok.action?.length ? blok.action : null;

	const headlineBlock = (
		<div
			className={twJoin(
				action && 'flex flex-wrap items-end justify-between gap-x-8 gap-y-4',
			)}
		>
			<div className="min-w-0">
				{blok.eyebrow && (
					<p className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.14em] text-accent-text">
						{blok.eyebrow}
					</p>
				)}
				<h2
					className={twJoin(
						'max-w-[20ch] font-display font-extrabold leading-[1.03]',
						size,
						headline,
					)}
				>
					{blok.headline}
				</h2>
			</div>

			{action && (
				<div className="flex-none">
					{action.map((nestedBlok) => (
						<StoryblokServerComponent
							blok={nestedBlok}
							key={nestedBlok._uid}
						/>
					))}
				</div>
			)}
		</div>
	);

	const introBlock = blok.intro ? (
		<p
			className={twJoin(
				'max-w-[52ch] text-[16px]',
				isSplit ? 'text-[15.5px]' : 'mt-4.5',
				isCenter && 'mx-auto',
				intro,
			)}
		>
			{blok.intro}
		</p>
	) : null;

	return (
		<div
			data-part="section-head"
			className="mx-auto mb-12 w-full max-w-page px-8 max-[760px]:px-5"
			{...storyblokEditable(blok)}
		>
			<div
				className={twJoin(
					isSplit &&
						'grid items-end gap-x-14 gap-y-4 min-[900px]:grid-cols-[1.25fr_0.75fr]',
					alignment,
				)}
			>
				{headlineBlock}
				{introBlock}
			</div>
		</div>
	);
}
