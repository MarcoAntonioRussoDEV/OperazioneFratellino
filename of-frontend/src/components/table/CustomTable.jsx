import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../ui/spinner.jsx';
import { capitalize } from '@/utils/FormatUtils.js';
import iconToast from '@/utils/toastUtils';
import { useToast } from '@/hooks/use-toast';
import PropTypes, { string } from 'prop-types';
import CustomRow from './CustomRow.jsx';
import { ArrowDown, CircleX, Trash2 } from 'lucide-react';
import { Label } from '../ui/label.jsx';
import { Input } from '../ui/Input.jsx';

const CustomTable = ({
  orderItems,
  filterItem,
  deleteItem,
  getItems,
  resetItems,
  entity,
}) => {
  const [filterColumn, setFilterColumn] = useState('id');
  const [filterDirection, setFilterDirection] = useState('ASC');
  const [filter, setFilter] = useState({});
  const searchRef = useRef();
  const [itemRows, setItemRows] = useState(
    Object.entries(entity.fields)
      .filter(([_, value]) => value.isTableHead)
      .map((el) => el[0])
      .concat(''),
  );
  const tableRef = useRef();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const allStore = `All${capitalize(entity.store)}`;
  const {
    [entity.store]: items,
    status: itemStatus,
    error: itemError,
    response: itemResponse,
  } = useSelector((state) => state[entity.store]);

  const [itemList, setItemList] = useState(items);
  useEffect(() => {
    setItemList(items);
  }, [items, itemStatus]);

  useEffect(() => {
    if (itemStatus === 'idle') {
      dispatch(getItems({ column: filterColumn, direction: filterDirection }));
      const timer = setTimeout(() => {
        dispatch(resetItems());
      }, 6000);
      return () => clearTimeout(timer);
    } else if (itemStatus === 'failed') {
      toast(iconToast(itemStatus, itemError));
    }
  }, [
    items,
    itemStatus,
    itemError,
    toast,
    dispatch,
    getItems,
    resetItems,
    // filterColumn,
    // filterDirection,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetItems());
    };
  }, [dispatch, resetItems]);

  useEffect(() => {
    if (itemStatus === 'deleted' || itemStatus === 'failed') {
      const currentToast = toast(iconToast(itemStatus, t(itemResponse)));
      return () => {
        currentToast.dismiss();
      };
    }
  }, [itemStatus, itemError, itemResponse, toast, dispatch]);

  useEffect(() => {
    setFilter({
      direction: filterDirection,
      column: filterColumn,
    });
  }, [filterColumn, filterDirection]);

  const handleFilter = (column) => {
    if (column != filterColumn) {
      setFilterColumn(column);
    } else {
      setFilterDirection((oldValue) => {
        return oldValue === 'ASC' ? 'DESC' : 'ASC';
      });
    }
  };

  useEffect(() => {
    dispatch(orderItems(filter));
  }, [filter]);

  const handleSearch = (search) => {
    dispatch(filterItem(search));
  };

  const clearSearch = () => {
    searchRef.current.value = '';

    handleSearch('');
  };
  const checkClearSearch = (e) => {
    if (e.key === 'Delete') {
      clearSearch();
    }
  };

  return itemStatus === 'loading' ? (
    <Spinner size="large" className="mt-10">
      {capitalize(t('loading'))}
    </Spinner>
  ) : (
    <>
      <div className="md:w-1/4 flex flex-col gap-2">
        <Label className="text-start">Cerca</Label>
        <div className="relative">
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
      </div>
      <Table>
        {!itemList.length ? (
          <TableCaption>{capitalize(t('noItems'))}</TableCaption>
        ) : (
          ''
        )}
        <TableHeader className="sticky top-0 bg-background pt-2 z-10">
          <TableRow>
            {itemRows.map((row, idx, arr) => {
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
          {itemList.map((item, idx, arr) => {
            return (
              <CustomRow
                key={item.id}
                item={item}
                entity={entity}
                deleteItem={deleteItem}
              />
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

CustomTable.propTypes = {
  getItems: PropTypes.func,
  resetItems: PropTypes.func,
  entity: PropTypes.object,
};

export default CustomTable;
