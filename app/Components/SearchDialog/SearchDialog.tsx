'use client';
import {
	useGlobalContext,
	useGlobalContextUpdate,
} from '@/app/context/globalContext';
import { commandIcon } from '@/app/utils/Icons';
import { Button } from '@/components/ui/button';
import { Command, CommandInput } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';

function SearchDialog() {
	const { geoCodedList, inputValue, handleInput } = useGlobalContext();
	const { setActiveCityCoords } = useGlobalContextUpdate();

	const [hoveredIndex, setHoveredIndex] = React.useState<number>(0);
	const [open, setOpen] = React.useState(false);

	const getClickedCoords = (lat: number, lon: number) => {
		setActiveCityCoords([lat, lon]);
		setOpen(false);
	};

	const handleEnterKey = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && geoCodedList?.length > 0) {
			getClickedCoords(
				geoCodedList[hoveredIndex].lat,
				geoCodedList[hoveredIndex].lon
			);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-full">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						className="w-full border inline-flex items-center justify-between text-sm font-medium hover:dark:bg-[#131313] hover:bg-slate-100 ease-in-out duration-200"
						onClick={() => setOpen(true)}
					>
						<p className="text-sm text-muted-foreground">Search Here...</p>
						<div className="command dark:bg-[#262626] bg-slate-200 py-[2px] pl-[5px] pr-[7px] rounded-sm flex items-center gap-2">
							{commandIcon}
							<span className="text-[9px]">F</span>
						</div>
					</Button>
				</DialogTrigger>

				<DialogContent className="p-0 w-full">
					<Command className="w-full rounded-lg border shadow-lg">
						<CommandInput
							value={inputValue}
							onChangeCapture={handleInput}
							onKeyDown={handleEnterKey}
							placeholder="Type a command or search..."
							className="w-full p-3 "
						/>
						<ul className="px-3 pb-2">
							<p className="p-2 text-sm text-muted-foreground">Suggestions</p>

							{geoCodedList?.length === 0 && <p className="p-2">No Results</p>}

							{geoCodedList &&
								geoCodedList.map(
									(
										item: {
											name: string;
											country: string;
											state: string;
											lat: number;
											lon: number;
										},
										index: number
									) => {
										const { country, state, name } = item;
										return (
											<li
												key={index}
												onMouseEnter={() => setHoveredIndex(index)}
												className={`py-3 px-2 text-sm rounded-sm cursor-pointer ${
													hoveredIndex === index ? 'bg-accent' : ''
												}`}
												onClick={() => getClickedCoords(item.lat, item.lon)}
											>
												<p>
													{name}, {state && `${state},`} {country}
												</p>
											</li>
										);
									}
								)}
						</ul>
					</Command>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default SearchDialog;
