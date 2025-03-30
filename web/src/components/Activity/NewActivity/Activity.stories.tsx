import type { Meta, StoryObj } from '@storybook/react'
import NewActivity from './NewActivity'

const meta: Meta<typeof NewActivity> = {
  component: NewActivity,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof NewActivity>

export const Primary: Story = {}
