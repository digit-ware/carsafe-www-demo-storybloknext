import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';
import HeaderNav from './HeaderNav';

interface StoryblokAsset {
	alt: string | null;
	filename: string | null;
	title: string | null;
}

interface HeaderBlok extends SbBlokData {
	brand_logo?: StoryblokAsset;
	brand_tagline?: string;
	main_navigation?: SbBlokData[];
	site_settings?: SbBlokData[];
	utility_note?: string;
	phone?: string;
	email?: string;
	cta?: SbBlokData[];
}

interface HeaderProps {
	blok: HeaderBlok;
}

function Brand({ logo, tagline }: { logo?: StoryblokAsset; tagline?: string }) {
	return (
		<a href="/" className="block flex-none leading-none">
			{logo?.filename ? (
				<img
					src={logo.filename}
					alt={logo.alt || 'CarSafe'}
					title={logo.title || undefined}
					className="h-8 w-auto"
				/>
			) : (
				<span className="font-display text-[23px] font-extrabold tracking-[-0.01em] text-ink">
					CAR<span className="text-accent">SAFE</span>
				</span>
			)}
			{tagline && (
				<span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.24em] text-ink-faint">
					{tagline}
				</span>
			)}
		</a>
	);
}

export default function Header({ blok }: HeaderProps) {
	const phoneHref = blok.phone
		? `tel:${blok.phone.replace(/\s/g, '')}`
		: undefined;

	return (
		<header {...storyblokEditable(blok)}>
			{/* .topbar — dark utility bar. `data-surface="dark"` on the row remaps the
			    brand tokens so the language / theme toggles read light-on-dark. */}
			<div className="bg-surface-dark text-[13.5px] text-white/60">
				<div
					data-surface="dark"
					className="mx-auto flex max-w-page items-center justify-end gap-5.5 px-8 max-[720px]:justify-between max-[720px]:px-5"
				>
					{blok.utility_note && (
						<span className="text-white/35 max-[720px]:hidden">
							{blok.utility_note}
						</span>
					)}
					{blok.phone && (
						<a
							href={phoneHref}
							className="font-bold text-white transition-colors hover:text-accent"
						>
							{blok.phone}
						</a>
					)}
					{blok.email && (
						<a
							href={`mailto:${blok.email}`}
							className="font-bold text-white transition-colors hover:text-accent max-[720px]:hidden"
						>
							{blok.email}
						</a>
					)}
					{blok.site_settings && blok.site_settings.length > 0 && (
						<div className="ml-1.5 flex items-center gap-1.5 py-1">
							{blok.site_settings.map((nestedBlok) => (
								<StoryblokServerComponent
									blok={nestedBlok}
									key={nestedBlok._uid}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* .site-header — sticky white nav bar */}
			<div className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
				<div className="relative mx-auto flex h-[72px] max-w-page items-center justify-between gap-7 px-8 max-[720px]:px-5">
					<Brand logo={blok.brand_logo} tagline={blok.brand_tagline} />

					<div className="ml-auto flex items-center gap-6.5">
						<HeaderNav
							menuLabel={blok.utility_note}
							cta={
								blok.cta && blok.cta.length > 0
									? blok.cta.map((nestedBlok) => (
											<StoryblokServerComponent
												blok={nestedBlok}
												key={nestedBlok._uid}
											/>
										))
									: undefined
							}
							links={
								blok.main_navigation?.map((nestedBlok) => (
									<StoryblokServerComponent
										blok={nestedBlok}
										key={nestedBlok._uid}
									/>
								)) ?? null
							}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
