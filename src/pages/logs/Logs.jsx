import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LogRow from './LogRow';
import { Spinner } from '@/components/ui/spinner';
import { useAppHooks } from '@/hooks/useAppHooks';
import { getAllLogs } from '@/redux/logsSlice';

const Logs = () => {
  const { logs, loading, error } = useSelector((state) => state.logs);
  const { tc, dispatch } = useAppHooks();
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    dispatch(getAllLogs());
  }, [dispatch]);

  const handleRowHover = (id) => {
    setHoveredRowId(id);
    setIsHovering(true);
  };

  const handleRowLeave = () => {
    setHoveredRowId(null);
    setIsHovering(false);
  };

  return (
    <div className="container border h-[calc(100vh-180px)] overflow-x-scroll text-start p-2 bg-muted-darker rounded font-mono flex flex-col gap-2">
      {!logs.length ? (
        <Spinner />
      ) : (
        logs.map((log) => (
          <LogRow
            key={log.id}
            {...log}
            isHovered={hoveredRowId === log.id}
            isHovering={isHovering}
            onHover={handleRowHover}
            onLeave={handleRowLeave}
          />
        ))
      )}
    </div>
  );
};

export default Logs;
