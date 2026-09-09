/**
 * Fallback demo dataset for the `locator` blok — 18 Torino-area carrozzerie
 * ported from the store-locator redesign mockup.
 *
 * When an editor adds `store` bloks in Storyblok the component uses those
 * instead; this list is only what renders when the `stores` field is empty, so
 * the block is never blank in the Visual Editor.
 */

export interface LocatorStore {
	id: string;
	name: string;
	/** One-line address as shown on the card. */
	address: string;
	phone: string;
	lat: number;
	lng: number;
	/** Insurance networks this body shop is affiliated with — drives the company filter. */
	companies: string[];
}

/** The demo "you are here" point (Torino centre) distances are measured from. */
export const SEARCH_CENTER: [number, number] = [45.075, 7.65];

export const INSURANCE_COMPANIES = [
	'Intesa San Paolo Assicura',
	'Toyota Motor Italia',
	'DIRA S.p.A.',
];

/** Great-circle distance in km between two [lat, lng] points. */
export function haversineKm(a: [number, number], b: [number, number]): number {
	const R = 6371;
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(b[0] - a[0]);
	const dLng = toRad(b[1] - a[1]);
	const lat1 = toRad(a[0]);
	const lat2 = toRad(b[0]);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
	return 2 * R * Math.asin(Math.sqrt(h));
}

export const DEMO_STORES: LocatorStore[] = [
	{
		id: 'monginevro-torino',
		name: 'Monginevro Srl (Torino)',
		address: 'Via Luigi Cibrario 1 - 10143 Torino',
		phone: '0117727241',
		lat: 45.0836,
		lng: 7.6524,
		companies: ['Intesa San Paolo Assicura'],
	},
	{
		id: 'ellezeta',
		name: 'Ellezeta Carrozzeria Snc',
		address: 'Via Caraglio 134/b - 10141 Torino',
		phone: '0118939744',
		lat: 45.0791,
		lng: 7.6289,
		companies: ['Toyota Motor Italia'],
	},
	{
		id: 'bucci',
		name: 'Carrozzeria Bucci Sas',
		address: 'Via Tirreno 235 - 10136 Torino',
		phone: '0113247568',
		lat: 45.0525,
		lng: 7.6191,
		companies: ['DIRA S.p.A.'],
	},
	{
		id: 'infinity',
		name: 'Carrozzeria Infinity Srls',
		address: 'Via Colleasca 8 - 10143 Torino',
		phone: '0119464199',
		lat: 45.0902,
		lng: 7.6437,
		companies: ['Intesa San Paolo Assicura', 'Toyota Motor Italia'],
	},
	{
		id: 'autosicura-15',
		name: 'Autosicura Srl 15',
		address: 'Via Mongrando 48 - 10153 Torino',
		phone: '011888768',
		lat: 45.0958,
		lng: 7.6798,
		companies: ['Intesa San Paolo Assicura'],
	},
	{
		id: 'leocata',
		name: 'Carrozzeria Leocata Srl',
		address: 'Via Carlo Capelli 1 - 10146 Torino',
		phone: '3387903844',
		lat: 45.0736,
		lng: 7.6155,
		companies: ['DIRA S.p.A.'],
	},
	{
		id: 'autosicura-16',
		name: 'Autosicura Srl 16',
		address: 'Via Caramagna 7 - 10127 Torino',
		phone: '0119888230',
		lat: 45.0621,
		lng: 7.6572,
		companies: ['Intesa San Paolo Assicura'],
	},
	{
		id: 'tagliente',
		name: 'Carrozzeria Tagliente Srl',
		address: 'Via Monginevro 274 - 10142 Torino',
		phone: '0117701177',
		lat: 45.0685,
		lng: 7.6083,
		companies: ['Toyota Motor Italia', 'DIRA S.p.A.'],
	},
	{
		id: 'avanta',
		name: 'Avanta Group Srl',
		address: 'Via Giuseppe Tartini 56 - 10154 Torino',
		phone: '0112426015',
		lat: 45.1012,
		lng: 7.6604,
		companies: ['Intesa San Paolo Assicura'],
	},
	{
		id: 'primavera',
		name: 'Primavera Srl',
		address: 'Via Alessandro Roccati 17 - 10151 Torino',
		phone: '0119712138',
		lat: 45.1044,
		lng: 7.6321,
		companies: ['Toyota Motor Italia'],
	},
	{
		id: 'monginevro-collegno',
		name: 'Monginevro Srl',
		address: 'Corso Francia 113 - 10093 Collegno',
		phone: '0117727241',
		lat: 45.0785,
		lng: 7.5798,
		companies: ['Intesa San Paolo Assicura'],
	},
	{
		id: 'mescia',
		name: 'Carrozzeria Mescia Sas',
		address: 'Via Domodossola 7/1 - 10099 San Mauro Torinese',
		phone: '3452547482',
		lat: 45.1096,
		lng: 7.7376,
		companies: ['DIRA S.p.A.'],
	},
	{
		id: 'saicar',
		name: 'Saicar Garage Srl',
		address: 'Strada del Francese 4 - 10156 Torino',
		phone: '3312473890',
		lat: 45.1187,
		lng: 7.6949,
		companies: ['Toyota Motor Italia'],
	},
	{
		id: 'sam-car',
		name: 'Sam Car Service Srl',
		address: 'Via Lando Conti 5 - 10042 Nichelino',
		phone: '0116055375',
		lat: 45.0058,
		lng: 7.6472,
		companies: ['Intesa San Paolo Assicura', 'DIRA S.p.A.'],
	},
	{
		id: 'dacri-car',
		name: 'Autocarrozzeria Dacri.Car',
		address: 'Via Buffa 19 - 10042 Nichelino',
		phone: '0116467745',
		lat: 45.0122,
		lng: 7.6538,
		companies: ['Toyota Motor Italia'],
	},
	{
		id: 'new-rojex',
		name: 'New Rojex Car S.R.L.',
		address: 'Via Regio Parco 91 - 10036 Settimo Torinese',
		phone: '3492696060',
		lat: 45.1341,
		lng: 7.7098,
		companies: ['Intesa San Paolo Assicura'],
	},
	{
		id: 'la-mia-carrozzeria',
		name: 'La Mia Carrozzeria Srls',
		address: 'Via Biella 48 - 10098 Rivoli',
		phone: '3470393280',
		lat: 45.0703,
		lng: 7.5194,
		companies: ['DIRA S.p.A.'],
	},
	{
		id: 'templa-car',
		name: 'Templa Car Srl',
		address: 'Via Rio San Gallo 14/A - 10036 Settimo Torinese',
		phone: '3246851540',
		lat: 45.1398,
		lng: 7.7215,
		companies: ['Intesa San Paolo Assicura', 'Toyota Motor Italia'],
	},
];
