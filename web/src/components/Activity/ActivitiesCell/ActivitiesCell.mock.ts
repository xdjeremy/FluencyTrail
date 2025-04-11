// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  activities: [
    {
      __typename: 'Activity' as const,
      id: '42',
      date: '2023-10-01T00:00:00.000Z',
      duration: 30,
      activityType: 'WATCHING',
      notes: 'Watched a movie',
    },
    {
      __typename: 'Activity' as const,
      id: '43',
      date: '2023-10-02T00:00:00.000Z',
      duration: 45,
      activityType: 'READING',
      notes: 'Read a book',
    },
    {
      __typename: 'Activity' as const,
      id: '44',
      date: '2023-10-03T00:00:00.000Z',
      duration: 60,
      activityType: 'LISTENING',
      notes: 'Listened to a podcast',
    },
  ],
});
