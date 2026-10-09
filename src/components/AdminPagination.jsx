import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminPagination = ({
  currentPage,
  totalItems,
  itemsPerPage = 5,
  onPageChange,
  itemLabel = 'records',
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safePage * itemsPerPage, totalItems);

  return (
    <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
      <span>
        Showing{' '}
        <strong className="text-slate-800 dark:text-slate-200">
          {startIndex === 0 ? 0 : `${startIndex}–${endIndex}`}
        </strong>{' '}
        of <strong className="text-slate-800 dark:text-slate-200">{totalItems}</strong> {itemLabel}
      </span>

      {totalPages > 1 ? (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer font-semibold"
          >
            <ChevronLeft size={13} />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const active = page === safePage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`w-7 h-7 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center justify-center ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/30'
                      : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer font-semibold"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>
      ) : (
        <span>Page 1 of 1</span>
      )}
    </div>
  );
};

export default AdminPagination;

