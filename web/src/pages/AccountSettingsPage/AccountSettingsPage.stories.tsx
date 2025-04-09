import type { Meta, StoryObj } from '@storybook/react'

import AccountSettingsPage from './AccountSettingsPage'

const meta: Meta<typeof AccountSettingsPage> = {
  component: AccountSettingsPage,
}

export default meta

type Story = StoryObj<typeof AccountSettingsPage>

export const Primary: Story = {}
