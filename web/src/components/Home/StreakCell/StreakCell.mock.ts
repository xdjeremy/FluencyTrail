// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  streak: {
    __typename: 'streak' as const,
    id: 42,
    currentStreak: 5,
    bestStreak: 10,
  },
})
