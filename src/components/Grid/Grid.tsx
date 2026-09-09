import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';

interface GridBlok extends SbBlokData {
	columns: SbBlokData[];
}

interface GridProps {
	blok: GridBlok;
}

export default function Grid({ blok }: GridProps) {
	return (
		<div
			{...storyblokEditable(blok)}
			className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(240px,1fr))] items-center gap-6 px-7 py-24 max-[720px]:px-4.5 max-[720px]:py-16"
		>
			{blok.columns.map((nestedBlok) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</div>
	);
}
