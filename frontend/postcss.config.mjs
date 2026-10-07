const postcssConfig = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px',
      viewportWidth: 1920,
      unitPrecision: 5,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: ['ignore-'],
      minPixelValue: 1,
      mediaQuery: true,
      replace: true,
      landscape: false,
    },
  },
};

export default postcssConfig;
