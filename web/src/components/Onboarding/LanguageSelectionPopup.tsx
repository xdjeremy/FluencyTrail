import { useState } from 'react';

import { Check, Search } from 'lucide-react';
import { FetchLanguagesForOnboarding } from 'types/graphql';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

import '../../../../node_modules/flag-icons/css/flag-icons.min.css';

interface LanguageSelectionPopupProps {
  data: FetchLanguagesForOnboarding;
}

const LanguageSelectionPopup = ({ data }: LanguageSelectionPopupProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // temp
  const [isOpen, _setIsOpen] = useState(true);
  const onClose = () => {};

  // Filter languages based on search query
  const filteredLanguages = searchQuery
    ? data.languages.filter(
        lang => lang.name.toLowerCase().includes(searchQuery.toLowerCase())
        // TODO: implement nativeName search
        //  ||
        //   lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data.languages;

  // Handle language selection
  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedLanguage) return;

    setIsSubmitting(true);

    // Simulate progress for better UX
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    try {
      // await onLanguageSelect(selectedLanguage);

      // Ensure progress completes before closing
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);

        // Small delay before closing to show completion
        setTimeout(() => {
          onClose();
          // Redirect to dashboard after selection
          // router.push('/dashboard');
        }, 500);
      }, 1000);
    } catch (error) {
      console.error('Error saving language preference:', error);
      clearInterval(interval);
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to FluencyTrail!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Let&apos;s personalize your language learning journey. What language
            would you like to learn?
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Search languages..."
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid max-h-[40vh] grid-cols-2 gap-3 overflow-y-auto py-2 pr-1 sm:grid-cols-3">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map(language => (
              <button
                key={language.code}
                className={`flex items-center rounded-lg border p-3 transition-all ${
                  selectedLanguage === language.code
                    ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-950/30'
                    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700'
                }`}
                onClick={() => handleLanguageSelect(language.code)}
                disabled={isSubmitting}
              >
                <div className="flex w-full items-center gap-3">
                  <span className={`fi fi-${language.code}`}></span>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">{language.name}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {language.nativeName}
                    </span>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="text-brand-600 dark:text-brand-400 ml-auto h-4 w-4" />
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-neutral-500 dark:text-neutral-400">
              No languages found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {isSubmitting && (
          <div className="my-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setting up your language profile...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Badge
              variant="outline"
              className="bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-800"
            >
              Tip
            </Badge>
            Why this matters
          </h4>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Selecting your target language helps us personalize your learning
            experience. Don&apos;t worry, you can always change this later or
            add more languages from your profile settings.
          </p>
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row">
          {!isSubmitting && (
            <Button
              variant="outline"
              onClick={onClose}
              className="order-2 sm:order-1"
            >
              I&apos;ll do this later
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!selectedLanguage || isSubmitting}
            className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 order-1 text-white sm:order-2 dark:text-neutral-900"
          >
            {isSubmitting ? 'Setting up...' : 'Start Learning'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionPopup;
