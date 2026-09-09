import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface CallCtaBlok extends SbBlokData {
	label?: string;
	phone_number: string;
	show_icon?: boolean;
}

interface CallCtaProps {
	blok: CallCtaBlok;
}

/**
 * Reference `.call-cta` — the oversized phone number that sits in the right
 * column of the dark contact section.
 */
export default function CallCta({ blok }: CallCtaProps) {
	const phoneHref = `tel:${blok.phone_number.replace(/\s/g, '')}`;

	return (
		<div
			className="text-left min-[900px]:text-right"
			{...storyblokEditable(blok)}
		>
			<a
				href={phoneHref}
				className="inline-flex items-center gap-3 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold tracking-[-0.02em] text-accent"
			>
				{blok.show_icon && (
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						className="h-6 w-6 flex-none fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2]"
					>
						<path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.3a1 1 0 011 1 11 11 0 00.56 3.5 1 1 0 01-.25 1z" />
					</svg>
				)}
				{blok.phone_number}
			</a>

			{blok.label && (
				<p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">
					{blok.label}
				</p>
			)}
		</div>
	);
}
