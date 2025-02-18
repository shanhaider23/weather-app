'use client';
import { useGlobalContext } from '@/app/context/globalContext';
import { sunset } from '@/app/utils/Icons';
import { unixToTime } from '@/app/utils/misc';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function Sunset() {
	const { forecast } = useGlobalContext();

	if (!forecast || !forecast?.sys || !forecast?.sys?.sunset) {
		return <Skeleton className="h-[14rem] w-full" />;
	}

	const times = forecast?.sys?.sunset;
	const timezone = forecast?.timezone;

	const sunsetTime = unixToTime(times, timezone);
	const sunrise = unixToTime(forecast?.sys?.sunrise, timezone);

	return (
		<div className="pt-6 pb-5 px-4 h-[14rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-lg ">
			<div className="top">
				<h2 className="flex items-center gap-2 font-medium text-2xl">
					{sunset}Sunset
				</h2>
				<p className="pt-4 text-3xl font-medium">{sunsetTime}</p>
			</div>

			<p className="text-xl font-medium">Sunrise: {sunrise}</p>
		</div>
	);
}

export default Sunset;
