import { ChevronDown, Globe } from 'lucide-react';
import { GetUserLanguagesForLanguageSelector } from 'types/graphql';

import { Button } from 'src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';

const LanguageSelector = ({ user }: GetUserLanguagesForLanguageSelector) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="text-brand-600 dark:text-brand-400 h-4 w-4" />
          <span>English</span>
          {/* <span className="bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200 rounded-full px-1.5 py-0.5 text-xs">
            Fluent
          </span> */}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.languages.map(language => (
          <DropdownMenuItem
            key={language.id}
            className="flex w-32 cursor-pointer items-center justify-between gap-4"
            // onClick={() => handleSelect(language.code)}
          >
            <div className="flex items-center gap-2">
              <span>{language.name}</span>
              {/* <span className="bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200 rounded-full px-1.5 py-0.5 text-xs">
                {language.level}
              </span> */}
            </div>
            {/* {language.code === selected && (
              <Check className="text-brand-600 dark:text-brand-400 h-4 w-4" />
            )} */}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
