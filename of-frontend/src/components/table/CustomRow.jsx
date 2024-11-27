import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, TableHead } from '@/components/ui/table';
import { capitalize, useTranslateAndCapitalize } from '@/utils/FormatUtils.js';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { loadLocale } from '@/utils/localeUtils.js';
import i18n from '../../../i18n.js';
import MTMDropdown from './MTMDropdown.jsx';
import OTMDropdown from './OTMDropdown.jsx';
import { axios } from '../../config/axios/axiosConfig';
import resolveEntityURLS from '../../config/links/urls';
import { Spinner } from '../ui/spinner.jsx';
import { components } from '@/config/entity/entities.js';

const CustomRow = ({ item, entity }) => {
  const tc = useTranslateAndCapitalize();
  const [formattedDates, setFormattedDates] = useState({});
  const [MTOdata, setMTOdata] = useState('');

  const formatDate = async (date) => {
    const locale = await loadLocale(i18n.language);
    return format(date, 'dd/MM/yyyy - HH:mm', { locale });
  };

  const formatDates = async () => {
    const newFormattedDates = {};
    for (const [field, value] of Object.entries(item)) {
      if (entity.fields[field]?.type === 'date' && value) {
        newFormattedDates[field] = await formatDate(value);
      }
    }
    setFormattedDates(newFormattedDates);
  };

  useEffect(() => {
    formatDates();
  }, [item, entity, i18n.language]);

  const MTOFetch = async (fetchField, displayField, entity, parameter) => {
    const stringBuilder = 'by' + capitalize(fetchField);
    const response = await axios.get(
      resolveEntityURLS(entity)[stringBuilder] + parameter,
    );
    setMTOdata(tc(response.data[displayField]));
  };
  return (
    <TableRow>
      {Object.entries(entity.fields).map(([field, fieldSettings]) => {
        if (!fieldSettings.foreignKey && fieldSettings.type === 'date') {
          return (
            <TableCell key={field} className="text-left">
              {formattedDates[field] || <Spinner size="sm" />}
            </TableCell>
          );
        } else if (
          !fieldSettings.foreignKey &&
          fieldSettings.type === 'image' &&
          item[field]
        ) {
          return (
            <TableCell key={field} className="text-left">
              <img
                src={item[field]}
                alt="product-image"
                className="rounded-lg"
              />
            </TableCell>
          );
        } else if (
          !fieldSettings.foreignKey &&
          fieldSettings.type === 'component'
        ) {
          const Component = components[item[field]];
          return (
            <TableCell key={field} className="text-left">
              <Component
                value={item[fieldSettings.props.value]}
                size={fieldSettings.props.size}
              />
            </TableCell>
          );
        } else if (fieldSettings.foreignKey === 'OTM') {
          return (
            <TableCell key={field} className="text-left">
              <OTMDropdown
                className="text-left"
                relateEntity={item[field]}
                dropDownName={field}
                relateDisplayField={fieldSettings.relateDisplayField}
              />
            </TableCell>
          );
        } else if (fieldSettings.foreignKey === 'MTM') {
          return (
            <TableCell key={field} className="text-left">
              <MTMDropdown
                className="text-left"
                relateEntity={item[field]}
                dropDownName={field}
                relateDisplayField={fieldSettings.relateDisplayField}
                relateDisplayValue={fieldSettings.relateDisplayValue}
              />
            </TableCell>
          );
        } else if (fieldSettings.foreignKey === 'MTO') {
          MTOFetch(
            fieldSettings.relateFetchField,
            fieldSettings.relateDisplayField,
            field,
            item[field],
          );
          return (
            <TableCell key={field} className="text-left">
              {MTOdata}
            </TableCell>
          );
        } else {
          return (
            <TableCell key={item[field]} className="text-left">
              {tc(item[field])}
            </TableCell>
          );
        }
      })}

      {/* {Object.entries(item).map(([field, value]) => {
        console.log();
        if (
          (typeof value === 'string' || typeof value === 'number') &&
          entity.fields[field]?.type != 'date'
        ) {
          return (
            <TableCell key={field} className="text-left">
              {capitalize(t(value))}
            </TableCell>
          );
        } else if (
          entity.fields[field]?.type === 'string' &&
          typeof value === 'object'
        ) {
          return (
            <TableCell key={field} className="text-left">
              {capitalize(t(value[entity.fields[field].relateDisplayField]))}
            </TableCell>
          );
        } else if (entity.fields[field]?.type === 'date') {
          return (
            <TableCell key={field} className="text-left">
              {formattedDates[field] || <Spinner size="sm" />}
            </TableCell>
          );
        } else {
          return (
            <TableCell key={value.id} className="text-left">
              <CustomTableDropdown
                relateDisplayField={entity.fields[field]?.relateDisplayField}
                obj={value}
                dropDownName={field}
                entity={entity}
              />
            </TableCell>
          );
        }
      })} */}
    </TableRow>
  );
};

CustomRow.propTypes = {
  item: PropTypes.object,
  entity: PropTypes.object,
};

export default CustomRow;
