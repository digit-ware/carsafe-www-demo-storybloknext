'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import { ChevronDown, Phone, Search, Shield } from 'lucide-react';
import { twJoin } from 'tailwind-merge';
import {
	DEMO_STORES,
	haversineKm,
	INSURANCE_COMPANIES,
	type LocatorStore,
	SEARCH_CENTER,
} from './stores';

/** A `store` blok added by an editor in the `stores` field. */
interface StoreBlok extends SbBlokData {
	name?: string;
	address?: string;
	phone?: string;
	latitude?: string | number;
	longitude?: string | number;
	companies?: string[];
}

interface LocatorBlok extends SbBlokData {
	eyebrow?: string;
	headline?: string;
	intro?: string;
	/** Body shops shown on the map. Falls back to the demo set when empty. */
	stores?: StoreBlok[];
	/** Localised UI strings — fall back to Italian to match the reference site. */
	search_placeholder?: string;
	radius_label?: string;
	company_label?: string;
	company_all_label?: string;
	search_label?: string;
	results_label?: string;
	phone_label?: string;
	load_more_label?: string;
	no_results?: string;
}

interface LocatorProps {
	blok: LocatorBlok;
}

type RankedStore = LocatorStore & { dist: number };

/**
 * `react-leaflet` touches `window` at module scope, so the map is a client-only
 * dynamic import — never server-rendered — with a plain skeleton in its place
 * until it mounts.
 */
const LocatorMap = dynamic(() => import('./LocatorMap'), {
	ssr: false,
	loading: () => (
		<div className="h-full w-full animate-pulse bg-surface-2" aria-hidden="true" />
	),
});

const RADII = [5, 10, 25, 50] as const;
const PAGE_SIZE = 6;

const FIELD =
	'flex h-[52px] items-center gap-2.5 rounded-[10px] border border-line bg-surface px-4';
const FIELD_CONTROL =
	'h-full w-full appearance-none border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint';
const FIELD_ICON = 'h-[17px] w-[17px] flex-none text-ink-faint';
const CARET = 'pointer-events-none h-3 w-3 flex-none text-ink-faint';

const norm = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '');

function toNumber(value: unknown): number {
	if (typeof value === 'number') return value;
	if (typeof value === 'string' && value.trim() !== '') return Number(value);
	return Number.NaN;
}

/** Normalises a `store` blok; returns null when it has no usable coordinates. */
function fromBlok(blok: StoreBlok, index: number): LocatorStore | null {
	const lat = toNumber(blok.latitude);
	const lng = toNumber(blok.longitude);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

	return {
		id: blok._uid || `store-${index}`,
		name: blok.name?.trim() || 'Carrozzeria',
		address: blok.address?.trim() || '',
		phone: blok.phone?.trim() || '',
		lat,
		lng,
		companies: Array.isArray(blok.companies) ? blok.companies.filter(Boolean) : [],
	};
}

export default function Locator({ blok }: LocatorProps) {
	const searchPlaceholder = blok.search_placeholder || 'Ricerca località';
	const radiusLabel = blok.radius_label || 'Raggio di ricerca';
	const companyLabel = blok.company_label || 'Compagnia assicurativa';
	const companyAllLabel =
		blok.company_all_label || 'Seleziona la tua compagnia assicurativa';
	const searchLabel = blok.search_label || 'Cerca';
	const phoneLabel = blok.phone_label || 'Telefono:';
	const loadMoreLabel = blok.load_more_label || 'Mostra altre carrozzerie';
	const noResults =
		blok.no_results || 'Nessuna carrozzeria trovata. Prova ad ampliare il raggio.';

	const [query, setQuery] = useState('');
	const [radius, setRadius] = useState<number>(10);
	const [company, setCompany] = useState('');
	const [activeId, setActiveId] = useState<string | null>(null);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	// Editor-managed stores when present, otherwise the bundled demo set.
	const source = useMemo<LocatorStore[]>(() => {
		const fromBloks = (blok.stores ?? [])
			.map((store, index) => fromBlok(store, index))
			.filter((store): store is LocatorStore => store !== null);
		return fromBloks.length > 0 ? fromBloks : DEMO_STORES;
	}, [blok.stores]);

	// Company filter options come from the data, so editor values show up too.
	const companies = useMemo(() => {
		const set = new Set(source.flatMap((store) => store.companies));
		return set.size > 0
			? Array.from(set).sort((a, b) => a.localeCompare(b))
			: INSURANCE_COMPANIES;
	}, [source]);

	const filtered = useMemo<RankedStore[]>(() => {
		const q = norm(query.trim());
		return source
			.map((store) => ({
				...store,
				dist: haversineKm(SEARCH_CENTER, [store.lat, store.lng]),
			}))
			.filter((store) => {
				if (store.dist > radius) return false;
				if (company && !store.companies.includes(company)) return false;
				if (q && !norm(`${store.name} ${store.address}`).includes(q)) return false;
				return true;
			})
			.sort((a, b) => a.dist - b.dist);
	}, [source, query, radius, company]);

	// Any change to the filters collapses the list back to the first page.
	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [query, radius, company]);

	const [countBefore, countAfter] = (
		blok.results_label || '{count} carrozzerie trovate'
	).split('{count}');

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		// Filtering is live; the button just mirrors the reference's explicit submit.
		event.preventDefault();
	}

	return (
		<section className="bg-surface-cream" {...storyblokEditable(blok)}>
			{(blok.eyebrow || blok.headline || blok.intro) && (
				<div className="mx-auto max-w-page px-8 pt-12 pb-10 max-[760px]:px-5">
					{blok.eyebrow && (
						<p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-accent-text">
							{blok.eyebrow}
						</p>
					)}
					{blok.headline && (
						<h2 className="mt-3.5 max-w-[24ch] font-display text-[clamp(1.75rem,3.6vw,2.5rem)] font-extrabold leading-none tracking-[-0.028em] text-ink">
							{blok.headline}
						</h2>
					)}
					{blok.intro && (
						<p className="mt-3.5 max-w-[52ch] text-[15.5px] text-ink-soft">
							{blok.intro}
						</p>
					)}
				</div>
			)}

			<div className="mx-auto max-w-page px-8 pb-22 max-[760px]:px-5">
				{/* Search panel — pulled up so it floats over the intro band. */}
				<form
					onSubmit={handleSubmit}
					className="relative z-[5] -mt-7 rounded-2xl bg-bg p-5.5 shadow-[0_16px_40px_rgba(20,22,26,0.08)]"
				>
					<div className="grid grid-cols-[1fr_132px] gap-3 max-[640px]:grid-cols-1">
						<label className={FIELD}>
							<Search aria-hidden="true" className={FIELD_ICON} />
							<input
								type="text"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder={searchPlaceholder}
								aria-label={searchPlaceholder}
								className={FIELD_CONTROL}
							/>
						</label>
						<label className={twJoin(FIELD, 'justify-between')}>
							<span className="sr-only">{radiusLabel}</span>
							<select
								value={radius}
								onChange={(event) => setRadius(Number(event.target.value))}
								aria-label={radiusLabel}
								className={FIELD_CONTROL}
							>
								{RADII.map((value) => (
									<option key={value} value={value}>
										{value} km
									</option>
								))}
							</select>
							<ChevronDown aria-hidden="true" className={CARET} />
						</label>
					</div>

					<div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
						<label className={twJoin(FIELD, 'justify-between')}>
							<Shield aria-hidden="true" className={FIELD_ICON} />
							<select
								value={company}
								onChange={(event) => setCompany(event.target.value)}
								aria-label={companyLabel}
								className={FIELD_CONTROL}
							>
								<option value="">{companyAllLabel}</option>
								{companies.map((name) => (
									<option key={name} value={name}>
										{name}
									</option>
								))}
							</select>
							<ChevronDown aria-hidden="true" className={CARET} />
						</label>
						<button
							type="submit"
							aria-label={searchLabel}
							className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[10px] bg-accent text-accent-ink transition-colors hover:bg-accent-strong"
						>
							<Search aria-hidden="true" className="h-[19px] w-[19px]" />
						</button>
					</div>
				</form>

				{/* Map */}
				<div className="mt-5.5 overflow-hidden rounded-2xl border border-line shadow-[0_10px_30px_rgba(20,22,26,0.06)]">
					<div className="h-[520px] max-[640px]:h-[380px]">
						<LocatorMap
							stores={filtered}
							center={SEARCH_CENTER}
							radiusKm={radius}
							activeId={activeId}
							onSelect={setActiveId}
						/>
					</div>
				</div>

				<p className="mt-6.5 text-[14px] text-ink-soft">
					{countBefore}
					<b className="font-bold text-ink">{filtered.length}</b>
					{countAfter}
				</p>

				{filtered.length === 0 ? (
					<p className="mt-4 rounded-xl border border-line bg-bg px-5 py-8 text-center text-[14.5px] text-ink-soft">
						{noResults}
					</p>
				) : (
					<div className="mt-4 grid grid-cols-2 gap-3.5 max-[820px]:grid-cols-1">
						{filtered.slice(0, visibleCount).map((store) => (
							<ShopCard
								key={store.id}
								store={store}
								active={store.id === activeId}
								phoneLabel={phoneLabel}
								onActivate={() => setActiveId(store.id)}
							/>
						))}
					</div>
				)}

				{visibleCount < filtered.length && (
					<div className="mt-7.5 flex justify-center">
						<button
							type="button"
							onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
							className="inline-flex items-center gap-2.5 rounded-full border border-line px-6 py-3.25 text-[14.5px] font-bold text-ink transition-colors hover:border-ink-faint"
						>
							{loadMoreLabel}
							<ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
						</button>
					</div>
				)}
			</div>
		</section>
	);
}

interface ShopCardProps {
	store: RankedStore;
	active: boolean;
	phoneLabel: string;
	onActivate: () => void;
}

function ShopCard({ store, active, phoneLabel, onActivate }: ShopCardProps) {
	return (
		<article
			onMouseEnter={onActivate}
			onFocus={onActivate}
			className={twJoin(
				'flex flex-col gap-2 rounded-xl border bg-bg px-5.5 py-5 transition-[border-color,box-shadow]',
				active
					? 'border-accent shadow-[0_0_0_3px_var(--color-accent-soft)]'
					: 'border-line hover:border-ink-faint hover:shadow-[0_8px_22px_rgba(20,22,26,0.06)]',
			)}
		>
			<div className="flex items-baseline justify-between gap-2.5">
				<h3 className="text-[15.5px] font-bold tracking-[-0.01em] text-ink">
					{store.name}
				</h3>
				<span className="flex-none whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-[3px] text-[11.5px] font-extrabold text-accent-text">
					≈ {store.dist.toFixed(1)} km
				</span>
			</div>
			{store.address && (
				<p className="text-[13.5px] text-ink-soft">{store.address}</p>
			)}
			{store.phone && (
				<p className="mt-0.5 flex items-center gap-2 text-[13.5px] text-ink-soft">
					<Phone
						aria-hidden="true"
						className="h-3.5 w-3.5 flex-none text-ink-faint"
					/>
					{phoneLabel}{' '}
					<a
						href={`tel:${store.phone}`}
						className="font-bold text-accent-text hover:text-accent-strong"
					>
						{store.phone}
					</a>
				</p>
			)}
		</article>
	);
}
