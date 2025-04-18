export const schema = gql`
  type Activity {
    id: String!
    userId: Int!
    user: User!
    activityType: ActivityType!
    mediaId: String
    media: Media
    customMediaId: String
    customMedia: CustomMedia
    notes: String
    duration: Int
    date: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!

    "The language this activity was performed in"
    language: Language! @requireAuth
  }

  enum ActivityType {
    WATCHING
    READING
    LISTENING
    GRAMMAR
    VOCABULARY
    WRITING
    PLAYING
    OTHER
  }

  type HeatMap {
    date: String!
    count: Int!
  }

  type Streak {
    currentStreak: Int!
    bestStreak: Int!
  }

  type TotalTime {
    totalTime: Int!
    vsLastWeek: Int!
  }

  type Query {
    activities(
      itemsPerPage: Int
      page: Int
      userId: Int
      languageId: Int
    ): [Activity!]! @requireAuth
    activity(id: String!): Activity @requireAuth
    "Get heatmap data, optionally filtered by language"
    heatMap(languageId: Int): [HeatMap!]! @requireAuth
    "Get streak data, optionally filtered by language"
    streak(languageId: Int): Streak! @requireAuth
    "Check if any activities were completed today, optionally filtered by language"
    completedToday(languageId: Int): Boolean! @requireAuth
    "Get total time spent on activities, optionally filtered by language"
    totalTime(languageId: Int): TotalTime! @requireAuth
  }

  input CreateActivityInput {
    date: DateTime!
    mediaSlug: String
    activityType: ActivityType!
    duration: Int!
    notes: String
    languageId: Int!
    customMediaTitle: String
  }

  input UpdateActivityInput {
    mediaSlug: String
    activityType: ActivityType
    notes: String
    duration: Int
    date: Date
    languageId: Int # Optional for updates
  }

  type Mutation {
    createActivity(input: CreateActivityInput!): Activity! @requireAuth
    updateActivity(id: String!, input: UpdateActivityInput!): Activity!
      @requireAuth
    deleteActivity(id: String!): Activity! @requireAuth
  }
`;
