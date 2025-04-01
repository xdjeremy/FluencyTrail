import type { QueryResolvers, MediaRelationResolvers } from 'types/graphql';

import { db } from 'src/lib/db';
import TheMovieDb from './themoviedb';
import { TmdbSearchMultiResponse } from './themoviedb/interfaces';
import { mapSearchResults, ServiceMedia } from 'src/lib/api/mapresult';

export const medias: QueryResolvers['medias'] = () => {
  return db.media.findMany();
};

export const searchMedias: QueryResolvers['searchMedias'] = async ({
  query,
}) => {
  let results: TmdbSearchMultiResponse;

  const tmdb = new TheMovieDb();

  results = await tmdb.searchMulti({
    query,
    page: Number(1),
    // language: (req.query.language as string) ?? req.locale,
  });

  // const media = await Media.getRelatedMedia(
  //   results.results.map(result => result.id)
  // );
  console.log(mapSearchResults(results.results));
  return mapSearchResults(results.results);
  // return res.status(200).json({
  //   page: results.page,
  //   totalPages: results.total_pages,
  //   totalResults: results.total_results,
  //   results: mapSearchResults(results.results, media),
  // });
};

export const Media: MediaRelationResolvers = {
  MovieMetadata: (_obj, { root }) => {
    return db.media.findUnique({ where: { id: root?.id } }).MovieMetadata();
  },
};
