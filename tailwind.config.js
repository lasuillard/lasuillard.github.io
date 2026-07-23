// eslint-disable-next-line jsdoc/check-tag-names
/** @type {import('tailwindcss').Config} */
export default {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/typography')],
	content: ['./src/**/*.{html,js,svelte,ts}']
};
