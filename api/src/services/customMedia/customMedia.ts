import { Prisma } from '@prisma/client'; // Changed from 'import type'

import { ForbiddenError } from '@redwoodjs/graphql-server';
import { context } from '@redwoodjs/graphql-server';

import { db } from 'src/lib/db';

export const customMedias: QueryResolvers['customMedias'] = async () => {
  // Ensure only the user's own custom media are returned
  return db.customMedia.findMany({
    where: { userId: context.currentUser.id },
    include: {
      media: true, // Fetch the full media object
      user: true, // Fetch the full user object
    },
  });
};

export const customMedia: QueryResolvers['customMedia'] = async ({ id }) => {
  const record = await db.customMedia.findUnique({
    where: { id },
    include: {
      media: true, // Fetch the full media object
      user: true, // Fetch the full user object
    },
  });

  // Check ownership
  if (record && record.userId !== context.currentUser.id) {
    throw new ForbiddenError("You don't have permission to access this media");
  }

  return record;
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
      media: true, // Fetch the full media object
      user: true, // Fetch the full user object
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
          // Cast metadata to Prisma's expected type
          metadata:
            typeof input.metadata === 'object'
              ? (input.metadata as Prisma.InputJsonValue)
              : Prisma.JsonNull,
        },
        include: {
          media: true, // Fetch the full media object
          user: true, // Fetch the full user object
        },
      });

      return customMedia;
    });
  };

export const updateCustomMedia: MutationResolvers['updateCustomMedia'] =
  async ({ id, input }) => {
    // Verify ownership first
    const recordToUpdate = await db.customMedia.findUnique({
      where: { id },
      select: { userId: true }, // Only need userId for check
    });

    if (!recordToUpdate) {
      // Let the standard update handle not found, or throw specific error here
      // For consistency, let the update call fail if not found
    } else if (recordToUpdate.userId !== context.currentUser.id) {
      throw new ForbiddenError(
        "You don't have permission to update this media"
      );
    }

    // Prepare data with potential metadata cast
    const data: Prisma.CustomMediaUpdateInput = {};
    if (input.metadata !== undefined) {
      data.metadata =
        typeof input.metadata === 'object'
          ? (input.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull;
    }

    return db.customMedia.update({
      data,
      where: { id },
      include: {
        media: true, // Fetch the full media object
        user: true, // Fetch the full user object
      },
    });
  };

export const deleteCustomMedia: MutationResolvers['deleteCustomMedia'] =
  async ({ id }) => {
    // Verify ownership first
    const recordToDelete = await db.customMedia.findUnique({
      where: { id },
      select: { userId: true }, // Only need userId for check
    });

    if (!recordToDelete) {
      // Let the standard delete handle not found, or throw specific error here
      // For consistency, let the delete call fail if not found
    } else if (recordToDelete.userId !== context.currentUser.id) {
      throw new ForbiddenError(
        "You don't have permission to delete this media"
      );
    }

    return db.customMedia.delete({
      where: { id },
      include: {
        media: true, // Fetch the full media object
        user: true, // Fetch the full user object
      },
    });
  };
