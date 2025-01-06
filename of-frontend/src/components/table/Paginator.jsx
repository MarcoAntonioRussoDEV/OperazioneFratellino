import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAppHooks } from '@/hooks/useAppHooks';

const Paginator = ({
  handlePrevious,
  handleNext,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  setPage,
}) => {
  const { dispatch } = useAppHooks();
  return (
    <Pagination
      className={totalItems === 0 || itemsPerPage > 50 ? 'hidden' : ''}
    >
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 0}
            onClick={handlePrevious}
          />
        </PaginationItem>
        {totalPages > 0 &&
          Array.from({ length: totalPages }, (_, i) => i + 1)
            .splice(0, 3)
            .map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage + 1}
                  onClick={() => dispatch(setPage(page - 1))}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
        {totalPages > 3 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === totalPages - 1}
                onClick={() => dispatch(setPage(totalPages - 1))}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            disabled={currentPage === totalPages - 1}
            onClick={handleNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginator;
