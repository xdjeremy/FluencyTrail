// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  heatMap: {
    __typename: 'HeatMap' as const,
    id: 42,
  },
})
