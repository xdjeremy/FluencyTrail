import type {
  Media as PrismaMedia,
  CustomMedia as PrismaCustomMedia,
  User as PrismaUser,
} from '@prisma/client';

type User = PrismaUser;

declare global {
  type CustomMedia = PrismaCustomMedia & {
    media: PrismaMedia;
    user: User;
  };

  interface QueryResolvers {
    customMedias(args: unknown): Promise<CustomMedia[]>;
    customMedia(args: { id: string }): Promise<CustomMedia | null>;
    myCustomMedias(args: { query?: string }): Promise<CustomMedia[]>;
  }

  interface MutationResolvers {
    createCustomMedia(args: {
      input: CreateCustomMediaInput;
    }): Promise<CustomMedia>;
    updateCustomMedia(args: {
      id: string;
      input: UpdateCustomMediaInput;
    }): Promise<CustomMedia>;
    deleteCustomMedia(args: { id: string }): Promise<CustomMedia>;
  }

  interface CustomMediaResolvers {
    media: (args: unknown, obj: { root: CustomMedia }) => Promise<PrismaMedia>;
    user: (args: unknown, obj: { root: CustomMedia }) => Promise<User>;
  }

  interface CreateCustomMediaInput {
    mediaId: string;
    metadata: Record<string, unknown>;
  }

  interface UpdateCustomMediaInput {
    metadata?: Record<string, unknown>;
  }
}
