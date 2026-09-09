import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';
import { twJoin } from 'tailwind-merge';

interface FooterColumnBlok extends SbBlokData {
	heading?: string;
	/** `link` bloks — tel:, mailto: or story links. */
	links?: SbBlokData[];
	/** Plain lines (addresses, VAT number). One <p> per newline. */
	notes?: string;
}

interface FooterColumnProps {
	blok: FooterColumnBlok;
}

export default function FooterColumn({ blok }: FooterColumnProps) {
	const notes =
		blok.notes
			?.split('\n')
			.map((line) => line.trim())
			.filter(Boolean) ?? [];
	const hasLinks = (blok.links?.length ?? 0) > 0;

	return (
		<div {...storyblokEditable(blok)}>
			{blok.heading && (
				// .footer__col h5
				<h5 className="mb-4.5 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-white">
					{blok.heading}
				</h5>
			)}

			{hasLinks && (
				// .footer__col a — the child <link> bloks render a bare <a>, styled here.
				<div className="[&_a]:mb-2.75 [&_a]:block [&_a]:text-[14px] [&_a]:text-white/60 [&_a:hover]:text-accent">
					{blok.links?.map((nestedBlok) => (
						<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
					))}
				</div>
			)}

			{notes.length > 0 && (
				<div className={twJoin(hasLinks && 'mt-4')}>
					{notes.map((line, index) => (
						<p key={index} className="mb-2.75 text-[14px] text-white/60">
							{line}
						</p>
					))}
				</div>
			)}
		</div>
	);
}
