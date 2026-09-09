import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';

interface StepsBlok extends SbBlokData {
	items?: SbBlokData[];
}

interface StepsProps {
	blok: StepsBlok;
}

/**
 * The reference's `.steps` — a flush row of equal columns joined by a hairline
 * rail (drawn per-step, see Step). Stacks with a gap and drops the rail under
 * 880px. Steps auto-number through a CSS counter reset here, so reordering or
 * adding a step in the editor never needs renumbering.
 */
export default function Steps({ blok }: StepsProps) {
	return (
		<div
			className="mx-auto max-w-page px-7 max-[720px]:px-4.5"
			{...storyblokEditable(blok)}
		>
			<div className="flex [counter-reset:step] max-[880px]:flex-col max-[880px]:gap-7">
				{blok.items?.map((nestedBlok) => (
					<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			</div>
		</div>
	);
}
