'use client';
import { useGlobalContext } from '@/app/context/globalContext';
import { gauge } from '@/app/utils/Icons';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function Pressure() {
	const { forecast } = useGlobalContext();

	if (!forecast || !forecast?.main || !forecast?.main?.pressure) {
		return <Skeleton className="h-[14rem] w-full" />;
	}

	const { pressure } = forecast?.main;

	const getPressureDescription = (pressure: number) => {
		if (pressure < 1000) return 'Very low pressure';

		if (pressure >= 1000 && pressure < 1015)
			return 'Low pressure. Expect weather changes.';

		if (pressure >= 1015 && pressure < 1025)
			return 'Normal pressure. Expect weather changes.';

		if (pressure >= 1025 && pressure < 1040)
			return 'High pressure. Expect weather changes.';

		if (pressure >= 1040) return 'Very high pressure. Expect weather changes.';

		return 'Unavailable pressure data';
	};

	return (
		<div className="pt-6 pb-5 px-4 border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-lg">
			<div className="top">
				<h2 className="flex items-center gap-2 text-2xl font-medium">
					{gauge} Pressure
				</h2>
				<p className="pt-4 text-3xl font-medium">{pressure} hPa</p>
			</div>

			<p className="text-md font-medium">{getPressureDescription(pressure)}.</p>
		</div>
	);
}

export default Pressure;
