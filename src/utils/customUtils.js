export const fieldSettingsResolver = (entity, field, targetValue) => {
  for (const [fieldKey, fieldSettings] of Object.entries(entity.fields)) {
    if (fieldKey === field) {
      return fieldSettings[targetValue];
    }
  }
};

export const extractCategoryByProduct = (productCode) => {
  return productCode.substring(0, 4);
};
