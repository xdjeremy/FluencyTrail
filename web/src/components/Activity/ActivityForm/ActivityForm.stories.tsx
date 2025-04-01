import type { Meta, StoryObj } from '@storybook/react';

import ActivityForm from './ActivityForm';

const meta: Meta<typeof ActivityForm> = {
  component: ActivityForm,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ActivityForm>;

export const Primary: Story = {};
