import type { MediaRelationResolvers, QueryResolvers } from 'types/graphql';

import { mapSearchResults } from 'src/lib/api/mapresult';
import { db } from 'src/lib/db';

import MediaManager from './mediamanager';
import TheMovieDb from './themoviedb';
import { TmdbSearchMultiResponse } from './themoviedb/interfaces';

export const media: QueryResolvers['media'] = async ({ slug }) => {
  const mediaManager = new MediaManager();
  return mediaManager.getMediaBySlug(slug);
};

export const medias: QueryResolvers['medias'] = async ({ query }) => {
  const tmdb = new TheMovieDb();

  const results: TmdbSearchMultiResponse = await tmdb.searchMulti({
    query,
    page: Number(1),
    // language: (req.query.language as string) ?? req.locale,
  });

  return mapSearchResults(results.results);
};

export const similarMedias: QueryResolvers['similarMedias'] = async ({
  slug,
}) => {
  const tmdb = new TheMovieDb();
  const mediaManager = new MediaManager();
  const { mediaType, tmdbId } = mediaManager.extractFromSlug(slug);

  const similarMedias = await tmdb.getSimilarMedias({
    mediaId: tmdbId,
    mediaType,
  });

  return mapSearchResults(similarMedias.results);
};

export const Media: MediaRelationResolvers = {
  MovieMetadata: (_obj, { root }) => {
    return db.media.findUnique({ where: { id: root?.id } }).MovieMetadata();
  },
  TvMetadata: (_obj, { root }) => {
    // Added TvMetadata resolver
    return db.media.findUnique({ where: { id: root?.id } }).TvMetadata();
  },
};
