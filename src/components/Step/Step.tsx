import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface StepBlok extends SbBlokData {
	title: string;
	text?: string;
}

interface StepProps {
	blok: StepBlok;
}

/**
 * One `.step`. The connector rail is this element's `::after` (full width,
 * pinned at the circle's mid-line, `not-last` so it stops before the final
 * step) — it's hidden once the row stacks. The number comes from the CSS
 * counter set up on the Steps container.
 */
export default function Step({ blok }: StepProps) {
	return (
		<div
			className="relative flex-1 pr-7 not-last:after:absolute not-last:after:right-0 not-last:after:top-[22px] not-last:after:h-px not-last:after:w-full not-last:after:bg-line not-last:after:content-[''] max-[880px]:pr-0 max-[880px]:after:hidden"
			{...storyblokEditable(blok)}
		>
			{/* .step-num — content is `counter(step)`, filled by the parent's counter-reset */}
			<div className="relative z-[1] mb-5 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink bg-surface font-display text-[17px] font-semibold [counter-increment:step] before:[content:counter(step)]" />

			<h4 className="mb-2 text-[17px] font-bold">{blok.title}</h4>

			{blok.text && (
				<p className="text-[14.5px] text-ink-soft">{blok.text}</p>
			)}
		</div>
	);
}
