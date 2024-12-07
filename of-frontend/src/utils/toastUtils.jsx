import { capitalize } from './FormatUtils';
import { BadgeCheck, CircleX, TriangleAlert } from 'lucide-react';

const STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  LOADING: 'loading',
  GENERIC_ERROR: 'generic error',
  WARNING: 'warning',
  CREATED: 'created',
  DELETED: 'deleted',
};

export default function iconToast(status, response) {
  if (response === STATUS.GENERIC_ERROR) {
    status = STATUS.WARNINGN;
  }
  let icon;
  switch (status) {
    case STATUS.SUCCESS: {
      icon = <BadgeCheck />;
      break;
    }
    case STATUS.CREATED: {
      icon = <BadgeCheck />;
      break;
    }
    case STATUS.DELETED: {
      icon = <BadgeCheck />;
      break;
    }
    case STATUS.FAILED: {
      icon = <CircleX />;
      break;
    }
    default: {
      status = 'warning';
      icon = <TriangleAlert />;
    }
  }
  return {
    description: (
      <div className="flex items-center gap-4">
        {icon}
        {capitalize(response)}
      </div>
    ),
    variant: status,
  };
}
