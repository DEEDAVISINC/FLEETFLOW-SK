import { NextRequest, NextResponse } from 'next/server';

interface WeatherAlert {
  id: string;
  type: 'storm' | 'tornado' | 'flood' | 'winter' | 'heat' | 'wind';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  startTime: string;
  endTime: string;
  affectedRoutes: string[];
  recommendedActions: string[];
}

interface RouteWeatherAnalysis {
  routeId: string;
  origin: string;
  destination: string;
  currentWeather: {
    temperature: number;
    condition: string;
    windSpeed: number;
    visibility: number;
    precipitation: number;
  };
  weatherAlerts: WeatherAlert[];
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  recommendedDelay: number;
  alternativeRoutes: string[];
  safetyRecommendations: string[];
}

// Mock weather data - in production, this would integrate with weather APIs
const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: 'alert-001',
    type: 'storm',
    severity: 'high',
    location: 'Kansas City, MO',
    coordinates: { lat: 39.0997, lng: -94.5786 },
    description:
      'Severe thunderstorm warning with hail and strong winds expected. Wind gusts up to 60 mph possible.',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    affectedRoutes: ['route-001', 'route-003'],
    recommendedActions: [
      'Delay departure by 2 hours',
      'Consider alternative route via I-70',
      'Monitor weather updates',
    ],
  },
  {
    id: 'alert-002',
    type: 'tornado',
    severity: 'extreme',
    location: 'Oklahoma City, OK',
    coordinates: { lat: 35.4676, lng: -97.5164 },
    description:
      'Tornado warning in effect. Take shelter immediately. Multiple tornadoes reported in the area.',
    startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    affectedRoutes: ['route-002'],
    recommendedActions: [
      'Immediate route diversion required',
      'Seek shelter if in affected area',
      'Contact dispatch for emergency protocols',
    ],
  },
  {
    id: 'alert-003',
    type: 'winter',
    severity: 'medium',
    location: 'Denver, CO',
    coordinates: { lat: 39.7392, lng: -104.9903 },
    description:
      'Winter storm warning with 6-12 inches of snow expected. Reduced visibility and icy conditions.',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    affectedRoutes: ['route-004'],
    recommendedActions: [
      'Check tire chains',
      'Reduce speed by 50%',
      'Increase following distance',
    ],
  },
  {
    id: 'alert-004',
    type: 'flood',
    severity: 'high',
    location: 'Houston, TX',
    coordinates: { lat: 29.7604, lng: -95.3698 },
    description:
      'Flash flood warning. Heavy rainfall causing rapid water level rises. Road closures expected.',
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    affectedRoutes: ['route-005'],
    recommendedActions: [
      'Avoid low-lying areas',
      'Check road closures',
      'Consider delay until conditions improve',
    ],
  },
];

const mockRouteAnalysis: RouteWeatherAnalysis[] = [
  {
    routeId: 'route-001',
    origin: 'Chicago, IL',
    destination: 'Kansas City, MO',
    currentWeather: {
      temperature: 72,
      condition: 'Partly Cloudy',
      windSpeed: 15,
      visibility: 8,
      precipitation: 0.1,
    },
    weatherAlerts: [mockWeatherAlerts[0]],
    riskLevel: 'high',
    recommendedDelay: 120,
    alternativeRoutes: ['I-80 via Des Moines', 'I-70 via St. Louis'],
    safetyRecommendations: [
      'Delay departure by 2 hours to avoid storm',
      'Monitor radar for storm movement',
      'Have emergency contact numbers ready',
      'Consider overnight stop if conditions worsen',
    ],
  },
  {
    routeId: 'route-002',
    origin: 'Dallas, TX',
    destination: 'Oklahoma City, OK',
    currentWeather: {
      temperature: 85,
      condition: 'Severe Thunderstorms',
      windSpeed: 45,
      visibility: 2,
      precipitation: 0.8,
    },
    weatherAlerts: [mockWeatherAlerts[1]],
    riskLevel: 'extreme',
    recommendedDelay: 180,
    alternativeRoutes: ['I-35W via Fort Worth', 'US-75 via Sherman'],
    safetyRecommendations: [
      'IMMEDIATE route diversion required',
      'Seek shelter if currently in affected area',
      'Contact dispatch for emergency protocols',
      'Monitor tornado warnings continuously',
    ],
  },
  {
    routeId: 'route-003',
    origin: 'Los Angeles, CA',
    destination: 'Phoenix, AZ',
    currentWeather: {
      temperature: 95,
      condition: 'Clear',
      windSpeed: 8,
      visibility: 10,
      precipitation: 0,
    },
    weatherAlerts: [],
    riskLevel: 'low',
    recommendedDelay: 0,
    alternativeRoutes: [],
    safetyRecommendations: [
      'Normal driving conditions',
      'Stay hydrated in high temperatures',
      'Monitor for heat-related issues',
    ],
  },
  {
    routeId: 'route-004',
    origin: 'Salt Lake City, UT',
    destination: 'Denver, CO',
    currentWeather: {
      temperature: 28,
      condition: 'Snow',
      windSpeed: 20,
      visibility: 3,
      precipitation: 0.5,
    },
    weatherAlerts: [mockWeatherAlerts[2]],
    riskLevel: 'medium',
    recommendedDelay: 90,
    alternativeRoutes: ['I-80 via Cheyenne', 'US-40 via Steamboat Springs'],
    safetyRecommendations: [
      'Check tire chains before departure',
      'Reduce speed by 50%',
      'Increase following distance to 8 seconds',
      'Carry emergency winter supplies',
    ],
  },
  {
    routeId: 'route-005',
    origin: 'New Orleans, LA',
    destination: 'Houston, TX',
    currentWeather: {
      temperature: 78,
      condition: 'Heavy Rain',
      windSpeed: 25,
      visibility: 4,
      precipitation: 1.2,
    },
    weatherAlerts: [mockWeatherAlerts[3]],
    riskLevel: 'high',
    recommendedDelay: 150,
    alternativeRoutes: ['I-10 via Lake Charles', 'US-90 via Beaumont'],
    safetyRecommendations: [
      'Avoid low-lying areas and underpasses',
      'Check road closures before departure',
      'Consider delay until flood conditions improve',
      'Have emergency flotation devices ready',
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (action === 'alerts') {
      return NextResponse.json({
        alerts: mockWeatherAlerts,
        timestamp: new Date().toISOString(),
        totalAlerts: mockWeatherAlerts.length,
        highSeverityAlerts: mockWeatherAlerts.filter(
          (alert) => alert.severity === 'high' || alert.severity === 'extreme'
        ).length,
      });
    }

    if (action === 'routes') {
      return NextResponse.json({
        routeAnalysis: mockRouteAnalysis,
        timestamp: new Date().toISOString(),
        totalRoutes: mockRouteAnalysis.length,
        routesWithAlerts: mockRouteAnalysis.filter(
          (route) => route.weatherAlerts.length > 0
        ).length,
        averageRiskLevel:
          mockRouteAnalysis.reduce((sum, route) => {
            const riskValues = { low: 1, medium: 2, high: 3, extreme: 4 };
            return sum + riskValues[route.riskLevel];
          }, 0) / mockRouteAnalysis.length,
      });
    }

    // Return all data by default
    return NextResponse.json({
      alerts: mockWeatherAlerts,
      routeAnalysis: mockRouteAnalysis,
      timestamp: new Date().toISOString(),
      summary: {
        totalAlerts: mockWeatherAlerts.length,
        highSeverityAlerts: mockWeatherAlerts.filter(
          (alert) => alert.severity === 'high' || alert.severity === 'extreme'
        ).length,
        totalRoutes: mockRouteAnalysis.length,
        routesWithAlerts: mockRouteAnalysis.filter(
          (route) => route.weatherAlerts.length > 0
        ).length,
        totalRecommendedDelay: mockRouteAnalysis.reduce(
          (sum, route) => sum + route.recommendedDelay,
          0
        ),
      },
    });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch weather data',
        message: 'Weather service temporarily unavailable',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, routeId, coordinates } = body;

    if (action === 'analyze-route') {
      // Simulate route analysis
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAnalysis = {
        routeId,
        coordinates,
        analysis: {
          weatherConditions: 'Good',
          riskLevel: 'low',
          recommendedDelay: 0,
          alternativeRoutes: [],
          safetyRecommendations: ['Normal driving conditions'],
        },
      };

      return NextResponse.json(mockAnalysis);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Weather API POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to process weather request' },
      { status: 500 }
    );
  }
}
