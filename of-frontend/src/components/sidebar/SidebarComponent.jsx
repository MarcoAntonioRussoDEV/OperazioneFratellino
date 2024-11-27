import React, { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { capitalize, useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { linksMenu, sellsMenu } from '@/config/links/linksMenu';
import IconMenuItem from './IconMenuItem';
import logo from '../../assets/Images/logo.png';
import logoColor from '../../assets/Images/logo-no-bg.png';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import UserNavbar from './UserNavbar';

const SidebarComponent = () => {
  const { t, i18n } = useTranslation();
  const tc = useTranslateAndCapitalize();
  const { isOpen: sidebarIsOpen } = useSelector((state) => state.sidebar);
  const { schema } = useSelector((state) => state.theme);
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  useEffect(() => {
    if (localStorage.getItem('language')) {
      i18n.changeLanguage(localStorage.getItem('language'));
    }
  }, []);

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <IconMenuItem
            name={'Operazione Fratellino'}
            path={'/'}
            icon={schema === 'dark' ? logo : logoColor}
            providedImage
          />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Links</SidebarGroupLabel>
          <SidebarMenu>
            {Object.entries(linksMenu).map(([name, values]) => {
              return <IconMenuItem key={name} name={name} {...values} />;
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{tc('sell', 'plural')}</SidebarGroupLabel>
          <SidebarMenu>
            {Object.entries(sellsMenu).map(([name, values]) => {
              return <IconMenuItem key={name} name={name} {...values} />;
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <div
            className={`${
              sidebarIsOpen ? 'flex-row' : 'flex-col'
            } flex justify-center`}
          >
            <Button onClick={() => changeLanguage('it')} variant="ghost">
              <em>IT</em>
            </Button>
            <Button onClick={() => changeLanguage('en')} variant="ghost">
              <em>EN</em>
            </Button>
          </div>
        </SidebarMenu>
        <UserNavbar />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
/* 
return (
    <Sidebar collapsible="icon" variant="floating" isSidebarCollapsed={true}>
      <SidebarHeader>
        <SidebarMenu>
          <IconMenuItem
            name={'Operazione Fratellino'}
            path={'/'}
            icon={schema === 'dark' ? logo : logoColor}
            providedImage
          />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Links</SidebarGroupLabel>
          <SidebarMenu>
            {Object.entries(linksMenu).map(([name, { path, icon }]) => {
              return (
                <IconMenuItem key={name} name={name} path={path} icon={icon} />
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <div
            className={`${
              sidebarIsOpen ? 'flex-row' : 'flex-col'
            } flex justify-center`}
          >
            <Button onClick={() => changeLanguage('it')} variant="ghost">
              <em>IT</em>
            </Button>
            <Button onClick={() => changeLanguage('en')} variant="ghost">
              <em>EN</em>
            </Button>
          </div>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
 */
