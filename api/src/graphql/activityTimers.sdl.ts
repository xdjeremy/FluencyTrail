export const schema = gql`
  type ActivityTimer {
    id: String!
    startTime: DateTime!
    endTime: DateTime!
    activityType: ActivityType!
    mediaId: String
    customMediaId: String
    languageId: Int!
    activityId: String
    media: Media
    customMedia: CustomMedia
    language: Language!
    activity: Activity
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

  type Query {
    activeTimer: ActivityTimer @requireAuth
  }

  input StartTimerInput {
    mediaSlug: String
    activityType: ActivityType!
    languageId: Int!
    customMediaTitle: String
  }

  input UpdateActivityTimerInput {
    id: String!
  }

  type Mutation {
    startActivityTimer(input: StartTimerInput!): ActivityTimer! @requireAuth
    stopActivityTimer(input: UpdateActivityTimerInput!): ActivityTimer!
      @requireAuth
  }
`;
