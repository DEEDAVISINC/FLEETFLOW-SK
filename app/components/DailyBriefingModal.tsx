'use client';

import React, { useEffect, useState } from 'react';
import {
  DailyBriefingData,
  FollowUpItem,
  MeetingItem,
  PriorityItem,
  StrategicQuestion,
} from '../services/DailyBriefingService';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefingData?: DailyBriefingData;
  onGenerateNew?: () => void;
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({
  isOpen,
  onClose,
  briefingData,
  onGenerateNew,
}) => {
  const [loading, setLoading] = useState(false);
  const [localBriefingData, setLocalBriefingData] =
    useState<DailyBriefingData | null>(briefingData || null);

  useEffect(() => {
    if (isOpen && !briefingData) {
      loadBriefingData();
    } else if (briefingData) {
      setLocalBriefingData(briefingData);
    }
  }, [isOpen, briefingData]);

  const loadBriefingData = async () => {
    setLoading(true);
    try {
      // In a real app, you'd get userId and tenantId from auth context
      const userId = 'demo_user';
      const tenantId = 'demo_tenant';

      const response = await fetch(
        `/api/daily-briefing/data?userId=${userId}&tenantId=${tenantId}`
      );
      const result = await response.json();

      if (result.success) {
        setLocalBriefingData(result.data);
      }
    } catch (error) {
      console.error('Error loading briefing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = async () => {
    setLoading(true);
    try {
      const userId = 'demo_user';
      const tenantId = 'demo_tenant';

      const response = await fetch('/api/daily-briefing/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tenantId,
          scheduleTime: '08:00',
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadBriefingData(); // Reload the data
        if (onGenerateNew) onGenerateNew();
      }
    } catch (error) {
      console.error('Error generating new briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='flex items-center gap-2 text-2xl font-bold'>
                🌅 Your Daily Briefing
              </h2>
              <p className='mt-1 text-blue-100'>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handleGenerateNew}
                disabled={loading}
                className='bg-opacity-20 hover:bg-opacity-30 rounded-lg bg-white px-4 py-2 text-white transition-colors disabled:opacity-50'
              >
                {loading ? '🔄 Generating...' : '🔄 Generate New'}
              </button>
              <button
                onClick={onClose}
                className='text-xl text-white hover:text-gray-200'
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='max-h-[calc(90vh-120px)] overflow-y-auto p-6'>
          {loading && !localBriefingData ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
                <p className='text-gray-600'>
                  Generating your personalized briefing...
                </p>
              </div>
            </div>
          ) : localBriefingData ? (
            <div className='space-y-8'>
              {/* Success Definition */}
              <div className='rounded-r-lg border-l-4 border-green-500 bg-green-50 p-6'>
                <h3 className='mb-3 flex items-center gap-2 text-lg font-semibold text-green-800'>
                  🎯 Today's Success Definition
                </h3>
                <p className='leading-relaxed text-green-700'>
                  {localBriefingData.successDefinition}
                </p>
              </div>

              {/* Top Priorities */}
              <div>
                <h3 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800'>
                  🎯 Top Priorities ({localBriefingData.topPriorities.length})
                </h3>
                <div className='space-y-4'>
                  {localBriefingData.topPriorities.map((priority, index) => (
                    <PriorityCard
                      key={priority.id}
                      priority={priority}
                      index={index + 1}
                    />
                  ))}
                </div>
              </div>

              {/* Meetings */}
              {localBriefingData.meetings.length > 0 && (
                <div>
                  <h3 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800'>
                    📅 Meetings ({localBriefingData.meetings.length})
                  </h3>
                  <div className='space-y-4'>
                    {localBriefingData.meetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-ups */}
              {localBriefingData.followUps.length > 0 && (
                <div>
                  <h3 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800'>
                    📝 Follow-ups ({localBriefingData.followUps.length})
                  </h3>
                  <div className='space-y-3'>
                    {localBriefingData.followUps.map((followUp) => (
                      <FollowUpCard key={followUp.id} followUp={followUp} />
                    ))}
                  </div>
                </div>
              )}

              {/* Strategic Questions */}
              {localBriefingData.strategicQuestions.length > 0 && (
                <div>
                  <h3 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800'>
                    🤔 Strategic Questions (
                    {localBriefingData.strategicQuestions.length})
                  </h3>
                  <div className='space-y-4'>
                    {localBriefingData.strategicQuestions.map(
                      (question, index) => (
                        <StrategicQuestionCard
                          key={index}
                          question={question}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='py-12 text-center'>
              <p className='text-gray-600'>
                Unable to load briefing data. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for individual priority items
const PriorityCard: React.FC<{ priority: PriorityItem; index: number }> = ({
  priority,
  index,
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-green-500 bg-green-50';
    }
  };

  const getUrgencyEmoji = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      default:
        return '🟢';
    }
  };

  return (
    <div
      className={`rounded-r-lg border-l-4 p-4 ${getUrgencyColor(priority.urgency)}`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <h4 className='mb-2 font-semibold text-gray-800'>
            {index}. {priority.title}
          </h4>
          <p className='mb-3 leading-relaxed text-gray-700'>
            {priority.description}
          </p>
          <div className='flex items-center gap-4 text-sm text-gray-600'>
            <span className='flex items-center gap-1'>
              ⏱️ {priority.estimatedTime}
            </span>
            <span className='flex items-center gap-1'>
              {getUrgencyEmoji(priority.urgency)}{' '}
              {priority.urgency.toUpperCase()}
            </span>
            <span className='rounded bg-gray-200 px-2 py-1 text-xs'>
              {priority.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for meeting items
const MeetingCard: React.FC<{ meeting: MeetingItem }> = ({ meeting }) => {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='mb-3 flex items-start justify-between'>
        <h4 className='font-semibold text-gray-800'>{meeting.title}</h4>
        <div className='text-right text-sm text-gray-600'>
          <div>{meeting.time}</div>
          <div>({meeting.duration})</div>
        </div>
      </div>

      <div className='mb-3 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <span className='text-sm font-medium text-gray-700'>
            Participants:
          </span>
          <p className='mt-1 text-sm text-gray-600'>
            {meeting.participants.join(', ')}
          </p>
        </div>
        <div>
          <span className='text-sm font-medium text-gray-700'>Location:</span>
          <p className='mt-1 text-sm text-gray-600'>{meeting.location}</p>
        </div>
      </div>

      {meeting.prepNotes.length > 0 && (
        <div>
          <span className='text-sm font-medium text-gray-700'>
            Preparation Notes:
          </span>
          <ul className='mt-1 list-inside list-disc text-sm text-gray-600'>
            {meeting.prepNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Component for follow-up items
const FollowUpCard: React.FC<{ followUp: FollowUpItem }> = ({ followUp }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3'>
      <div className={`mt-1 ${getPriorityColor(followUp.priority)}`}>
        {followUp.priority === 'high'
          ? '🔴'
          : followUp.priority === 'medium'
            ? '🟡'
            : '🟢'}
      </div>
      <div className='flex-1'>
        <p className='font-medium text-gray-800'>{followUp.description}</p>
        <p className='mt-1 text-sm text-gray-600'>{followUp.originalContext}</p>
        <p className='mt-1 text-xs text-gray-500'>Due: {followUp.dueDate}</p>
      </div>
    </div>
  );
};

// Component for strategic questions
const StrategicQuestionCard: React.FC<{ question: StrategicQuestion }> = ({
  question,
}) => {
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-blue-300 bg-blue-50';
    }
  };

  return (
    <div
      className={`rounded-r-lg border-l-4 p-4 ${getImportanceColor(question.importance)}`}
    >
      <h4 className='mb-2 font-semibold text-gray-800'>{question.question}</h4>
      <p className='mb-2 text-gray-700'>{question.context}</p>
      <div className='flex items-center gap-4 text-sm text-gray-600'>
        <span className='flex items-center gap-1'>
          📊 {question.importance.toUpperCase()} IMPORTANCE
        </span>
        <span className='flex items-center gap-1'>⏰ {question.timeframe}</span>
      </div>
    </div>
  );
};

export default DailyBriefingModal;

