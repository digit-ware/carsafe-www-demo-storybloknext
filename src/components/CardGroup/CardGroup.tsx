import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { twJoin } from 'tailwind-merge';
import FeatureCard from '@/components/FeatureCard';
import NewsCard from '@/components/NewsCard';
import PartnerCard from '@/components/PartnerCard';
import Stat from '@/components/Stat';
import Testimonial from '@/components/Testimonial';

type CardGroupColumns = '2' | '3' | '4';
type CardGroupFrame = 'plain' | 'divided' | 'boxed';

interface CardGroupBlok extends SbBlokData {
	items: SbBlokData[];
	columns: CardGroupColumns;
	frame: CardGroupFrame;
}

interface CardGroupProps {
	blok: CardGroupBlok;
}

/**
 * CardGroup switches on `item.component` — the `items` whitelist mixes
 * feature cards, stats, news cards, partner cards and testimonials, and each
 * needs its own renderer plus (for some) frame-aware padding. Anything not in
 * the map is skipped rather than crashing the page.
 */
const ITEM_RENDERERS = {
	feature_card: FeatureCard,
	stat: Stat,
	news_card: NewsCard,
	partner_card: PartnerCard,
	testimonial: Testimonial,
} as const;

type KnownComponent = keyof typeof ITEM_RENDERERS;

/** Explicit lookups — the full class names stay greppable for static extraction. */
const COLUMNS_CLASSES: Record<CardGroupColumns, string> = {
	'2': 'grid-cols-1 min-[640px]:grid-cols-2',
	'3': 'grid-cols-1 min-[640px]:grid-cols-2 min-[900px]:grid-cols-3',
	'4': 'grid-cols-1 min-[640px]:grid-cols-2 min-[900px]:grid-cols-4',
};

/**
 *   plain   → gutters, no rules
 *   divided → hairline on top, vertical rules between columns (reference
 *             `.card-group--divided`)
 *   boxed   → single frame around the whole group, hairline grid inside
 *             (reference `.card-group--boxed`)
 */
const FRAME_GRID_CLASSES: Record<CardGroupFrame, string> = {
	plain: 'gap-8',
	divided: 'border-t border-line',
	boxed: 'overflow-hidden rounded-xl border border-line',
};

const FRAME_CELL_CLASSES: Record<CardGroupFrame, string> = {
	plain: '',
	divided: 'border-line pt-9 pr-8 pb-9',
	boxed: 'border-b border-r border-line bg-surface',
};

/** divided: the first cell of each row has no left rule / left padding. */
const DIVIDED_ROW_START: Record<CardGroupColumns, string> = {
	'2': 'max-[640px]:[&>*]:border-l-0 max-[640px]:[&>*]:pl-0 min-[640px]:[&>*:nth-child(2n+1)]:border-l-0 min-[640px]:[&>*:nth-child(2n+1)]:pl-0',
	'3': 'max-[900px]:[&>*]:border-l-0 max-[900px]:[&>*]:pl-0 min-[900px]:[&>*:nth-child(3n+1)]:border-l-0 min-[900px]:[&>*:nth-child(3n+1)]:pl-0',
	'4': 'max-[900px]:[&>*]:border-l-0 max-[900px]:[&>*]:pl-0 min-[900px]:[&>*:nth-child(4n+1)]:border-l-0 min-[900px]:[&>*:nth-child(4n+1)]:pl-0',
};

/** boxed: drop the right rule on the last column so it doesn't double the frame. */
const BOXED_LAST_COL: Record<CardGroupColumns, string> = {
	'2': 'min-[640px]:[&>*:nth-child(2n)]:border-r-0',
	'3': 'min-[900px]:[&>*:nth-child(3n)]:border-r-0',
	'4': 'min-[900px]:[&>*:nth-child(4n)]:border-r-0',
};

export default function CardGroup({ blok }: CardGroupProps) {
	const columns = COLUMNS_CLASSES[blok.columns] ?? COLUMNS_CLASSES['3'];
	const frame = blok.frame ?? 'plain';
	const grid = FRAME_GRID_CLASSES[frame] ?? FRAME_GRID_CLASSES.plain;
	const cell = FRAME_CELL_CLASSES[frame] ?? FRAME_CELL_CLASSES.plain;

	const dividedRules =
		frame === 'divided'
			? twJoin(
					'[&>*]:border-l [&>*]:pl-8',
					DIVIDED_ROW_START[blok.columns] ?? DIVIDED_ROW_START['3'],
				)
			: '';
	const boxedRules =
		frame === 'boxed'
			? (BOXED_LAST_COL[blok.columns] ?? BOXED_LAST_COL['3'])
			: '';

	return (
		<div
			data-part="card-group"
			className="mx-auto w-full max-w-page px-8 max-[760px]:px-5"
			{...storyblokEditable(blok)}
		>
			<div className={twJoin('grid', columns, grid, dividedRules, boxedRules)}>
				{blok.items.map((item) => {
					const Renderer = ITEM_RENDERERS[item.component as KnownComponent];
					if (!Renderer) return null;

					return (
						<div key={item._uid} className={cell || undefined}>
							{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
							<Renderer blok={item as any} frame={frame} />
						</div>
					);
				})}
			</div>
		</div>
	);
}
