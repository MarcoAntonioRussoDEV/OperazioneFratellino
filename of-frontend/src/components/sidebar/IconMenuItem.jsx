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
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { Link } from 'react-router-dom';
import { icons } from '@/config/links/linksMenu';
import { capitalize, useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { useSelector } from 'react-redux';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@radix-ui/react-context-menu';

const IconMenuItem = ({
  name,
  path,
  icon,
  subPath,
  providedImage = 'react-icon',
  gender,
}) => {
  const IconComponent = icons[icon];
  const tc = useTranslateAndCapitalize();
  const { isOpen: sidebarIsOpen } = useSelector((state) => state.sidebar);
  if (!subPath || !sidebarIsOpen) {
    //TODO
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
            {Object.entries(subPath).map(([name, { path, icon, gender }]) => {
              const SubIconComponent = icons[icon];
              return (
                <SidebarMenuSub key={path}>
                  <Link to={path}>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <SubIconComponent />
                        {tc(name, gender)}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </Link>
                </SidebarMenuSub>
              );
            })}
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }
};

export default IconMenuItem;

/* 

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
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { Link } from 'react-router-dom';
import { icons } from '@/utils/linksMenu';
import { capitalize } from '@/utils/stringUtils';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { useSelector } from 'react-redux';

const IconMenuItem = ({
  name,
  path,
  icon,
  subPath,
  providedImage = 'react-icon',
}) => {
  const IconComponent = icons[icon];
  const { t } = useTranslation();
  const { isOpen: sidebarIsOpen } = useSelector((state) => state.sidebar);

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
            <span>{capitalize(t(name))}</span>
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
              <span>{capitalize(t(name))}</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {Object.entries(subPath).map(([name, { path, icon, gender }]) => {
              const SubIconComponent = icons[icon];
              return (
                <SidebarMenuSub key={path}>
                  <Link to={path}>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <SubIconComponent />
                        {capitalize(t(name, { context: gender }))}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </Link>
                </SidebarMenuSub>
              );
            })}
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }
};

export default IconMenuItem;

/* 

  return (
    <Collapsible>
      <SidebarMenuItem>
        <Link to={path}>
        <SidebarGroupLabel className="w-100">
          <CollapsibleTrigger>
            <SidebarMenuButton>
              {providedImage === 'react-icon' ? (
                <IconComponent />
              ) : (
                <img src={icon} alt="" className="w-7 h-auto" />
              )}
              <span>{capitalize(t(name))}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        </Link>
      </SidebarMenuItem>
    </Collapsible>
  );
*/
