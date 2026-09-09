import Page from '@/components/Page';
import Feature from '@/components/Feature';
import Grid from '@/components/Grid';
import Teaser from '@/components/Teaser';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FooterColumn from '@/components/FooterColumn';
import Link from '@/components/Link';
import CallCta from '@/components/CallCta';
import JoinCta from '@/components/JoinCta';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import Button from '@/components/Button';
import Stat from '@/components/Stat';
import Image from '@/components/Image';
import Section from '@/components/Section';
import SectionHead from '@/components/SectionHead';
import ListItem from '@/components/ListItem';
import FeatureCard from '@/components/FeatureCard';
import CardGroup from '@/components/CardGroup';
import Steps from '@/components/Steps';
import Step from '@/components/Step';
import Testimonials from '@/components/Testimonials';
import Testimonial from '@/components/Testimonial';
import Marquee from '@/components/Marquee';
import NewsCard from '@/components/NewsCard';
import PartnerCard from '@/components/PartnerCard';
import Locator from '@/components/Locator';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

export const getStoryblokApi = storyblokInit({
	accessToken: process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN,
	use: [apiPlugin],
	components: {
		page: Page,
		feature: Feature,
		grid: Grid,
		teaser: Teaser,
		header: Header,
		footer: Footer,
		footer_column: FooterColumn,
		link: Link,
		call_cta: CallCta,
		join_cta: JoinCta,
		language_toggle: LanguageToggle,
		theme_toggle: ThemeToggle,
		cta: Button,
		button: Button,
		stat: Stat,
		image: Image,
		section: Section,
		section_head: SectionHead,
		list_item: ListItem,
		feature_card: FeatureCard,
		card_group: CardGroup,
		steps: Steps,
		step: Step,
		testimonials: Testimonials,
		testimonial: Testimonial,
		marquee: Marquee,
		news_card: NewsCard,
		partner_card: PartnerCard,
		locator: Locator,
		// Data-only bloks — read as fields by their parent, never rendered directly.
		config: () => null,
		theme_palette: () => null,
		form_field: () => null,
		store: () => null,
	},
	apiOptions: {
		/** Set the correct region for your space. Learn more: https://www.storyblok.com/docs/packages/storyblok-js#example-region-parameter */
		region: process.env.NEXT_PUBLIC_STORYBLOK_REGION || 'eu',
	},
});
