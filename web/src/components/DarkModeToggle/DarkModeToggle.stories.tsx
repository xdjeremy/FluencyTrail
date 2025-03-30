// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/7/writing-stories/args

import type { Meta, StoryObj } from '@storybook/react'

import DarkModeToggle from './DarkModeToggle'

const meta: Meta<typeof DarkModeToggle> = {
  component: DarkModeToggle,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DarkModeToggle>

export const Primary: Story = {}
