import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import jsdoc from 'eslint-plugin-jsdoc';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

// https://github.com/sindresorhus/globals/issues/239
const browserGlobals = {
	...globals.browser,
	AudioWorkletGlobalScope: false // this is the default,
};

delete browserGlobals['AudioWorkletGlobalScope '];

export default ts.config(
	{
		ignores: [
			'coverage/*',
			'playwright-report/*',
			'test-results/*',
			'build/*',
			'.svelte-kit/*',
			'vite.config.{js,ts}.timestamp-*',
			'node_modules/*',
			'.wrangler/*',
			'src/worker-configuration.d.ts'
		]
	},
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	...svelte.configs.recommended,
	jsdoc.configs['flat/recommended-typescript'],
	{
		languageOptions: {
			globals: {
				...browserGlobals,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off'
		}
	}
);
