export const fieldSettingsResolver = (entity, field, targetValue) => {
  for (const [fieldKey, fieldSettings] of Object.entries(entity.fields)) {
    if (fieldKey === field) {
      return fieldSettings[targetValue];
    }
  }
};
