'use client';

/**
 * AI Sales Assistant Dashboard
 * Native FleetFlow SalesAI-like capabilities integrated into AI Flow
 * Real-time conversational AI, follow-up automation, and call analytics
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    BarChart3,
    Brain,
    Calendar,
    Clock,
    Mail,
    MessageSquare,
    PauseCircle,
    Phone,
    PlayCircle,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { FollowUpAnalytics, aiFollowUpAutomation } from '../services/AIFollowUpAutomation';
import { CallAnalyticsInsights, enhancedCallAnalytics } from '../services/EnhancedCallAnalytics';
import { AICallRecommendation } from '../services/LiveCallAIAssistant';

interface LiveCallAssistance {
  callId: string;
  contactName: string;
  duration: string;
  recommendations: AICallRecommendation[];
  status: 'active' | 'completed';
}

interface SystemMetrics {
  activeCalls: number;
  aiRecommendations: number;
  followUpsScheduled: number;
  todayAnalytics: number;
  conversionRate: number;
  responseRate: number;
}

export default function AISalesAssistantDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    activeCalls: 0,
    aiRecommendations: 0,
    followUpsScheduled: 0,
    todayAnalytics: 0,
    conversionRate: 0,
    responseRate: 0
  });

  const [liveAssistance, setLiveAssistance] = useState<LiveCallAssistance[]>([]);
  const [followUpAnalytics, setFollowUpAnalytics] = useState<FollowUpAnalytics | null>(null);
  const [callInsights, setCallInsights] = useState<CallAnalyticsInsights | null>(null);
  const [systemActive, setSystemActive] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    // Load follow-up analytics
    const followUpData = aiFollowUpAutomation.getAnalytics();
    setFollowUpAnalytics(followUpData);

    // Load call analytics insights
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const insights = enhancedCallAnalytics.getAnalyticsInsights(startDate, endDate);
    setCallInsights(insights);

    // Update system metrics
    setSystemMetrics({
      activeCalls: Math.floor(Math.random() * 12) + 3, // Mock active calls
      aiRecommendations: Math.floor(Math.random() * 50) + 25,
      followUpsScheduled: followUpData.totalScheduled,
      todayAnalytics: insights.totalCalls,
      conversionRate: insights.conversionMetrics.overallRate,
      responseRate: followUpData.responseRate
    });

    // Mock live assistance data
    setLiveAssistance([
      {
        callId: 'call-001',
        contactName: 'Sarah Johnson (Walmart)',
        duration: '5:23',
        recommendations: [
          {
            type: 'response_suggestion',
            priority: 'high',
            suggestion: 'Mention our 18.7% fuel savings for large volume customers',
            reasoning: 'Customer expressed cost concerns',
            confidence: 0.92,
            timing: 'immediate'
          },
          {
            type: 'pricing_guidance',
            priority: 'medium',
            suggestion: 'Offer volume discount structure for 20+ loads/month',
            reasoning: 'Enterprise customer with high volume potential',
            confidence: 0.85,
            timing: 'when_appropriate'
          }
        ],
        status: 'active'
      },
      {
        callId: 'call-002',
        contactName: 'Mike Davis (Construction Co)',
        duration: '3:47',
        recommendations: [
          {
            type: 'objection_handler',
            priority: 'high',
            suggestion: 'We specialize in construction equipment transport with proper permits',
            reasoning: 'Customer concerned about specialized handling',
            confidence: 0.88,
            timing: 'immediate'
          }
        ],
        status: 'active'
      }
    ]);
  };

  const handleSystemToggle = () => {
    setSystemActive(!systemActive);
    console.log(`🤖 AI Sales Assistant ${systemActive ? 'Paused' : 'Activated'}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'response_suggestion': return <MessageSquare className="h-4 w-4" />;
      case 'objection_handler': return <Target className="h-4 w-4" />;
      case 'pricing_guidance': return <TrendingUp className="h-4 w-4" />;
      case 'competitive_intel': return <Brain className="h-4 w-4" />;
      case 'next_action': return <Zap className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">🤖 AI Sales Assistant</h2>
          <p className="text-gray-600 mt-1">Native FleetFlow SalesAI-like capabilities</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${systemActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {systemActive ? 'AI Active' : 'AI Paused'}
            </span>
          </div>

          <Button
            variant={systemActive ? "destructive" : "default"}
            onClick={handleSystemToggle}
            className="flex items-center gap-2"
          >
            {systemActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            {systemActive ? 'Pause AI' : 'Activate AI'}
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Phone className="h-8 w-8 text-blue-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">{systemMetrics.activeCalls}</div>
                <div className="text-xs text-blue-600">Active Calls</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-900">{systemMetrics.aiRecommendations}</div>
                <div className="text-xs text-purple-600">AI Suggestions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-900">{systemMetrics.followUpsScheduled}</div>
                <div className="text-xs text-green-600">Follow-ups</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-900">{systemMetrics.todayAnalytics}</div>
                <div className="text-xs text-orange-600">Analyzed Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-50 to-teal-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-teal-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-900">{systemMetrics.conversionRate.toFixed(1)}%</div>
                <div className="text-xs text-teal-600">Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-50 to-pink-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Mail className="h-8 w-8 text-pink-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-900">{systemMetrics.responseRate.toFixed(1)}%</div>
                <div className="text-xs text-pink-600">Response Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="live-assistance">Live Assistance</TabsTrigger>
          <TabsTrigger value="follow-up-automation">Follow-up Automation</TabsTrigger>
          <TabsTrigger value="call-analytics">Call Analytics</TabsTrigger>
        </Tabs>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Live Call AI Assistant</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Follow-up Automation</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Call Analytics Engine</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Processing</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Freight Knowledge Base</span>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">Updated</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent AI Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI suggested pricing response for Walmart call</span>
                    <span className="text-gray-500 ml-auto">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Follow-up email scheduled for Amazon prospect</span>
                    <span className="text-gray-500 ml-auto">5 min ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Call analysis completed for Construction Co</span>
                    <span className="text-gray-500 ml-auto">8 min ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Objection handler triggered for pricing concern</span>
                    <span className="text-gray-500 ml-auto">12 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Live Assistance Tab */}
        <TabsContent value="live-assistance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Live Call AI Assistance
              </CardTitle>
              <CardDescription>
                Real-time conversational AI support during active phone calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              {liveAssistance.length > 0 ? (
                <div className="space-y-6">
                  {liveAssistance.map((call) => (
                    <div key={call.callId} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="font-semibold">{call.contactName}</div>
                            <div className="text-sm text-gray-600">Duration: {call.duration}</div>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {call.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700">AI Recommendations:</div>
                        {call.recommendations.map((rec, index) => (
                          <div key={index} className={`border rounded-lg p-3 ${getPriorityColor(rec.priority)}`}>
                            <div className="flex items-start gap-2">
                              {getRecommendationIcon(rec.type)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium capitalize">
                                    {rec.type.replace('_', ' ')}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                                      {rec.priority}
                                    </Badge>
                                    <span className="text-xs text-gray-600">
                                      {Math.round(rec.confidence * 100)}% confidence
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm mb-1">{rec.suggestion}</div>
                                <div className="text-xs text-gray-600">{rec.reasoning}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <div>No active calls with AI assistance</div>
                  <div className="text-sm">AI recommendations will appear here during live calls</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Follow-up Automation Tab */}
        <TabsContent value="follow-up-automation" className="space-y-6">
          {followUpAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{followUpAnalytics.totalScheduled}</div>
                  <div className="text-sm text-gray-600">Total Scheduled</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{followUpAnalytics.sentToday}</div>
                  <div className="text-sm text-gray-600">Sent Today</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{followUpAnalytics.responseRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{followUpAnalytics.conversionRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Top Performing Follow-up Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              {followUpAnalytics?.topPerformingRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-gray-600">Rule ID: {rule.ruleId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{rule.responseRate.toFixed(1)}% response</div>
                    <div className="text-xs text-gray-600">{rule.conversionRate.toFixed(1)}% conversion</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Call Analytics Tab */}
        <TabsContent value="call-analytics" className="space-y-6">
          {callInsights && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{callInsights.totalCalls}</div>
                    <div className="text-sm text-gray-600">Total Calls</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{callInsights.conversionMetrics.overallRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{callInsights.sentimentTrends.positive.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Positive Sentiment</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{callInsights.commonObjections.length}</div>
                    <div className="text-sm text-gray-600">Common Objections</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {callInsights.topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{performer.agentName}</div>
                          <div className="text-sm text-gray-600">Agent ID: {performer.agentId}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{performer.conversionRate.toFixed(1)}% conversion</div>
                          <div className="text-xs text-gray-600">{performer.avgSentiment.toFixed(1)} avg sentiment</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Improvement Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {callInsights.improvementOpportunities.map((opportunity, index) => (
                      <div key={index} className="border rounded-lg p-3 mb-3 last:mb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{opportunity.area}</div>
                          <Badge variant={opportunity.impact === 'high' ? 'destructive' : 'secondary'}>
                            {opportunity.impact} impact
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{opportunity.description}</div>
                        <div className="text-sm font-medium text-blue-600">{opportunity.recommendation}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
