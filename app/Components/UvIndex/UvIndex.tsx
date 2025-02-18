'use client';

import { useGlobalContext } from '@/app/context/globalContext';
import { sun } from '@/app/utils/Icons';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { UvProgress } from '../UvProgress/UvProgress';

function UvIndex() {
	const { uvIndex } = useGlobalContext();

	if (!uvIndex || !uvIndex.daily) {
		return <Skeleton className="h-[14rem] w-full" />;
	}

	const { daily } = uvIndex;
	const { uv_index_clear_sky_max, uv_index_max } = daily;

	const uvIndexMax = uv_index_max[0].toFixed(0);

	const uvIndexCategory = (uvIndex: number) => {
		if (uvIndex <= 2) {
			return {
				text: 'Low',
				protection: 'No protection required',
			};
		} else if (uvIndex <= 5) {
			return {
				text: 'Moderate',
				protection: 'Stay in shade near midday.',
			};
		} else if (uvIndex <= 7) {
			return {
				text: 'High',
				protection: 'Wear a hat and sunglasses.',
			};
		} else if (uvIndex <= 10) {
			return {
				text: 'Very High',
				protection: 'Apply sunscreen SPF 30+ every 2 hours.',
			};
		} else if (uvIndex > 10) {
			return {
				text: 'Extreme',
				protection: 'Avoid being outside.',
			};
		} else {
			return {
				text: 'Extreme',
				protection: 'Avoid being outside.',
			};
		}
	};

	const marginLeftPercentage = (uvIndexMax / 14) * 100;

	return (
		<div className="pt-6 pb-5 px-4 h-[14rem] border rounded-lg flex flex-col gap-5 dark:bg-dark-grey shadow-lg">
			<div className="top">
				<h2 className="flex items-center gap-2 font-medium text-2xl">
					{sun} Uv Index
				</h2>
				<div className="pt-4 flex flex-col gap-1">
					<p className="text-3xl font-medium flex justify-start gap-2 items-center">
						{uvIndexMax}
						<span className="text-lg">
							({uvIndexCategory(uvIndexMax).text})
						</span>
					</p>

					<UvProgress
						value={marginLeftPercentage}
						max={14}
						className="progress"
					/>
				</div>
			</div>

			<p className="text-md font-medium">
				{uvIndexCategory(uvIndexMax).protection}{' '}
			</p>
		</div>
	);
}

export default UvIndex;
