import type { Meta, StoryObj } from '@storybook/react'

import ProviderLayout from './ProvidersLayout'

const meta: Meta<typeof ProviderLayout> = {
  component: ProviderLayout,
}

export default meta

type Story = StoryObj<typeof ProviderLayout>

export const Primary: Story = {}
