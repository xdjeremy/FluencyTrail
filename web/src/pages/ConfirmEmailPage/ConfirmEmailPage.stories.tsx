import type { Meta, StoryObj } from '@storybook/react';

import ConfirmEmailError from './ConfirmEmailError';
import ConfirmEmailLoading from './ConfirmEmailLoading';
import ConfirmEmailPage from './ConfirmEmailPage';
import ConfirmEmailSuccess from './ConfirmEmailSuccess';

const meta: Meta<typeof ConfirmEmailPage> = {
  component: ConfirmEmailPage,
};

export default meta;

type Story = StoryObj<typeof ConfirmEmailPage>;

export const Loading: Story = {
  render: () => <ConfirmEmailLoading />,
};

export const Error: Story = {
  render: () => <ConfirmEmailError errorMessage="Invalid token" />,
};

export const Success: Story = {
  render: () => <ConfirmEmailSuccess />,
};
