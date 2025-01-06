import CustomTable from '@/components/table/CustomTable';
import { USER } from '@/config/entity/entities';
import {
  filterDeletedUsers,
  getAllUsers,
  orderUsers,
  resetToastStatus,
  resetUsers,
  setItemsPerPage,
  setPage,
  unfilterDeletedUsers,
} from '@/redux/usersSlice';
import React from 'react';
import AdminDashboardUserRow from './AdminDashboardUserRow';
import { STATUS_ENUM } from '@/utils/toastUtils';

const AdminDashboardUserTable = () => {
  const toastArray = [
    STATUS_ENUM.RESET,
    STATUS_ENUM.DELETED,
    STATUS_ENUM.SUCCESS,
    STATUS_ENUM.FAILED,
  ];
  return (
    <CustomTable
      ENTITY={USER}
      getItems={getAllUsers}
      resetItems={resetUsers}
      orderItems={orderUsers}
      resetToast={resetToastStatus}
      toastArray={toastArray}
      unfilerDeletedItems={unfilterDeletedUsers}
      filterDeletedItems={filterDeletedUsers}
      ItemRow={AdminDashboardUserRow}
      setItemsPerPage={setItemsPerPage}
      setPage={setPage}
    />
  );
};

export default AdminDashboardUserTable;

// import { USER } from '@/config/entity/entities';
// import {
//   useAppHooks,
//   useFilterHooks,
//   useTableColumns,
//   useToastHooks,
// } from '@/hooks/useAppHooks';
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Spinner } from '@/components/ui/spinner';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { ArrowDown, CircleX } from 'lucide-react';
// import AdminDashboardUserRow from './AdminDashboardUserRow';
// import {
//   filterDeletedUsers,
//   filterUsers,
//   getAllUsers,
//   orderUsers,
//   resetToastStatus,
//   resetUsers,
//   unfilterDeletedUsers,
// } from '@/redux/usersSlice';
// import CustomSwitch from '@/components/CustomSwitch';

// const AdminDashboardUserTable = () => {
//   const {
//     filterColumn,
//     setFilterColumn,
//     filterDirection,
//     setFilterDirection,
//     filter,
//     setFilter,
//     searchRef,
//     handleFilter,
//     handleSearch,
//     checkClearSearch,
//     clearSearch,
//   } = useFilterHooks(getAllUsers, resetUsers, filterUsers, orderUsers, USER);
//   const { tc, t, dispatch, capitalize } = useAppHooks();
//   const { entityColumns } = useTableColumns(USER);
//   const {
//     users,
//     status: usersStatus,
//     toast: { status: toastStatus, response: toastResponse },
//     error: usersError,
//     response: usersResponse,
//   } = useSelector((state) => state.users);
//   const [checked, setChecked] = useState(true);

//   const handleDeleted = () => {
//     if (checked) {
//       dispatch(unfilterDeletedUsers());
//     } else {
//       dispatch(filterDeletedUsers());
//     }

//     setChecked((oldValue) => !oldValue);
//   };

//   useToastHooks(
//     toastStatus,
//     ['reset', 'deleted', 'success', 'error'],
//     toastResponse,
//   );

//   useEffect(() => {
//     return () => dispatch(resetToastStatus());
//   }, []);

//   return usersStatus === 'loading' || !users ? (
//     <Spinner size="large" className="mt-10">
//       {capitalize(t('loading'))}
//     </Spinner>
//   ) : (
//     <>
//       <div className="md:w-1/4 flex flex-col gap-2">
//         <Label className="text-start">{tc('search')}</Label>
//         <div className="relative">
//           <Input
//             id="custom-cancel-button"
//             onChange={(e) => handleSearch(e.target.value)}
//             type="search"
//             ref={searchRef}
//             onKeyDown={checkClearSearch}
//           />
//           <p className="absolute top-1/2 -translate-y-1/2 right-0 p-2">
//             <CircleX
//               className={`w-4 opacity-40 cursor-pointer hover:opacity-100 ${
//                 searchRef.current && searchRef.current.value ? '' : 'hidden'
//               }`}
//               onClick={clearSearch}
//             />
//           </p>
//         </div>
//         <CustomSwitch
//           id="filter-deleted"
//           checked={checked}
//           label={`${tc('filter', 'action')} ${t('deletedUsers')}`}
//           onChecked={handleDeleted}
//         />
//       </div>
//       <Table>
//         {!users.length ? (
//           <TableCaption>{capitalize(t('noItems'))}</TableCaption>
//         ) : (
//           ''
//         )}
//         <TableHeader className="sticky top-0 bg-background pt-2 z-10">
//           <TableRow>
//             {entityColumns.map((row, idx, arr) => {
//               return (
//                 <TableHead
//                   onClick={() => {
//                     handleFilter(row);
//                   }}
//                   key={row}
//                   className={`cursor-pointer ${
//                     filterColumn === row && 'font-bold text-foreground'
//                   }`}
//                 >
//                   <div className="flex items-center gap-1">
//                     {t(row).toUpperCase()}
//                     {filterColumn === row && (
//                       <ArrowDown
//                         className={`w-3 h-3 ${
//                           filterDirection === 'ASC' ? '' : 'rotate-180'
//                         }`}
//                       />
//                     )}
//                   </div>
//                 </TableHead>
//               );
//             })}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {users.map((user) => {
//             return <AdminDashboardUserRow key={user.email} {...user} />;
//           })}
//         </TableBody>
//       </Table>
//     </>
//   );
// };

// export default AdminDashboardUserTable;
