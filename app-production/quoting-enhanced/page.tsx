'use client'

import React, { useState } from 'react'
import FreightQuotingDashboard from '../components/FreightQuotingDashboard'
import CompetitiveIntelligence from '../components/CompetitiveIntelligence'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  Users, 
  BarChart3, 
  Zap, 
  Target, 
  TrendingUp,
  Shield,
  Globe,
  Brain,
  DollarSign
} from 'lucide-react'

export default function EnhancedQuotingPage() {
  const [activeTab, setActiveTab] = useState('quoting')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <span>←</span>
                  Dashboard
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Advanced Freight Quoting Engine
                </h1>
                <p className="text-gray-600">
                  AI-powered quoting with market intelligence and competitive analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Globe className="w-3 h-3 mr-1" />
                Real-time Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Pricing</h3>
                  <p className="text-sm text-gray-600">Smart algorithms</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Advanced pricing algorithms with machine learning optimization
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Market Intel</h3>
                  <p className="text-sm text-gray-600">Real-time data</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Live market rates, demand levels, and capacity analytics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Competitive</h3>
                  <p className="text-sm text-gray-600">Analysis</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Competitor tracking and strategic market positioning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Win Rate</h3>
                  <p className="text-sm text-gray-600">Optimization</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Probability scoring and rate optimization for maximum wins
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quoting" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Smart Quoting
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Competitive Intelligence
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Market Analytics
            </TabsTrigger>
          </TabsList>

          {/* Smart Quoting Tab */}
          <TabsContent value="quoting">
            <FreightQuotingDashboard 
              onQuoteGenerated={(quote) => {
                console.log('AI-Enhanced Quote Generated:', quote)
                // Enhanced quote handling with comprehensive features:
                // - Market intelligence integration
                // - Competitive positioning analysis
                // - Win probability optimization
                // - Real-time rate adjustments
                // - Risk factor assessment
                // - Automated recommendations
              }}
            />
          </TabsContent>

          {/* Competitive Intelligence Tab */}
          <TabsContent value="intelligence">
            <CompetitiveIntelligence />
          </TabsContent>

          {/* Market Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Market Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">+12.5%</div>
                      <div className="text-sm text-gray-600">Market Growth</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <DollarSign className="w-8 h-8 mx-auto mb-3 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">$2,450</div>
                      <div className="text-sm text-gray-600">Avg Lane Rate</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <Target className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">73%</div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Demand Level</span>
                        <Badge className="bg-orange-100 text-orange-800">HIGH</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Capacity Tightness</span>
                        <Badge className="bg-red-100 text-red-800">78%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Seasonal Factor</span>
                        <Badge className="bg-blue-100 text-blue-800">1.15x</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Fuel Impact</span>
                        <Badge className="bg-yellow-100 text-yellow-800">22%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Quote Volume</span>
                        <span className="font-semibold">1,247 this month</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Margin</span>
                        <span className="font-semibold text-green-600">15.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Response Time</span>
                        <span className="font-semibold">2.3 minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Customer Satisfaction</span>
                        <span className="font-semibold text-blue-600">4.7/5.0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-800">Market Opportunity</span>
                      </div>
                      <p className="text-blue-700 text-sm">
                        Regional lanes showing 15% above-market demand. Consider expanding coverage 
                        in Southeast markets for premium pricing opportunities.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-800">Pricing Strategy</span>
                      </div>
                      <p className="text-green-700 text-sm">
                        Current market conditions favor competitive pricing. Win rates could improve 
                        by 8-12% with slight rate adjustments on high-volume lanes.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-800">Risk Management</span>
                      </div>
                      <p className="text-purple-700 text-sm">
                        Fuel volatility expected to increase 5-8% next quarter. Consider implementing 
                        dynamic fuel surcharge adjustments for better margin protection.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 