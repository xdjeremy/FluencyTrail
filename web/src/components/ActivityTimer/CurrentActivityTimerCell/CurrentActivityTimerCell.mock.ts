// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  currentActivityTimer: {
    __typename: 'CurrentActivityTimer' as const,
    id: 42,
  },
})
