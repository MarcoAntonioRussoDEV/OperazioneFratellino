import React from 'react';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { Link } from 'react-router-dom';
import { icons } from '@/config/links/linksMenu';
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { useSelector } from 'react-redux';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@radix-ui/react-context-menu';
import { hasAccess } from '@/utils/authService';
import { Badge } from '../ui/badge';
import { preordersMenu } from '@/config/links/linksMenu';

const IconMenuItem = ({
  name,
  path,
  icon,
  subPath,
  providedImage = 'react-icon',
  gender,
  userRole,
}) => {
  const IconComponent = icons[icon];
  const tc = useTranslateAndCapitalize();
  const { isOpen: sidebarIsOpen } = useSelector((state) => state.sidebar);

  const badgeValues = useSelector((state) => {
    if (subPath) {
      return Object.fromEntries(
        Object.entries(subPath).map(([name, { badge }]) => [
          name,
          badge ? state[badge.store]?.[badge.state] : null,
        ]),
      );
    }
  });

  if (!subPath || !sidebarIsOpen) {
    return (
      <Link to={path}>
        <SidebarMenuItem>
          <SidebarMenuButton>
            {providedImage === 'react-icon' ? (
              <IconComponent />
            ) : (
              <img src={icon} alt="" className="w-7 h-auto" />
            )}
            <span>{tc(name, gender)}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </Link>
    );
  } else {
    return (
      <Collapsible
        defaultOpen={location.pathname.split('/').some((el) => el == name)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              {providedImage === 'react-icon' ? (
                <IconComponent />
              ) : (
                <img src={icon} alt="" className="w-7 h-auto" />
              )}
              <span>{tc(name, gender)}</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {Object.entries(subPath).map(
              ([name, { path, icon, gender, requiredRole, badge }]) => {
                if (hasAccess(userRole, requiredRole)) {
                  const SubIconComponent = icons[icon];
                  return (
                    <SidebarMenuSub key={path}>
                      <Link to={path}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            <SubIconComponent />
                            {tc(name, gender)}
                            <SidebarMenuBadge>
                              {badgeValues[name] !== 0 &&
                                badgeValues[name] !== null && (
                                  <Badge
                                    className={'pt-0'}
                                    variant={'destructive'}
                                  >
                                    {badgeValues[name]}
                                  </Badge>
                                )}
                            </SidebarMenuBadge>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </Link>
                    </SidebarMenuSub>
                  );
                }
              },
            )}
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }
};

export default IconMenuItem;
