import type { MetadataRoute } from 'next';

type ExtendedScreenshot = {
	src: string;
	sizes: string;
	type: string;
	form_factor?: 'wide' | 'narrow';
};
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Weather',
		short_name: 'weather',
		description: 'Best weather app',
		start_url: '/',
		scope: '/',
		display: 'standalone',
		theme_color: '#2c095d',
		background_color: '#1f1e33',
		orientation: 'portrait-primary',
		icons: [
			{
				src: '/icon-144x144.png',
				sizes: '144x144',
				type: 'image/png',
			},
			{
				src: '/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: '/icon-512-maskable.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
		],
		screenshots: [
			{
				src: '/screenshot-11.png',
				sizes: '640x320',
				type: 'image/png',
				form_factor: 'wide',
			},
			{
				src: '/screenshot-12.png',
				sizes: '800x600',
				type: 'image/png',
				form_factor: 'narrow',
			},
		] as ExtendedScreenshot[],
	};
}
