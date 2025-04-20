// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  customMedia: [
    {
      __typename: 'CustomMedia' as const,
      id: '42',
      title: 'Sample Media Title',
      createdAt: '2023-10-01T00:00:00Z',
    },
  ],
});
