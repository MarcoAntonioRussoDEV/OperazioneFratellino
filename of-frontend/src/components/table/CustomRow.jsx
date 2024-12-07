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
import EAVDropdown from './EAVDropdown.jsx';
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, DrawerTrigger } from '../ui/drawer.jsx';
import { Button } from '../ui/button.jsx';
import ImageDrawer from './ImageDrawer.jsx';

const CustomRow = ({ item, entity, deleteItem }) => {
  const tc = useTranslateAndCapitalize();
  const [formattedDates, setFormattedDates] = useState({});
  const [MTOdata, setMTOdata] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

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
      {Object.entries(entity.fields)
        .filter((el) => el[1].isTableHead)
        .map(([field, fieldSettings]) => {
          /!* DATA */;
          if (!fieldSettings.foreignKey && fieldSettings.type === 'date') {
            return (
              <TableCell key={field} className="text-left">
                {formattedDates[field] || <Spinner size="sm" />}
              </TableCell>
            );
            /!* IMAGE  */;
          } else if (
            !fieldSettings.foreignKey &&
            fieldSettings.type === 'image' &&
            item[field]
          ) {
            return (
              <Drawer key={field}>
                <DrawerTrigger asChild>
                  <TableCell className="text-left">
                    <div className="w-14 h-14 cursor-pointer hover:scale-[1.1]">
                      <img
                        src={item[field]}
                        alt="product-image"
                        className="rounded-lg object-cover h-full w-full"
                      />
                    </div>
                  </TableCell>
                </DrawerTrigger>
                <ImageDrawer
                  title={item[fieldSettings.drawer.title]}
                  description={item[fieldSettings.drawer.description]}
                  imgSrc={item[field]}
                />
              </Drawer>
            );
            /!* COMPONENT  */;
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
            /!* OneToMany  */;
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
            /!* ManyToMany  */;
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
            /!* EntityAttributeValue  */;
          } else if (fieldSettings.foreignKey === 'EAV') {
            return (
              <TableCell key={field} className="text-left">
                <EAVDropdown
                  className="text-left"
                  relateEntity={item[field]}
                  dropDownName={field}
                  relateDisplayField={fieldSettings.relateDisplayField}
                  relateDisplayValue={fieldSettings.relateDisplayValue}
                />
              </TableCell>
            );
            /!* ManyToOne  */;
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
            /!* Default  */;
          } else {
            return (
              <>
                <TableCell key={item[field]} className="text-left">
                  {tc(item[field])} {fieldSettings.currency ?? ''}
                </TableCell>
              </>
            );
          }
        })}

      {/* DELETE BUTTON  */}
      {user.role == 'ADMIN' && (
        <TableCell className="text-left">
          <Trash2
            onClick={() => {
              dispatch(deleteItem(item[entity.deleteKey]));
            }}
            className="text-destructive cursor-pointer"
          />
        </TableCell>
      )}
    </TableRow>
  );
};

CustomRow.propTypes = {
  item: PropTypes.object,
  entity: PropTypes.object,
};

export default CustomRow;
