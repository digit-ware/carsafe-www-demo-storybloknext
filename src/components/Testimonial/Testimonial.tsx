import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { twJoin } from 'tailwind-merge';

interface TestimonialBlok extends SbBlokData {
	quote?: string;
	attribution?: string;
	role?: string;
}

interface TestimonialProps {
	blok: TestimonialBlok;
	/** CardGroup passes this; a card in a boxed cell drops its own fill. */
	frame?: 'plain' | 'divided' | 'boxed';
}

/** Reference `.testimonial` — a single quote card. */
export default function Testimonial({ blok, frame }: TestimonialProps) {
	const bare = frame === 'boxed' || frame === 'divided';

	return (
		<figure
			className={twJoin(
				'flex h-full flex-col',
				bare ? 'p-0' : 'rounded-xl bg-surface p-8 max-[600px]:p-6',
			)}
			{...storyblokEditable(blok)}
		>
			<div
				aria-hidden="true"
				className="font-display text-[34px] font-extrabold leading-[0.6] text-accent"
			>
				&ldquo;
			</div>

			{blok.quote && (
				<blockquote className="mt-5.5 max-w-[42ch] text-[16px] text-ink">
					{blok.quote}
				</blockquote>
			)}

			{(blok.attribution || blok.role) && (
				<figcaption className="mt-5">
					{blok.attribution && (
						<span className="text-[13.5px] font-bold text-ink">
							{blok.attribution}
						</span>
					)}
					{blok.role && (
						<span className="block text-[13px] font-medium text-ink-faint">
							{blok.role}
						</span>
					)}
				</figcaption>
			)}
		</figure>
	);
}
