const mockMovieResponse = {
  id: 1234,
  title: 'John Wick',
  original_title: 'John Wick',
  overview: 'An ex-hitman comes out of retirement...',
  poster_path: '/path/to/poster.jpg',
  backdrop_path: '/path/to/backdrop.jpg',
  popularity: 100,
  release_date: '2014-10-24',
  adult: false,
  original_language: 'en',
  genres: [{ name: 'Action' }, { name: 'Thriller' }],
  runtime: 120,
};

const mockTvResponse = {
  id: 91011,
  name: 'Stranger Things',
  original_name: 'Stranger Things',
  overview: 'When a young boy disappears...',
  poster_path: '/path/to/poster.jpg',
  backdrop_path: '/path/to/backdrop.jpg',
  popularity: 100,
  first_air_date: '2016-07-15',
  adult: false,
  original_language: 'en',
  genres: [{ name: 'Drama' }, { name: 'Horror' }],
  origin_country: ['US'],
};

export default class TheMovieDb {
  async getMovie({ movieId }) {
    if (movieId === 5678) {
      return {
        ...mockMovieResponse,
        id: movieId,
        title: 'Inception',
        original_title: 'Inception',
        overview: 'A thief who steals corporate secrets...',
        genres: [{ name: 'Sci-Fi' }, { name: 'Action' }],
        runtime: 148,
      };
    }
    return mockMovieResponse;
  }

  async getTv({ tvId }) {
    if (tvId === 1213) {
      return {
        ...mockTvResponse,
        id: tvId,
        name: 'Breaking Bad',
        original_name: 'Breaking Bad',
        overview: 'A high school chemistry teacher...',
        genres: [{ name: 'Drama' }, { name: 'Crime' }],
        first_air_date: '2008-01-20',
      };
    }
    return mockTvResponse;
  }

  async searchMulti() {
    return {
      page: 1,
      results: [mockMovieResponse, mockTvResponse],
      total_pages: 1,
      total_results: 2,
    };
  }
}
