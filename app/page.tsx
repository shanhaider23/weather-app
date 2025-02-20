'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AirPollution from './Components/AirPollution/AirPollution';
import DailyForecast from './Components/DailyForecast/DailyForecast';
import FeelsLike from './Components/FeelsLike/FeelsLike';
import Humidity from './Components/Humidity/Humidity';
// import Mapbox from './Components/Mapbox/Mapbox';
import Navbar from './Components/Navbar';
import Population from './Components/Population/Population';
import Pressure from './Components/Pressure/Pressure';
import Sunset from './Components/Sunset/Sunset';
import Temperature from './Components/Temperature/Temperature';
import UvIndex from './Components/UvIndex/UvIndex';
import Visibility from './Components/Visibility/Visibility';
import Wind from './Components/Wind/Wind';
import defaultStates from './utils/defaultStates';
import FiveDayForecast from './Components/FiveDayForecast/FiveDayForecast';
import { useGlobalContextUpdate } from './context/globalContext';
const Mapbox = dynamic(() => import('./Components/Mapbox/Mapbox'), {
	ssr: false, // This prevents Next.js from rendering the component server-side
});
export default function Home() {
	const { setActiveCityCoords } = useGlobalContextUpdate();

	const getClickedCityCords = (lat: number, lon: number) => {
		setActiveCityCoords([lat, lon]);

		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<main className="mx-[1rem] lg:mx-[2rem] xl:mx-[6rem] 2xl:mx-[16rem] m-auto">
			<Navbar />
			<div className="pb-4 flex flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-4 w-full min-w-[18rem] md:w-[35rem] ">
					<Temperature />
					<FiveDayForecast />
				</div>
				<div className="flex flex-col w-full">
					<div className="instruments grid h-full gap-4 col-span-full sm-2:col-span-2 lg:grid-cols-3 xl:grid-cols-4">
						<AirPollution />
						<Sunset />
						<Wind />
						<DailyForecast />
						<UvIndex />
						<Population />
						<FeelsLike />
						<Humidity />
						<Visibility />
						<Pressure />
					</div>
					<div className="mapbox-con mt-4 flex gap-4">
						<Mapbox />
						<div className="states flex flex-col gap-3 flex-1">
							<h2 className="flex items-center gap-2 font-medium">
								Top Large Cities
							</h2>
							<div className="flex flex-col gap-4">
								{defaultStates.map((state, index) => {
									return (
										<div
											key={index}
											className="border rounded-lg cursor-pointer dark:bg-dark-grey shadow-sm dark:shadow-none"
											onClick={() => {
												getClickedCityCords(state.lat, state.lon);
											}}
										>
											<p className="px-6 py-4">{state.name}</p>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>

			<footer className="w-full py-4 flex justify-center pb-8">
				<div className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm flex justify-between gap-0 sm:gap-5 items-center flex-wrap w-full">
					<a
						href="https://shanehaider.dk"
						target="_blank"
						className="text-center"
					>
						Design and Developed by Shan-e-Haider Bukhari
					</a>
					<p className="text-center">
						&copy; {new Date().getFullYear()} All rights reserved.
					</p>
				</div>
			</footer>
		</main>
	);
}
