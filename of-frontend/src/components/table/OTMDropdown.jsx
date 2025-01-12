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
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils';
import { ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const OTMDropdown = ({
  relateEntity,
  dropDownName,
  relateDisplayField,
  relateDisplayValue,
  targetNavigate,
}) => {
  const chevronRef = useRef(null);
  const tc = useTranslateAndCapitalize();
  const navigate = useNavigate();
  const handleOpen = () => {
    chevronRef.current.classList.toggle('rotate-[-180deg]');
  };

  const sortedRelateEntity = [...relateEntity].sort((a, b) => a.id - b.id);

  const handleShowRelate = (value) => {
    navigate(`/${targetNavigate}/${value}`);
  };
  return (
    <>
      <DropdownMenu onOpenChange={handleOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="text" className="px-0" onClick={handleOpen}>
            {tc(dropDownName)}
            <ChevronDownIcon ref={chevronRef} className="duration-200" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>{tc(dropDownName)}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {Object.entries(sortedRelateEntity).map(([key, value]) => {
            return (
              <DropdownMenuItem
                key={key}
                onClick={() => handleShowRelate(value[relateDisplayField])}
              >
                {tc(value[relateDisplayField])}
                <DropdownMenuShortcut>
                  {value[relateDisplayValue] ? (
                    value[relateDisplayValue]
                  ) : (
                    <ExternalLink />
                  )}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

OTMDropdown.propTypes = {
  dropDownName: PropTypes.string.isRequired,
  relateDisplayField: PropTypes.string.isRequired,
  relateEntity: PropTypes.object.isRequired,
};

export default OTMDropdown;
