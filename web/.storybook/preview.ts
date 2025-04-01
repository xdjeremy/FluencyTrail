import type { Preview } from '@storybook/react';

const customViewports = {
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1280px',
      height: '800px',
    },
  },
  largeDesktop: {
    name: 'Large Desktop',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
};

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: customViewports,
    },
    // ...other parameters
  },
};

export default preview;
