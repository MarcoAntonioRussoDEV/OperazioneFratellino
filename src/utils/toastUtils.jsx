import { capitalize } from './formatUtils';
import { BadgeCheck, CircleX, TriangleAlert } from 'lucide-react';

export const STATUS_ENUM = {
  SUCCESS: 'success',
  CREATED: 'created',
  CONVERTED: 'converted',
  FULFILLED: 'fulfilled',
  RESET: 'reset',
  ADDED: 'added',
  LOADING: 'loading',
  GENERIC_ERROR: 'generic error',
  WARNING: 'warning',
  FAILED: 'failed',
  DELETED: 'deleted',
};

export default function iconToast(status, response) {
  if (response === STATUS_ENUM.GENERIC_ERROR) {
    status = STATUS_ENUM.WARNING;
  }

  switch (status) {
    case STATUS_ENUM.CREATED:
      status = STATUS_ENUM.SUCCESS;
      break;
    case STATUS_ENUM.FULFILLED:
      status = STATUS_ENUM.SUCCESS;
      break;
    case STATUS_ENUM.CONVERTED:
      status = STATUS_ENUM.SUCCESS;
      break;
    case STATUS_ENUM.ADDED:
      status = STATUS_ENUM.SUCCESS;
      break;
    case STATUS_ENUM.RESET:
      status = STATUS_ENUM.SUCCESS;
      break;
  }

  let icon;
  switch (status) {
    case STATUS_ENUM.SUCCESS: {
      icon = <BadgeCheck />;
      break;
    }
    case STATUS_ENUM.DELETED: {
      icon = <BadgeCheck />;
      break;
    }
    case STATUS_ENUM.FAILED: {
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
