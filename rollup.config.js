import resolve from '@rollup/plugin-node-resolve';

export default {
  input: {
    content: 'src/content/content.js',
    blockingOverlay: 'src/content/blockingOverlay.js',
    autoplayControl: 'src/content/autoplayControl.js',
    searchBarListeners: 'src/content/searchBarListeners.js',
    background: 'src/background.js',
  },
  output: {
    dir: 'dist',
    format: 'esm',  // ✅ Ensures compatibility with Chrome
    entryFileNames: '[name].js',
  },
  plugins: [resolve()],
};