import type { ElementType } from 'react';
import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { isExternalHref, resolveHref, type StoryblokLink } from '@/lib/links';

interface StoryblokAsset {
	filename: string | null;
	alt: string | null;
	title: string | null;
}

interface PartnerCardBlok extends SbBlokData {
	name: string;
	logo?: StoryblokAsset;
	link?: StoryblokLink;
}

interface PartnerCardProps {
	blok: PartnerCardBlok;
	frame?: 'plain' | 'divided' | 'boxed';
}

/** Reference `.partner-card` — one cell of the boxed partner grid. */
export default function PartnerCard({ blok }: PartnerCardProps) {
	const href = blok.link ? resolveHref(blok.link) : undefined;
	const external = href ? isExternalHref(href) : false;
	const Tag: ElementType = href ? 'a' : 'div';

	return (
		<Tag
			href={href}
			target={blok.link?.target || undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			className="group flex h-full min-h-28 items-center justify-center p-6 text-center text-[14.5px] font-semibold text-ink-soft transition-colors hover:text-ink"
			{...storyblokEditable(blok)}
		>
			{blok.logo?.filename ? (
				<img
					src={blok.logo.filename}
					alt={blok.logo.alt || blok.name}
					title={blok.logo.title || undefined}
					loading="lazy"
					decoding="async"
					className="max-h-10 w-auto max-w-55 opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
				/>
			) : (
				blok.name
			)}
		</Tag>
	);
}
