import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { isExternalHref, resolveHref, type StoryblokLink } from '@/lib/links';

interface LinkBlok extends SbBlokData {
	Title: string;
	/** Changed from a plain text field to a Storyblok Link field. */
	Url: StoryblokLink;
}

interface LinkProps {
	blok: LinkBlok;
}

export default function Link({ blok }: LinkProps) {
	const href = resolveHref(blok.Url);
	const external = isExternalHref(href);

	return (
		<a
			href={href}
			target={blok.Url?.target || undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			{...storyblokEditable(blok)}
		>
			{blok.Title}
		</a>
	);
}
