'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
	Circle,
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { mdiCarOutline } from '@mdi/js';
import 'leaflet/dist/leaflet.css';
import type { LocatorStore } from './stores';

interface LocatorMapProps {
	stores: LocatorStore[];
	/** Demo "you are here" point — centre of the radius circle. */
	center: [number, number];
	radiusKm: number;
	activeId: string | null;
	onSelect: (id: string) => void;
}

const ACCENT = '#E8873A';
const ACCENT_STRONG = '#D2761F';

/**
 * A classic map pin — teardrop body in the brand colour, white disc, and the
 * Material Design `car-outline` glyph knocked out of it. Built as an inline-SVG
 * `divIcon` so it sidesteps Leaflet's broken default-marker asset resolution.
 */
function shopIcon(active: boolean) {
	const bg = active ? ACCENT_STRONG : ACCENT;
	return L.divIcon({
		className: 'locator-pin',
		html: `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 4px rgba(20,22,26,.35))"><path d="M17 1C9.27 1 3 7.27 3 15c0 9.5 11.06 24.13 13.02 26.66a1.22 1.22 0 0 0 1.96 0C19.94 39.13 31 24.5 31 15 31 7.27 24.73 1 17 1Z" fill="${bg}"/><circle cx="17" cy="15" r="11" fill="#fff"/><path d="${mdiCarOutline}" transform="translate(7.3 5) scale(0.8)" fill="${bg}"/></svg>`,
		iconSize: [34, 44],
		iconAnchor: [17, 43],
		popupAnchor: [0, -40],
	});
}

const meIcon = L.divIcon({
	className: '',
	html: `<span style="display:block;width:20px;height:20px;border-radius:50%;background:#24272C;border:2px solid #fff;box-shadow:0 3px 10px rgba(20,22,26,.28)"></span>`,
	iconSize: [20, 20],
	iconAnchor: [10, 10],
});

/** Reframes the map to the search centre plus every visible pin. */
function FitBounds({
	stores,
	center,
}: {
	stores: LocatorStore[];
	center: [number, number];
}) {
	const map = useMap();

	useEffect(() => {
		if (stores.length === 0) {
			map.setView(center, 11);
			return;
		}
		const bounds = L.latLngBounds([
			center,
			...stores.map((s) => [s.lat, s.lng] as [number, number]),
		]);
		map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
	}, [map, stores, center]);

	return null;
}

/** Opens the popup for the store the list is hovering / has selected. */
function ActivePopup({
	activeId,
	markerRefs,
}: {
	activeId: string | null;
	markerRefs: { current: Record<string, L.Marker | null> };
}) {
	const map = useMap();

	useEffect(() => {
		if (!activeId) return;
		const marker = markerRefs.current[activeId];
		if (marker) {
			marker.openPopup();
			map.panTo(marker.getLatLng(), { animate: true });
		}
	}, [activeId, map, markerRefs]);

	return null;
}

export default function LocatorMap({
	stores,
	center,
	radiusKm,
	activeId,
	onSelect,
}: LocatorMapProps) {
	const icons = useMemo(
		() => ({ idle: shopIcon(false), active: shopIcon(true) }),
		[],
	);
	const markerRefs = useRef<Record<string, L.Marker | null>>({});

	return (
		<MapContainer
			center={center}
			zoom={11}
			scrollWheelZoom={false}
			className="h-full w-full"
			style={{ background: 'var(--color-surface-2)' }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<FitBounds stores={stores} center={center} />
			<ActivePopup activeId={activeId} markerRefs={markerRefs} />

			<Circle
				center={center}
				radius={radiusKm * 1000}
				pathOptions={{
					color: ACCENT,
					weight: 2,
					fillColor: ACCENT,
					fillOpacity: 0.08,
				}}
			/>
			<Marker position={center} icon={meIcon} />

			{stores.map((store) => (
				<Marker
					key={store.id}
					position={[store.lat, store.lng]}
					icon={store.id === activeId ? icons.active : icons.idle}
					ref={(marker) => {
						markerRefs.current[store.id] = marker;
					}}
					eventHandlers={{ click: () => onSelect(store.id) }}
				>
					<Popup>
						<b>{store.name}</b>
						<br />
						<span style={{ color: '#5C626A' }}>{store.address}</span>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
