'use client';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import {
  AlertCircle,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MessageSquare,
  Shield,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  aiSupportService,
  type ChatbotInteraction,
  type SupportMetrics,
  type SupportTicket,
} from '../services/AISupportService';

export default function AISupportDashboard() {
  const [supportMetrics, setSupportMetrics] = useState<SupportMetrics>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgResolutionTime: 0,
    aiResolutionRate: 0,
    customerSatisfactionScore: 0,
    responseTime: 0,
    ticketsByCategory: {},
    ticketsByPriority: {},
    agentPerformance: [],
  });
  const [activeTickets, setActiveTickets] = useState<SupportTicket[]>([]);
  const [recentChatbots, setRecentChatbots] = useState<ChatbotInteraction[]>(
    []
  );
  const [realtimeActivity, setRealtimeActivity] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );

  useEffect(() => {
    // Load initial data
    loadSupportData();

    // Set up event listeners
    const handleTicketCreated = (ticket: SupportTicket) => {
      setRealtimeActivity((prev) => [
        `New ticket created: ${ticket.subject}`,
        ...prev.slice(0, 9),
      ]);
      loadSupportData();
    };

    const handleTicketProcessed = (ticket: SupportTicket) => {
      setRealtimeActivity((prev) => [
        `AI processed ticket: ${ticket.id}`,
        ...prev.slice(0, 9),
      ]);
      loadSupportData();
    };

    const handleTicketEscalated = (ticket: SupportTicket) => {
      setRealtimeActivity((prev) => [
        `Ticket escalated to human: ${ticket.id}`,
        ...prev.slice(0, 9),
      ]);
      loadSupportData();
    };

    const handleChatbotInteraction = (interaction: ChatbotInteraction) => {
      setRealtimeActivity((prev) => [
        `Chatbot interaction: ${interaction.intent}`,
        ...prev.slice(0, 9),
      ]);
      loadSupportData();
    };

    const handleMetricsUpdated = (metrics: SupportMetrics) => {
      setSupportMetrics(metrics);
    };

    aiSupportService.on('ticketCreated', handleTicketCreated);
    aiSupportService.on('ticketProcessed', handleTicketProcessed);
    aiSupportService.on('ticketEscalated', handleTicketEscalated);
    aiSupportService.on('chatbotInteraction', handleChatbotInteraction);
    aiSupportService.on('metricsUpdated', handleMetricsUpdated);

    // Cleanup listeners
    return () => {
      aiSupportService.off('ticketCreated', handleTicketCreated);
      aiSupportService.off('ticketProcessed', handleTicketProcessed);
      aiSupportService.off('ticketEscalated', handleTicketEscalated);
      aiSupportService.off('chatbotInteraction', handleChatbotInteraction);
      aiSupportService.off('metricsUpdated', handleMetricsUpdated);
    };
  }, []);

  const loadSupportData = () => {
    setSupportMetrics(aiSupportService.getSupportMetrics());
    setActiveTickets(
      aiSupportService
        .getTicketsByStatus('open')
        .concat(aiSupportService.getTicketsByStatus('in_progress'))
    );
    setRecentChatbots(aiSupportService.getRecentChatbotInteractions());
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'pending_customer':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const handleTicketStatusUpdate = async (
    ticketId: string,
    newStatus: SupportTicket['status']
  ) => {
    await aiSupportService.updateTicketStatus(ticketId, newStatus);
    loadSupportData();
  };

  const testChatbot = async () => {
    await aiSupportService.processChatbotInteraction(
      'TEST-CUSTOMER',
      'Test Customer',
      'Hello, I need help tracking my shipment FF-12345'
    );
  };

  return (
    <div className='flex-1 space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>
            AI Customer Support
          </h2>
          <p className='text-muted-foreground'>
            24/7 Intelligent Support • Superior to SalesAI.com •{' '}
            {supportMetrics.aiResolutionRate.toFixed(1)}% AI Resolution Rate
          </p>
        </div>
        <Button
          onClick={testChatbot}
          className='bg-green-600 hover:bg-green-700'
        >
          <Bot className='mr-2 h-4 w-4' />
          Test Chatbot
        </Button>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Tickets</CardTitle>
            <MessageSquare className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {supportMetrics.totalTickets}
            </div>
            <p className='text-muted-foreground text-xs'>
              <span className='text-red-500'>
                {supportMetrics.openTickets} open
              </span>{' '}
              •{' '}
              <span className='text-green-500'>
                {supportMetrics.resolvedTickets} resolved
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              AI Resolution Rate
            </CardTitle>
            <Bot className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {supportMetrics.aiResolutionRate.toFixed(1)}%
            </div>
            <Progress
              value={supportMetrics.aiResolutionRate}
              className='mt-2'
            />
            <p className='text-muted-foreground mt-1 text-xs'>
              AI handling{' '}
              {Math.round(
                (supportMetrics.aiResolutionRate / 100) *
                  supportMetrics.resolvedTickets
              )}{' '}
              tickets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Avg Resolution Time
            </CardTitle>
            <Clock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {formatTime(supportMetrics.avgResolutionTime)}
            </div>
            <p className='text-muted-foreground text-xs'>
              First response in {formatTime(supportMetrics.responseTime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Customer Satisfaction
            </CardTitle>
            <Star className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>
              {supportMetrics.customerSatisfactionScore.toFixed(1)}/5.0
            </div>
            <div className='mt-1 flex'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(supportMetrics.customerSatisfactionScore)
                      ? 'fill-current text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        {/* Active Support Tickets */}
        <div className='xl:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <AlertCircle className='mr-2 h-5 w-5 text-red-500' />
                Active Support Tickets ({activeTickets.length})
              </CardTitle>
              <CardDescription>
                Current tickets requiring attention or in progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='max-h-96 space-y-4 overflow-y-auto'>
                {activeTickets.length === 0 ? (
                  <div className='text-muted-foreground py-8 text-center'>
                    <CheckCircle2 className='mx-auto mb-2 h-12 w-12 text-green-500' />
                    <p>All tickets resolved! Great work.</p>
                  </div>
                ) : (
                  activeTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className='hover:bg-muted/50 cursor-pointer rounded-lg border p-4 transition-colors'
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className='mb-2 flex items-start justify-between'>
                        <div className='flex-1'>
                          <div className='mb-1 flex items-center gap-2'>
                            <Badge
                              variant='outline'
                              className={getPriorityColor(ticket.priority)}
                            >
                              {ticket.priority.toUpperCase()}
                            </Badge>
                            <Badge variant='secondary'>{ticket.category}</Badge>
                            <div
                              className={`h-2 w-2 rounded-full ${getStatusColor(ticket.status)}`}
                            />
                          </div>
                          <h4 className='text-sm font-medium'>
                            {ticket.subject}
                          </h4>
                          <p className='text-muted-foreground text-xs'>
                            {ticket.customerName} • {ticket.id}
                          </p>
                        </div>
                        <div className='text-muted-foreground text-right text-xs'>
                          <p>
                            {new Date(ticket.createdAt).toLocaleTimeString()}
                          </p>
                          <p className='text-xs'>{ticket.assignedAgent}</p>
                        </div>
                      </div>
                      <p className='text-muted-foreground mb-2 line-clamp-2 text-xs'>
                        {ticket.description}
                      </p>
                      <div className='flex items-center justify-between'>
                        <div className='flex gap-2'>
                          {ticket.status === 'open' && (
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-xs'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTicketStatusUpdate(
                                  ticket.id,
                                  'in_progress'
                                );
                              }}
                            >
                              Start Processing
                            </Button>
                          )}
                          {ticket.status === 'in_progress' && (
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-xs text-green-600'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTicketStatusUpdate(ticket.id, 'resolved');
                              }}
                            >
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                        <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                          {ticket.humanEscalated ? (
                            <Users className='h-3 w-3 text-orange-500' />
                          ) : (
                            <Bot className='h-3 w-3 text-green-500' />
                          )}
                          <span>
                            {ticket.conversationHistory.length} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Agents & Analytics */}
        <div className='space-y-6'>
          {/* AI Agent Performance */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Shield className='mr-2 h-5 w-5 text-blue-500' />
                AI Support Agents
              </CardTitle>
              <CardDescription>
                Performance metrics for AI support staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {supportMetrics.agentPerformance
                  .filter((agent) => agent.agentType === 'ai')
                  .map((agent) => (
                    <div key={agent.agentId} className='rounded-lg border p-3'>
                      <div className='mb-2 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Bot className='h-4 w-4 text-green-500' />
                          <h4 className='text-sm font-medium'>
                            {agent.agentName}
                          </h4>
                        </div>
                        <Badge variant='secondary' className='text-xs'>
                          {agent.resolutionRate.toFixed(1)}% success
                        </Badge>
                      </div>
                      <div className='text-muted-foreground space-y-1 text-xs'>
                        <p>• {agent.ticketsHandled} tickets handled</p>
                        <p>
                          • {formatTime(agent.avgResolutionTime)} avg resolution
                        </p>
                        <p>
                          • {agent.customerSatisfactionScore.toFixed(1)}/5.0
                          satisfaction
                        </p>
                        <div className='mt-2 flex flex-wrap gap-1'>
                          {agent.specializations.map((spec) => (
                            <Badge
                              key={spec}
                              variant='outline'
                              className='text-xs'
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Chatbot Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <MessageSquare className='mr-2 h-5 w-5 text-purple-500' />
                Chatbot Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Active Chats
                  </span>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-600'
                  >
                    {recentChatbots.filter((chat) => !chat.endedAt).length}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Resolved Today
                  </span>
                  <Badge variant='outline'>
                    {recentChatbots.filter((chat) => chat.resolved).length}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Escalation Rate
                  </span>
                  <Badge variant='outline' className='text-orange-600'>
                    {(
                      (recentChatbots.filter((chat) => chat.escalatedToTicket)
                        .length /
                        Math.max(recentChatbots.length, 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </Badge>
                </div>

                {recentChatbots.slice(0, 3).length > 0 && (
                  <div className='border-t pt-2'>
                    <h5 className='text-muted-foreground mb-2 text-xs font-medium'>
                      Recent Interactions
                    </h5>
                    <div className='space-y-2'>
                      {recentChatbots.slice(0, 3).map((chat) => (
                        <div key={chat.id} className='text-xs'>
                          <div className='flex items-center gap-2'>
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${
                                chat.resolved
                                  ? 'bg-green-500'
                                  : chat.escalatedToTicket
                                    ? 'bg-orange-500'
                                    : 'bg-blue-500'
                              }`}
                            />
                            <span className='text-muted-foreground'>
                              {chat.customerName} • {chat.intent}
                            </span>
                          </div>
                          <p className='text-muted-foreground ml-3 truncate'>
                            {chat.messages[0]?.message.substring(0, 50)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <TrendingUp className='mr-2 h-5 w-5 text-green-500' />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-48 space-y-2 overflow-y-auto'>
                {realtimeActivity.length === 0 ? (
                  <p className='text-muted-foreground text-xs'>
                    No recent activity
                  </p>
                ) : (
                  realtimeActivity.map((activity, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 text-xs'
                    >
                      <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-500' />
                      <span className='text-muted-foreground'>{activity}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Support Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <BarChart3 className='mr-2 h-5 w-5 text-blue-500' />
                Support Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {Object.entries(supportMetrics.ticketsByCategory).map(
                  ([category, count]) => (
                    <div
                      key={category}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm capitalize'>{category}</span>
                      <Badge variant='outline'>{count}</Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitive Advantage Banner */}
      <Card className='border-green-200 bg-gradient-to-r from-green-50 to-blue-50'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='rounded-full bg-green-100 p-3'>
                <HeartHandshake className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <h3 className='font-semibold text-green-900'>
                  🎯 Competitive Advantage: Superior to SalesAI.com
                </h3>
                <p className='text-sm text-green-700'>
                  FleetFlow AI Support:{' '}
                  {supportMetrics.aiResolutionRate.toFixed(1)}% AI Resolution •
                  {formatTime(supportMetrics.avgResolutionTime)} Avg Resolution
                  •{supportMetrics.customerSatisfactionScore.toFixed(1)}/5.0
                  Customer Satisfaction
                </p>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-green-600'>24/7</div>
              <div className='text-xs text-green-700'>AI Coverage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Ticket Modal/Details could go here */}
      {selectedTicket && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <Card className='max-h-[80vh] w-full max-w-2xl overflow-y-auto'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>{selectedTicket.subject}</span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSelectedTicket(null)}
                >
                  Close
                </Button>
              </CardTitle>
              <CardDescription>
                {selectedTicket.id} • {selectedTicket.customerName}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <Badge className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority.toUpperCase()}
                </Badge>
                <Badge variant='secondary'>{selectedTicket.category}</Badge>
                <Badge
                  variant='outline'
                  className={getStatusColor(selectedTicket.status)}
                >
                  {selectedTicket.status.replace('_', ' ')}
                </Badge>
              </div>

              <div>
                <h4 className='mb-2 font-medium'>Description</h4>
                <p className='text-muted-foreground text-sm'>
                  {selectedTicket.description}
                </p>
              </div>

              {selectedTicket.conversationHistory.length > 0 && (
                <div>
                  <h4 className='mb-2 font-medium'>Conversation History</h4>
                  <div className='max-h-60 space-y-3 overflow-y-auto'>
                    {selectedTicket.conversationHistory.map((message) => (
                      <div key={message.id} className='rounded border p-3'>
                        <div className='mb-1 flex items-center gap-2'>
                          {message.sender === 'ai_agent' ? (
                            <Bot className='h-4 w-4 text-green-500' />
                          ) : (
                            <Users className='h-4 w-4 text-blue-500' />
                          )}
                          <span className='text-sm font-medium'>
                            {message.senderName}
                          </span>
                          <span className='text-muted-foreground text-xs'>
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className='text-sm'>{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='flex gap-2 pt-4'>
                {selectedTicket.status !== 'resolved' && (
                  <Button
                    onClick={() => {
                      handleTicketStatusUpdate(selectedTicket.id, 'resolved');
                      setSelectedTicket(null);
                    }}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
