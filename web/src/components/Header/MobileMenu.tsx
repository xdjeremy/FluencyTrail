import React, { FC } from 'react';

import { Book } from 'lucide-react';

import { Link, routes } from '@redwoodjs/router';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface MobileMenuProps {
  trigger: React.ReactNode;
}

const MobileMenu: FC<MobileMenuProps> = ({ trigger }) => {
  const isLoggedIn = false;
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-background flex h-screen w-screen flex-col items-center justify-center rounded-none border-none p-0 sm:max-w-none">
        <DialogTitle className="sr-only">Main menu</DialogTitle>
        <DialogDescription className="sr-only">
          Use the links below to navigate the site
        </DialogDescription>
        <div className="mb-8 flex items-center justify-center">
          <Book className="text-brand-600 mr-2 h-8 w-8" />
          <span className="text-2xl font-semibold">FluencyTrail</span>
        </div>

        <nav className="flex flex-col items-center gap-8">
          {isLoggedIn ? (
            <>
              <Link
                to={routes.home()}
                className="text-brand-600 hover:text-brand-700 text-xl font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to={routes.home()}
                className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
              >
                Lessons
              </Link>
              <Link
                to={routes.home()}
                className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
              >
                Practice
              </Link>
              <Link
                to={routes.home()}
                className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
              >
                Progress
              </Link>
              <Link
                to={routes.home()}
                className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to={routes.home()}
                className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
              >
                Features
              </Link>
              <Link
                to={routes.home()}
                className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
              >
                Languages
              </Link>
              <Link
                to={routes.home()}
                className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                to={routes.home()}
                className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
              >
                About
              </Link>
            </>
          )}
        </nav>

        <div className="mt-12 flex flex-col items-center gap-4">
          {isLoggedIn ? (
            <Button className="bg-brand-600 hover:bg-brand-700 w-64 py-6 text-white">
              Continue Learning
            </Button>
          ) : (
            <>
              <Button
                className="bg-brand-600 hover:bg-brand-700 w-64 py-6 text-white"
                asChild
              >
                <Link to={routes.home()}>Sign up</Link>
              </Button>
              <Button
                variant="outline"
                className="w-64 border-neutral-200 py-6 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                asChild
              >
                <Link to={routes.home()}>Log in</Link>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileMenu;
