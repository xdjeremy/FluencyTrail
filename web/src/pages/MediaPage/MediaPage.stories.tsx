import type { Meta, StoryObj } from '@storybook/react';

import MediaPage from './MediaPage';

const meta: Meta<typeof MediaPage> = {
  component: MediaPage,
};

export default meta;

type Story = StoryObj<typeof MediaPage>;

export const Primary: Story = {
  args: {
    id: 'john-wick-1234',
  },
};
