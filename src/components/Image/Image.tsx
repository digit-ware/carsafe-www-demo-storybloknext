import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

interface StoryblokAsset {
	filename: string | null;
	alt: string | null;
	title: string | null;
	name: string | null;
}

interface ImageBlok extends SbBlokData {
	upload_image: StoryblokAsset;
}

interface ImageProps {
	blok: ImageBlok;
}

export default function Image({ blok }: ImageProps) {
	const asset = blok.upload_image;

	if (!asset?.filename) {
		return null;
	}

	return (
		<img
			src={asset.filename}
			alt={asset.alt ?? ''}
			title={asset.title || undefined}
			loading="lazy"
			decoding="async"
			className="h-auto w-full"
			{...storyblokEditable(blok)}
		/>
	);
}
