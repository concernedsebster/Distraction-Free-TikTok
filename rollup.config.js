import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/content/content.js',
  output: {
    dir: 'dist',
    format: 'esm',
    preserveModules: true,        // ✅ Keeps modules separate
    name: "MyExtension",          // ✅ Stops unnecessary function renaming
    exports: "named",             // ✅ Explicitly preserves function names
  },
  plugins: [resolve(), commonjs()],
};