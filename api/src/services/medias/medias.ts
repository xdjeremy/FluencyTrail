import type { QueryResolvers, MediaRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const medias: QueryResolvers['medias'] = () => {
  return db.media.findMany()
}

export const searchMedias: QueryResolvers['searchMedias'] = ({ query }) => {
  return db.media.findMany()
}

export const Media: MediaRelationResolvers = {
  MovieMetadata: (_obj, { root }) => {
    return db.media.findUnique({ where: { id: root?.id } }).MovieMetadata()
  },
}
