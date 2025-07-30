// WeatherService.ts - Integration with National Weather Service API (Free, no API key required)
'use client'

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  windDirection: string
  visibility: number
  precipitation: number
  alerts: WeatherAlert[]
  forecast: WeatherForecast[]
}

export interface WeatherAlert {
  id: string
  title: string
  description: string
  severity: 'minor' | 'moderate' | 'severe' | 'extreme'
  areas: string[]
  onset: string
  expires: string
}

export interface WeatherForecast {
  time: string
  temperature: number
  condition: string
  precipitationChance: number
}

export interface LocationWeather {
  location: string
  coordinates: [number, number]
  weather: WeatherData
  lastUpdated: string
}

class WeatherService {
  private baseUrl = 'https://api.weather.gov'
  private cache = new Map<string, { data: WeatherData; timestamp: number }>()
  private cacheTimeout = 10 * 60 * 1000 // 10 minutes

  // Get weather data for coordinates
  async getWeatherForLocation(lat: number, lon: number): Promise<WeatherData | null> {
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`
    
    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      // Get weather station info
      const pointResponse = await fetch(`${this.baseUrl}/points/${lat.toFixed(4)},${lon.toFixed(4)}`)
      if (!pointResponse.ok) {
        console.warn('Weather service unavailable, using fallback data')
        return this.getFallbackWeather(lat, lon)
      }

      const pointData = await pointResponse.json()
      const forecastUrl = pointData.properties.forecast
      const forecastHourlyUrl = pointData.properties.forecastHourly
      
      // Get current conditions and forecast
      const [forecastResponse, hourlyResponse] = await Promise.all([
        fetch(forecastUrl),
        fetch(forecastHourlyUrl)
      ])

      if (!forecastResponse.ok || !hourlyResponse.ok) {
        return this.getFallbackWeather(lat, lon)
      }

      const forecastData = await forecastResponse.json()
      const hourlyData = await hourlyResponse.json()

      // Get weather alerts for the area
      const alertsResponse = await fetch(`${this.baseUrl}/alerts/active?point=${lat},${lon}`)
      const alertsData = alertsResponse.ok ? await alertsResponse.json() : { features: [] }

      // Process weather data
      const currentPeriod = forecastData.properties.periods[0]
      const currentHour = hourlyData.properties.periods[0]
      
      const weatherData: WeatherData = {
        temperature: currentHour.temperature,
        condition: currentPeriod.shortForecast,
        humidity: currentHour.relativeHumidity?.value || 50,
        windSpeed: this.parseWindSpeed(currentHour.windSpeed),
        windDirection: currentHour.windDirection,
        visibility: this.parseVisibility(currentHour.visibility),
        precipitation: currentHour.probabilityOfPrecipitation?.value || 0,
        alerts: this.processWeatherAlerts(alertsData.features),
        forecast: this.processForecast(hourlyData.properties.periods.slice(0, 24))
      }

      // Cache the result
      this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() })
      return weatherData

    } catch (error) {
      console.error('Weather API error:', error)
      return this.getFallbackWeather(lat, lon)
    }
  }

  // Get weather for multiple locations (for route tracking)
  async getWeatherForRoute(coordinates: [number, number][]): Promise<LocationWeather[]> {
    const weatherPromises = coordinates.map(async ([lat, lon]) => {
      const weather = await this.getWeatherForLocation(lat, lon)
      return {
        location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
        coordinates: [lat, lon] as [number, number],
        weather: weather || this.getFallbackWeather(lat, lon),
        lastUpdated: new Date().toISOString()
      }
    })

    return Promise.all(weatherPromises)
  }

  // Check for weather-related delays
  getWeatherImpact(weather: WeatherData): {
    riskLevel: 'low' | 'moderate' | 'high' | 'extreme'
    recommendations: string[]
    delayEstimate: number // in minutes
  } {
    let riskLevel: 'low' | 'moderate' | 'high' | 'extreme' = 'low'
    const recommendations: string[] = []
    let delayEstimate = 0

    // Check temperature extremes
    if (weather.temperature <= 10) {
      riskLevel = 'moderate'
      recommendations.push('Monitor for ice conditions')
      delayEstimate += 15
    }
    if (weather.temperature >= 100) {
      riskLevel = 'moderate'
      recommendations.push('Monitor vehicle cooling systems')
      delayEstimate += 10
    }

    // Check precipitation
    if (weather.precipitation > 70) {
      riskLevel = 'high'
      recommendations.push('Heavy rain - reduce speed, increase following distance')
      delayEstimate += 30
    }

    // Check wind conditions
    if (weather.windSpeed > 35) {
      riskLevel = 'high'
      recommendations.push('High winds - secure cargo, avoid high-profile routes')
      delayEstimate += 20
    }

    // Check visibility
    if (weather.visibility < 2) {
      riskLevel = 'extreme'
      recommendations.push('Low visibility - consider route delay')
      delayEstimate += 60
    }

    // Check alerts
    if (weather.alerts.length > 0) {
      const hasExtreme = weather.alerts.some(alert => alert.severity === 'extreme')
      const hasSevere = weather.alerts.some(alert => alert.severity === 'severe')
      
      if (hasExtreme) {
        riskLevel = 'extreme'
        recommendations.push('Extreme weather alert - consider stopping until conditions improve')
        delayEstimate += 120
      } else if (hasSevere) {
        riskLevel = 'high'
        recommendations.push('Severe weather alert - proceed with extreme caution')
        delayEstimate += 45
      }
    }

    return { riskLevel, recommendations, delayEstimate }
  }

  private getFallbackWeather(lat: number, lon: number): WeatherData {
    // Provide reasonable fallback data when API is unavailable
    return {
      temperature: 72,
      condition: 'Clear',
      humidity: 45,
      windSpeed: 8,
      windDirection: 'SW',
      visibility: 10,
      precipitation: 0,
      alerts: [],
      forecast: []
    }
  }

  private parseWindSpeed(windSpeed: string): number {
    const match = windSpeed.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  private parseVisibility(visibility: string): number {
    if (!visibility) return 10
    const match = visibility.match(/(\d+)/)
    return match ? parseInt(match[1]) : 10
  }

  private processWeatherAlerts(features: any[]): WeatherAlert[] {
    return features.map(feature => ({
      id: feature.id,
      title: feature.properties.headline,
      description: feature.properties.description,
      severity: feature.properties.severity.toLowerCase(),
      areas: feature.properties.areaDesc.split(';').map((area: string) => area.trim()),
      onset: feature.properties.onset,
      expires: feature.properties.expires
    }))
  }

  private processForecast(periods: any[]): WeatherForecast[] {
    return periods.map(period => ({
      time: period.startTime,
      temperature: period.temperature,
      condition: period.shortForecast,
      precipitationChance: period.probabilityOfPrecipitation?.value || 0
    }))
  }
}

export const weatherService = new WeatherService()
