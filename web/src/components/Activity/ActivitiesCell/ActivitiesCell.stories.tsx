import type { Meta, StoryObj } from '@storybook/react'

import { Loading, Empty, Failure, Success } from './ActivitiesCell'
import { standard } from './ActivitiesCell.mock'

const meta: Meta = {
  title: 'Cells/ActivitiesCell',
  tags: ['autodocs'],
}

export default meta

export const loading: StoryObj<typeof Loading> = {
  render: () => {
    return <Loading />
  },
}

export const empty: StoryObj<typeof Empty> = {
  render: () => {
    return <Empty />
  },
}

export const failure: StoryObj<typeof Failure> = {
  render: (args) => {
    return <Failure error={new Error('Oh no')} {...args} />
  },
}

export const success: StoryObj<typeof Success> = {
  render: (args) => {
    return <Success {...standard()} {...args} />
  },
}
