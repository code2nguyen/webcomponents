const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  stories: ['../stories/*.{js,md,mdx}'],
  addons: [
    // 'storybook-prebuilt/addon-actions/register.js',
    // 'storybook-prebuilt/addon-knobs/register.js',
    'storybook-prebuilt/addon-docs/register.js',
    'storybook-prebuilt/addon-viewport/register.js',
  ],
  esDevServer: {
    // custom es-dev-server options
    nodeResolve: true,
    watch: true,
    open: true,
  },
  rollup: config => {
    config.plugins.unshift(
      commonjs({
        namedExports: {
          esrever: ['reverse'],
          'react-dom': ['findDOMNode'],
          'react-dom/server': ['renderToStaticMarkup'],
        },
      })
    );
    return config;
  },
};
