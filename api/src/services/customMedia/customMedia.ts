import type { Prisma } from '@prisma/client';

interface CustomMedia {
  id: string;
  mediaId: string;
  userId: number;
  metadata: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
  media: {
    id: string;
    title: string;
    slug: string;
    mediaType: string;
    externalId: string;
  };
  user: { id: number; email: string };
}

interface QueryResolvers {
  customMedias(): Promise<CustomMedia[]>;
  customMedia(args: { id: string }): Promise<CustomMedia | null>;
  myCustomMedias(args: { query?: string }): Promise<CustomMedia[]>;
}

interface MutationResolvers {
  createCustomMedia(args: {
    input: { mediaId: string; metadata: Prisma.JsonValue };
  }): Promise<CustomMedia>;
  updateCustomMedia(args: {
    id: string;
    input: { metadata?: Prisma.JsonValue };
  }): Promise<CustomMedia>;
  deleteCustomMedia(args: { id: string }): Promise<CustomMedia>;
}

interface CustomMediaResolvers {
  media: (
    args: unknown,
    obj: { root: { id: string } }
  ) => Promise<{
    id: string;
    title: string;
    slug: string;
    mediaType: string;
    externalId: string;
  }>;
  user: (
    args: unknown,
    obj: { root: { id: string } }
  ) => Promise<{ id: number; email: string }>;
}

import { context } from '@redwoodjs/graphql-server';

import { db } from 'src/lib/db';

export const customMedias: QueryResolvers['customMedias'] = async () => {
  return db.customMedia.findMany({
    include: {
      media: {
        select: {
          id: true,
          title: true,
          slug: true,
          mediaType: true,
          externalId: true,
        },
      },
      user: { select: { id: true, email: true } },
    },
  });
};

export const customMedia: QueryResolvers['customMedia'] = async ({ id }) => {
  return db.customMedia.findUnique({
    where: { id },
    include: {
      media: {
        select: {
          id: true,
          title: true,
          slug: true,
          mediaType: true,
          externalId: true,
        },
      },
      user: { select: { id: true, email: true } },
    },
  });
};

export const myCustomMedias: QueryResolvers['myCustomMedias'] = async ({
  query,
}) => {
  const where: {
    userId: number;
    metadata?: { path: string[]; string_contains: string };
  } = { userId: context.currentUser?.id as number };

  if (query) {
    where.metadata = { path: ['title'], string_contains: query };
  }
  return db.customMedia.findMany({
    where,
    include: {
      media: {
        select: {
          id: true,
          title: true,
          slug: true,
          mediaType: true,
          externalId: true,
        },
      },
      user: { select: { id: true, email: true } },
    },
  });
};

export const createCustomMedia: MutationResolvers['createCustomMedia'] =
  async ({ input }) => {
    return db.$transaction(async tx => {
      // Extract title from metadata
      const title =
        typeof input.metadata === 'object' &&
        input.metadata !== null &&
        'title' in input.metadata
          ? String(input.metadata.title)
          : 'Custom Media';

      // First create the Media record
      const media = await tx.media.create({
        data: {
          id: input.mediaId,
          title,
          mediaType: 'BOOK', // Use BOOK type for custom media
          slug: input.mediaId,
          externalId: input.mediaId,
          releaseDate: new Date(), // Use current date for custom media
          posterUrl: null,
          backdropUrl: null,
          originalTitle: title,
        },
      });

      // Create the CustomMedia record with proper metadata type
      const customMedia = await tx.customMedia.create({
        data: {
          mediaId: media.id,
          userId: context.currentUser?.id,
          metadata: typeof input.metadata === 'object' ? input.metadata : {},
        },
        include: {
          media: {
            select: {
              id: true,
              title: true,
              slug: true,
              mediaType: true,
              externalId: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return customMedia;
    });
  };

export const updateCustomMedia: MutationResolvers['updateCustomMedia'] =
  async ({ id, input }) => {
    return db.customMedia.update({
      data: input,
      where: { id },
      include: {
        media: {
          select: {
            id: true,
            title: true,
            slug: true,
            mediaType: true,
            externalId: true,
          },
        },
        user: { select: { id: true, email: true } },
      },
    });
  };

export const deleteCustomMedia: MutationResolvers['deleteCustomMedia'] =
  async ({ id }) => {
    return db.customMedia.delete({
      where: { id },
      include: {
        media: {
          select: {
            id: true,
            title: true,
            slug: true,
            mediaType: true,
            externalId: true,
          },
        },
        user: { select: { id: true, email: true } },
      },
    });
  };

export const CustomMedia: CustomMediaResolvers = {
  media: (_obj, { root }) =>
    db.customMedia
      .findUnique({
        where: { id: root.id },
        include: {
          media: {
            select: {
              id: true,
              title: true,
              slug: true,
              mediaType: true,
              externalId: true,
            },
          },
        },
      })
      .then(c => c?.media),
  user: (_obj, { root }) =>
    db.customMedia
      .findUnique({
        where: { id: root.id },
        include: { user: { select: { id: true, email: true } } },
      })
      .then(c => c?.user),
};
