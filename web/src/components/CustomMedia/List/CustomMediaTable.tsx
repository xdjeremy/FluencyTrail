import { useEffect, useState } from 'react';

import { Search } from 'lucide-react';
import { GetAllCustomMediasQuery } from 'types/graphql';

import { Card } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';

import CustomMediaList from './CustomMediaList';

const CustomMediaTable = ({ customMedia }: GetAllCustomMediasQuery) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(customMedia);

  // Apply search filter when query or media items change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(customMedia);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = customMedia.filter(item =>
      item.title.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  }, [customMedia, searchQuery]);

  return (
    <div className="flex flex-col space-y-6">
      <Card className="border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Search media by title..."
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>
      <CustomMediaList mediaItems={filteredItems} />
    </div>
  );
};

export default CustomMediaTable;
