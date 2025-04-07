// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  totalTime: {
    __typename: 'TotalTime' as const,
    id: 42,
    totalTime: 130,
    vsLastWeek: 10,
  },
});
