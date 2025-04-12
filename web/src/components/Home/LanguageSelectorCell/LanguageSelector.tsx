import { useEffect } from 'react';

import { ChevronDown, Globe } from 'lucide-react';
import { GetUserLanguagesForLanguageSelector } from 'types/graphql';

import { Button } from 'src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';

import { useHomeContext } from '../HomeProvider';

const LanguageSelector = ({ user }: GetUserLanguagesForLanguageSelector) => {
  const { selectedLanguage, setSelectedLanguage } = useHomeContext();

  // set the selected language to the primary language if it is not already selected
  useEffect(() => {
    if (user.primaryLanguage && selectedLanguage === null) {
      setSelectedLanguage(user.primaryLanguage.id);
    }
  }, [selectedLanguage, setSelectedLanguage, user.primaryLanguage]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="text-brand-600 dark:text-brand-400 h-4 w-4" />
          {user.languages.find(lang => lang.id === selectedLanguage)?.name}
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
            onClick={() => setSelectedLanguage(language.id)}
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
