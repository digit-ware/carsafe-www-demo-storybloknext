'use client';

import { type FormEvent, useState } from 'react';

export interface JoinCtaField {
	name: string;
	placeholder: string;
	type: 'text' | 'tel' | 'email';
	required: boolean;
}

interface JoinCtaFormProps {
	fields: JoinCtaField[];
	submitLabel: string;
	successMessage: string;
}

export default function JoinCtaForm({
	fields,
	submitLabel,
	successMessage,
}: JoinCtaFormProps) {
	const [submitted, setSubmitted] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		// No backend wired up — mirror the reference's confirm-and-reset demo.
		event.currentTarget.reset();
		setSubmitted(true);
	}

	return (
		// .join-form — inputs get the global accent focus ring from globals.css.
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			{fields.map((field) => (
				<input
					key={field.name}
					name={field.name}
					type={field.type}
					placeholder={field.placeholder}
					required={field.required}
					aria-label={field.placeholder || field.name}
					className="w-full rounded-[5px] border border-white/20 bg-white/5 px-3.5 py-3.25 text-[14.5px] text-bg placeholder:text-bg/50"
				/>
			))}

			<button
				type="submit"
				className="mt-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded border border-transparent bg-accent px-5.5 py-3.25 text-[15px] font-bold text-accent-ink transition-colors hover:bg-accent-strong active:translate-y-px"
			>
				{submitLabel}
			</button>

			{submitted && (
				// .join-confirm
				<p className="mt-2.5 text-[14.5px] text-accent" role="status">
					{successMessage}
				</p>
			)}
		</form>
	);
}
