import React, { Children, cloneElement, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppHooks } from '@/hooks/useAppHooks';
import PropTypes from 'prop-types';
import ActionsDeleteButton from './ActionsDeleteButton';
import { OctagonX, Trash2, UserX } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import CustomModal from '../modal/CustomModal';

const ActionsDropdown = ({
  label = 'actions',
  children,
  isDeleted,
  primaryKey,
  isDeletedDispatchAction,
  isNotDeletedDispatchAction,
  DeleteIcon,
  entityName,
  permaDelete,
}) => {
  const { tc } = useAppHooks();
  const softDeleteModal = useRef();
  const permaDeleteModal = useRef();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-foreground">
          {tc('actions')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{tc(label)}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Children.map(children, (child) => {
          const clonedChild = cloneElement(child, []);
          return (
            <DropdownMenuItem {...child.props}>
              {clonedChild.props.children}
            </DropdownMenuItem>
          );
        })}
        {/* //! SOFT DELETE */}
        {isDeletedDispatchAction && isNotDeletedDispatchAction && (
          <DropdownMenuItem
            isDeletedDispatchAction={isDeletedDispatchAction}
            isNotDeletedDispatchAction={isNotDeletedDispatchAction}
            className={
              'focus:bg-destructive focus:text-destructive-foreground flex justify-between'
            }
            onClick={() => {
              softDeleteModal.current.click();
            }}
          >
            {isDeleted
              ? tc(`${entityName}.enable`)
              : tc(`${entityName}.disable`)}
            {DeleteIcon ? (
              cloneElement(DeleteIcon, { className: 'w-4' })
            ) : (
              <OctagonX className="w-4" />
            )}
          </DropdownMenuItem>
        )}

        {/* //! PERMA DELETE */}

        {permaDelete && (
          <DropdownMenuItem
            permaDelete={permaDelete}
            className={
              'focus:bg-destructive focus:text-destructive-foreground flex justify-between'
            }
            onClick={() => {
              permaDeleteModal.current.click();
            }}
          >
            {tc(`${entityName}.delete`)}
            {DeleteIcon ? (
              cloneElement(DeleteIcon, { className: 'w-4' })
            ) : (
              <Trash2 className="w-4" />
            )}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>

      {/* //! SOFT DELETE MODAL */}
      <AlertDialog>
        <AlertDialogTrigger>
          <p
            ref={softDeleteModal}
            className="text-destructive cursor-pointer hidden"
          />
        </AlertDialogTrigger>
        <CustomModal
          confirmAction={
            isDeleted ? isDeletedDispatchAction : isNotDeletedDispatchAction
          }
          confirmTarget={primaryKey}
          title={isDeleted ? 'enableModalTitle' : 'disableModalTitle'}
          description={
            isDeleted
              ? `${entityName}.enableModalDescription`
              : `${entityName}.disableModalDescription`
          }
        />
      </AlertDialog>

      {/* //! PERMA DELETE MODAL */}
      <AlertDialog>
        <AlertDialogTrigger>
          <p
            ref={permaDeleteModal}
            className="text-destructive cursor-pointer hidden"
          />
        </AlertDialogTrigger>
        <CustomModal
          confirmAction={permaDelete}
          confirmTarget={primaryKey}
          title="deleteModalTitle"
          description={`${entityName}.deleteModalDescription`}
        />
      </AlertDialog>
    </DropdownMenu>
  );
};

ActionsDropdown.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
};

export default ActionsDropdown;
