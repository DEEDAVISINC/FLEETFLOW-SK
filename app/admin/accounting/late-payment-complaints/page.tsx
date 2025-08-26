'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../config/access';
import {
  LatePaymentComplaint,
  latePaymentComplaintService,
} from '../../../services/LatePaymentComplaintService';
import ComplaintForm from './components/ComplaintForm';
import FollowUpForm from './components/FollowUpForm';

export default function LatePaymentComplaintsPage() {
  const [complaints, setComplaints] = useState<LatePaymentComplaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] =
    useState<LatePaymentComplaint | null>(null);
  const [isAddingComplaint, setIsAddingComplaint] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'new' | 'in_progress' | 'resolved' | 'all'
  >('all');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);

  const { user } = getCurrentUser();
  const hasFinancePermission = [
    'admin',
    'finance_manager',
    'accountant',
  ].includes(user.role);

  useEffect(() => {
    loadComplaints();
    updateAnalytics();
  }, []);

  const loadComplaints = async () => {
    const allComplaints = await latePaymentComplaintService.getAllComplaints();
    setComplaints(allComplaints);
  };

  const updateAnalytics = () => {
    setAnalyticsData(latePaymentComplaintService.generateAnalyticsReport());
  };

  const handleCreateComplaint = (complaintData: any) => {
    latePaymentComplaintService.createComplaint(complaintData);
    loadComplaints();
    updateAnalytics();
    setIsAddingComplaint(false);
  };

  const handleStatusChange = (
    complaintId: string,
    newStatus: LatePaymentComplaint['status'],
    resolution?: string
  ) => {
    latePaymentComplaintService.updateComplaintStatus(
      complaintId,
      newStatus,
      resolution
    );
    loadComplaints();
    updateAnalytics();

    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              resolution: resolution || prev.resolution,
            }
          : null
      );
    }
  };

  const handleAddFollowUp = async (actionData: any) => {
    latePaymentComplaintService.addFollowUpAction(actionData);
    setIsAddingFollowUp(false);

    // Refresh the selected complaint
    if (selectedComplaint) {
      const updatedComplaint =
        await latePaymentComplaintService.getComplaintById(
          selectedComplaint.id
        );
      if (updatedComplaint) {
        setSelectedComplaint(updatedComplaint);
      }
    }

    loadComplaints();
  };

  const handleCompleteFollowUp = async (actionId: string) => {
    latePaymentComplaintService.completeFollowUpAction(actionId);

    // Refresh the selected complaint
    if (selectedComplaint) {
      const updatedComplaint =
        await latePaymentComplaintService.getComplaintById(
          selectedComplaint.id
        );
      if (updatedComplaint) {
        setSelectedComplaint(updatedComplaint);
      }
    }

    loadComplaints();
  };

  const filteredComplaints =
    activeTab === 'all'
      ? complaints
      : complaints.filter((c) => c.status === activeTab);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>
        Late Payment Complaint Management
      </h1>

      {/* Analytics Dashboard */}
      {analyticsData && (
        <div className='mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
            Analytics Overview
          </h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-md bg-blue-50 p-4 dark:bg-blue-900/20'>
              <p className='text-sm text-blue-700 dark:text-blue-400'>
                Total Outstanding
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                ${analyticsData.totalOutstandingAmount.toFixed(2)}
              </p>
            </div>
            <div className='rounded-md bg-amber-50 p-4 dark:bg-amber-900/20'>
              <p className='text-sm text-amber-700 dark:text-amber-400'>
                Open Complaints
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {analyticsData.byStatus.new + analyticsData.byStatus.inProgress}
              </p>
            </div>
            <div className='rounded-md bg-green-50 p-4 dark:bg-green-900/20'>
              <p className='text-sm text-green-700 dark:text-green-400'>
                Resolved
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {analyticsData.byStatus.resolved}
              </p>
            </div>
            <div className='rounded-md bg-purple-50 p-4 dark:bg-purple-900/20'>
              <p className='text-sm text-purple-700 dark:text-purple-400'>
                Avg. Days Overdue
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {Math.round(analyticsData.averageDaysOverdue)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Complaints List */}
        <div className='lg:w-1/2'>
          <div className='rounded-lg bg-white shadow-md dark:bg-gray-800'>
            <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
              <div>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Complaints
                </h2>
                <div className='mt-2 flex'>
                  {['all', 'new', 'in_progress', 'resolved'].map((tab) => (
                    <button
                      key={tab}
                      className={`rounded-md px-3 py-1 text-sm ${
                        activeTab === tab
                          ? 'bg-blue-100 font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab as any)}
                    >
                      {tab === 'in_progress'
                        ? 'In Progress'
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                onClick={() => setIsAddingComplaint(true)}
              >
                New Complaint
              </button>
            </div>
            <div className='max-h-[600px] overflow-y-auto'>
              {filteredComplaints.length === 0 ? (
                <p className='p-4 text-gray-500 dark:text-gray-400'>
                  No complaints found.
                </p>
              ) : (
                filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className={`cursor-pointer border-b border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                      selectedComplaint?.id === complaint.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : ''
                    }`}
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <div className='mb-2 flex items-start justify-between'>
                      <h3 className='font-medium text-gray-900 dark:text-white'>
                        {complaint.entityName}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          complaint.status === 'new'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : complaint.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : complaint.status === 'resolved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {complaint.status === 'in_progress'
                          ? 'In Progress'
                          : complaint.status.charAt(0).toUpperCase() +
                            complaint.status.slice(1)}
                      </span>
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      <p>
                        Invoice: {complaint.invoiceNumber} - $
                        {complaint.invoiceAmount}
                      </p>
                      <p>
                        Days Overdue:{' '}
                        <span className='font-medium text-red-600 dark:text-red-400'>
                          {complaint.daysOverdue}
                        </span>
                        {complaint.daysOverdue > 0 && (
                          <span className='ml-1 text-xs text-gray-500 italic dark:text-gray-400'>
                            (live)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Complaint Detail or Add Form */}
        <div className='lg:w-1/2'>
          {isAddingComplaint ? (
            <ComplaintForm
              onSubmit={handleCreateComplaint}
              onCancel={() => setIsAddingComplaint(false)}
            />
          ) : selectedComplaint ? (
            <div className='rounded-lg bg-white shadow-md dark:bg-gray-800'>
              <div className='border-b border-gray-200 p-6 dark:border-gray-700'>
                <div className='mb-4 flex items-start justify-between'>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      Complaint Details
                    </h2>
                    {selectedComplaint.contractReference && (
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Contract: {selectedComplaint.contractReference}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      selectedComplaint.status === 'new'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : selectedComplaint.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : selectedComplaint.status === 'resolved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {selectedComplaint.status === 'in_progress'
                      ? 'In Progress'
                      : selectedComplaint.status.charAt(0).toUpperCase() +
                        selectedComplaint.status.slice(1)}
                  </span>
                </div>

                <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Entity Type
                    </p>
                    <p className='text-gray-900 capitalize dark:text-white'>
                      {selectedComplaint.entityType}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Entity Name
                    </p>
                    <p className='text-gray-900 dark:text-white'>
                      {selectedComplaint.entityName}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Invoice Number
                    </p>
                    <p className='text-gray-900 dark:text-white'>
                      {selectedComplaint.invoiceNumber}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Invoice Amount
                    </p>
                    <p className='text-gray-900 dark:text-white'>
                      ${selectedComplaint.invoiceAmount}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Invoice Date
                    </p>
                    <p className='text-gray-900 dark:text-white'>
                      {new Date(
                        selectedComplaint.invoiceDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Due Date
                    </p>
                    <p className='text-gray-900 dark:text-white'>
                      {new Date(selectedComplaint.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Days Overdue
                    </p>
                    <div className='flex items-center'>
                      <p
                        className={`flex items-center font-medium ${
                          selectedComplaint.daysOverdue > 60
                            ? 'text-red-600 dark:text-red-400'
                            : selectedComplaint.daysOverdue > 30
                              ? 'text-orange-500 dark:text-orange-400'
                              : selectedComplaint.daysOverdue > 0
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {selectedComplaint.daysOverdue}
                        <span
                          className={`ml-2 rounded-full px-2 py-1 text-xs text-white ${
                            selectedComplaint.daysOverdue > 60
                              ? 'bg-red-600 dark:bg-red-700'
                              : selectedComplaint.daysOverdue > 30
                                ? 'bg-orange-500 dark:bg-orange-600'
                                : selectedComplaint.daysOverdue > 0
                                  ? 'bg-yellow-500 dark:bg-yellow-600'
                                  : 'bg-green-600 dark:bg-green-700'
                          }`}
                        >
                          {selectedComplaint.daysOverdue > 60
                            ? 'Critical'
                            : selectedComplaint.daysOverdue > 30
                              ? 'High'
                              : selectedComplaint.daysOverdue > 0
                                ? 'Medium'
                                : 'None'}
                        </span>
                        {selectedComplaint.lastUpdated && (
                          <span className='ml-2 text-xs font-normal text-gray-500 dark:text-gray-400'>
                            (updated{' '}
                            {new Date(
                              selectedComplaint.lastUpdated
                            ).toLocaleDateString()}
                            )
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Priority
                    </p>
                    <p
                      className={`capitalize ${
                        selectedComplaint.priority === 'high'
                          ? 'font-medium text-red-600 dark:text-red-400'
                          : selectedComplaint.priority === 'medium'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {selectedComplaint.priority}
                    </p>
                  </div>
                </div>

                <div className='mb-6'>
                  <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                    Previous Contact Attempts
                  </p>
                  <p className='rounded-md bg-gray-50 p-3 text-gray-900 dark:bg-gray-700/50 dark:text-gray-200'>
                    {selectedComplaint.contactAttempts || 'None recorded'}
                  </p>
                </div>

                <div className='mb-6'>
                  <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                    Additional Notes
                  </p>
                  <p className='rounded-md bg-gray-50 p-3 text-gray-900 dark:bg-gray-700/50 dark:text-gray-200'>
                    {selectedComplaint.description || 'No additional notes'}
                  </p>
                </div>

                {/* Legal Information */}
                <div className='mb-6'>
                  <div className='mb-1 flex items-center justify-between'>
                    <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                      Legal & Payment Information
                    </p>
                    {hasFinancePermission &&
                      selectedComplaint.status !== 'resolved' && (
                        <button
                          className='text-xs text-blue-600 hover:underline dark:text-blue-400'
                          onClick={() => {
                            // This would open a modal to edit legal details
                            alert(
                              'Edit legal details functionality would open here'
                            );
                          }}
                        >
                          Edit Details
                        </button>
                      )}
                  </div>

                  <div className='rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20'>
                    <div className='mb-3 grid grid-cols-2 gap-3'>
                      <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          Payment Terms
                        </p>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          {selectedComplaint.paymentTerms || 'Not specified'}
                        </p>
                      </div>

                      <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          Late Fee
                        </p>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          {selectedComplaint.lateFeePercentage
                            ? `${selectedComplaint.lateFeePercentage}% monthly`
                            : 'Not specified'}
                        </p>
                      </div>

                      {selectedComplaint.accruedLateFees &&
                        selectedComplaint.accruedLateFees > 0 && (
                          <div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                              Accrued Late Fees
                            </p>
                            <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                              ${selectedComplaint.accruedLateFees.toFixed(2)}
                            </p>
                          </div>
                        )}

                      <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          Total Outstanding
                        </p>
                        <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                          $
                          {(
                            selectedComplaint.invoiceAmount +
                            (selectedComplaint.accruedLateFees || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {selectedComplaint.legalNotes && (
                      <div className='mt-2 border-t border-blue-200 pt-2 text-xs text-gray-600 dark:border-blue-800/50 dark:text-gray-300'>
                        <p className='mb-1 font-medium'>Legal Notes:</p>
                        <p>{selectedComplaint.legalNotes}</p>
                      </div>
                    )}

                    {/* BROKERSNAPSHOT Integration */}
                    {(selectedComplaint.entityType === 'carrier' ||
                      selectedComplaint.entityType === 'driver') && (
                      <div className='mt-3 border-t border-blue-200 pt-3 dark:border-blue-800/50'>
                        <div className='mb-2 flex items-center justify-between'>
                          <div className='flex items-center'>
                            <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                              BROKERSNAPSHOT Status
                            </span>
                            {selectedComplaint.mcNumber && (
                              <span className='ml-2 text-xs text-gray-500 dark:text-gray-400'>
                                MC# {selectedComplaint.mcNumber}
                              </span>
                            )}
                          </div>

                          {!selectedComplaint.mcNumber &&
                            hasFinancePermission && (
                              <button
                                className='text-xs text-blue-600 hover:underline dark:text-blue-400'
                                onClick={() => {
                                  const mcNumber = prompt(
                                    'Enter MC Number to enable BROKERSNAPSHOT integration:'
                                  );
                                  if (mcNumber) {
                                    alert(
                                      `MC Number ${mcNumber} would be added to this complaint`
                                    );
                                    // In a real implementation, this would call an API to update the MC number
                                  }
                                }}
                              >
                                Add MC Number
                              </button>
                            )}
                        </div>

                        {selectedComplaint.mcNumber ? (
                          selectedComplaint.reviewPostedToBrokerSnapshot ? (
                            <div className='mb-2 flex items-center'>
                              <div className='rounded-full bg-red-100 p-1 dark:bg-red-900/30'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-4 w-4 text-red-600 dark:text-red-400'
                                  viewBox='0 0 20 20'
                                  fill='currentColor'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              </div>
                              <span className='ml-2 text-xs text-red-600 dark:text-red-400'>
                                Negative review posted to BROKERSNAPSHOT
                                {selectedComplaint.brokerSnapshotReviewDate && (
                                  <span className='ml-1 text-gray-500 dark:text-gray-400'>
                                    on{' '}
                                    {new Date(
                                      selectedComplaint.brokerSnapshotReviewDate
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </span>

                              {hasFinancePermission && (
                                <button
                                  className='ml-3 text-xs text-red-600 hover:underline dark:text-red-400'
                                  onClick={() => {
                                    const reason = prompt(
                                      'Enter reason for removing the review:'
                                    );
                                    if (reason) {
                                      alert(
                                        `Review would be removed with reason: ${reason}`
                                      );
                                      // In real implementation, this would call the removeBrokerSnapshotReview method
                                    }
                                  }}
                                >
                                  Remove Review
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                {selectedComplaint.daysOverdue >= 60 ? (
                                  <div className='flex items-center'>
                                    <div className='rounded-full bg-yellow-100 p-1 dark:bg-yellow-900/30'>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-4 w-4 text-yellow-600 dark:text-yellow-400'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                      >
                                        <path
                                          fillRule='evenodd'
                                          d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                                          clipRule='evenodd'
                                        />
                                      </svg>
                                    </div>
                                    <span className='ml-2 text-xs text-yellow-600 dark:text-yellow-400'>
                                      Eligible for automatic review posting (
                                      {selectedComplaint.daysOverdue} days
                                      overdue)
                                    </span>
                                  </div>
                                ) : (
                                  <div className='flex items-center'>
                                    <div className='rounded-full bg-gray-100 p-1 dark:bg-gray-700'>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-4 w-4 text-gray-600 dark:text-gray-400'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                      >
                                        <path
                                          fillRule='evenodd'
                                          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                                          clipRule='evenodd'
                                        />
                                      </svg>
                                    </div>
                                    <span className='ml-2 text-xs text-gray-600 dark:text-gray-400'>
                                      No review posted (requires 60+ days
                                      overdue)
                                    </span>
                                  </div>
                                )}
                              </div>

                              {hasFinancePermission &&
                                selectedComplaint.mcNumber && (
                                  <button
                                    className='rounded bg-red-100 px-3 py-1 text-xs text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    onClick={() => {
                                      const confirmed = confirm(
                                        `Are you sure you want to post a negative review for ${selectedComplaint.entityName} (MC# ${selectedComplaint.mcNumber}) to BROKERSNAPSHOT?\n\nThis action should only be taken after multiple collection attempts have failed.`
                                      );
                                      if (confirmed) {
                                        alert(
                                          'Review would be posted to BROKERSNAPSHOT'
                                        );
                                        // In a real implementation, this would call the postBrokerSnapshotReview method
                                      }
                                    }}
                                  >
                                    Post Review Now
                                  </button>
                                )}
                            </div>
                          )
                        ) : (
                          <div className='flex items-center'>
                            <div className='rounded-full bg-gray-100 p-1 dark:bg-gray-700'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4 text-gray-600 dark:text-gray-400'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </div>
                            <span className='ml-2 text-xs text-gray-600 dark:text-gray-400'>
                              No MC number provided - BROKERSNAPSHOT integration
                              unavailable
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Legal Action Buttons */}
                    {hasFinancePermission &&
                      selectedComplaint.status !== 'resolved' &&
                      selectedComplaint.status !== 'cancelled' && (
                        <div className='mt-3 flex justify-end space-x-2 border-t border-blue-200 pt-3 dark:border-blue-800/50'>
                          <button
                            className='rounded bg-blue-100 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            onClick={() => {
                              // This would open a modal to generate and send a demand letter
                              alert(
                                'Generate demand letter functionality would open here'
                              );
                            }}
                          >
                            Generate Demand Letter
                          </button>
                          <button
                            className='rounded bg-purple-100 px-3 py-1 text-xs text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                            onClick={() => {
                              // This would open a modal to upload legal documents
                              alert(
                                'Upload legal documents functionality would open here'
                              );
                            }}
                          >
                            Upload Legal Document
                          </button>
                        </div>
                      )}
                  </div>
                </div>

                {selectedComplaint.status === 'resolved' &&
                  selectedComplaint.resolution && (
                    <div className='mb-6'>
                      <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                        Resolution
                      </p>
                      <p className='rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/20 dark:text-green-300'>
                        {selectedComplaint.resolution}
                      </p>
                    </div>
                  )}

                {/* Status Actions */}
                {hasFinancePermission &&
                  selectedComplaint.status !== 'resolved' &&
                  selectedComplaint.status !== 'cancelled' && (
                    <div className='mb-6 flex flex-wrap gap-2'>
                      {selectedComplaint.status === 'new' && (
                        <button
                          className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                          onClick={() =>
                            handleStatusChange(
                              selectedComplaint.id,
                              'in_progress'
                            )
                          }
                        >
                          Mark In Progress
                        </button>
                      )}
                      <button
                        className='rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                        onClick={() => {
                          const resolution = window.prompt(
                            'Enter resolution details:'
                          );
                          if (resolution) {
                            handleStatusChange(
                              selectedComplaint.id,
                              'resolved',
                              resolution
                            );
                          }
                        }}
                      >
                        Mark Resolved
                      </button>
                      <button
                        className='rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600'
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure you want to cancel this complaint?'
                            )
                          ) {
                            handleStatusChange(
                              selectedComplaint.id,
                              'cancelled'
                            );
                          }
                        }}
                      >
                        Cancel Complaint
                      </button>
                    </div>
                  )}
              </div>

              {/* Follow-up Actions */}
              <div className='p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    Follow-up Actions
                  </h3>
                  {hasFinancePermission &&
                    selectedComplaint.status !== 'resolved' &&
                    selectedComplaint.status !== 'cancelled' && (
                      <button
                        className='rounded-md bg-blue-100 px-3 py-1 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                        onClick={() => setIsAddingFollowUp(true)}
                      >
                        Add Follow-up
                      </button>
                    )}
                </div>

                {isAddingFollowUp ? (
                  <FollowUpForm
                    complaintId={selectedComplaint.id}
                    onSubmit={handleAddFollowUp}
                    onCancel={() => setIsAddingFollowUp(false)}
                  />
                ) : null}

                <div>
                  {latePaymentComplaintService.getFollowUpActions(
                    selectedComplaint.id
                  ).length === 0 ? (
                    <p className='text-sm text-gray-500 italic dark:text-gray-400'>
                      No follow-up actions recorded
                    </p>
                  ) : (
                    <div className='space-y-3'>
                      {latePaymentComplaintService
                        .getFollowUpActions(selectedComplaint.id)
                        .map((action) => (
                          <div
                            key={action.id}
                            className={`rounded-md p-3 ${
                              action.status === 'completed'
                                ? 'border border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/20'
                                : 'border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50'
                            }`}
                          >
                            <div className='flex justify-between'>
                              <div>
                                <span
                                  className={`mr-2 inline-block rounded-full px-2 py-1 text-xs ${
                                    action.actionType === 'email'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                      : action.actionType === 'call'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                        : action.actionType === 'letter'
                                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                          : action.actionType === 'legal'
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                            : action.actionType ===
                                                'payment_plan'
                                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {action.actionType
                                    .replace('_', ' ')
                                    .toUpperCase()}
                                </span>
                                <span className='font-medium text-gray-900 dark:text-white'>
                                  {action.description}
                                </span>
                              </div>
                              {hasFinancePermission &&
                                action.status !== 'completed' &&
                                selectedComplaint.status !== 'resolved' && (
                                  <button
                                    className='rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                                    onClick={() =>
                                      handleCompleteFollowUp(action.id)
                                    }
                                  >
                                    Mark Complete
                                  </button>
                                )}
                            </div>

                            <div className='mt-1 text-sm'>
                              <span className='text-gray-500 dark:text-gray-400'>
                                Due:{' '}
                                {new Date(action.dueDate).toLocaleDateString()}
                              </span>
                              <span className='mx-2'>•</span>
                              <span className='text-gray-500 dark:text-gray-400'>
                                Assigned to: {action.assignedTo}
                              </span>
                            </div>

                            {action.status === 'completed' &&
                              action.completedAt && (
                                <div className='mt-1 text-sm text-green-600 dark:text-green-400'>
                                  <span>
                                    Completed:{' '}
                                    {new Date(
                                      action.completedAt
                                    ).toLocaleDateString()}
                                  </span>
                                  {action.notes && (
                                    <p className='mt-1 text-gray-600 dark:text-gray-400'>
                                      {action.notes}
                                    </p>
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md dark:bg-gray-800'>
              <div className='mb-4 text-6xl'>📋</div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
                No Complaint Selected
              </h3>
              <p className='mb-6 text-center text-gray-500 dark:text-gray-400'>
                Select a complaint from the list to view details or click the
                button below to create a new complaint.
              </p>
              <button
                className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                onClick={() => setIsAddingComplaint(true)}
              >
                Create New Complaint
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
