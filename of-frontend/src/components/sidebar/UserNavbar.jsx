import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogIn,
  LogOut,
  Sparkles,
  UserRound,
  UserCog,
} from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser, logoutUser, resetStatus } from '@/redux/userSlice';
import {
  usernameInitials,
  useTranslateAndCapitalize,
} from '@/utils/FormatUtils';
import { useNavigate } from 'react-router-dom';
import ConditionalRender from '../ConditionalRender';

const UserNavbar = () => {
  const { isMobile } = useSidebar();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [avatarFallback, setAvatarFallback] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tc = useTranslateAndCapitalize();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAuthUser());
      setAvatarFallback(usernameInitials(user.name));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetStatus());
    navigate('/login');
  };

  const goToLoginPage = () => {
    navigate('/login');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <ConditionalRender
                  condition={isAuthenticated}
                  trueComponent={
                    <AvatarFallback className="rounded-lg">
                      {avatarFallback}
                    </AvatarFallback>
                  }
                  falseComponent={<UserRound />}
                />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <ConditionalRender
                    condition={isAuthenticated}
                    trueComponent={
                      <AvatarFallback className="rounded-lg">
                        {avatarFallback}
                      </AvatarFallback>
                    }
                    falseComponent={<UserRound />}
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <UserCog />
                {tc('dashboard')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuSeparator />
            {isAuthenticated ? (
              <DropdownMenuItem
                onClick={handleLogout}
                className="focus:bg-destructive"
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={goToLoginPage}
                className="focus:bg-green-700"
              >
                <LogIn />
                Log In
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserNavbar;
