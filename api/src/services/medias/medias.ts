import type {
  MediaRelationResolvers,
  QueryResolvers,
  SearchResultItem,
} from 'types/graphql';

import { context } from '@redwoodjs/graphql-server'; // Import context

import { mapSearchResults } from 'src/lib/api/mapresult'; // Removed ServiceMedia import
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

// New unified search function
export const searchMyContent: QueryResolvers['searchMyContent'] = async ({
  query,
}): Promise<SearchResultItem[]> => {
  const userId = context.currentUser?.id;
  if (!userId) {
    // Should be caught by @requireAuth, but good practice
    throw new Error('User must be logged in to search their content');
  }

  // 1. Fetch Standard Media (reuse existing logic)
  const tmdb = new TheMovieDb();
  const standardResultsRaw: TmdbSearchMultiResponse = await tmdb.searchMulti({
    query,
    page: 1,
  });
  const standardResultsMapped = mapSearchResults(standardResultsRaw.results);

  // Map standard results to SearchResultItem
  const standardSearchResults: SearchResultItem[] = standardResultsMapped.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (media: any) => ({
      // Use 'any' type annotation as workaround, disable ESLint rule
      id: media.id,
      title: media.title,
      slug: media.slug,
      mediaType: media.mediaType, // Already MOVIE or TV
      posterUrl: media.posterUrl,
      releaseDate: media.releaseDate,
    })
  );

  // 2. Fetch User's Custom Media
  const customMediaResults = await db.customMedia.findMany({
    where: {
      userId,
      // Search within the 'title' property of the JSON metadata
      metadata: {
        path: ['title'],
        string_contains: query,
        // mode: 'insensitive', // Prisma JSON filter doesn't support mode here
      },
    },
    // No include needed as we map manually
  });

  // Map custom media results to SearchResultItem
  const customSearchResults: SearchResultItem[] = customMediaResults.map(cm => {
    // Safely extract title from JSON metadata
    let title = 'Custom Media'; // Default title
    if (
      typeof cm.metadata === 'object' &&
      cm.metadata !== null &&
      'title' in cm.metadata &&
      typeof cm.metadata.title === 'string'
    ) {
      title = cm.metadata.title;
    }

    // Extract other potential fields if they exist in metadata (optional)
    const posterUrl =
      typeof cm.metadata === 'object' &&
      cm.metadata !== null &&
      'posterUrl' in cm.metadata &&
      typeof cm.metadata.posterUrl === 'string'
        ? cm.metadata.posterUrl
        : null;
    const releaseDateStr =
      typeof cm.metadata === 'object' &&
      cm.metadata !== null &&
      'releaseDate' in cm.metadata &&
      typeof cm.metadata.releaseDate === 'string'
        ? cm.metadata.releaseDate
        : null;
    const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;

    return {
      id: cm.id, // Use CustomMedia ID as the primary ID here
      title,
      slug: cm.id, // Use CustomMedia ID as slug for routing/identification
      mediaType: 'CUSTOM', // Explicitly set type
      posterUrl,
      releaseDate:
        releaseDate instanceof Date && !isNaN(releaseDate.getTime())
          ? releaseDate
          : null,
    };
  });

  // 3. Combine and Return
  // Consider sorting or prioritizing results if needed
  return [...standardSearchResults, ...customSearchResults];
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
