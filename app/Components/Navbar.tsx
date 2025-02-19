'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { github } from '../utils/Icons';
import ThemeDropdown from './ThemeDropdown/ThemeDropdown';
import SearchDialog from './SearchDialog/SearchDialog';
import { useGlobalContext } from '../context/globalContext';

function Navbar() {
	const router = useRouter();
	const { state } = useGlobalContext();

	return (
		<div className="w-full py-4 flex items-center justify-end">
			<div className="search-container flex  w-full gap-2 sm:w-fit">
				<SearchDialog />

				<ThemeDropdown />
			</div>
		</div>
	);
}

export default Navbar;
