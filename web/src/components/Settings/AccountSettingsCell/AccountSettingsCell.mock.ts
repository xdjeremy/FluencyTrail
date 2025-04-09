// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  user: {
    __typename: 'AccountSettings' as const,
    id: 42,
    name: 'John Doe',
    email: 'john@example.com',
  },
});
