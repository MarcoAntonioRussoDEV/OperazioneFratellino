import { useTranslation } from 'react-i18next';
import { UserRound } from 'lucide-react';
import { loadLocale } from './localeUtils';
import i18n from '../../i18n';
import { format } from 'date-fns';

export function capitalize(string) {
  if (typeof string === 'string') {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
}

export function codify(int) {
  int += '';
  while (int.length < 3) {
    int = '0' + int;
  }

  return int;
}

export const useTranslateAndCapitalize = () => {
  const { t } = useTranslation();

  const translateAndCapitalize = (key, context) => {
    return capitalize(t(key, { context }));
  };

  return translateAndCapitalize;
};

export const extractLastCode = (array, categoryCode) => {
  const { length } = array;
  const lastCode = array[length - 1]?.code.replace(categoryCode, '');
  return lastCode !== undefined ? parseInt(lastCode) : 0;
};

export const generateProductCode = (/* array */ category, categoryCode) => {
  // return categoryCode + codify(extractLastCode(array, categoryCode) + 1);
  return categoryCode + codify(category.lastCode + 1);
};

export const usernameInitials = (username) => {
  let initials = username
    .trim()
    .split(' ')
    .map((el) => el[0].toUpperCase());
  if (initials.length > 1) {
    return initials.splice(0, 2).join('');
  } else {
    return initials.join('');
  }
};

export const toHSL = (percentages) => {
  return `hsl(${percentages})`;
};

export const dateRangeResolver = (date, locale) => {
  return new Date(date).toLocaleString(locale, {
    month: 'long',
    year: 'numeric',
  });
};

export const monthsRangeResolver = (from, to) => {
  const splitFrom = from.split(' ');
  const splitTo = to.split(' ');
  if (splitFrom[0] === splitTo[0] && splitFrom[1] === splitTo[1]) {
    return `${capitalize(splitFrom[0])} ${capitalize(splitFrom[1])}`;
  } else if (splitFrom[1] === splitTo[1]) {
    return `${capitalize(splitFrom[0])} - ${capitalize(
      splitTo[0],
    )} ${capitalize(splitFrom[1])}`;
  } else {
    return `${capitalize(from)} - ${capitalize(to)}`;
  }
};

export const setCurrentMonth = () => {
  const firstCurrentMonth = new Date();
  firstCurrentMonth.setDate(1);
  return {
    from: firstCurrentMonth,
    to: new Date(),
  };
};

export const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy - hh:mm');
};
