'use client';

import {
  Award,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Lightbulb,
  MessageSquare,
  Share2,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
  CrossTrainingSession,
  KnowledgePattern,
  KnowledgeRequest,
} from '../services/AIStaffKnowledgeSharingService';
import { aiStaffKnowledgeSharingService } from '../services/AIStaffKnowledgeSharingService';

export default function AIStaffCrossTrainingNetwork() {
  const [activeTab, setActiveTab] = useState<
    'patterns' | 'requests' | 'sessions' | 'analytics'
  >('patterns');
  const [knowledgePatterns, setKnowledgePatterns] = useState<
    KnowledgePattern[]
  >([]);
  const [knowledgeRequests, setKnowledgeRequests] = useState<
    KnowledgeRequest[]
  >([]);
  const [upcomingSessions, setUpcomingSessions] = useState<
    CrossTrainingSession[]
  >([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const loadData = () => {
    setIsLoading(true);
    try {
      // Load knowledge patterns
      const patterns = aiStaffKnowledgeSharingService.getKnowledgePatterns(
        selectedCategory !== 'all' ? { category: selectedCategory } : undefined
      );
      setKnowledgePatterns(patterns);

      // Load knowledge requests
      const requests = aiStaffKnowledgeSharingService.getKnowledgeRequests({
        resolved: false,
      });
      setKnowledgeRequests(requests);

      // Load upcoming sessions
      const sessions = aiStaffKnowledgeSharingService.getUpcomingSessions();
      setUpcomingSessions(sessions);

      // Load analytics
      const analyticsData =
        aiStaffKnowledgeSharingService.getKnowledgeSharingAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load cross-training data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories', icon: '📚' },
    { id: 'communication', label: 'Communication', icon: '💬' },
    { id: 'problem_solving', label: 'Problem Solving', icon: '🧩' },
    { id: 'customer_handling', label: 'Customer Handling', icon: '👥' },
    { id: 'compliance', label: 'Compliance', icon: '⚖️' },
    { id: 'sales', label: 'Sales', icon: '💰' },
    { id: 'operations', label: 'Operations', icon: '⚙️' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <Brain className='mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500' />
          <p className='text-gray-500'>Loading Cross-Training Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-white/20'>
              <Brain className='h-8 w-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>
                🤝 AI Staff Cross-Training Network
              </h1>
              <p className='text-blue-100'>
                Collaborative knowledge sharing and continuous learning across
                all AI staff
              </p>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold'>
              {analytics?.totalPatterns || 0}
            </div>
            <div className='text-sm text-blue-100'>Knowledge Patterns</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='flex space-x-1 rounded-lg bg-gray-100 p-1'>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'patterns'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className='mr-2 inline h-4 w-4' />
          Knowledge Patterns
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'requests'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className='mr-2 inline h-4 w-4' />
          Help Requests ({knowledgeRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'sessions'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className='mr-2 inline h-4 w-4' />
          Training Sessions ({upcomingSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className='mr-2 inline h-4 w-4' />
          Analytics
        </button>
      </div>

      {/* Category Filter */}
      {activeTab === 'patterns' && (
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className='mr-2'>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {activeTab === 'patterns' && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {knowledgePatterns.map((pattern) => (
            <div
              key={pattern.id}
              className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md'
            >
              <div className='mb-3 flex items-start justify-between'>
                <div className='flex-1'>
                  <h3 className='mb-1 font-semibold text-gray-800'>
                    {pattern.title}
                  </h3>
                  <p className='mb-2 text-sm text-gray-600'>
                    {pattern.description}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <span>by {pattern.originalStaffName}</span>
                    <span>•</span>
                    <span>{pattern.originalDepartment}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(pattern.difficulty)}`}
                >
                  {pattern.difficulty}
                </span>
              </div>

              <div className='mb-3 flex items-center justify-between text-sm'>
                <div className='flex items-center gap-4'>
                  <span className='flex items-center gap-1'>
                    <ThumbsUp className='h-3 w-3' />
                    {pattern.votes.helpful}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='h-3 w-3' />
                    {pattern.adoptedBy.length}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Target className='h-3 w-3' />
                    {Math.round(pattern.successRate)}%
                  </span>
                </div>
              </div>

              <div className='mb-3 flex flex-wrap gap-1'>
                {pattern.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className='w-full rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100'>
                <Share2 className='mr-2 inline h-4 w-4' />
                Adopt This Pattern
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className='space-y-4'>
          {knowledgeRequests.map((request) => (
            <div
              key={request.id}
              className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'
            >
              <div className='mb-3 flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-1 flex items-center gap-2'>
                    <h3 className='font-semibold text-gray-800'>
                      {request.specificTopic}
                    </h3>
                    <span
                      className={`h-2 w-2 rounded-full ${getUrgencyColor(request.urgency)}`}
                    />
                  </div>
                  <p className='mb-2 text-sm text-gray-600'>
                    {request.context}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <span>Requested by {request.requestingStaffName}</span>
                    <span>•</span>
                    <span>{request.category}</span>
                    <span>•</span>
                    <Clock className='h-3 w-3' />
                    <span>
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-lg font-bold text-blue-600'>
                    {request.responses.length}
                  </div>
                  <div className='text-xs text-gray-500'>Responses</div>
                </div>
              </div>

              {request.responses.length > 0 && (
                <div className='border-t border-gray-100 pt-3'>
                  <h4 className='mb-2 text-sm font-medium text-gray-700'>
                    Latest Response:
                  </h4>
                  <div className='rounded bg-gray-50 p-3'>
                    <p className='text-sm text-gray-700'>
                      {request.responses[request.responses.length - 1].response}
                    </p>
                    <div className='mt-2 text-xs text-gray-500'>
                      by{' '}
                      {
                        request.responses[request.responses.length - 1]
                          .respondingStaffName
                      }
                    </div>
                  </div>
                </div>
              )}

              <div className='mt-3 flex gap-2'>
                <button className='flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100'>
                  <MessageSquare className='mr-2 inline h-4 w-4' />
                  Provide Help
                </button>
                {request.responses.length === 0 && (
                  <button className='rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100'>
                    <Lightbulb className='mr-2 inline h-4 w-4' />
                    I'm Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'
            >
              <div className='mb-3'>
                <h3 className='mb-1 font-semibold text-gray-800'>
                  {session.title}
                </h3>
                <p className='mb-2 text-sm text-gray-600'>
                  {session.description}
                </p>
                <div className='mb-2 flex items-center gap-2 text-xs text-gray-500'>
                  <Calendar className='h-3 w-3' />
                  <span>
                    {new Date(session.scheduledAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <Clock className='h-3 w-3' />
                  <span>{session.duration} min</span>
                </div>
                <div className='text-sm text-gray-700'>
                  <strong>Topic:</strong> {session.topic} ({session.category})
                </div>
              </div>

              <div className='mb-3'>
                <div className='mb-2 text-sm font-medium text-gray-700'>
                  Participants ({session.participants.length}):
                </div>
                <div className='flex flex-wrap gap-1'>
                  {session.participants
                    .slice(0, 5)
                    .map((participant, index) => (
                      <span
                        key={index}
                        className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                      >
                        {participant.staffName}
                      </span>
                    ))}
                  {session.participants.length > 5 && (
                    <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600'>
                      +{session.participants.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <button className='w-full rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100'>
                <Users className='mr-2 inline h-4 w-4' />
                Join Session
              </button>
            </div>
          ))}

          {upcomingSessions.length === 0 && (
            <div className='col-span-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
              <Calendar className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                No Upcoming Sessions
              </h3>
              <p className='mb-4 text-gray-500'>
                Schedule a cross-training session to get started.
              </p>
              <button className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
                Schedule Session
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && analytics && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Key Metrics */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Knowledge Network Stats
              </h3>
              <Brain className='h-6 w-6 text-blue-500' />
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Total Patterns:</span>
                <span className='font-semibold text-blue-600'>
                  {analytics.totalPatterns}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Pattern Adoptions:
                </span>
                <span className='font-semibold text-green-600'>
                  {analytics.totalAdoptions}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Help Requests:</span>
                <span className='font-semibold text-purple-600'>
                  {analytics.totalRequests}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Resolved Requests:
                </span>
                <span className='font-semibold text-green-600'>
                  {analytics.resolvedRequests}
                </span>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Top Categories
              </h3>
              <Award className='h-6 w-6 text-yellow-500' />
            </div>
            <div className='space-y-2'>
              {analytics.topCategories.map((category: any, index: number) => (
                <div
                  key={category.category}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-gray-600'>
                      #{index + 1}
                    </span>
                    <span className='text-sm text-gray-800 capitalize'>
                      {category.category.replace('_', ' ')}
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-blue-600'>
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active Staff */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Most Active Contributors
              </h3>
              <Star className='h-6 w-6 text-purple-500' />
            </div>
            <div className='space-y-2'>
              {analytics.mostActiveStaff.map((staff: any, index: number) => (
                <div
                  key={staff.staffId}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-gray-600'>
                      #{index + 1}
                    </span>
                    <span className='text-sm text-gray-800'>
                      {staff.staffName}
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-purple-600'>
                    {staff.activity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Network Health */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-3'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Network Health
              </h3>
              <TrendingUp className='h-6 w-6 text-green-500' />
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {analytics.upcomingSessions}
                </div>
                <div className='text-sm text-gray-600'>Upcoming Sessions</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {analytics.totalRequests > 0
                    ? Math.round(
                        (analytics.resolvedRequests / analytics.totalRequests) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className='text-sm text-gray-600'>Request Resolution</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {analytics.totalPatterns > 0
                    ? Math.round(
                        (analytics.totalAdoptions / analytics.totalPatterns) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className='text-sm text-gray-600'>Pattern Adoption</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-600'>
                  {analytics.mostActiveStaff.length > 0
                    ? Math.round(
                        (analytics.mostActiveStaff[0].activity /
                          analytics.totalPatterns) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className='text-sm text-gray-600'>
                  Community Engagement
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty States */}
      {activeTab === 'patterns' && knowledgePatterns.length === 0 && (
        <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center'>
          <BookOpen className='mx-auto mb-4 h-12 w-12 text-gray-400' />
          <h3 className='mb-2 text-lg font-medium text-gray-900'>
            No Knowledge Patterns Yet
          </h3>
          <p className='mb-4 text-gray-500'>
            {selectedCategory === 'all'
              ? 'Share your first successful approach to start building the knowledge network.'
              : `No patterns found in the ${categories.find((c) => c.id === selectedCategory)?.label.toLowerCase()} category yet.`}
          </p>
          <button className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
            Share Your First Pattern
          </button>
        </div>
      )}
    </div>
  );
}

