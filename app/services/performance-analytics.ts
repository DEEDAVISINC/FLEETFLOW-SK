// PerformanceAnalyticsService for driver performance metrics
interface PerformanceMetrics {
  driverId: string;
  score: number;
  completedLoads: number;
  onTimeDelivery: number;
  rating: number;
  fuelEfficiency: number;
  safetyScore: number;
  milesThisWeek: number;
  milesThisMonth: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  lastUpdated: string;
}

interface DetailedAnalytics {
  driverId: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    loads: { completed: number; cancelled: number; onTime: number; late: number };
    revenue: { total: number; perMile: number; perLoad: number };
    fuel: { totalGallons: number; efficiency: number; cost: number };
    safety: { violations: number; accidents: number; inspections: number };
    performance: { averageRating: number; customerFeedback: number };
  };
  trends: {
    metric: string;
    change: number;
    direction: 'up' | 'down' | 'stable';
  }[];
}

class PerformanceAnalyticsServiceClass {
  private metrics: { [driverId: string]: PerformanceMetrics } = {
    'DRV-001': {
      driverId: 'DRV-001',
      score: 95,
      completedLoads: 127,
      onTimeDelivery: 98,
      rating: 4.8,
      fuelEfficiency: 7.2,
      safetyScore: 96,
      milesThisWeek: 2847,
      milesThisMonth: 11230,
      revenueThisWeek: 8940,
      revenueThisMonth: 35600,
      lastUpdated: new Date().toISOString()
    },
    'DRV-002': {
      driverId: 'DRV-002',
      score: 92,
      completedLoads: 89,
      onTimeDelivery: 94,
      rating: 4.6,
      fuelEfficiency: 6.8,
      safetyScore: 98,
      milesThisWeek: 2156,
      milesThisMonth: 9840,
      revenueThisWeek: 6780,
      revenueThisMonth: 29200,
      lastUpdated: new Date().toISOString()
    }
  };

  async getMetrics(driverId: string): Promise<PerformanceMetrics | null> {
    try {
      return this.metrics[driverId] || null;
    } catch (error) {
      console.error('Error getting metrics:', error);
      return null;
    }
  }

  async updateMetrics(driverId: string, updates: Partial<PerformanceMetrics>): Promise<boolean> {
    try {
      const current = this.metrics[driverId];
      if (!current) {
        return false;
      }

      this.metrics[driverId] = {
        ...current,
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      return true;
    } catch (error) {
      console.error('Error updating metrics:', error);
      return false;
    }
  }

  async getDetailedAnalytics(driverId: string, period: DetailedAnalytics['period']): Promise<DetailedAnalytics | null> {
    try {
      const metrics = this.metrics[driverId];
      if (!metrics) {
        return null;
      }

      // Mock detailed analytics - in real implementation, this would query historical data
      const analytics: DetailedAnalytics = {
        driverId,
        period,
        metrics: {
          loads: {
            completed: metrics.completedLoads,
            cancelled: 3,
            onTime: Math.round(metrics.completedLoads * (metrics.onTimeDelivery / 100)),
            late: Math.round(metrics.completedLoads * ((100 - metrics.onTimeDelivery) / 100))
          },
          revenue: {
            total: period === 'week' ? metrics.revenueThisWeek : metrics.revenueThisMonth,
            perMile: period === 'week' ? metrics.revenueThisWeek / metrics.milesThisWeek : metrics.revenueThisMonth / metrics.milesThisMonth,
            perLoad: period === 'week' ? metrics.revenueThisWeek / 5 : metrics.revenueThisMonth / 20
          },
          fuel: {
            totalGallons: period === 'week' ? metrics.milesThisWeek / metrics.fuelEfficiency : metrics.milesThisMonth / metrics.fuelEfficiency,
            efficiency: metrics.fuelEfficiency,
            cost: period === 'week' ? (metrics.milesThisWeek / metrics.fuelEfficiency) * 3.8 : (metrics.milesThisMonth / metrics.fuelEfficiency) * 3.8
          },
          safety: {
            violations: 0,
            accidents: 0,
            inspections: 2
          },
          performance: {
            averageRating: metrics.rating,
            customerFeedback: 95
          }
        },
        trends: [
          { metric: 'On-time Delivery', change: 2.3, direction: 'up' },
          { metric: 'Fuel Efficiency', change: 0.4, direction: 'up' },
          { metric: 'Safety Score', change: -1.2, direction: 'down' },
          { metric: 'Revenue per Mile', change: 5.7, direction: 'up' }
        ]
      };

      return analytics;
    } catch (error) {
      console.error('Error getting detailed analytics:', error);
      return null;
    }
  }

  async getLeaderboard(metric: 'score' | 'onTimeDelivery' | 'fuelEfficiency' | 'safetyScore'): Promise<{ driverId: string; value: number; rank: number }[]> {
    try {
      const drivers = Object.values(this.metrics);
      const sorted = drivers.sort((a, b) => b[metric] - a[metric]);
      
      return sorted.map((driver, index) => ({
        driverId: driver.driverId,
        value: driver[metric],
        rank: index + 1
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  async recordLoadCompletion(driverId: string, loadData: {
    onTime: boolean;
    revenue: number;
    miles: number;
    fuelUsed: number;
    rating: number;
  }): Promise<boolean> {
    try {
      const metrics = this.metrics[driverId];
      if (!metrics) {
        return false;
      }

      // Update metrics
      metrics.completedLoads += 1;
      metrics.onTimeDelivery = Math.round(((metrics.onTimeDelivery * (metrics.completedLoads - 1)) + (loadData.onTime ? 100 : 0)) / metrics.completedLoads);
      metrics.rating = Math.round(((metrics.rating * (metrics.completedLoads - 1)) + loadData.rating) / metrics.completedLoads * 10) / 10;
      metrics.fuelEfficiency = Math.round(((metrics.fuelEfficiency * (metrics.completedLoads - 1)) + (loadData.miles / loadData.fuelUsed)) / metrics.completedLoads * 10) / 10;
      
      // Update weekly/monthly totals
      metrics.milesThisWeek += loadData.miles;
      metrics.milesThisMonth += loadData.miles;
      metrics.revenueThisWeek += loadData.revenue;
      metrics.revenueThisMonth += loadData.revenue;

      // Recalculate overall score
      metrics.score = Math.round((metrics.onTimeDelivery * 0.3 + metrics.rating * 20 * 0.2 + metrics.fuelEfficiency * 10 * 0.2 + metrics.safetyScore * 0.3));

      metrics.lastUpdated = new Date().toISOString();
      return true;
    } catch (error) {
      console.error('Error recording load completion:', error);
      return false;
    }
  }

  async getComparativeAnalytics(driverId: string): Promise<{
    driverRank: number;
    totalDrivers: number;
    aboveAverage: string[];
    belowAverage: string[];
    recommendations: string[];
  }> {
    try {
      const metrics = this.metrics[driverId];
      if (!metrics) {
        return {
          driverRank: 0,
          totalDrivers: 0,
          aboveAverage: [],
          belowAverage: [],
          recommendations: []
        };
      }

      const allDrivers = Object.values(this.metrics);
      const sorted = allDrivers.sort((a, b) => b.score - a.score);
      const driverRank = sorted.findIndex(d => d.driverId === driverId) + 1;

      // Calculate averages
      const avgOnTime = allDrivers.reduce((sum, d) => sum + d.onTimeDelivery, 0) / allDrivers.length;
      const avgRating = allDrivers.reduce((sum, d) => sum + d.rating, 0) / allDrivers.length;
      const avgFuelEfficiency = allDrivers.reduce((sum, d) => sum + d.fuelEfficiency, 0) / allDrivers.length;
      const avgSafetyScore = allDrivers.reduce((sum, d) => sum + d.safetyScore, 0) / allDrivers.length;

      const aboveAverage = [];
      const belowAverage = [];
      const recommendations = [];

      if (metrics.onTimeDelivery > avgOnTime) {
        aboveAverage.push(`On-time Delivery (${metrics.onTimeDelivery}% vs ${avgOnTime.toFixed(1)}% avg)`);
      } else {
        belowAverage.push(`On-time Delivery (${metrics.onTimeDelivery}% vs ${avgOnTime.toFixed(1)}% avg)`);
        recommendations.push('Focus on route planning and time management to improve on-time delivery');
      }

      if (metrics.rating > avgRating) {
        aboveAverage.push(`Customer Rating (${metrics.rating}/5 vs ${avgRating.toFixed(1)}/5 avg)`);
      } else {
        belowAverage.push(`Customer Rating (${metrics.rating}/5 vs ${avgRating.toFixed(1)}/5 avg)`);
        recommendations.push('Improve customer service and communication skills');
      }

      if (metrics.fuelEfficiency > avgFuelEfficiency) {
        aboveAverage.push(`Fuel Efficiency (${metrics.fuelEfficiency} MPG vs ${avgFuelEfficiency.toFixed(1)} MPG avg)`);
      } else {
        belowAverage.push(`Fuel Efficiency (${metrics.fuelEfficiency} MPG vs ${avgFuelEfficiency.toFixed(1)} MPG avg)`);
        recommendations.push('Consider eco-driving techniques to improve fuel efficiency');
      }

      if (metrics.safetyScore > avgSafetyScore) {
        aboveAverage.push(`Safety Score (${metrics.safetyScore}% vs ${avgSafetyScore.toFixed(1)}% avg)`);
      } else {
        belowAverage.push(`Safety Score (${metrics.safetyScore}% vs ${avgSafetyScore.toFixed(1)}% avg)`);
        recommendations.push('Complete additional safety training courses');
      }

      return {
        driverRank,
        totalDrivers: allDrivers.length,
        aboveAverage,
        belowAverage,
        recommendations
      };
    } catch (error) {
      console.error('Error getting comparative analytics:', error);
      return {
        driverRank: 0,
        totalDrivers: 0,
        aboveAverage: [],
        belowAverage: [],
        recommendations: []
      };
    }
  }

  async exportPerformanceReport(driverId: string, period: 'week' | 'month' | 'quarter'): Promise<{ success: boolean; data?: any }> {
    try {
      const metrics = await this.getMetrics(driverId);
      const analytics = await this.getDetailedAnalytics(driverId, period);
      const comparative = await this.getComparativeAnalytics(driverId);

      if (!metrics || !analytics) {
        return { success: false };
      }

      const report = {
        driverId,
        period,
        generatedAt: new Date().toISOString(),
        summary: metrics,
        detailedAnalytics: analytics,
        comparative,
        recommendations: comparative.recommendations
      };

      return { success: true, data: report };
    } catch (error) {
      console.error('Error exporting performance report:', error);
      return { success: false };
    }
  }
}

export const PerformanceAnalyticsService = new PerformanceAnalyticsServiceClass(); 