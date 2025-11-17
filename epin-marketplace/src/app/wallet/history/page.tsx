'use client';

import { useState, useEffect } from 'react';
import TransactionHistoryHeader from '@/components/wallet/TransactionHistoryHeader';
import TransactionFilters from '@/components/wallet/TransactionFilters';
import TransactionsTable from '@/components/wallet/TransactionsTable';
import PaginationControls from '@/components/wallet/PaginationControls';
import { getTransactions, exportTransactionsToCSV } from '@/app/actions/transactions';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'all',
    type: 'all',
    status: 'all',
  });

  const fetchTransactions = async (page: number = 1) => {
    setLoading(true);
    try {
      const result = await getTransactions({
        ...filters,
        page,
        limit: 10,
      });

      if (result.success) {
        setTransactions(result.transactions);
        setTotalPages(result.totalPages || 1);
        setTotalItems(result.total || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleDateRangeChange = (range: string) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  const handleTypeChange = (type: string) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      dateRange: 'all',
      type: 'all',
      status: 'all',
    });
    fetchTransactions(1);
  };

  const handleApply = () => {
    fetchTransactions(1);
  };

  const handlePageChange = (page: number) => {
    fetchTransactions(page);
  };

  const handleExportCSV = async () => {
    try {
      const result = await exportTransactionsToCSV(filters);
      if (result.success && result.csvContent) {
        const blob = new Blob([result.csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', result.filename || 'transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleViewDetails = (transactionId: string) => {
    // TODO: Implement transaction details modal/page
    console.log('View transaction details:', transactionId);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <div className="layout-container flex h-full grow flex-col">
        <TransactionHistoryHeader />
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
            {/* Page Heading and Export Button */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-4">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                Transaction History
              </p>
              <button
                onClick={handleExportCSV}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-white/10 dark:bg-[#223d49] text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                <span className="truncate">Export to CSV</span>
              </button>
            </div>

            {/* Filters */}
            <TransactionFilters
              onSearchChange={handleSearchChange}
              onDateRangeChange={handleDateRangeChange}
              onTypeChange={handleTypeChange}
              onStatusChange={handleStatusChange}
              onReset={handleReset}
              onApply={handleApply}
            />

            {/* Transaction Table */}
            {loading ? (
              <div className="p-4 text-center text-white/50">Loading transactions...</div>
            ) : (
              <>
                <TransactionsTable transactions={transactions} onViewDetails={handleViewDetails} />
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={10}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

