import { format } from 'date-fns';
import React from 'react';

const LogRow = ({
  id,
  message,
  severity,
  createdAt,
  caller,
  isHovered,
  isHovering,
  onHover,
  onLeave,
}) => {
  const severityColor = () => {
    switch (severity) {
      case 'INFO':
        return 'bg-blue-500';
      case 'ERROR':
        return 'bg-red-500';
      case 'WARNING':
        return 'bg-yellow-500 text-warning-foreground';
      case 'DEBUG':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`rounded duration-200 relative pl-5 ${
        isHovered && 'hover:brightness-125 hover:shadow-md'
      }
        ${isHovering && !isHovered && 'brightness-75'}
      }`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
    >
      <span className="absolute left-0">&gt;</span>
      <span className="inline-block text-warning mr-2">
        {format(new Date(createdAt), 'dd/MM/yyyy - hh:mm:ss')}
      </span>
      <span className={`inline-block ${severityColor()} px-2 rounded mr-2`}>
        {severity}
      </span>
      <span className="inline-block mr-2">{message}</span>
      <span className="inline-block text-purple-500 underline">{caller}</span>
    </div>
  );
};

export default LogRow;
