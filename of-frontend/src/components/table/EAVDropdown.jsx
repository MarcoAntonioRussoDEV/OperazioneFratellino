import React, { useEffect, useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { capitalize, useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';

const EAVDropdown = ({
  relateEntity,
  dropDownName,
  relateDisplayField,
  relateDisplayValue,
}) => {
  const chevronRef = useRef(null);
  const tc = useTranslateAndCapitalize();
  const handleOpen = () => {
    chevronRef.current.classList.toggle('rotate-[-180deg]');
  };
  const sortedRelateEntity = [...relateEntity].sort((a, b) => a.id - b.id);

  return (
    <>
      <DropdownMenu onOpenChange={handleOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="text" className="px-0" onClick={handleOpen}>
            {tc(dropDownName)}
            <ChevronDownIcon ref={chevronRef} className="duration-200" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent /* className="w-48" */>
          <DropdownMenuLabel>{tc(dropDownName)}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {Object.entries(sortedRelateEntity).map(([key, value]) => {
            return (
              <DropdownMenuItem key={key}>
                {tc(value[relateDisplayField])}
                <DropdownMenuShortcut>
                  {tc(value[relateDisplayValue])}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

EAVDropdown.propTypes = {
  dropDownName: PropTypes.string.isRequired,
  relateDisplayField: PropTypes.string.isRequired,
  relateDisplayValue: PropTypes.string.isRequired,
  relateEntity: PropTypes.object.isRequired,
};

export default EAVDropdown;

//TODO Rifattorizzare componente per dividere l'effettivo MTM dal multi MTM
