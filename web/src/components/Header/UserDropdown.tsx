import initials from 'initials';
import { LogOut, Popcorn, Settings } from 'lucide-react';

import { Link, routes } from '@redwoodjs/router';

import { useAuth } from 'src/auth';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const UserDropdown = () => {
  const { logOut, currentUser } = useAuth();

  return (
    <div
      className="hidden items-center gap-2 md:flex"
      data-testid="user-dropdown"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full"
            data-testid="user-header-profile-icon"
          >
            <Avatar>
              <AvatarImage src="" className="h-10 w-10" />
              <AvatarFallback className="bg-brand-100 text-brand-800 dark:bg-brand-800 dark:text-brand-200">
                {initials(currentUser?.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to={routes.customMedia()} className="cursor-pointer">
                <Popcorn className="mr-2 h-4 w-4" />
                <span>Custom Media</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={routes.accountSettings()} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logOut}
            className="cursor-pointer text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
