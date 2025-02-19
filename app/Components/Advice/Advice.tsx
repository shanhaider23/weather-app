import React from 'react';
import { useGlobalContext } from '@/app/context/globalContext';

function Advice() {
	const { advice } = useGlobalContext();

	return (
		<div className="py-2 px-4 border rounded-lg shadow-md dark:bg-dark-grey text-sm text-gray-800 dark:text-gray-200">
			{advice ? <p>{advice}</p> : <p>No advice available at the moment.</p>}
		</div>
	);
}

export default Advice;
