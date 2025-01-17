import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import iconToast from '@/utils/toastUtils';
import { getAuthUser, logoutUser } from '@/redux/userSlice';
import { countPreordersByStatus } from '@/redux/preorderSlice';

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
  const { schema } = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const tc = useTranslateAndCapitalize();
  const { isAuthenticated } = useSelector((state) => state.user);
  const isLogginOut = useRef(false);
  const { isMobile } = useSidebar();

  const handleUnauthorized = (event) => {
    localStorage.removeItem('token');
    if (isAuthenticated && !isLogginOut.current) {
      isLogginOut.current = true;
      dispatch(logoutUser()).finally(() => (isLogginOut.current = false));
      navigate('/login');

      dismiss();
      toast(iconToast('', tc(event.detail.error.data.message)));
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const handleForbidden = (event) => {
    const { error } = event.detail;
    navigate(`/error/${error.status}`, {
      state: { message: error.data.message },
    });
    toast(iconToast('', tc(error.data.message)));
  };

  useEffect(() => {
    window.addEventListener('unauthorized', handleUnauthorized);
    window.addEventListener('forbidden', handleForbidden);
    dispatch(getAuthUser());
    dispatch(countPreordersByStatus('PENDING'));
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
      window.removeEventListener('forbidden', handleForbidden);
    };
  }, [navigate]);

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
        className="w-16 sm:w-32 md:w-64 h-auto absolute m-2 top-0 right-0 z-10"
      />
      <SidebarInset className="overflow-x-scroll custom-scrollbar shadow-inner">
        <h1 className="text-start font-semibold text-sm truncate sm:text-md md:text-xl">
          Gestionale Magazzino Fondazione Magnificat{' '}
          <span className="text-xs">E.T.S.</span>
        </h1>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            {location.pathname !== '/login' && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarTrigger
                        className="-ml-1"
                        onClick={() => {
                          if (!isMobile) dispatch(toggleIsOpen());
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{sidebarIsOpen ? 'Chiudi' : 'Apri'} barra laterale</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Separator orientation="vertical" className="mr-2 h-4" />
              </>
            )}
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
        <div className="flex flex-1 flex-col gap-4 lg:p-4 pt-0">{children}</div>
        <footer className="text-start">
          <Toaster />
        </footer>
      </SidebarInset>
    </>
  );
};

export default Layout;
