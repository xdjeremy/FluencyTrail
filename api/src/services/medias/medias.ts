import type { MediaRelationResolvers, QueryResolvers } from 'types/graphql';

import { db } from 'src/lib/db';

import MediaManager from './mediamanager';
import TheMovieDb from './themoviedb';

// For testing purposes, we'll allow injecting the TMDB client
let tmdbClient: TheMovieDb;
let mediaManager: MediaManager;

const getMediaManager = () => {
  if (!mediaManager) {
    // Create singleton instances if they don't exist
    tmdbClient = new TheMovieDb();
    mediaManager = new MediaManager(tmdbClient);
  }
  return mediaManager;
};

// For testing - allows us to inject mocked instances
export const setMediaManager = (manager: MediaManager) => {
  mediaManager = manager;
};

export const media: QueryResolvers['media'] = async ({ slug: _slug }) => {
  // TODO: Implement media resolver
  return null;
};

export const similarMedias: QueryResolvers['similarMedias'] = async ({
  slug: _slug,
}) => {
  // TODO: Implement similarMedias
  return [];
};

export const searchMedias: QueryResolvers['searchMedias'] = async ({
  query,
}) => {
  const results = await getMediaManager().searchMedias(query);

  // Convert MediaResultDto[] to Media[] as expected by GraphQL
  return results.map(result => ({
    id: result.id,
    externalId: result.externalId,
    slug: result.slug,
    title: result.title,
    mediaType: result.mediaType,
    originalTitle: result.originalTitle,
    description: result.description,
    posterUrl: result.posterUrl,
    backdropUrl: result.backdropUrl,
    popularity: result.popularity,
    releaseDate: result.date, // Map date field to releaseDate
    createdAt: new Date(), // Required by GraphQL schema
    updatedAt: new Date(), // Required by GraphQL schema
  }));
};

export const MediaResolver: MediaRelationResolvers = {
  MovieMetadata: (_obj, { root }) => {
    return db.media.findUnique({ where: { id: root?.id } }).MovieMetadata();
  },
  TvMetadata: (_obj, { root }) => {
    return db.media.findUnique({ where: { id: root?.id } }).TvMetadata();
  },
};
