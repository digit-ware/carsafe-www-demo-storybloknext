'use client';

import { useState } from 'react';
import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { twJoin } from 'tailwind-merge';
import Testimonial from '@/components/Testimonial';

type TestimonialsLayout = 'grid' | 'carousel';
type TestimonialsColumns = '2' | '3';

interface TestimonialBlok extends SbBlokData {
	quote?: string;
	attribution?: string;
	role?: string;
}

interface TestimonialsBlok extends SbBlokData {
	items?: TestimonialBlok[];
	/** aria-labels for the icon-only nav — localised per story language. */
	prev_label?: string;
	next_label?: string;
	layout: TestimonialsLayout;
	columns: TestimonialsColumns;
}

interface TestimonialsProps {
	blok: TestimonialsBlok;
}

/** Explicit lookups keep the class names greppable for static extraction. */
const COLUMNS_CLASSES: Record<TestimonialsColumns, string> = {
	'2': 'min-[800px]:grid-cols-2',
	'3': 'min-[800px]:grid-cols-3',
};

const NAV_BUTTON =
	'flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink-faint [&_svg]:h-[15px] [&_svg]:w-[15px]';

export default function Testimonials({ blok }: TestimonialsProps) {
	const items = (blok.items ?? []).filter((item) => item.quote);
	const [index, setIndex] = useState(0);

	if (items.length === 0) return null;

	const columns = COLUMNS_CLASSES[blok.columns] ?? COLUMNS_CLASSES['2'];

	if (blok.layout !== 'carousel') {
		return (
			<div
				className="mx-auto w-full max-w-page px-8 max-[760px]:px-5"
				{...storyblokEditable(blok)}
			>
				<div className={twJoin('grid grid-cols-1 gap-6.5', columns)}>
					{items.map((item) => (
						<Testimonial blok={item} key={item._uid} />
					))}
				</div>
			</div>
		);
	}

	const safeIndex = index % items.length;
	const current = items[safeIndex];
	const move = (delta: number) =>
		setIndex((i) => (i + delta + items.length) % items.length);

	return (
		<div
			className="mx-auto w-full max-w-page px-8 max-[760px]:px-5"
			{...storyblokEditable(blok)}
		>
			<div className="relative rounded-xl bg-surface p-11 max-[600px]:p-7.5">
				{items.length > 1 && (
					<div className="absolute top-11 right-11 flex gap-1.5 max-[600px]:hidden">
						{items.map((item, i) => (
							<span
								key={item._uid}
								className={twJoin(
									'h-1.5 w-1.5 rounded-full',
									i === safeIndex ? 'bg-accent' : 'bg-line',
								)}
							/>
						))}
					</div>
				)}

				<Testimonial blok={current} />

				{items.length > 1 && (
					<div className="mt-7 flex gap-2.5">
						<button
							type="button"
							onClick={() => move(-1)}
							aria-label={blok.prev_label || 'Precedente'}
							className={NAV_BUTTON}
						>
							<ChevronLeft aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={() => move(1)}
							aria-label={blok.next_label || 'Successiva'}
							className={NAV_BUTTON}
						>
							<ChevronRight aria-hidden="true" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
