import { Book, Menu } from 'lucide-react';

import { Link, routes } from '@redwoodjs/router';

import { useAuth } from 'src/auth';

import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

import MobileMenu from './MobileMenu';
import SearchBox from './Search/SearchBox';
import { SearchNavigationProvider } from './Search/useSearchNavigation';
import UserDropdown from './UserDropdown';

const Header = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <SearchNavigationProvider>
      <header className="bg-background sticky top-0 z-50 w-full border-b px-4">
        <div className="container mx-auto flex h-16 items-center justify-between px-20">
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
            <SearchBox />
            <DarkModeToggle />

            {/*
                Initially the page load as "isAuthenticated" = false
                We have to show a loading skeleton while the useAuth hook
                is still running
             */}
            {isAuthenticated ? (
              // if user is logged in
              <UserDropdown />
            ) : (
              // if user is NOT logged in
              <div className="hidden items-center gap-2 md:flex">
                {loading ? (
                  <Skeleton
                    className="h-10 w-10 rounded-full"
                    data-testid="user-header-profile-icon"
                  />
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to={routes.login()}>Log in</Link>
                    </Button>
                    <Button variant="brand" asChild>
                      <Link to={routes.signup()}>Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            )}

            <div className="md:hidden">
              {/* TODO: implement here as well */}
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
    </SearchNavigationProvider>
  );
};

export default Header;
