import type { ReactElement } from 'react';
import {
	type SbBlokData,
	StoryblokServerComponent,
	StoryblokServerRichText,
	type StoryblokRichTextNode,
	storyblokEditable,
} from '@storyblok/react/rsc';

interface StoryblokAsset {
	filename: string | null;
	alt: string | null;
	title: string | null;
}

interface TeaserBlok extends SbBlokData {
	eyebrow?: StoryblokRichTextNode<ReactElement>;
	headline: string;
	subheadline?: string;
	buttons?: SbBlokData[];
	stats?: SbBlokData[];
	/** Hero photo — sits in the offset frame with the orange slab behind it. */
	image?: StoryblokAsset;
	/** Floating stat chip over the image. */
	badge_value?: string;
	badge_label?: string;
}

interface TeaserProps {
	blok: TeaserBlok;
}

/**
 * Reference `.hero`: cream band, copy left, an offset photo on the right with a
 * solid orange slab peeking out behind it (`.hero__slab` — pure CSS, no content)
 * and a floating stat badge over the corner.
 */
export default function Teaser({ blok }: TeaserProps) {
	const hasBadge = Boolean(blok.badge_value || blok.badge_label);

	return (
		<section className="bg-surface-2" {...storyblokEditable(blok)}>
			<div className="mx-auto grid max-w-page items-center gap-14 px-8 pt-20 pb-24 max-[900px]:gap-10 max-[900px]:pt-14 max-[900px]:pb-16 max-[760px]:px-5 min-[900px]:grid-cols-[1.02fr_0.98fr]">
				<div>
					{blok.eyebrow && (
						<div className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.14em] text-accent-text [&_p]:m-0">
							<StoryblokServerRichText doc={blok.eyebrow} />
						</div>
					)}

					<h1 className="max-w-[11ch] font-display text-[clamp(2.625rem,6.2vw,4.875rem)] font-extrabold leading-[0.96] tracking-[-0.035em]">
						{blok.headline}
					</h1>

					{blok.subheadline && (
						<p className="mt-6.5 max-w-[44ch] text-[16.5px] text-ink-soft">
							{blok.subheadline}
						</p>
					)}

					{blok.buttons && blok.buttons.length > 0 && (
						<div className="mt-9 flex flex-wrap items-center gap-x-6.5 gap-y-4">
							{blok.buttons.map((nestedBlok) => (
								<StoryblokServerComponent
									blok={nestedBlok}
									key={nestedBlok._uid}
								/>
							))}
						</div>
					)}

					{blok.stats && blok.stats.length > 0 && (
						<div className="mt-12 flex max-w-xl gap-8 border-t border-line pt-6 max-[560px]:flex-col max-[560px]:gap-4">
							{blok.stats.map((nestedBlok) => (
								<StoryblokServerComponent
									blok={nestedBlok}
									key={nestedBlok._uid}
								/>
							))}
						</div>
					)}
				</div>

				{/* .hero__visual */}
				<div className="relative pt-6.5 pr-8 pb-8 max-[900px]:pr-6 max-[900px]:pb-6">
					{/* .hero__slab — offset orange block behind the photo */}
					<div
						aria-hidden="true"
						className="absolute top-16 right-0 bottom-0 w-[54%] bg-accent"
					/>

					{/* .hero__media */}
					<div className="relative aspect-[1/1.04] overflow-hidden rounded-tl-[190px] rounded-br-[190px] bg-linear-to-br from-[#8C99AC] via-[#5B6577] to-[#2E3540] max-[900px]:aspect-4/3 max-[900px]:rounded-tl-[120px] max-[900px]:rounded-br-[120px]">
						{blok.image?.filename && (
							<img
								src={blok.image.filename}
								alt={blok.image.alt ?? ''}
								title={blok.image.title || undefined}
								decoding="async"
								className="h-full w-full object-cover"
							/>
						)}
					</div>

					{hasBadge && (
						<div className="absolute right-[6%] bottom-[9%] z-2 flex items-center gap-3.5 rounded-2xl bg-white px-5 py-3.5 shadow-[0_12px_34px_rgba(20,22,26,0.14)]">
							{blok.badge_value && (
								<b className="font-display text-[27px] font-extrabold tracking-[-0.03em] text-accent">
									{blok.badge_value}
								</b>
							)}
							{blok.badge_label && (
								/* Badge stays bg-white in both themes, so pin the label to the
								   light-theme ink value — `text-ink` remaps to near-white under
								   [data-theme="dark"] and would vanish against the white chip. */
								<span
									className="max-w-[13ch] text-[12.5px] font-semibold leading-[1.3]"
									style={{ color: '#1b1e22' }}
								>
									{blok.badge_label}
								</span>
							)}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
