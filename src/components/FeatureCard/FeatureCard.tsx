import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';
import { twJoin } from 'tailwind-merge';

type FeatureCardVariant = 'dark' | 'tint' | 'plain';
type FeatureCardIcon = 'none' | 'arrow' | 'check';
type CardGroupFrame = 'plain' | 'divided' | 'boxed';

interface FeatureCardBlok extends SbBlokData {
	eyebrow?: string;
	headline: string;
	text?: string;
	variant: FeatureCardVariant;
	icon: FeatureCardIcon;
	items?: SbBlokData[];
	buttons?: SbBlokData[];
}

interface FeatureCardProps {
	blok: FeatureCardBlok;
	/** Passed by CardGroup — a filled variant self-pads, otherwise the cell pads. */
	frame?: CardGroupFrame;
}

/**
 * `dark`/`tint` are filled tiles that carry their own surface, so they pin their
 * own text colours and padding. `plain` is transparent — it inherits the
 * section's remapped tokens (`text-ink`, `text-ink-soft`, …) and lets the
 * CardGroup cell own the padding. Parallel lookups keyed on `variant` keep every
 * class name greppable for static extraction.
 */
const VARIANT_CLASSES: Record<FeatureCardVariant, string> = {
	dark: 'rounded-xl bg-ink p-8 text-white',
	tint: 'rounded-xl bg-accent-soft p-8 text-ink',
	plain: '',
};

const HEADLINE_CLASSES: Record<FeatureCardVariant, string> = {
	dark: 'text-white',
	tint: 'text-ink',
	plain: 'text-ink',
};

const TEXT_CLASSES: Record<FeatureCardVariant, string> = {
	dark: 'text-white/70',
	tint: 'text-ink-soft',
	plain: 'text-ink-soft',
};

const ICON_PATHS: Record<Exclude<FeatureCardIcon, 'none'>, string> = {
	arrow: 'M6 18L18 6M8 6h10v10',
	check: 'M4 12l5 5L20 6',
};

export default function FeatureCard({ blok }: FeatureCardProps) {
	const variant = VARIANT_CLASSES[blok.variant] ?? VARIANT_CLASSES.plain;
	const headline = HEADLINE_CLASSES[blok.variant] ?? HEADLINE_CLASSES.plain;
	const text = TEXT_CLASSES[blok.variant] ?? TEXT_CLASSES.plain;
	const iconPath =
		blok.icon && blok.icon !== 'none' ? ICON_PATHS[blok.icon] : null;

	return (
		<div className={twJoin('h-full', variant)} {...storyblokEditable(blok)}>
			{blok.eyebrow && (
				<p className="text-small font-bold tracking-widest text-ink-soft">
					{blok.eyebrow}
				</p>
			)}

			{iconPath && (
				<svg
					viewBox="0 0 24 24"
					aria-hidden="true"
					className="my-5.5 size-5.5 text-accent fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-1.8]"
				>
					<path d={iconPath} />
				</svg>
			)}

			<h3
				className={twJoin(
					'font-display text-[19px] font-bold leading-[1.2] tracking-[-0.02em]',
					(blok.eyebrow || iconPath) && 'mt-2.5',
					headline,
				)}
			>
				{blok.headline}
			</h3>

			{blok.text && (
				<p className={twJoin('mt-2.5 max-w-[30ch] text-[14.5px]', text)}>
					{blok.text}
				</p>
			)}

			{blok.items && blok.items.length > 0 && (
				<ul className="mt-3.5 flex flex-col gap-2.5">
					{blok.items.map((nestedBlok) => (
						<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
					))}
				</ul>
			)}

			{blok.buttons && blok.buttons.length > 0 && (
				<div className="mt-5 flex flex-wrap gap-3.5">
					{blok.buttons.map((nestedBlok) => (
						<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
					))}
				</div>
			)}
		</div>
	);
}
