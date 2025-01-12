import React, { useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { useTranslation } from 'react-i18next';
import {
  linksMenu,
  logsMenu,
  preordersMenu,
  salesMenu,
} from '@/config/links/linksMenu';
import IconMenuItem from './IconMenuItem';
import logo from '../../assets/Images/logo.png';
import logoColor from '../../assets/Images/logo-no-bg.png';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import UserNavbar from './UserNavbar';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import { countPreordersByStatus } from '@/redux/preorderSlice';
import { getAuthUser } from '@/redux/userSlice';

const SidebarComponent = () => {
  const { t, i18n } = useTranslation();
  const tc = useTranslateAndCapitalize();
  const { isOpen: sidebarIsOpen } = useSelector((state) => state.sidebar);
  const { schema } = useSelector((state) => state.theme);
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };
  const {
    user: { role: userRole },
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const { status: preorderStatus } = useSelector((state) => state.preorders);

  useEffect(() => {
    if (localStorage.getItem('language')) {
      i18n.changeLanguage(localStorage.getItem('language'));
      dispatch(countPreordersByStatus('PENDING'));
    }
    dispatch(getAuthUser());
  }, []);

  useEffect(() => {
    if (preorderStatus === 'loading') {
      dispatch(countPreordersByStatus('PENDING'));
    }
  }, [preorderStatus]);

  return (
    <Sidebar collapsible="icon" variant="floating" className="z-50">
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
          <SidebarGroupLabel>{tc('links')}</SidebarGroupLabel>
          <SidebarMenu>
            {Object.entries(linksMenu).map(([name, values]) => {
              if (hasAccess(userRole, values.requiredRole))
                return (
                  <IconMenuItem
                    key={name}
                    name={name}
                    {...values}
                    userRole={userRole}
                  />
                );
            })}
          </SidebarMenu>
        </SidebarGroup>
        {hasAccess(userRole, USER_ROLES.OPERATOR) && (
          <SidebarGroup>
            <SidebarGroupLabel>{tc('sale', 'plural')}</SidebarGroupLabel>
            <SidebarMenu>
              {Object.entries(salesMenu).map(([name, values]) => {
                if (hasAccess(userRole, values.requiredRole))
                  return (
                    <IconMenuItem
                      key={name}
                      name={name}
                      {...values}
                      userRole={userRole}
                    />
                  );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>{tc('preorders')}</SidebarGroupLabel>
          <SidebarMenu>
            {Object.entries(preordersMenu).map(([name, values]) => {
              if (hasAccess(userRole, values.requiredRole))
                return (
                  <IconMenuItem
                    key={name}
                    name={name}
                    {...values}
                    userRole={userRole}
                  />
                );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{tc('log')}</SidebarGroupLabel>
          <SidebarMenu>
            {Object.entries(logsMenu).map(([name, values]) => {
              if (hasAccess(userRole, values.requiredRole))
                return (
                  <IconMenuItem
                    key={name}
                    name={name}
                    {...values}
                    userRole={userRole}
                  />
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
        <SidebarMenu>
          <UserNavbar />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
