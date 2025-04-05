import type { Meta, StoryObj } from '@storybook/react';

import ResetPasswordError from './ResetPasswordError';
import ResetPasswordLoading from './ResetPasswordLoading';
import ResetPasswordPage from './ResetPasswordPage';

const meta: Meta<typeof ResetPasswordPage> = {
  component: ResetPasswordPage,
};

export default meta;

type Story = StoryObj<typeof ResetPasswordPage>;

export const Loading: Story = {
  render: () => <ResetPasswordLoading />,
};

export const Error: Story = {
  render: () => <ResetPasswordError errorMessage="Test error" />,
};
