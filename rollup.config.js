import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: [
    'src/content/content.js',
    'src/background.js',
    'src/inject.js'
  ],
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js',
    exports: "named",
    preserveModules: false,
  },
  plugins: [commonjs(), resolve()],
};