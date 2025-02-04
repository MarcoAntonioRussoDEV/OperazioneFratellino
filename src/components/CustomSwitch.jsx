import { Switch } from './ui/switch';
import React from 'react';
import { Label } from './ui/label';

const CustomSwitch = ({ id, label, onChecked, checked }) => {
  return (
    <div className="flex items-center gap-2">
      <Switch onCheckedChange={onChecked} id={id} checked={checked} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
};

export default CustomSwitch;
