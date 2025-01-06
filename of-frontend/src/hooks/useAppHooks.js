import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from '@/utils/formatUtils';
import { useToast } from './use-toast';
import iconToast from '@/utils/toastUtils';
import { format, set } from 'date-fns';
import { loadLocale } from '@/utils/localeUtils';
import i18n from '../../i18n';
import resolveEntityURLS from '@/config/links/urls';
import { axios } from '@/config/axios/axiosConfig';
import { useLocation } from 'react-router-dom';

/* Frequents hooks */
export const useAppHooks = () => {
  const dispatch = useDispatch();
  const tc = useTranslateAndCapitalize();
  const { t } = useTranslation();

  return { tc, t, dispatch, capitalize };
};

export const useFilterHooks = (
  getItems,
  resetItems,
  filterItems,
  orderItems,
  entity,
  setPage,
) => {
  const [filterColumn, setFilterColumn] = useState('id');
  const [filterDirection, setFilterDirection] = useState('ASC');
  const [filter, setFilter] = useState({});
  const searchRef = useRef();
  const dispatch = useDispatch();
  const {
    [entity.store]: items,
    status: itemStatus,
    error: itemError,
    response: itemResponse,
    pagination: { currentPage, itemsPerPage },
  } = useSelector((state) => state[entity.store]);
  const { toast, dismiss } = useToast();

  const handlePreviousPage = () => {
    dispatch(setPage(currentPage - 1));
  };

  const handleNextPage = () => {
    dispatch(setPage(currentPage + 1));
  };

  useEffect(() => {
    if (currentPage && itemsPerPage) {
      dispatch(getItems({ page: currentPage, size: itemsPerPage }));
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    dispatch(getItems({ page: 0, size: 10 }));
  }, []);

  useEffect(() => {
    dispatch(orderItems(filter));
  }, [filter]);

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

  const handleSearch = (search) => {
    dispatch(filterItems(search));
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

  // useEffect(() => {
  //   let currentToast;
  //   if (itemStatus === 'idle') {
  //     dispatch(getItems({ column: filterColumn, direction: filterDirection }));
  //     const timer = setTimeout(() => {
  //       dispatch(resetItems());
  //     }, 6000);
  //     return () => clearTimeout(timer);
  //   } else if (itemStatus === 'failed') {
  //     //! currentToast = toast(iconToast(itemStatus, itemError));
  //   }

  //   return () => {
  //     if (currentToast) currentToast.dismiss();
  //   };
  // }, [
  //   items,
  //   itemStatus,
  //   itemError,
  //   toast,
  //   dispatch,
  //   getItems,
  //   resetItems,
  //   // filterColumn,
  //   // filterDirection,
  // ]);

  return {
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
    currentPage,
  };
};

export const useTableColumns = (entity) => {
  const [entityColumns, setEntityColumns] = useState(
    Object.entries(entity.fields)
      .filter(([_, value]) => value.isTableHead)
      .map((el) => el[0]),
  );
  return { entityColumns };
};

export const useToastHooks = (
  statusReference,
  statusStringArray,
  message,
  formReset,
  extraMessage = '',
) => {
  const { toast, dismiss } = useToast();
  const [currentToast, setCurrentToast] = useState();
  const tc = useTranslateAndCapitalize();
  const dispatch = useDispatch();

  useEffect(() => {
    statusStringArray.forEach((status) => {
      if (statusReference === status) {
        setCurrentToast(
          toast(iconToast(statusReference, `${tc(message)} ${extraMessage}`)),
        );
        if (formReset) formReset();
      }
    });
    return () => {
      dismiss(currentToast);
      if (formReset) formReset();
    };
  }, [statusReference]);
  return { currentToast };
};

export const useMTOHooks = (entity, item) => {
  const { tc } = useAppHooks();
  const [MTOdata, setMTOdata] = useState({});

  const MTOFetch = async (fetchField, displayField, entity, parameter) => {
    const stringBuilder = 'by' + capitalize(fetchField);
    const response = await axios.get(
      resolveEntityURLS(entity)[stringBuilder] + parameter,
    );
    return tc(response.data[displayField]);
  };

  useEffect(() => {
    const fetchAllMTOData = async () => {
      const newMTOdata = {};
      for (const [field, fieldSettings] of Object.entries(entity.fields)) {
        if (fieldSettings.foreignKey === 'MTO') {
          newMTOdata[field] = await MTOFetch(
            fieldSettings.relateFetchField,
            fieldSettings.relateDisplayField,
            field,
            item[field],
          );
        }
      }
      setMTOdata(newMTOdata);
    };
    fetchAllMTOData();
  }, [item, entity]);
  return { MTOdata };
};

export const useOTMHooks = (entity, item) => {
  const [OTMdata, setOTMdata] = useState([]);

  useEffect(() => {
    if (!item.length) {
      for (const [field, fieldSettings] of Object.entries(entity.fields)) {
        if (fieldSettings.foreignKey === 'OTM') {
          setOTMdata((oldValue) => [
            ...oldValue,
            item[field][fieldSettings.relateDisplayField],
          ]);
        }
      }
    }
  }, [item]);

  return { OTMdata };
};

export const useResetStatus = (resetStatus) => {
  const { dispatch } = useAppHooks();
  useEffect(() => {
    return () => dispatch(resetStatus());
  }, []);
};
