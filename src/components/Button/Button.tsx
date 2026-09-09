import type { ReactNode } from 'react';
import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { twJoin } from 'tailwind-merge';
import { isExternalHref, resolveHref, type StoryblokLink } from '@/lib/links';

type ButtonVariant = 'primary' | 'ghost' | 'on_dark' | 'link';
type ButtonIcon = 'none' | 'arrow_up_right' | 'arrow_down';

interface ButtonBlok extends SbBlokData {
	label: string;
	link: StoryblokLink;
	variant: ButtonVariant;
	icon: ButtonIcon;
}

interface ButtonProps {
	blok: ButtonBlok;
}

const BASE =
	'inline-flex items-center gap-2.5 whitespace-nowrap text-[15px] font-bold transition-[background-color,border-color,color,transform] active:translate-y-px';

/**
 * Explicit lookups — the full class names have to stay in source for Tailwind.
 * `link` drops the pill entirely (reference `.cta--link`): an underlined label.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary:
		'rounded-full border border-accent bg-accent px-6.5 py-3.75 text-accent-ink hover:border-accent-strong hover:bg-accent-strong',
	ghost:
		'rounded-full border border-line bg-transparent px-5.5 py-3.25 text-ink hover:border-ink-faint',
	on_dark:
		'rounded-full border border-white/35 bg-transparent px-5.5 py-3.25 text-white hover:border-white',
	link: 'rounded-none border-b-[1.5px] border-current px-0 py-1 text-ink hover:text-accent-text',
};

const ICON_PATHS: Record<Exclude<ButtonIcon, 'none'>, string> = {
	arrow_up_right: 'M7 17L17 7M9 7h8v8',
	arrow_down: 'M12 5v14M6 13l6 6 6-6',
};

export default function Button({ blok }: ButtonProps) {
	const href = resolveHref(blok.link);
	const variant = VARIANT_CLASSES[blok.variant] ?? VARIANT_CLASSES.primary;
	const external = isExternalHref(href);
	const iconPath =
		blok.icon && blok.icon !== 'none' ? ICON_PATHS[blok.icon] : null;

	let icon: ReactNode = null;
	if (iconPath) {
		icon = (
			<svg
				viewBox="0 0 24 24"
				aria-hidden="true"
				className="h-3.5 w-3.5 flex-none fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.2]"
			>
				<path d={iconPath} />
			</svg>
		);
	}

	return (
		<a
			href={href}
			target={blok.link?.target || undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			className={twJoin(BASE, variant)}
			{...storyblokEditable(blok)}
		>
			{blok.label}
			{icon}
		</a>
	);
}
