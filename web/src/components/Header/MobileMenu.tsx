import React, { FC, useState } from 'react';

import { Book } from 'lucide-react';

import { Link, NavLink, routes } from '@redwoodjs/router';

import { useAuth } from 'src/auth';

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
  const { isAuthenticated, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <NavLink
            to={routes.home()}
            className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
            activeClassName="text-brand-600 hover:text-brand-700 text-xl font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to={routes.activity()}
            className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
            activeClassName="text-brand-600 hover:text-brand-700 text-xl font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Lessons
          </NavLink>
          <Link
            to={routes.home()}
            className="hover:text-brand-600 text-xl font-medium text-neutral-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            My Profile
          </Link>
        </nav>

        <div className="mt-12 flex flex-col items-center gap-4">
          {isAuthenticated ? (
            <Button onClick={logOut} variant="outline" className="w-64">
              Logout
            </Button>
          ) : (
            <>
              <Button
                className="bg-brand-600 hover:bg-brand-700 w-64 py-6 text-white"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link to={routes.signup()} onClick={() => setIsOpen(false)}>
                  Sign up
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-64 border-neutral-200 py-6 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link to={routes.login()} onClick={() => setIsOpen(false)}>
                  Log in
                </Link>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileMenu;
