'use client';

import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { useEffect, useRef, useState } from 'react';

interface StatBlok extends SbBlokData {
	/** Text, not Number — has to hold "600", "600+", "20" and "2020". */
	value: string;
	label: string;
	animate: boolean;
}

interface StatProps {
	blok: StatBlok;
	/** Supplied by CardGroup; Stat renders the same either way. */
	frame?: 'plain' | 'divided' | 'boxed';
}

/** Split "600+" into { prefix: "", number: 600, suffix: "+" }. */
function parseValue(value: string) {
	const match = String(value ?? '').match(/^(\D*)(\d[\d.,]*)(.*)$/);
	if (!match) return null;

	const [, prefix, digits, suffix] = match;
	const number = Number(digits.replace(/[.,]/g, ''));
	if (!Number.isFinite(number)) return null;

	return { prefix, number, suffix };
}

const DURATION = 1100;

function useCountUp(target: number, enabled: boolean) {
	const [value, setValue] = useState(enabled ? 0 : target);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!enabled) {
			setValue(target);
			return;
		}

		const node = ref.current;
		if (!node) return;

		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;
		if (prefersReducedMotion) {
			setValue(target);
			return;
		}

		let frame = 0;
		let start = 0;

		const tick = (now: number) => {
			if (!start) start = now;
			const progress = Math.min((now - start) / DURATION, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setValue(Math.round(target * eased));
			if (progress < 1) frame = requestAnimationFrame(tick);
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				frame = requestAnimationFrame(tick);
			},
			{ threshold: 0.6 },
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [target, enabled]);

	return { value, ref };
}

export default function Stat({ blok }: StatProps) {
	const parsed = parseValue(blok.value);
	const shouldAnimate = Boolean(blok.animate) && parsed !== null;
	const { value: count, ref } = useCountUp(parsed?.number ?? 0, shouldAnimate);

	const display = parsed
		? `${parsed.prefix}${shouldAnimate ? count : parsed.number}${parsed.suffix}`
		: blok.value;

	return (
		<div ref={ref} className="flex-1" {...storyblokEditable(blok)}>
			<div className="font-display text-[clamp(2.125rem,3.6vw,2.625rem)] font-extrabold leading-none tracking-[-0.035em] text-ink">
				{display}
			</div>
			<div className="mt-2.5 text-[11.5px] font-semibold uppercase tracking-[0.09em] text-ink-soft">
				{blok.label}
			</div>
		</div>
	);
}
