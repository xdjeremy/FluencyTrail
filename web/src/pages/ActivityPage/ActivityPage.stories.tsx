import type { Meta, StoryObj } from '@storybook/react'

import ActivityPage from './ActivityPage'

const meta: Meta<typeof ActivityPage> = {
  component: ActivityPage,
}

export default meta

type Story = StoryObj<typeof ActivityPage>

export const Primary: Story = {}
