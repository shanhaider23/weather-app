'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import ThemeDropdown from './ThemeDropdown/ThemeDropdown';
import SearchDialog from './SearchDialog/SearchDialog';
import { useGlobalContext } from '../context/globalContext';
import Advice from './Advice/Advice';

function Navbar() {
	const router = useRouter();
	const { state } = useGlobalContext();

	return (
		<div className="w-full py-4 flex gap-3 items-center justify-between flex-wrap-reverse">
			<div className="w-full gap-2 sm:w-fit">
				<Advice />
			</div>
			<div className="search-container flex  w-full gap-2 sm:w-fit">
				<SearchDialog />

				<ThemeDropdown />
			</div>
		</div>
	);
}

export default Navbar;
