'use client';
import { useGlobalContext } from '@/app/context/globalContext';
import { people } from '@/app/utils/Icons';
import { formatNumber } from '@/app/utils/misc';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function Population() {
	const { fiveDayForecast } = useGlobalContext();
	const { city } = fiveDayForecast;

	if (!fiveDayForecast || !city) {
		return <Skeleton className="h-[14rem] w-full" />;
	}

	return (
		<div className="pt-6 pb-5 px-4 border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-lg">
			<div className="top">
				<h2 className="flex items-center gap-2 font-medium text-2xl">
					{people} Population
				</h2>
				<p className="pt-4 text-3xl font-medium">
					{formatNumber(city.population)}
				</p>
			</div>
			<p className="text-md font-medium">
				Latest UN population data for {city.name}.
			</p>
		</div>
	);
}

export default Population;
