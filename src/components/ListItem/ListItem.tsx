import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';

type ListItemIcon = 'check' | 'none';

interface ListItemBlok extends SbBlokData {
	text: string;
	icon: ListItemIcon;
}

interface ListItemProps {
	blok: ListItemBlok;
}

export default function ListItem({ blok }: ListItemProps) {
	return (
		<li
			className="flex items-start gap-2.5 text-[14.5px] text-ink-soft"
			{...storyblokEditable(blok)}
		>
			{blok.icon === 'check' && (
				<svg
					viewBox="0 0 24 24"
					aria-hidden="true"
					className="mt-1 h-4 w-4 flex-none fill-none stroke-accent [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.4]"
				>
					<path d="M4 12l5 5L20 6" />
				</svg>
			)}
			<span>{blok.text}</span>
		</li>
	);
}
