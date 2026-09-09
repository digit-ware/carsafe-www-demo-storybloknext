import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { twJoin } from 'tailwind-merge';

type MarqueeSpeed = 'slow' | 'normal' | 'fast';

interface MarqueeItem extends SbBlokData {
	name?: string;
}

interface MarqueeBlok extends SbBlokData {
	items?: MarqueeItem[];
	speed: MarqueeSpeed;
}

interface MarqueeProps {
	blok: MarqueeBlok;
}

/**
 * Explicit lookups — the arbitrary custom-prop value has to stay in the source
 * for Tailwind's scanner. Drives `--marquee-duration`, consumed by the
 * `animate-[marquee_…]` utility on the track. Values mirror the reference
 * (`.marquee` 34s, `.marquee--fast` 20s, `.marquee--slow` 52s).
 */
const SPEED_CLASSES: Record<MarqueeSpeed, string> = {
	slow: '[--marquee-duration:52s]',
	normal: '[--marquee-duration:34s]',
	fast: '[--marquee-duration:20s]',
};

/**
 * Reference `.marquee` — a full-bleed orange strip that scrolls a short list of
 * labels. The track renders the list twice: the first pass is the real content,
 * the second is `aria-hidden` and exists only so the `translateX(-50%)` loop
 * (see the `marquee` keyframe in globals.css) has no visible seam.
 * `motion-reduce` parks it; hovering the strip pauses it.
 */
export default function Marquee({ blok }: MarqueeProps) {
	const items = (blok.items ?? []).filter((item) => item.name);
	if (items.length === 0) return null;

	const speed = SPEED_CLASSES[blok.speed] ?? SPEED_CLASSES.normal;

	const group = (key: string, hidden?: boolean) => (
		<div
			key={key}
			aria-hidden={hidden || undefined}
			className="flex h-11 flex-none items-center gap-8.5 px-4.25"
		>
			{items.map((item, i) => (
				<span key={`${key}-${item._uid ?? i}`} className="flex items-center gap-8.5">
					<span className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] whitespace-nowrap">
						{item.name}
					</span>
					<span className="h-[5px] w-[5px] flex-none rounded-full bg-accent-ink/55" />
				</span>
			))}
		</div>
	);

	return (
		<div
			className="group overflow-hidden bg-accent text-accent-ink"
			{...storyblokEditable(blok)}
		>
			<div
				className={twJoin(
					'flex w-max animate-[marquee_var(--marquee-duration)_linear_infinite]',
					'group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center',
					speed,
				)}
			>
				{group('a')}
				{group('b', true)}
			</div>
		</div>
	);
}
