import type { ElementType } from 'react';
import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { isExternalHref, resolveHref, type StoryblokLink } from '@/lib/links';

interface StoryblokAsset {
	filename: string | null;
	alt: string | null;
	title: string | null;
}

interface NewsCardBlok extends SbBlokData {
	image?: StoryblokAsset;
	date?: string;
	title: string;
	link?: StoryblokLink;
	link_label?: string;
}

interface NewsCardProps {
	blok: NewsCardBlok;
	frame?: 'plain' | 'divided' | 'boxed';
}

const ARROW = 'M7 17L17 7M9 7h8v8';

/** Reference `.news-card` — an article teaser, the whole cell is the link. */
export default function NewsCard({ blok }: NewsCardProps) {
	const href = blok.link ? resolveHref(blok.link) : undefined;
	const external = href ? isExternalHref(href) : false;
	const Tag: ElementType = href ? 'a' : 'div';

	return (
		<Tag
			href={href}
			target={blok.link?.target || undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			className="group block h-full"
			{...storyblokEditable(blok)}
		>
			<div className="aspect-[16/11] overflow-hidden rounded-lg bg-linear-to-br from-[#9AA6B4] to-[#4E5865]">
				{blok.image?.filename && (
					<img
						src={blok.image.filename}
						alt={blok.image.alt ?? ''}
						title={blok.image.title || undefined}
						loading="lazy"
						decoding="async"
						className="h-full w-full object-cover"
					/>
				)}
			</div>

			{blok.date && (
				<p className="mt-4.5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-accent-text">
					{blok.date}
				</p>
			)}

			<h3 className="mt-2.5 font-display text-[19px] font-bold leading-[1.25] tracking-[-0.02em] text-ink transition-colors group-hover:text-accent-text">
				{blok.title}
			</h3>

			{blok.link_label && (
				<span className="mt-5 inline-flex items-center gap-2.5 text-[14px] font-bold text-ink">
					{blok.link_label}
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						className="h-[13px] w-[13px] fill-none stroke-accent [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.2]"
					>
						<path d={ARROW} />
					</svg>
				</span>
			)}
		</Tag>
	);
}
