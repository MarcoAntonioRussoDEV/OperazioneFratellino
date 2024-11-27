import React from 'react';

const ConditionalRender = ({
  condition,
  trueComponent: TrueComponent,
  falseComponent: FalseComponent,
}) => {
  return condition ? TrueComponent : FalseComponent;
};

export default ConditionalRender;
