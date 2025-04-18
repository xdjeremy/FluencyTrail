import { Form } from '@redwoodjs/forms';
import { render, screen, fireEvent, waitFor } from '@redwoodjs/testing/web';

import MediaSelect from './MediaSelect';

const MOCK_DATA = {
  searchMedias: [
    {
      title: 'Existing Media',
      slug: 'existing-media',
      date: '2024-01-01',
    },
  ],
};

jest.mock('@redwoodjs/web', () => ({
  ...jest.requireActual('@redwoodjs/web'),
  useQuery: () => ({
    data: MOCK_DATA,
    loading: false,
  }),
}));

describe('MediaSelect', () => {
  it('allows searching existing media', async () => {
    render(
      <Form onSubmit={() => {}}>
        <MediaSelect isLoading={false} />
      </Form>
    );

    const input = screen.getByPlaceholderText(
      'Search media or type to create new...'
    );
    fireEvent.change(input, { target: { value: 'Existing' } });

    await waitFor(() => {
      expect(screen.getByText('Existing Media')).toBeInTheDocument();
    });
  });

  it('shows create option for new media', async () => {
    render(
      <Form onSubmit={() => {}}>
        <MediaSelect isLoading={false} />
      </Form>
    );

    const input = screen.getByPlaceholderText(
      'Search media or type to create new...'
    );
    fireEvent.change(input, { target: { value: 'New Custom Media' } });

    await waitFor(() => {
      expect(
        screen.getByText('Press Enter to create "New Custom Media"')
      ).toBeInTheDocument();
    });
  });

  it('handles media selection', async () => {
    render(
      <Form onSubmit={() => {}}>
        <MediaSelect isLoading={false} />
      </Form>
    );

    const input = screen.getByPlaceholderText(
      'Search media or type to create new...'
    );
    fireEvent.change(input, { target: { value: 'Existing' } });

    await waitFor(() => {
      const mediaItem = screen.getByText('Existing Media');
      fireEvent.click(mediaItem);
      expect((input as HTMLInputElement).value).toBe(''); // Input should be cleared after selection
    });
  });
});
