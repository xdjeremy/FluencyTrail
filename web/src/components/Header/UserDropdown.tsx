import { LogOut } from 'lucide-react';

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
  const { logOut } = useAuth();

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
              <AvatarImage
                src="https://placehold.co/600x400"
                className="h-10 w-10"
              />
              <AvatarFallback className="bg-brand-100 text-brand-800 dark:bg-brand-800 dark:text-brand-200">
                AJ
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              {/* <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link> */}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {/* <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link> */}
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
