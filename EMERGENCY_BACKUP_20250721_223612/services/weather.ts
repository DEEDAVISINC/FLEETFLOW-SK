// Weather Service for real-time weather information
interface WeatherCondition {
  temperature: number; // Fahrenheit
  feelsLike: number;
  humidity: number; // percentage
  windSpeed: number; // mph
  windDirection: string;
  visibility: number; // miles
  conditions: string; // Clear, Cloudy, Rain, etc.
  icon: string;
  pressure: number; // inHg
  dewPoint: number;
  uvIndex: number;
}

interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  conditions: string;
  icon: string;
  precipitation: number; // percentage
}

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  startTime: string;
  endTime: string;
  areas: string[];
}

interface WeatherData {
  location: {
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  current: WeatherCondition;
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
  lastUpdated: string;
}

class WeatherServiceClass {
  private cache: { [key: string]: { data: WeatherData; timestamp: number } } = {};
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
      
      // Check cache first
      const cached = this.cache[cacheKey];
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
        return cached.data;
      }

      // Try to get weather from OpenWeatherMap (requires API key)
      const weatherData = await this.fetchFromOpenWeatherMap(latitude, longitude);
      
      if (weatherData) {
        this.cache[cacheKey] = {
          data: weatherData,
          timestamp: Date.now()
        };
        return weatherData;
      }

      // Fallback to mock data for demonstration
      return this.generateMockWeatherData(latitude, longitude);
    } catch (error) {
      console.error('Error fetching weather:', error);
      return this.generateMockWeatherData(latitude, longitude);
    }
  }

  private async fetchFromOpenWeatherMap(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      // This would require an OpenWeatherMap API key
      // For now, we'll simulate the API call
      
      // Example API call (commented out since we don't have API key):
      // const response = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=imperial`
      // );
      
      // Since we don't have API key, return null to use mock data
      return null;
    } catch (error) {
      console.error('OpenWeatherMap API error:', error);
      return null;
    }
  }

  private generateMockWeatherData(latitude: number, longitude: number): WeatherData {
    const now = new Date();
    const locations = this.getLocationInfo(latitude, longitude);
    
    // Generate realistic weather based on location and season
    const baseTemp = this.getSeasonalBaseTemp(latitude, now.getMonth());
    const currentTemp = baseTemp + (Math.random() - 0.5) * 20;
    
    return {
      location: {
        city: locations.city,
        state: locations.state,
        coordinates: { latitude, longitude }
      },
      current: {
        temperature: Math.round(currentTemp),
        feelsLike: Math.round(currentTemp + (Math.random() - 0.5) * 5),
        humidity: Math.round(30 + Math.random() * 50),
        windSpeed: Math.round(Math.random() * 25),
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        visibility: Math.round(5 + Math.random() * 5),
        conditions: this.getRandomConditions(),
        icon: this.getWeatherIcon(this.getRandomConditions()),
        pressure: Math.round(29.5 + Math.random() * 1.5),
        dewPoint: Math.round(currentTemp - 10 - Math.random() * 20),
        uvIndex: Math.round(Math.random() * 10)
      },
      forecast: this.generateForecast(currentTemp),
      alerts: this.generateAlerts(),
      lastUpdated: now.toISOString()
    };
  }

  private getLocationInfo(latitude: number, longitude: number): { city: string; state: string } {
    // Simple location mapping for demo purposes
    if (latitude > 40) return { city: 'Chicago', state: 'IL' };
    if (latitude > 35) return { city: 'Dallas', state: 'TX' };
    if (latitude > 30) return { city: 'Phoenix', state: 'AZ' };
    if (longitude < -120) return { city: 'Los Angeles', state: 'CA' };
    if (longitude < -100) return { city: 'Denver', state: 'CO' };
    if (longitude < -80) return { city: 'Atlanta', state: 'GA' };
    return { city: 'New York', state: 'NY' };
  }

  private getSeasonalBaseTemp(latitude: number, month: number): number {
    const isWinter = month < 3 || month > 10;
    const isSummer = month > 4 && month < 9;
    
    if (latitude > 45) {
      // Northern regions
      return isWinter ? 20 : (isSummer ? 75 : 55);
    } else if (latitude > 35) {
      // Mid regions
      return isWinter ? 40 : (isSummer ? 85 : 65);
    } else {
      // Southern regions
      return isWinter ? 60 : (isSummer ? 90 : 75);
    }
  }

  private getRandomConditions(): string {
    const conditions = [
      'Clear', 'Partly Cloudy', 'Cloudy', 'Overcast',
      'Light Rain', 'Rain', 'Heavy Rain', 'Snow',
      'Fog', 'Mist', 'Thunderstorm'
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private getWeatherIcon(conditions: string): string {
    const iconMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Light Rain': '🌦️',
      'Rain': '🌧️',
      'Heavy Rain': '⛈️',
      'Snow': '❄️',
      'Fog': '🌫️',
      'Mist': '🌫️',
      'Thunderstorm': '⛈️'
    };
    return iconMap[conditions] || '🌤️';
  }

  private generateForecast(baseTemp: number): WeatherForecast[] {
    const forecast: WeatherForecast[] = [];
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const dayTemp = baseTemp + (Math.random() - 0.5) * 15;
      const conditions = this.getRandomConditions();
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        high: Math.round(dayTemp + Math.random() * 10),
        low: Math.round(dayTemp - Math.random() * 15),
        conditions,
        icon: this.getWeatherIcon(conditions),
        precipitation: Math.round(Math.random() * 100)
      });
    }
    
    return forecast;
  }

  private generateAlerts(): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    
    // Randomly generate alerts (about 20% chance)
    if (Math.random() < 0.2) {
      const alertTypes = [
        {
          title: 'Winter Weather Advisory',
          description: 'Snow and ice expected. Reduced visibility and slippery road conditions.',
          severity: 'moderate' as const
        },
        {
          title: 'Severe Thunderstorm Warning',
          description: 'Severe thunderstorms with heavy rain, lightning, and strong winds.',
          severity: 'severe' as const
        },
        {
          title: 'Dense Fog Advisory',
          description: 'Dense fog reducing visibility to less than 1/4 mile.',
          severity: 'minor' as const
        },
        {
          title: 'High Wind Warning',
          description: 'High winds expected. Difficult driving conditions for high-profile vehicles.',
          severity: 'severe' as const
        }
      ];
      
      const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 6 * 60 * 60 * 1000); // 6 hours
      
      alerts.push({
        id: `alert-${Date.now()}`,
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        areas: ['Current Location', 'Route Area']
      });
    }
    
    return alerts;
  }

  async getWeatherAlerts(latitude: number, longitude: number): Promise<WeatherAlert[]> {
    const weatherData = await this.getCurrentWeather(latitude, longitude);
    return weatherData?.alerts || [];
  }

  async getRouteForecast(startLat: number, startLon: number, endLat: number, endLon: number): Promise<WeatherForecast[]> {
    // For route weather, we'll get weather for start and end points
    // In a real implementation, this would get weather along the entire route
    try {
      const [startWeather, endWeather] = await Promise.all([
        this.getCurrentWeather(startLat, startLon),
        this.getCurrentWeather(endLat, endLon)
      ]);
      
      const forecast: WeatherForecast[] = [];
      
      if (startWeather) {
        forecast.push(...startWeather.forecast);
      }
      
      if (endWeather && endWeather.location.city !== startWeather?.location.city) {
        forecast.push(...endWeather.forecast);
      }
      
      return forecast;
    } catch (error) {
      console.error('Error getting route forecast:', error);
      return [];
    }
  }

  getDrivingConditions(weather: WeatherCondition): {
    safety: 'good' | 'caution' | 'poor' | 'dangerous';
    message: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let safety: 'good' | 'caution' | 'poor' | 'dangerous' = 'good';
    let message = 'Good driving conditions';
    
    // Check visibility
    if (weather.visibility < 2) {
      safety = 'dangerous';
      message = 'Very poor visibility - exercise extreme caution';
      recommendations.push('Use headlights and reduce speed significantly');
      recommendations.push('Consider stopping if visibility becomes too poor');
    } else if (weather.visibility < 5) {
      safety = 'poor';
      message = 'Poor visibility conditions';
      recommendations.push('Use headlights and reduce speed');
    }
    
    // Check weather conditions
    if (weather.conditions.includes('Snow') || weather.conditions.includes('Ice')) {
      safety = 'dangerous';
      message = 'Hazardous winter conditions';
      recommendations.push('Reduce speed and increase following distance');
      recommendations.push('Check tire chains and winter equipment');
    } else if (weather.conditions.includes('Heavy Rain') || weather.conditions.includes('Thunderstorm')) {
      safety = 'poor';
      message = 'Severe weather conditions';
      recommendations.push('Reduce speed and use caution');
      recommendations.push('Avoid driving through flooded areas');
    } else if (weather.conditions.includes('Rain')) {
      safety = 'caution';
      message = 'Wet road conditions';
      recommendations.push('Reduce speed on wet roads');
    }
    
    // Check wind conditions
    if (weather.windSpeed > 35) {
      safety = 'dangerous';
      message = 'High wind conditions - dangerous for high-profile vehicles';
      recommendations.push('Reduce speed and grip steering wheel firmly');
      recommendations.push('Consider alternate route or wait for winds to subside');
    } else if (weather.windSpeed > 25) {
      safety = 'poor';
      message = 'Strong wind conditions';
      recommendations.push('Use caution, especially with high-profile loads');
    }
    
    return { safety, message, recommendations };
  }
}

export const WeatherService = new WeatherServiceClass(); 