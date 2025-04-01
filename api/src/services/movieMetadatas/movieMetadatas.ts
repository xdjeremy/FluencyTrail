import type {
  QueryResolvers,
  MovieMetadataRelationResolvers,
} from 'types/graphql';

import { db } from 'src/lib/db';

export const movieMetadatas: QueryResolvers['movieMetadatas'] = () => {
  return db.movieMetadata.findMany();
};

export const movieMetadata: QueryResolvers['movieMetadata'] = ({ mediaId }) => {
  return db.movieMetadata.findUnique({
    where: { mediaId },
  });
};

export const MovieMetadata: MovieMetadataRelationResolvers = {
  media: (_obj, { root }) => {
    return db.movieMetadata
      .findUnique({ where: { mediaId: root?.mediaId } })
      .media();
  },
};
