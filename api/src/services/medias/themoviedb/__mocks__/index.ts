class TheMovieDb {
  async getMovie({ movieId }: { movieId: number }) {
    // Mock response for Inception (ID: 5678)
    if (movieId === 5678) {
      return {
        id: 5678,
        title: 'Inception',
        name: undefined, // Movie specific
        type: 'MOVIE',
        adult: false,
        original_language: 'en',
        genres: [
          { id: 878, name: 'Sci-Fi' },
          { id: 28, name: 'Action' },
        ],
        runtime: 148,
        overview: 'A mind-bending thriller',
        popularity: 100,
        release_date: '2010-07-16',
        poster_path: '/inception-poster.jpg',
        backdrop_path: '/inception-backdrop.jpg',
      };
    }
    throw new Error('Movie not found');
  }

  async getTv({ tvId }: { tvId: number }) {
    // Mock response for Breaking Bad (ID: 1213)
    if (tvId === 1213) {
      return {
        id: 1213,
        name: 'Breaking Bad',
        title: undefined, // TV specific
        type: 'TV',
        adult: false,
        original_language: 'en',
        genres: [
          { id: 18, name: 'Drama' },
          { id: 80, name: 'Crime' },
        ],
        first_air_date: '2008-01-20',
        last_air_date: '2013-09-29',
        number_of_seasons: 5,
        number_of_episodes: 62,
        status: 'Ended',
        origin_country: ['US'],
        overview: 'A high school chemistry teacher turned meth kingpin',
        popularity: 100,
        poster_path: '/breaking-bad-poster.jpg',
        backdrop_path: '/breaking-bad-backdrop.jpg',
      };
    }
    throw new Error('TV show not found');
  }

  async searchMulti() {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

export default TheMovieDb;
