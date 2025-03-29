'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/app/context/globalContext';
import {
	clearSky,
	cloudy,
	drizzleIcon,
	navigation,
	rain,
	snow,
} from '@/app/utils/Icons';
import { kelvinToCelsius } from '@/app/utils/misc';
import moment from 'moment';

function Temperature() {
	const { forecast } = useGlobalContext();

	const { main, timezone, name, weather } = forecast;

	if (!forecast || !weather) {
		return <div>Loading...</div>;
	}

	const temp = kelvinToCelsius(main?.temp);
	const minTemp = kelvinToCelsius(main?.temp_min);
	const maxTemp = kelvinToCelsius(main?.temp_max);

	// State
	const [localTime, setLocalTime] = useState<string>('');
	const [currentDay, setCurrentDay] = useState<string>('');
	const [videoSrc, setVideoSrc] = useState<string>('/videos/sunny.mp4');
	const { main: weatherMain, description } = weather[0];

	const getBackgroundVideo = () => {
		const hour = moment()
			.utcOffset(timezone / 60)
			.hour();
		const lowerDescription = description.toLowerCase(); // Ensure case-insensitive matching

		// Rain Conditions
		if (weatherMain === 'Rain') {
			if (lowerDescription.includes('light rain'))
				return '/videos/light-rain.mp4';
			if (lowerDescription.includes('moderate rain'))
				return '/videos/moderate-rain.mp4';
			if (lowerDescription.includes('heavy rain'))
				return '/videos/heavy-rain.mp4';
			return '/videos/rain.mp4';
		}

		// Drizzle Conditions
		if (weatherMain === 'Drizzle') {
			if (lowerDescription.includes('light drizzle'))
				return '/videos/light-drizzle.mp4';
			if (lowerDescription.includes('heavy drizzle'))
				return '/videos/heavy-drizzle.mp4';
			return '/videos/drizzle.mp4';
		}

		// Snow Conditions
		if (weatherMain === 'Snow') {
			if (lowerDescription.includes('light snow'))
				return '/videos/light-snow.mp4';
			if (lowerDescription.includes('heavy snow'))
				return '/videos/heavy-snow.mp4';
			return '/videos/snow.mp4';
		}

		// Fog, Mist, Haze
		if (
			weatherMain === 'Mist' ||
			weatherMain === 'Smoke' ||
			weatherMain === 'Haze' ||
			weatherMain === 'Dust' ||
			weatherMain === 'Fog' ||
			weatherMain === 'Sand' ||
			weatherMain === 'Ash'
		) {
			return '/videos/fog.mp4';
		}

		// Extreme Conditions
		if (
			weatherMain === 'Squall' ||
			weatherMain === 'Tornado' ||
			weatherMain === 'storm'
		) {
			return '/videos/storm.mp4';
		}

		// Cloudy Conditions
		if (weatherMain === 'Clouds') {
			if (lowerDescription.includes('few clouds'))
				return '/videos/partly-cloudy.mp4';
			if (lowerDescription.includes('scattered clouds'))
				return '/videos/scattered-clouds.mp4';
			if (
				lowerDescription.includes('broken clouds') ||
				lowerDescription.includes('overcast clouds')
			)
				return '/videos/cloudy1.mp4';
			return '/videos/cloudy.mp4';
		}

		// Clear Sky with Time Check
		if (weatherMain === 'Clear' || weatherMain === 'Clear Sky') {
			if (hour >= 4 && hour < 7) return '/videos/sunrise.mp4';
			if (hour >= 7 && hour < 12) return '/videos/morning.mp4';
			if (hour >= 12 && hour < 16) return '/videos/midday.mp4';
			if (hour >= 16 && hour < 18) return '/videos/sunset.mp4';
			if (hour >= 18 || hour < 4) return '/videos/night.mp4';
		}

		// Default Background
		return '/videos/default.mp4';
	};

	// Live time update
	useEffect(() => {
		const interval = setInterval(() => {
			const localMoment = moment().utcOffset(timezone / 60);
			const formatedTime = localMoment.format('HH:mm:ss');

			const day = localMoment.format('dddd');

			setLocalTime(formatedTime);
			setCurrentDay(day);
			setVideoSrc(getBackgroundVideo());
		}, 1000);

		return () => clearInterval(interval);
	}, [timezone]);

	return (
		<div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg">
			{/* Background Video */}
			<video
				className="absolute top-0 left-0 w-full h-full object-cover"
				autoPlay
				loop
				muted
				src={videoSrc}
			/>

			{/* Overlay Content */}
			<div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-2 rounded-lg shadow-lg text-white z-10">
				{/* City Name and Time */}
				<div className="flex justify-between items-center">
					<p className="text-xl font-bold flex gap-1">
						<span>{name}</span>
						<span>{navigation}</span>
					</p>
					<p className="flex gap-2 items-center">
						<span className="font-medium">{currentDay}</span>
						<span className="font-medium">{localTime}</span>
					</p>
				</div>

				{/* Temperature Display */}
				<p className="py-10 text-7xl font-bold self-center drop-shadow-lg">
					{temp}°
				</p>

				{/* Weather Details */}
				<div className="flex flex-col items-center text-white">
					<div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg">
						<p className="capitalize text-md font-semibold drop-shadow-lg">
							{description}
						</p>
					</div>
					<p className="flex items-center gap-4 text-md bg-black bg-opacity-50 px-4 py-2 rounded-lg mt-2">
						<span className="font-semibold">🌡️ Low: {minTemp}°</span>
						<span className="font-semibold">🔥 High: {maxTemp}°</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Temperature;
