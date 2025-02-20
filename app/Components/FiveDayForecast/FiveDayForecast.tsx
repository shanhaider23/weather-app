'use client';
import { useGlobalContext } from '@/app/context/globalContext';
import { calender } from '@/app/utils/Icons';
import { kelvinToCelsius, unixToDay } from '@/app/utils/misc';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function FiveDayForecast() {
	const { fiveDayForecast } = useGlobalContext();

	const { city, list } = fiveDayForecast;

	if (!fiveDayForecast || !city || !list) {
		return <Skeleton className="h-[14rem] w-full" />;
	}

	const processData = (
		dailyData: {
			main: { temp_min: number; temp_max: number };
			dt: number;
			weather: { main: string; icon: string }[];
		}[]
	) => {
		let minTemp = Number.MAX_VALUE;
		let maxTemp = Number.MIN_VALUE;
		let weatherCondition = dailyData[0].weather[0].main;
		let weatherIcon = dailyData[0].weather[0].icon;

		dailyData.forEach(
			(day: {
				main: { temp_min: number; temp_max: number };
				dt: number;
				weather: { main: string; icon: string }[];
			}) => {
				if (day.main.temp_min < minTemp) {
					minTemp = day.main.temp_min;
				}
				if (day.main.temp_max > maxTemp) {
					maxTemp = day.main.temp_max;
				}
			}
		);

		return {
			day: unixToDay(dailyData[0].dt),
			minTemp: kelvinToCelsius(minTemp),
			maxTemp: kelvinToCelsius(maxTemp),
			weatherCondition,
			weatherIcon,
		};
	};

	const dailyForecasts = [];

	for (let i = 0; i < 40; i += 8) {
		const dailyData = list.slice(i, i + 8);
		dailyForecasts.push(processData(dailyData));
	}

	return (
		<div
			className="pt-6 pb-5 px-4 flex-1 border rounded-lg flex flex-col
        justify-between dark:bg-dark-grey shadow-lg max-h-[750px]"
		>
			<div>
				<h2 className="flex items-center gap-2 font-medium text-2xl">
					{calender} Five Days Forecast for {city.name}
				</h2>

				<div className="forecast-list pt-3">
					{dailyForecasts.map((day, i) => {
						return (
							<div
								key={i}
								className="daily-forecast py-4 flex flex-col justify-evenly border-b-2"
							>
								<div className="flex justify-between items-center">
									<p className="text-xl min-w-[3.5rem]">{day.day}</p>
									<div className="flex items-center gap-2">
										<img
											src={`https://openweathermap.org/img/wn/${day.weatherIcon}.png`}
											alt={day.weatherCondition}
											className="w-10 h-10"
										/>
										<p className="text-sm">{day.weatherCondition}</p>
									</div>
								</div>

								<p className="text-sm flex justify-between">
									<span>(low)</span>
									<span>(high)</span>
								</p>

								<div className="flex-1 flex items-center justify-between gap-4">
									<p className="font-bold">{day.minTemp}°C</p>
									<div className="temperature flex-1 w-full h-2 rounded-lg"></div>
									<p className="font-bold">{day.maxTemp}°C</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default FiveDayForecast;
