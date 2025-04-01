import { Book, Menu } from 'lucide-react';

import { Link, routes } from '@redwoodjs/router';

import { Button } from '../ui/button';

import MobileMenu from './MobileMenu';
import SearchMedia from './SearchMedia';

const Header = () => {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={routes.home()} className="flex items-center gap-2">
            <Book className="text-brand-600 h-6 w-6" />
            <span className="hidden text-xl font-semibold sm:inline-block">
              FluencyTrail
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to={routes.home()}
              className="text-brand-600 hover:text-brand-800 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to={routes.home()}
              className="hover:text-brand-600 text-sm font-medium text-neutral-600 transition-colors"
            >
              Lessons
            </Link>
            <Link
              to={routes.home()}
              className="hover:text-brand-600 text-sm font-medium text-neutral-600 transition-colors"
            >
              Practice
            </Link>
            <Link
              to={routes.home()}
              className="hover:text-brand-600 text-sm font-medium text-neutral-600 transition-colors"
            >
              Progress
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SearchMedia />
          {/* <DarkModeToggle /> */}

          {/* {user ? (
            // if user is logged in
            <UserDropdown />
          ) : (
            // if user is NOT logged in
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="outline" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="brand" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )} */}

          <div className="md:hidden">
            <MobileMenu
              trigger={
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
