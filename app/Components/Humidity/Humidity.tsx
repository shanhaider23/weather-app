'use client';
import { useGlobalContext } from '@/app/context/globalContext';
import { droplets } from '@/app/utils/Icons';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function Humidity() {
	const { forecast } = useGlobalContext();

	if (!forecast || !forecast?.main || !forecast?.main?.humidity) {
		return <Skeleton className="h-[14rem] w-full" />;
	}

	const { humidity } = forecast?.main;

	const getHumidityText = (humidity: number) => {
		if (humidity < 30) return 'Dry: May cause skin irritation';
		if (humidity >= 30 && humidity < 50)
			return 'Comfortable: Ideal for health and comfort';
		if (humidity >= 50 && humidity < 70)
			return 'Moderate: Sticky, may increase allergens';
		if (humidity >= 70) return 'High: Uncomfortable, mold growth risk';
		return 'Unavailable: Humidity data not available';
	};

	return (
		<div className="pt-6 pb-5 px-4 border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-lg">
			<div className="top">
				<h2 className="flex items-center gap-2 font-medium text-2xl">
					{droplets} Humidity
				</h2>
				<p className="pt-4 text-3xl">{humidity}%</p>
			</div>

			<p className="text-md font-medium">{getHumidityText(humidity)}.</p>
		</div>
	);
}

export default Humidity;
