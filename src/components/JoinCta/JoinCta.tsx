import { type SbBlokData, storyblokEditable } from '@storyblok/react/rsc';
import JoinCtaForm, { type JoinCtaField } from './JoinCtaForm';

interface FormFieldBlok extends SbBlokData {
	name?: string;
	placeholder?: string;
	type?: JoinCtaField['type'];
	required?: boolean;
}

interface JoinCtaBlok extends SbBlokData {
	headline?: string;
	body?: string;
	fields?: FormFieldBlok[];
	submit_label?: string;
	success_message?: string;
	/** Anchor target for header nav (reference: #richiedi). */
	anchor_id?: string;
}

interface JoinCtaProps {
	blok: JoinCtaBlok;
}

/** `form_field` bloks are data-only — flattened to plain props for the client form. */
function toField(blok: FormFieldBlok, index: number): JoinCtaField {
	return {
		name: blok.name?.trim() || `field-${index + 1}`,
		placeholder: blok.placeholder ?? '',
		type: blok.type ?? 'text',
		required: blok.required ?? true,
	};
}

export default function JoinCta({ blok }: JoinCtaProps) {
	const fields = (blok.fields ?? []).map(toField);

	return (
		<section id={blok.anchor_id || 'richiedi'} {...storyblokEditable(blok)}>
			<div className="mx-auto max-w-page px-7 py-24 max-[720px]:px-4.5 max-[720px]:py-16">
				{/* .join — dark card, copy + form side by side */}
				<div className="grid grid-cols-[1.1fr_0.9fr] gap-12 rounded-[10px] bg-ink p-14 text-bg max-[880px]:grid-cols-1 max-[880px]:px-6.5 max-[880px]:py-9">
					<div>
						{blok.headline && (
							// base layer pins h2 to text-ink — override for the dark card
							<h2 className="max-w-[16ch] font-display text-[clamp(1.625rem,3vw,2.25rem)] font-semibold text-bg">
								{blok.headline}
							</h2>
						)}

						{blok.body && (
							// .join p.jn
							<p className="mt-4 max-w-[44ch] text-[15.5px] text-bg/70">
								{blok.body}
							</p>
						)}
					</div>

					{fields.length > 0 && (
						<JoinCtaForm
							fields={fields}
							submitLabel={blok.submit_label || 'Invia'}
							successMessage={
								blok.success_message || 'Grazie! Ti contatteremo a breve.'
							}
						/>
					)}
				</div>
			</div>
		</section>
	);
}
