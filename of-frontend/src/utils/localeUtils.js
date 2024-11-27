export const loadLocale = async (locale) => {
  switch (locale) {
    case 'it':
      return (await import('date-fns/locale/it')).default;
    case 'en':
      return (await import('date-fns/locale/en-US')).default;
    default:
      return (await import('date-fns/locale/it')).default;
  }
};
