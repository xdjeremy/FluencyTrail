// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  customMedia: {
    __typename: 'CustomMedia' as const,
    id: '42',
  },
})
