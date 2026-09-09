import { StoryblokStory, type ISbStoriesParams } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';
import { splitLanguageFromSegments, toStoryblokLanguage } from '@/lib/i18n';

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params;
	const { language, slugSegments } = splitLanguageFromSegments(slug ?? []);

	const fullSlug = slugSegments.length > 0 ? slugSegments.join('/') : 'home';
	const sbParams: ISbStoriesParams = {
		version: 'draft',
		language: toStoryblokLanguage(language),
	};

	const storyblokApi = getStoryblokApi();
	const { data } = await storyblokApi.get(`cdn/stories/${fullSlug}`, sbParams);

	return <StoryblokStory story={data.story} />;
}
