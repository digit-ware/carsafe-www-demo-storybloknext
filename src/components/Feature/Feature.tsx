import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface FeatureBlok extends SbBlokData {
	name: string;
}

interface FeatureProps {
	blok: FeatureBlok;
}

export default function Feature({ blok }: FeatureProps) {
	return (
		<div className="feature" {...storyblokEditable(blok)}>
			<span>{blok.name}</span>
		</div>
	);
}
