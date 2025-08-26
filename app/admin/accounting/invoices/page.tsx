'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../config/access';
import { companyAccountingService } from '../../../services/TenantAccountingService';
import AccountingNavigation from '../components/AccountingNavigation';

export default function InvoicesPage() {
  const [activeRole, setActiveRole] = useState<'broker' | 'dispatcher'>(
    'broker'
  );
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user } = getCurrentUser();

  useEffect(() => {
    loadInvoices();
  }, [activeRole]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      // Load invoices based on the active role
      const invoiceData =
        activeRole === 'broker'
          ? companyAccountingService.getShipperInvoices()
          : companyAccountingService.getDispatcherInvoices();

      setInvoices(invoiceData);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter invoices based on search term and status filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      searchTerm === '' ||
      (invoice.shipperName &&
        invoice.shipperName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.carrierName &&
        invoice.carrierName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      invoice.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate summary statistics
  const invoiceStats = {
    total: filteredInvoices.length,
    totalAmount: filteredInvoices.reduce(
      (sum, inv) => sum + (inv.amount || inv.dispatchFee || 0),
      0
    ),
    pending: filteredInvoices.filter((inv) => inv.status === 'Pending').length,
    paid: filteredInvoices.filter((inv) => inv.status === 'Paid').length,
    overdue: filteredInvoices.filter((inv) => inv.status === 'Overdue').length,
    overdueAmount: filteredInvoices
      .filter((inv) => inv.status === 'Overdue')
      .reduce((sum, inv) => sum + (inv.amount || inv.dispatchFee || 0), 0),
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>
        Accounts Receivable Management
      </h1>

      {/* Navigation component for A/R Management section */}
      <AccountingNavigation activeSection='invoices' />

      {/* Role Selector */}
      <div className='mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'>
        <div className='mb-4 flex items-center'>
          <h2 className='mr-4 text-xl font-semibold text-gray-900 dark:text-white'>
            Invoice Management
          </h2>
          <div className='flex overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700'>
            <button
              className={`px-4 py-2 ${activeRole === 'broker' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
              onClick={() => setActiveRole('broker')}
            >
              Broker View
            </button>
            <button
              className={`px-4 py-2 ${activeRole === 'dispatcher' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
              onClick={() => setActiveRole('dispatcher')}
            >
              Dispatcher View
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-md bg-blue-50 p-4 dark:bg-blue-900/20'>
            <p className='text-sm text-blue-700 dark:text-blue-400'>
              Total Invoices
            </p>
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              {invoiceStats.total}
            </p>
          </div>
          <div className='rounded-md bg-green-50 p-4 dark:bg-green-900/20'>
            <p className='text-sm text-green-700 dark:text-green-400'>
              Total Amount
            </p>
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              ${invoiceStats.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className='rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20'>
            <p className='text-sm text-yellow-700 dark:text-yellow-400'>
              Pending
            </p>
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              {invoiceStats.pending}
            </p>
          </div>
          <div className='rounded-md bg-red-50 p-4 dark:bg-red-900/20'>
            <p className='text-sm text-red-700 dark:text-red-400'>Overdue</p>
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              ${invoiceStats.overdueAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='mb-6 flex flex-wrap gap-4'>
          <input
            type='text'
            placeholder='Search invoices...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-1 rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          >
            <option value='all'>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='paid'>Paid</option>
            <option value='overdue'>Overdue</option>
            <option value='sent'>Sent</option>
          </select>

          <button
            className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500'
            onClick={loadInvoices}
          >
            Refresh
          </button>

          <button className='rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 dark:bg-green-500'>
            New Invoice
          </button>
        </div>

        {/* Invoices Table */}
        <div className='overflow-x-auto'>
          <table className='min-w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800'>
            <thead className='bg-gray-100 dark:bg-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300'>
                  Invoice #
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300'>
                  {activeRole === 'broker' ? 'Shipper' : 'Carrier'}
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300'>
                  Amount
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300'>
                  Days
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800'>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'
                  >
                    Loading invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  >
                    <td className='px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white'>
                      {invoice.invoiceNumber}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400'>
                      {activeRole === 'broker'
                        ? invoice.shipperName
                        : invoice.carrierName}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400'>
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400'>
                      $
                      {(activeRole === 'broker'
                        ? invoice.amount
                        : invoice.dispatchFee
                      ).toLocaleString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                          invoice.status === 'Paid'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : invoice.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : invoice.status === 'Overdue'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400'>
                      {invoice.daysSinceInvoice}
                    </td>
                    <td className='px-6 py-4 text-right text-sm whitespace-nowrap'>
                      <button className='mr-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300'>
                        View
                      </button>
                      {invoice.status === 'Overdue' && (
                        <button className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'>
                          File Complaint
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
