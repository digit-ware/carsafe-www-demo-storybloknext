import {
	type SbBlokData,
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';

interface PageBlok extends SbBlokData {
	body?: SbBlokData[];
}

interface PageProps {
	blok: PageBlok;
}

export default function Page({ blok }: PageProps) {
	return (
		<main {...storyblokEditable(blok)}>
			{blok.body?.map((nestedBlok) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</main>
	);
}
