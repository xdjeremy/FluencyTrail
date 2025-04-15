export interface TmdbSearchMultiResponse {
  page: number;
  results: TmdbMultiSearchResult[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  release_date?: string;
  first_air_date?: string;
}

export interface TmdbSearchMovieResponse {
  page: number;
  results: TmdbMovieResult[];
  total_pages: number;
  total_results: number;
}

export interface TmdbSearchTvResponse {
  page: number;
  results: TmdbTvResult[];
  total_pages: number;
  total_results: number;
}

interface TmdbMovieResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  release_date: string;
  media_type: 'movie';
}

interface TmdbTvResult {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  first_air_date: string;
  media_type: 'tv';
}

export interface TmdbMovieDetails extends TmdbMovieResult {
  // Additional movie details fields would go here
}

export interface TmdbTvDetails extends TmdbTvResult {
  // Additional TV details fields would go here
}
