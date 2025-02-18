'use client';
import { useGlobalContext } from '@/app/context/globalContext';
import { thermometer } from '@/app/utils/Icons';
import { kelvinToCelsius } from '@/app/utils/misc';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function FeelsLike() {
	const { forecast } = useGlobalContext();

	if (!forecast || !forecast?.main || !forecast?.main?.feels_like) {
		return <Skeleton className="h-[14rem] w-full" />;
	}

	const { feels_like, temp_min, temp_max } = forecast?.main;

	const feelsLikeText = (
		feelsLike: number,
		minTemo: number,
		maxTemp: number
	) => {
		const avgTemp = (minTemo + maxTemp) / 2;

		if (feelsLike < avgTemp - 5) {
			return 'Feels significantly colder than actual temperature.';
		}
		if (feelsLike > avgTemp - 5 && feelsLike <= avgTemp + 5) {
			return 'Feels close to the actual temperature.';
		}
		if (feelsLike > avgTemp + 5) {
			return 'Feels significantly warmer than actual temperature.';
		}

		return 'Temperature feeling is typical for this range.';
	};

	const feelsLikeDescription = feelsLikeText(feels_like, temp_min, temp_max);

	return (
		<div className="pt-6 pb-5 px-4 h-[14rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-lg">
			<div className="top">
				<h2 className="flex items-center gap-2 font-medium text-2xl">
					{thermometer} Feels Like
				</h2>
				<p className="pt-4 text-3xl font-medium">
					{kelvinToCelsius(feels_like)}°
				</p>
			</div>

			<p className="text-md font-medium">{feelsLikeDescription}</p>
		</div>
	);
}

export default FeelsLike;
