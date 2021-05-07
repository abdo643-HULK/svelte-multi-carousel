import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';
import livereload from 'rollup-plugin-livereload';

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
		typescript({ sourceMap: !production }),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
			preprocess: sveltePreprocess(),
		}),
		css({ output: 'bundle.css' }),
		resolve(),
		commonjs(),
		!production && serve(),
		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn(
				'npm',
				['run', 'start', '--', '--dev'],
				{
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true,
				},
			);

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		},
	};
}
