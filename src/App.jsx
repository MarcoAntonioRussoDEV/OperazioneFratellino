import './App.css';
import { useSelector } from 'react-redux';
import '../i18n';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarComponent from './components/sidebar/SidebarComponent';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateCategories from '@/pages/categories/create/CreateCategories';
import { ToastProvider } from '@radix-ui/react-toast';
import Layout from '@/pages/Layout';
import Home from '@/pages/homepage/Home';
import CategoriesTable from '@/pages/categories/all/CategoriesTable';
import CreateProduct from '@/pages/products/create/createProduct';
import AttributesTable from '@/pages/attributes/all/AttributesTable';
import ProductAttributesTable from '@/pages/productAttributes/all/ProductAttributesTable';
import LoginForm from '@/pages/auth/LoginForm';
import ProtectedRoute from './components/routes/ProtectedRoute';
import NewSale from '@/pages/sale/create/NewSale';
import SaleTable from './pages/sale/all/SaleTable';
import { USER_ROLES } from './utils/userRoles';
import Error from './pages/errorsPages/Error';
import { hasAccess } from './utils/authService';
import UserSettings from '@/pages/user/UserSettings';
import AdminDashboard from './pages/user/admin/AdminDashboard';
import NewPreorder from './pages/preorders/createOperator/NewPreorder';
import ProductsList from './pages/products/all/ProductsList';
import PreordersTable from './pages/preorders/all/PreordersTable';
import Cart from './pages/cart/Cart';
import MyPreorders from './pages/preorders/myPreorders/MyPreorders';
import ProductsCardsList from './pages/products/all/cards/ProductsCardsList';
import EditUser from './pages/user/EditUser';
import EditProduct from './pages/products/edit/EditProduct';
import EditCategory from './pages/categories/edit/EditCategory';
import ProductShow from './pages/products/show/ProductShow';
import Logs from './pages/logs/Logs';

function App() {
  const {
    isAuthenticated,
    user: { role },
  } = useSelector((state) => state.user);

  return (
    <Router>
      <ToastProvider>
        <SidebarProvider
          defaultOpen={JSON.parse(localStorage.getItem('sidebarStatus'))}
        >
          {/* <SidebarComponent /> */}
          {isAuthenticated ? <SidebarComponent /> : ''}
          <Layout>
            <Routes>
              {/*AUTH-FREE ROUTES  */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/error/:errorCode" element={<Error />} />
              {/* <Route path="/register" element={<RegisterForm />} /> */}

              {/* AUTH+ ROUTES */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    {hasAccess(role, USER_ROLES.OPERATOR) ? (
                      <Home />
                    ) : (
                      <ProductsCardsList />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <UserSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/:userEmail"
                element={
                  <ProtectedRoute>
                    <EditUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:code"
                element={
                  <ProtectedRoute>
                    <ProductShow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <CategoriesTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attributes/"
                element={
                  <ProtectedRoute>
                    <AttributesTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sale/"
                element={
                  <ProtectedRoute>
                    <SaleTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preorder/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preorder/myPreorders"
                element={
                  <ProtectedRoute>
                    <MyPreorders />
                  </ProtectedRoute>
                }
              />
              {/* OPERATOR+ ROUTES */}
              <Route
                path="/products/create"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.OPERATOR}>
                    <CreateProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/edit/:code"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.OPERATOR}>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories/create"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.OPERATOR}>
                    <CreateCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories/edit/:id"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.OPERATOR}>
                    <EditCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sale/create"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.OPERATOR}>
                    <NewSale />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preorder"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.OPERATOR}>
                    <PreordersTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preorder/create"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.OPERATOR}>
                    <NewPreorder />
                  </ProtectedRoute>
                }
              />
              {/* ADMIN ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* DEVELOPER ROUTES */}
              <Route
                path="/logs"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.DEVELOPER}>
                    <Logs />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </SidebarProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
