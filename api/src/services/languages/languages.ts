import type { QueryResolvers } from 'types/graphql';

import { db } from 'src/lib/db';

export const languages: QueryResolvers['languages'] = () => {
  return db.language.findMany({
    orderBy: { name: 'asc' },
  });
};
