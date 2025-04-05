import { ArrowLeft } from 'lucide-react';

import { Link, routes } from '@redwoodjs/router';

import DarkModeToggle from 'src/components/DarkModeToggle/DarkModeToggle';
import { Button } from 'src/components/ui/button';

type AuthLayoutProps = {
  children?: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  // TODO: add auth check and remove auth check from the routes under this layout

  return (
    <div className="min-h-screen p-4">
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between">
          <Button variant={'ghost'} size={'icon'} asChild>
            <Link to={routes.home()} className="text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <DarkModeToggle />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
