'use client';

/**
 * Government Contracts Follow-Ups Widget
 * Managed by Alexis Best (AI Executive Assistant)
 * Displays pending government contract follow-ups with countdown timers and quick actions
 */

import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Send,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { calendarReminderService } from '../services/CalendarReminderService';
import {
  PendingFollowUp,
  dailyBriefingService,
} from '../services/DailyBriefingService';
import { emailMonitoringService } from '../services/EmailMonitoringService';

export default function GovernmentContractsFollowUps() {
  const [pendingFollowUps, setPendingFollowUps] = useState<PendingFollowUp[]>(
    []
  );
  const [selectedFollowUp, setSelectedFollowUp] =
    useState<PendingFollowUp | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFollowUps();

    // Refresh every 5 minutes
    const interval = setInterval(loadFollowUps, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadFollowUps = () => {
    setIsLoading(true);
    try {
      const followUps = dailyBriefingService.getPendingFollowUps();
      setPendingFollowUps(followUps);
    } catch (error) {
      console.error('Failed to load follow-ups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = (followUp: PendingFollowUp) => {
    setSelectedFollowUp(followUp);
    setShowEmailPreview(true);
  };

  const handleMarkReceived = (followUp: PendingFollowUp) => {
    if (confirm(`Mark response as received for ${followUp.title}?`)) {
      calendarReminderService.completeEvent(followUp.id);
      emailMonitoringService.deactivateMonitor(followUp.id);
      loadFollowUps();
      alert(
        `✅ ${followUp.title} marked as complete. Calendar reminder cancelled.`
      );
    }
  };

  const handlePostpone = (followUp: PendingFollowUp) => {
    const days = prompt('Postpone by how many days?', '7');
    if (days && !isNaN(parseInt(days))) {
      // In production, would update the calendar event date
      alert(`📅 Follow-up postponed by ${days} days`);
      loadFollowUps();
    }
  };

  const confirmSendEmail = () => {
    if (!selectedFollowUp) return;

    // In production, this would actually send the email
    alert(
      `📧 Follow-up email sent to ${selectedFollowUp.contactEmail}\nBCC: info@deedavis.biz`
    );

    // Mark as completed
    handleMarkReceived(selectedFollowUp);
    setShowEmailPreview(false);
    setSelectedFollowUp(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusBadge = (followUp: PendingFollowUp) => {
    if (followUp.status === 'overdue') {
      return (
        <span className='inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700'>
          <Clock className='h-3 w-3' />
          OVERDUE
        </span>
      );
    }
    if (followUp.daysUntilDue === 0) {
      return (
        <span className='inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700'>
          <Bell className='h-3 w-3' />
          DUE TODAY
        </span>
      );
    }
    if (followUp.daysUntilDue <= 3) {
      return (
        <span className='inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700'>
          <Clock className='h-3 w-3' />
          {followUp.daysUntilDue} day{followUp.daysUntilDue !== 1 ? 's' : ''}{' '}
          left
        </span>
      );
    }
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700'>
        <Calendar className='h-3 w-3' />
        {followUp.daysUntilDue} days
      </span>
    );
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-white'>
            🏛️ Government Contracts Follow-Ups
          </h2>
          <p className='text-sm text-slate-400'>
            Managed by Alexis Best, AI Executive Assistant
          </p>
        </div>
        <button
          onClick={loadFollowUps}
          className='rounded-lg bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600'
        >
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className='rounded-xl bg-slate-800 p-8 text-center'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500'></div>
          <p className='mt-4 text-slate-400'>Loading follow-ups...</p>
        </div>
      )}

      {/* No Follow-Ups */}
      {!isLoading && pendingFollowUps.length === 0 && (
        <div className='rounded-xl bg-slate-800 p-8 text-center'>
          <CheckCircle className='mx-auto h-12 w-12 text-green-500' />
          <h3 className='mt-4 text-lg font-semibold text-white'>
            All Caught Up!
          </h3>
          <p className='mt-2 text-slate-400'>
            No pending follow-ups at this time. Alexis is monitoring for new
            opportunities.
          </p>
        </div>
      )}

      {/* Pending Follow-Ups List */}
      {!isLoading && pendingFollowUps.length > 0 && (
        <div className='space-y-4'>
          {pendingFollowUps.map((followUp) => (
            <div
              key={followUp.id}
              className='rounded-xl border border-slate-700 bg-slate-800 p-6 transition hover:border-slate-600'
            >
              {/* Priority Indicator */}
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex items-start gap-3'>
                  <div
                    className={`mt-1 h-3 w-3 rounded-full ${getPriorityColor(followUp.priority)}`}
                  ></div>
                  <div>
                    <h3 className='text-lg font-semibold text-white'>
                      {followUp.title}
                    </h3>
                    {followUp.solicitationNumber && (
                      <p className='text-sm text-slate-400'>
                        Solicitation: {followUp.solicitationNumber}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(followUp)}
              </div>

              {/* Details */}
              <div className='mb-4 grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-slate-400'>Submitted</p>
                  <p className='font-medium text-white'>
                    {followUp.submittedDate}
                  </p>
                </div>
                <div>
                  <p className='text-slate-400'>Follow-up Due</p>
                  <p className='font-medium text-white'>
                    {new Date(followUp.followUpDueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className='text-slate-400'>Contact</p>
                  <p className='font-medium text-white'>
                    {followUp.contactEmail}
                  </p>
                </div>
                <div>
                  <p className='text-slate-400'>Type</p>
                  <p className='font-medium text-white uppercase'>
                    {followUp.type}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => handleSendEmail(followUp)}
                  className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500'
                >
                  <Send className='h-4 w-4' />
                  Send Follow-Up Email
                </button>
                <button
                  onClick={() => handleMarkReceived(followUp)}
                  className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500'
                >
                  <CheckCircle className='h-4 w-4' />
                  Mark Received
                </button>
                <button
                  onClick={() => handlePostpone(followUp)}
                  className='inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600'
                >
                  <Calendar className='h-4 w-4' />
                  Postpone
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview &&
        selectedFollowUp &&
        selectedFollowUp.emailTemplate && (
          <div className='bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
            <div className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-slate-800 p-6'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h3 className='text-xl font-bold text-white'>
                    Review Follow-Up Email
                  </h3>
                  <p className='text-sm text-slate-400'>
                    To: {selectedFollowUp.contactEmail} | BCC: info@deedavis.biz
                  </p>
                </div>
                <button
                  onClick={() => setShowEmailPreview(false)}
                  className='rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='space-y-4'>
                {/* Subject */}
                <div>
                  <label className='mb-1 block text-sm font-medium text-slate-400'>
                    Subject
                  </label>
                  <input
                    type='text'
                    value={selectedFollowUp.emailTemplate.subject}
                    readOnly
                    className='w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white'
                  />
                </div>

                {/* Body */}
                <div>
                  <label className='mb-1 block text-sm font-medium text-slate-400'>
                    Message
                  </label>
                  <textarea
                    value={selectedFollowUp.emailTemplate.body}
                    readOnly
                    rows={20}
                    className='w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 font-mono text-sm text-white'
                  />
                </div>

                {/* Actions */}
                <div className='flex gap-2'>
                  <button
                    onClick={confirmSendEmail}
                    className='flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500'
                  >
                    <Mail className='mr-2 inline h-5 w-5' />
                    Send Email
                  </button>
                  <button
                    onClick={() => setShowEmailPreview(false)}
                    className='rounded-lg bg-slate-700 px-4 py-3 font-medium text-white transition hover:bg-slate-600'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Summary Stats */}
      <div className='grid grid-cols-3 gap-4'>
        <div className='rounded-lg bg-slate-800 p-4 text-center'>
          <div className='text-3xl font-bold text-white'>
            {pendingFollowUps.length}
          </div>
          <div className='text-sm text-slate-400'>Total Pending</div>
        </div>
        <div className='rounded-lg bg-slate-800 p-4 text-center'>
          <div className='text-3xl font-bold text-orange-500'>
            {pendingFollowUps.filter((f) => f.daysUntilDue <= 3).length}
          </div>
          <div className='text-sm text-slate-400'>Due This Week</div>
        </div>
        <div className='rounded-lg bg-slate-800 p-4 text-center'>
          <div className='text-3xl font-bold text-red-500'>
            {pendingFollowUps.filter((f) => f.status === 'overdue').length}
          </div>
          <div className='text-sm text-slate-400'>Overdue</div>
        </div>
      </div>
    </div>
  );
}
