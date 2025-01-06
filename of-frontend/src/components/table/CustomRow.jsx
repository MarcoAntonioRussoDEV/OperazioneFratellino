import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils.js';
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
import ImageDrawer from './ImageDrawer.jsx';
import { hasAccess } from '@/utils/authService.js';
import { USER_ROLES } from '@/utils/userRoles.js';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DeleteModal from '../modal/DeleteModal.jsx';
import { blobToSrc } from '@/utils/imageUtils.js';

const CustomRow = ({ item, entity, deleteItem, children, className }) => {
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

  return (
    <TableRow className={className}>
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
                        alt=""
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
                  item={item}
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
                  relateDisplayValue={fieldSettings.relateDisplayValue}
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
            return (
              <TableCell key={field} className="text-left">
                {MTOdata[field] || <Spinner size="sm" />}
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

      <TableCell className="text-left">{children}</TableCell>
      {/* DELETE BUTTON  */}
      {hasAccess(user.role, USER_ROLES.ADMIN) && (
        <TableCell className="text-left">
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash2 className="text-destructive cursor-pointer" />
            </AlertDialogTrigger>
            <DeleteModal
              confirmAction={deleteItem}
              confirmTarget={item[entity.deleteKey]}
            />
          </AlertDialog>
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
