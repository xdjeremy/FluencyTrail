import type { Meta, StoryObj } from '@storybook/react';

import { Loading, Empty, Failure, Success } from './SearchCell';
import { standard } from './SearchCell.mock';

const meta: Meta = {
  title: 'Cells/MediasCell',
  tags: ['autodocs'],
};

export default meta;

export const loading: StoryObj<typeof Loading> = {
  render: () => {
    return Loading ? <Loading /> : <></>;
  },
};

export const empty: StoryObj<typeof Empty> = {
  render: () => {
    return Empty ? <Empty /> : <></>;
  },
};

export const failure: StoryObj<typeof Failure> = {
  render: args => {
    return Failure ? <Failure error={new Error('Oh no')} {...args} /> : <></>;
  },
};

export const success: StoryObj<typeof Success> = {
  args: {
    query: 'Star Wars',
  },
  render: args => {
    return Success ? <Success {...standard()} {...args} /> : <></>;
  },
};
