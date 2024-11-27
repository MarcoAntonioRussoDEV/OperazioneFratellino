import './App.css';
import { store } from './redux/store.js';
import { useSelector } from 'react-redux';
import '../i18n';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarComponent from './components/sidebar/SidebarComponent';
import ProductsTable from '@/pages/products/all/ProductsTable.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateCategories from './pages/categories/create/CreateCategories';
import { ToastProvider } from '@radix-ui/react-toast';

import Layout from './pages/Layout';
import Home from './pages/homepage/Home';
import CategoriesTable from './pages/categories/all/CategoriesTable';
import CreateProduct from './pages/products/create/createProduct';
import AttributesTable from './pages/attributes/all/AttributesTable';
import ProductAttributesTable from './pages/productAttributes/all/ProductAttributesTable';
import LoginForm from './pages/auth/LoginForm';
import RegisterForm from './pages/auth/RegisterForm';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { useEffect } from 'react';
import NewSell from './pages/sells/NewSell';
import UserDashboard from './pages/dashboard/UserDashboard';

function App() {
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <Router>
      <ToastProvider>
        <SidebarProvider
          defaultOpen={JSON.parse(localStorage.getItem('sidebarStatus'))}
        >
          <SidebarComponent />
          {isAuthenticated ? <SidebarComponent /> : ''}
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              {/* <Route path="/register" element={<RegisterForm />} /> */}
              {/* Protected Routes */}
              {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/products" element={<ProductsTable />} />
              <Route path="/products/create" element={<CreateProduct />} />
              <Route path="/categories" element={<CategoriesTable />} />
              <Route path="/categories/create" element={<CreateCategories />} />
              <Route path="/attributes/" element={<AttributesTable />} />
              <Route
                path="/product-attributes/"
                element={<ProductAttributesTable />}
              />
              <Route path="/sell/" element={<NewSell />} />
              {/* </Route> */}
            </Routes>
          </Layout>
        </SidebarProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
