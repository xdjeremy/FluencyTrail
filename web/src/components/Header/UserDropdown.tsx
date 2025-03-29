import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/avatar";
import { Button } from "@/src/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

const UserDropdown = () => {
  return (
    <div
      className="hidden md:flex items-center gap-2"
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
                className="w-10 h-10"
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
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
