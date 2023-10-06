// eslint-disable-next-line jsdoc/check-tag-names
/** @type {import('tailwindcss').Config} */
export default {
	plugins: [require('daisyui'), require('@tailwindcss/typography')],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: ['light', 'dark']
	}
};
