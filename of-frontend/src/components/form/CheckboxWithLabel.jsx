import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '../ui/label';
import { useAppHooks } from '@/hooks/useAppHooks';

const CheckboxWithLabel = ({ label, onChecked }, ...props) => {
  const { tc } = useAppHooks();
  return (
    <div className="flex gap-2 items-center" {...props}>
      <Checkbox
        id={`checkbox-${label}`}
        onCheckedChange={() => onChecked(label)}
      />
      <Label className="whitespace-nowrap" htmlFor={`checkbox-${label}`}>
        {tc(label)}
      </Label>
    </div>
  );
};

CheckboxWithLabel.propTypes = {
  label: PropTypes.string,
  onChecked: PropTypes.func,
};

export default CheckboxWithLabel;
