import type { CustomMedia } from '@prisma/client';
import type { MediaType } from 'types/graphql';

import { db } from 'src/lib/db';

import { MediaFetcher, MediaMapper, MediaResultDto } from './interfaces';

export class CustomMediaMapper implements MediaMapper<CustomMedia> {
  map(source: CustomMedia): MediaResultDto {
    return {
      id: source.id,
      externalId: source.id,
      slug: source.id, // Using ID as slug as specified
      title: source.title,
      mediaType: 'CUSTOM' as MediaType,
      date: source.createdAt, // Using createdAt as the date
    };
  }
}

export class CustomMediaFetcher implements MediaFetcher {
  private mapper: CustomMediaMapper;

  constructor() {
    this.mapper = new CustomMediaMapper();
  }

  async fetch(query: string): Promise<MediaResultDto[]> {
    try {
      const results = await db.customMedia.findMany({
        where: {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: 10, // Limit to 10 results as specified
      });

      return results.map(media => this.mapper.map(media));
    } catch (error) {
      console.error(
        `[CustomMediaFetcher] Error fetching results: ${error.message}`
      );
      return [];
    }
  }
}
