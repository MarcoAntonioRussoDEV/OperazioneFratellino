import React from 'react';
import { useFormContext } from 'react-hook-form';

// eslint-disable-next-line react/display-name
const withFormContext = (Component) => (props) => {
  const { control, register } = useFormContext();
  return <Component control={control} register={register} {...props} />;
};

export default withFormContext;
