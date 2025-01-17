import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  useAppHooks,
  useFilterHooks,
  useTableColumns,
  useToastHooks,
} from '@/hooks/useAppHooks';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { ArrowDown, CircleX } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CustomSwitch from '@/components/CustomSwitch';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import { STATUS_ENUM } from '@/utils/toastUtils';
import Paginator from './Paginator';
import ItemsPerPage from './ItemsPerPage';

const CustomTable = ({
  ENTITY,
  getItems,
  resetItems,
  filterItems,
  orderItems,
  resetToast,
  toastArray,
  unfilerDeletedItems,
  filterDeletedItems,
  ItemRow,
  setPage,
  setItemsPerPage,
  children,
}) => {
  const { tc, t, dispatch, capitalize } = useAppHooks();
  const { entityColumns } = useTableColumns(ENTITY);
  const [checked, setChecked] = useState(true);
  const { user } = useSelector((state) => state.user);
  const {
    filterColumn,
    setFilterColumn,
    filterDirection,
    setFilterDirection,
    filter,
    setFilter,
    searchRef,
    handleFilter,
    handleSearch,
    checkClearSearch,
    clearSearch,
    handlePreviousPage,
    handleNextPage,
  } = useFilterHooks(
    getItems,
    resetItems,
    filterItems,
    orderItems,
    ENTITY,
    setPage,
    setItemsPerPage,
  );

  const {
    [ENTITY.store]: items,
    status: itemStatus,
    error: itemError,
    response: itemResponse,
    pagination: { currentPage, itemsPerPage, totalItems, totalPages },
    toast: { status: toastStatus, response: toastResponse, error: toastError },
  } = useSelector((state) => state[ENTITY.store]);

  useToastHooks(
    toastStatus,
    toastArray ?? [
      STATUS_ENUM.SUCCESS,
      STATUS_ENUM.DELETED,
      STATUS_ENUM.FAILED,
    ],
    toastResponse,
    resetToast,
  );

  const handleDeleted = () => {
    if (checked) {
      dispatch(unfilerDeletedItems());
    } else {
      dispatch(filterDeletedItems());
    }

    setChecked((oldValue) => !oldValue);
  };

  useEffect(() => {
    return () => dispatch(resetToast());
  }, []);

  return itemStatus === 'loading' || !items ? (
    <Spinner size="large" className="mt-10">
      {capitalize(t('loading'))}
    </Spinner>
  ) : (
    <>
      <div className=" flex flex-col gap-2">
        <article className="flex gap-2 justify-between">
          <div className="relative text-start flex flex-col gap-2 w-full">
            <Label className="text-start">{tc('search')}</Label>
            <Input
              id="custom-cancel-button"
              onChange={(e) => handleSearch(e.target.value)}
              type="search"
              ref={searchRef}
              onKeyDown={checkClearSearch}
            />
            <p className="absolute top-1/2 -translate-y-1/2 right-0 p-2">
              <CircleX
                className={`w-4 opacity-40 cursor-pointer hover:opacity-100 ${
                  searchRef.current && searchRef.current.value ? '' : 'hidden'
                }`}
                onClick={clearSearch}
              />
            </p>
          </div>
          <div className="text-start flex flex-col gap-2 w-fit">
            <Label className="text-start whitespace-nowrap ">
              {tc('itemsPerPage')}
            </Label>
            <ItemsPerPage
              placeholder={tc('itemsPerPage')}
              values={[10, 25, 50]}
              onValueChange={(value) => dispatch(setItemsPerPage(value))}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </article>
        {filterDeletedItems && unfilerDeletedItems && (
          <CustomSwitch
            id="filter-deleted"
            checked={checked}
            label={`${tc('filter', 'action')} ${t(`${ENTITY.store}.disabled`, {
              context: 'plural',
            })}`}
            onChecked={handleDeleted}
          />
        )}
        {children}
      </div>

      <Table>
        {!items.length ? (
          <TableCaption>{capitalize(t('noItems'))}</TableCaption>
        ) : (
          ''
        )}

        <TableHeader className="sticky top-0 bg-background pt-2 z-10">
          <TableRow>
            {entityColumns
              .filter((row) => {
                if (hasAccess(user.role, USER_ROLES.OPERATOR)) {
                  return row;
                } else {
                  return row !== 'actions';
                }
              })
              .map((row) => {
                return (
                  <TableHead
                    onClick={() => {
                      handleFilter(row);
                    }}
                    key={row}
                    className={`cursor-pointer ${
                      filterColumn === row && 'font-bold text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {t(row).toUpperCase()}
                      {filterColumn === row && (
                        <ArrowDown
                          className={`w-3 h-3 ${
                            filterDirection === 'ASC' ? '' : 'rotate-180'
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                );
              })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => {
            return <ItemRow key={item.id ?? idx} {...item} />;
          })}
        </TableBody>
      </Table>
      <Paginator
        handlePrevious={handlePreviousPage}
        handleNext={handleNextPage}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setPage={setPage}
      />
    </>
  );
};

CustomTable.propTypes = {
  ENTITY: PropTypes.shape({
    store: PropTypes.string,
  }),
  ItemRow: PropTypes.node,
  filterDeletedItems: PropTypes.func,
  filterItems: PropTypes.func,
  getItems: PropTypes.func,
  orderItems: PropTypes.func,
  resetItems: PropTypes.func,
  resetToast: PropTypes.func,
  toastArray: PropTypes.array,
  unfilerDeletedItems: PropTypes.func,
  children: PropTypes.node,
};

export default CustomTable;
