// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  immersionTracker: {
    __typename: 'ImmersionTracker' as const,
    id: 42,
  },
})
