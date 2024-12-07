import React, { useEffect, useMemo, useCallback } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { capitalize } from '@/utils/FormatUtils';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toggleIsOpen } from '@/redux/sidebarSlice';
import { toggleTheme } from '@/redux/themeSlice';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const location = useLocation();
  const pathnames = useMemo(
    () => location.pathname.split('/').filter((x) => x),
    [location],
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOpen: sidebarIsOpen } = useSelector((state) => state.sidebar);
  const { status: categoryStatus } = useSelector((state) => state.categories);
  const { schema } = useSelector((state) => state.theme);
  useEffect(() => {
    document.body.className = schema;
  }, [schema]);

  const handleTheme = useCallback(() => {
    dispatch(toggleTheme());
    document.body.className = schema;
  }, [dispatch, schema]);

  return (
    <>
      <img
        src="LOGO.png"
        alt=""
        className="w-64 mx-auto h-auto absolute m-4 top-0 right-0 z-10"
      />
      {/* <h1>Gestionale Magazzino Fondazione Magnificat E.T.S.</h1> */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger
                    className="-ml-1"
                    onClick={() => dispatch(toggleIsOpen())}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sidebarIsOpen ? 'Chiudi' : 'Apri'} barra laterale</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="mr-2 h-4" />
            <Button variant="ghost" size="sm" onClick={handleTheme}>
              {schema === 'dark' ? <Sun /> : <Moon />}
            </Button>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block" value={'home'}>
                  <Link to={'/'}>Operazione Fratellino</Link>
                </BreadcrumbItem>
                {pathnames.map((path, idx) => {
                  const link = `/${pathnames.slice(0, idx + 1).join('/')}`;
                  return (
                    <React.Fragment key={idx}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      {pathnames[idx + 1] ? (
                        <BreadcrumbItem>
                          <Link to={link}>{capitalize(t(path))}</Link>
                        </BreadcrumbItem>
                      ) : (
                        <BreadcrumbItem>
                          <BreadcrumbPage>{capitalize(t(path))}</BreadcrumbPage>
                        </BreadcrumbItem>
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        <footer className="text-start">
          <Toaster />
        </footer>
      </SidebarInset>
    </>
  );
};

export default Layout;
