import { capitalize } from './FormatUtils';
import { BadgeCheck, CircleX, TriangleAlert } from 'lucide-react';

const STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  LOADING: 'loading',
  GENERIC_ERROR: 'generic error',
  WARNING: 'warning',
};

export default function iconToast(status, response) {
  //TODO STATUS NOT DEFINED COLOR YELLOW

  if (response === STATUS.GENERIC_ERROR) {
    status = STATUS.WARNINGN;
  }

  let icon;
  switch (status) {
    case STATUS.SUCCESS: {
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
