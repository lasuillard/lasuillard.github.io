/** @type {import('tailwindcss').Config} */
export default {
	plugins: [require('daisyui')],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: ['light', 'dark']
	}
};
