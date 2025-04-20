import { Plus, Search } from 'lucide-react';

import { Button } from 'src/components/ui/button';
import { Card } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';

const EmptyCustomMedia = () => {
  return (
    <div className="flex flex-col space-y-6">
      <Card className="border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input placeholder="Search media by title..." className="pl-9" />
        </div>
      </Card>

      {/* TODO: don't forget to add custom media functionality here too */}
      <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
        <p className="mb-2 text-lg font-medium">No custom media found</p>
        <p className="mb-6">Add your first custom media item to get started.</p>
        <Button className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 text-white dark:text-neutral-900">
          <Plus className="mr-1 h-4 w-4" />
          Add Custom Media
        </Button>
      </div>
    </div>
  );
};

export default EmptyCustomMedia;
