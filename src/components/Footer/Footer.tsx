import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';

interface StoryblokAsset {
	alt: string;
	filename: string;
	title: string;
}

interface FooterBlok extends SbBlokData {
	brand_logo?: StoryblokAsset;
	tagline?: string;
	columns?: SbBlokData[];
	/** Rendered as `© {year} {copyright}` — no year in the field. */
	copyright?: string;
	legal_line?: string;
	/** Optional anchor target so header nav can link here (reference: #contatti). */
	anchor_id?: string;
}

interface FooterProps {
	blok: FooterBlok;
}

export default function Footer({ blok }: FooterProps) {
	const year = new Date().getFullYear();

	return (
		<footer
			id={blok.anchor_id || undefined}
			data-surface="dark"
			// Reference `.site-footer` — always the dark panel, in both themes.
			className="bg-surface-dark pt-13 pb-6 text-white"
			{...storyblokEditable(blok)}
		>
			<div className="mx-auto max-w-page border-t border-white/15 px-8 pt-13 max-[720px]:px-5">
				{/* .footer__grid — brand cell (wider) + the columns grid */}
				<div className="grid grid-cols-[1.5fr_3fr] gap-10 max-[860px]:grid-cols-1">
					<div>
						{blok.brand_logo?.filename ? (
							<a href="/" className="flex flex-none items-center">
								<img
									src={blok.brand_logo.filename}
									alt={blok.brand_logo.alt || 'CarSafe'}
									title={blok.brand_logo.title || undefined}
									className="h-8 w-auto"
								/>
							</a>
						) : (
							<a
								href="/"
								className="font-display text-[23px] font-extrabold tracking-[-0.01em] text-white"
							>
								CAR<span className="text-accent">SAFE</span>
							</a>
						)}

						{blok.tagline && (
							<p className="mt-4 max-w-[28ch] text-[14.5px] text-white/60 lg:text-start">
								{blok.tagline}
							</p>
						)}
					</div>

					<div className="grid grid-cols-3 gap-10 max-[860px]:grid-cols-2 max-[520px]:grid-cols-1">
						{blok.columns?.map((nestedBlok) => (
							<StoryblokServerComponent
								blok={nestedBlok}
								key={nestedBlok._uid}
							/>
						))}
					</div>
				</div>

				{/* .footer__bottom */}
				<div className="mt-13 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-5.5 text-[12.5px] text-white/35 [&_a:hover]:text-white">
					<span>
						© {year}
						{blok.copyright ? ` ${blok.copyright}` : ''}
					</span>
					{blok.legal_line && <span>{blok.legal_line}</span>}
				</div>
			</div>
		</footer>
	);
}
