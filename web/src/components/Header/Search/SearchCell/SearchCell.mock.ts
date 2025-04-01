// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  medias: [
    {
      __typename: 'Media' as const,
      id: '42',
    },
    {
      __typename: 'Media' as const,
      id: '43',
    },
    {
      __typename: 'Media' as const,
      id: '44',
    },
  ],
})
