import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { filterDeletedUsers, unfilterDeletedUsers } from '@/redux/usersSlice';
import React, { useState } from 'react';
import RegisterForm from '@/pages/auth/RegisterForm';
import AdminDashboardUserTable from './AdminDashboardUserTable';
import { useAppHooks } from '@/hooks/useAppHooks';

const AdminDashboard = () => {
  const { t, tc, dispatch } = useAppHooks();
  const [checked, setChecked] = useState(true);

  const handleDeleted = () => {
    if (checked) {
      dispatch(unfilterDeletedUsers());
    } else {
      dispatch(filterDeletedUsers());
    }

    setChecked((oldValue) => !oldValue);
  };

  return (
    <Tabs defaultValue="users">
      <TabsList>
        <TabsTrigger value="users">{tc('users')}</TabsTrigger>
        <TabsTrigger value="createUser">{tc('createUser')}</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <AdminDashboardUserTable />
      </TabsContent>
      <TabsContent value="createUser">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboard;
