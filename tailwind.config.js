// eslint-disable-next-line jsdoc/check-tag-names
/** @type {import('tailwindcss').Config} */
export default {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/typography')],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				'h-sm': {
					raw: '(min-height: 480px)'
				},
				'h-md': {
					raw: '(min-height: 640px)'
				},
				'h-lg': {
					raw: '(min-height: 768px)'
				}
			}
		}
	}
};
