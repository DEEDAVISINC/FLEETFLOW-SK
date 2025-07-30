'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Phone, 
  Truck, 
  Calendar, 
  Users, 
  DollarSign, 
  Activity,
  Zap,
  Star,
  Target,
  UserPlus,
  BarChart3,
  Headphones,
  Navigation,
  Gauge
} from 'lucide-react'

export default function TruckingAIPlatform() {
  const [activeTab, setActiveTab] = useState('call-center')

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FleetFlow AI Operations Platform
            </h1>
            <p className="text-xl text-gray-600">
              Complete Transportation Management & Operations Center
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Operations</p>
                  <p className="text-2xl font-bold text-green-600">24/7</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Efficiency</p>
                  <p className="text-2xl font-bold text-blue-600">97.3%</p>
                </div>
                <Gauge className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                  <p className="text-2xl font-bold text-purple-600">$47.2K</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Decisions</p>
                  <p className="text-2xl font-bold text-orange-600">1,247</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="call-center" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            Call Center
          </TabsTrigger>
          <TabsTrigger value="freight-broker" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Freight Broker
          </TabsTrigger>
          <TabsTrigger value="dispatch" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Dispatch
          </TabsTrigger>
          <TabsTrigger value="recruiting" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Recruiting
          </TabsTrigger>
          <TabsTrigger value="scheduler" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduler
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="call-center" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Live Call Center Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Call Center Active</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">FreeSWITCH Connected</Badge>
                </div>
                <div className="text-center py-8">
                  <p className="text-xl font-bold text-green-600">Real-time Call Center Integration</p>
                  <p className="text-gray-600">FreeSWITCH ESL Port 8021 - AI Lead Management</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="freight-broker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                AI Freight Broker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-xl font-bold text-blue-600">Dynamic Pricing & Load Management</p>
                <p className="text-gray-600">Real-time load board with AI optimization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispatch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                AI Dispatch Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-xl font-bold text-purple-600">Smart Load Coordination</p>
                <p className="text-gray-600">Automated route optimization and driver management</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruiting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                AI Recruiting Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-xl font-bold text-orange-600">Intelligent Lead Generation</p>
                <p className="text-gray-600">Automated driver recruitment and qualification</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                AI Scheduler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-xl font-bold text-green-600">Automated Appointment Setting</p>
                <p className="text-gray-600">Smart scheduling and calendar management</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-xl font-bold text-indigo-600">Comprehensive Analytics</p>
                <p className="text-gray-600">Real-time metrics and government API integration</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 