import React, { useEffect, useState } from 'react';
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

const CustomTable = ({ getItems, resetItems, entity }) => {
  const [itemRows, setItemRows] = useState(
    Object.entries(entity.fields)
      .filter(([_, value]) => value.isTableHead)
      .map((el) => el[0]),
  );

  const { toast } = useToast();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    [entity.store]: items,
    status: itemStatus,
    error: itemError,
  } = useSelector((state) => state[entity.store]);
  const [itemList, setItemList] = useState(items);

  useEffect(() => {
    setItemList(items);
  }, [items, itemStatus]);

  useEffect(() => {
    if (itemStatus === 'idle' && !items.length) {
      dispatch(getItems());
      const timer = setTimeout(() => {
        dispatch(resetItems());
      }, 6000);
      return () => clearTimeout(timer);
    } else if (itemStatus === 'failed') {
      toast(iconToast(itemStatus, itemError));
    }
  }, [items, itemStatus, itemError, toast, dispatch]);

  return itemStatus === 'loading' ? (
    <Spinner size="large" className="mt-10">
      {capitalize(t('loading'))}
    </Spinner>
  ) : (
    <Table>
      {!itemList.length ? (
        <TableCaption>{capitalize(t('noItems'))}</TableCaption>
      ) : (
        ''
      )}
      <TableHeader>
        <TableRow>
          {itemRows.map((row, idx, arr) => {
            return <TableHead key={row}>{t(row).toUpperCase()} </TableHead>;
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {itemList.map((item, idx, arr) => {
          return <CustomRow key={item.id} item={item} entity={entity} />;
        })}
      </TableBody>
    </Table>
  );
};

CustomTable.propTypes = {
  getItems: PropTypes.func,
  resetItems: PropTypes.func,
  entity: PropTypes.object,
};

export default CustomTable;
