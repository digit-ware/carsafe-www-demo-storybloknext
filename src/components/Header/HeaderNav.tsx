'use client';

import { type ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderNavProps {
	links: ReactNode;
	cta?: ReactNode;
	menuLabel?: string;
}

const DESKTOP_LINKS =
	'hidden items-center gap-6.5 min-[961px]:flex [&_a]:border-b-2 [&_a]:border-transparent [&_a]:py-1 [&_a]:text-[14.5px] [&_a]:font-semibold [&_a]:text-ink [&_a]:transition-colors [&_a:hover]:border-accent';

const MOBILE_LINKS =
	'flex flex-col [&_a]:border-b [&_a]:border-line [&_a]:px-8 [&_a]:py-4 [&_a]:font-bold [&_a]:text-ink';

export default function HeaderNav({ links, cta, menuLabel }: HeaderNavProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<nav className={DESKTOP_LINKS}>{links}</nav>

			{cta && <div className="hidden min-[961px]:block">{cta}</div>}

			<button
				type="button"
				aria-label={menuLabel || 'Menu'}
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
				className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full border border-line text-ink min-[961px]:hidden [&_svg]:h-[18px] [&_svg]:w-[18px]"
			>
				{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
			</button>

			{open && (
				<div className="absolute inset-x-0 top-full border-t border-line bg-bg min-[961px]:hidden">
					<div
						className={MOBILE_LINKS}
						onClick={() => setOpen(false)}
						role="presentation"
					>
						{links}
					</div>
					{cta && <div className="px-8 py-4">{cta}</div>}
				</div>
			)}
		</>
	);
}
