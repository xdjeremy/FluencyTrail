import type {
  QueryResolvers,
  MutationResolvers,
  TvMetadataRelationResolvers,
} from 'types/graphql';

import { db } from 'src/lib/db';

export const tvMetadatas: QueryResolvers['tvMetadatas'] = () => {
  return db.tvMetadata.findMany();
};

export const tvMetadata: QueryResolvers['tvMetadata'] = ({ mediaId }) => {
  return db.tvMetadata.findUnique({
    where: { mediaId },
  });
};

export const createTvMetadata: MutationResolvers['createTvMetadata'] = ({
  input,
}) => {
  return db.tvMetadata.create({
    data: input,
  });
};

export const updateTvMetadata: MutationResolvers['updateTvMetadata'] = ({
  mediaId,
  input,
}) => {
  return db.tvMetadata.update({
    data: input,
    where: { mediaId },
  });
};

export const deleteTvMetadata: MutationResolvers['deleteTvMetadata'] = ({
  mediaId,
}) => {
  return db.tvMetadata.delete({
    where: { mediaId },
  });
};

export const TvMetadata: TvMetadataRelationResolvers = {
  media: (_obj, { root }) => {
    return db.tvMetadata
      .findUnique({ where: { mediaId: root?.mediaId } })
      .media();
  },
};
