import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, (m) => m.toUpperCase())
	.replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
	input: './src/index.ts',
	output: [
		{ file: pkg.module, format: 'es' },
		{ file: pkg.main, format: 'umd', name },
	],
	plugins: [
		svelte({
			preprocess: sveltePreprocess(),
		}),
		css({ output: 'bundle.css' }),
		typescript({ sourceMap: !production }),
		resolve(),
		commonjs(),
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};
