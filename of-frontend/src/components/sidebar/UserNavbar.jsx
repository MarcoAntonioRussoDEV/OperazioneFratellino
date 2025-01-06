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
  capitalize,
  usernameInitials,
  useTranslateAndCapitalize,
} from '@/utils/formatUtils';
import { useNavigate } from 'react-router-dom';
import ConditionalRender from '../ConditionalRender';
import { DashboardIcon } from '@radix-ui/react-icons';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import { Badge } from '../ui/badge';
import iconToast, { STATUS_ENUM } from '@/utils/toastUtils';
import { useToast } from '@/hooks/use-toast';

const UserNavbar = () => {
  const { isMobile } = useSidebar();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [avatarFallback, setAvatarFallback] = useState('');
  const { isOpen: isSidebarOpen } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tc = useTranslateAndCapitalize();
  const { toast, dismiss } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAuthUser());
      setAvatarFallback(usernameInitials(user.name));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    if (isAuthenticated) {
      dispatch(logoutUser());
    }
    // dispatch(resetStatus());
    // localStorage.setItem('isAuthenticated', false);
  };

  const goToLoginPage = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (user?.isFirstAccess && window.location.pathname != 'login') {
      navigate(`/user/${user.email}`);
    }
  }, [user, navigate]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* <p
            className={`ps-2 pb-1 text-xs w-12 text-start opacity-100 rounded-b-lg ${
              isSidebarOpen && 'group-hover:opacity-80 duration-300'
            }`}
          >
            {user.role}
          </p> */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative group p-0 m-0">
                <Avatar
                  className={`${
                    isSidebarOpen ? 'h-12 w-12' : 'h-8 w-8'
                  } rounded-lg duration-150`}
                >
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <ConditionalRender
                    condition={isAuthenticated}
                    trueComponent={
                      <AvatarFallback className="rounded-lg text-foreground">
                        {avatarFallback}
                      </AvatarFallback>
                    }
                    falseComponent={<UserRound />}
                  />
                </Avatar>
                {/* <span
                  className={`truncate text-xs absolute bottom-0 start-0 w-12 text-center bg-secondary opacity-0 rounded-b-lg ${
                    isSidebarOpen && 'group-hover:opacity-80 duration-300'
                  }`}
                >
                  {user.role}
                </span> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold ">
                  {capitalize(user.name)}
                </span>
                <div className="group relative mb-4">
                  <p className="truncate text-xs top-1/2 absolute group-hover:translate-y-10 duration-150 max-w-[8.8rem]">
                    {user.email}
                  </p>
                  <p className="truncate text-xs top-1/2 absolute translate-y-10 group-hover:block group-hover:translate-y-0 duration-150 italic">
                    {user.role}
                  </p>
                </div>
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
                  <span className="truncate font-semibold">
                    {capitalize(user.name)}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <UserCog />
                {tc('settings')}
              </DropdownMenuItem>
              {hasAccess(user.role, USER_ROLES.ADMIN) && (
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <DashboardIcon />
                  {tc('dashboard')}
                </DropdownMenuItem>
              )}
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
