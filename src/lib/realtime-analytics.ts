// Real-time Analytics Engine for Zenalyst Nexus
// Processes streaming data and provides live insights

export interface StreamingDataPoint {
  timestamp: Date
  [key: string]: number | string | Date | boolean
}

export interface RealTimeMetrics {
  currentValue: number
  previousValue: number
  changePercent: number
  trend: 'up' | 'down' | 'stable'
  sparklineData: { timestamp: Date; value: number }[]
  lastUpdated: Date
}

export interface AlertConfig {
  metric: string
  condition: 'above' | 'below' | 'equals' | 'change_percent'
  threshold: number
  enabled: boolean
  severity: 'low' | 'medium' | 'high'
}

export interface RealTimeAlert {
  id: string
  metric: string
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: Date
  acknowledged: boolean
  value: number
  threshold: number
}

export interface LiveInsight {
  type: 'anomaly' | 'trend_break' | 'threshold_breach' | 'correlation_shift'
  title: string
  description: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  timestamp: Date
  affectedMetrics: string[]
}

export class RealTimeAnalyticsEngine {
  private dataBuffer: Map<string, StreamingDataPoint[]> = new Map()
  private metrics: Map<string, RealTimeMetrics> = new Map()
  private alerts: RealTimeAlert[] = []
  private alertConfigs: AlertConfig[] = []
  private subscribers: Map<string, Function[]> = new Map()
  private bufferSize: number = 1000
  private updateInterval: number = 5000 // 5 seconds
  private isProcessing: boolean = false

  constructor() {
    this.initializeDefaultAlerts()
    this.startProcessing()
  }

  // Initialize default alert configurations
  private initializeDefaultAlerts() {
    this.alertConfigs = [
      {
        metric: 'revenue',
        condition: 'change_percent',
        threshold: -10,
        enabled: true,
        severity: 'high'
      },
      {
        metric: 'users',
        condition: 'change_percent',
        threshold: -20,
        enabled: true,
        severity: 'medium'
      },
      {
        metric: 'conversion_rate',
        condition: 'below',
        threshold: 0.02,
        enabled: true,
        severity: 'high'
      },
      {
        metric: 'bounce_rate',
        condition: 'above',
        threshold: 0.7,
        enabled: true,
        severity: 'medium'
      }
    ]
  }

  // Start real-time processing
  private startProcessing() {
    setInterval(() => {
      if (!this.isProcessing) {
        this.processRealTimeUpdates()
      }
    }, this.updateInterval)
  }

  // Add streaming data point
  public addDataPoint(point: StreamingDataPoint) {
    const key = 'default' // In real app, could partition by source/stream
    
    if (!this.dataBuffer.has(key)) {
      this.dataBuffer.set(key, [])
    }
    
    const buffer = this.dataBuffer.get(key)!
    buffer.push(point)
    
    // Maintain buffer size
    if (buffer.length > this.bufferSize) {
      buffer.shift()
    }
    
    // Trigger immediate processing for critical updates
    this.processLatestData(point)
  }

  // Process the latest data point for immediate insights
  private processLatestData(point: StreamingDataPoint) {
    Object.keys(point).forEach(key => {
      if (key === 'timestamp') return
      
      const value = Number(point[key])
      if (isNaN(value)) return
      
      this.updateMetric(key, value, point.timestamp)
      this.checkAlerts(key, value)
    })
  }

  // Update metric with new value
  private updateMetric(metricName: string, newValue: number, timestamp: Date) {
    const existingMetric = this.metrics.get(metricName)
    
    if (!existingMetric) {
      // Initialize new metric
      this.metrics.set(metricName, {
        currentValue: newValue,
        previousValue: newValue,
        changePercent: 0,
        trend: 'stable',
        sparklineData: [{ timestamp, value: newValue }],
        lastUpdated: timestamp
      })
      return
    }

    // Update existing metric
    const changePercent = existingMetric.currentValue === 0 ? 0 : 
      ((newValue - existingMetric.currentValue) / existingMetric.currentValue) * 100
    
    const trend = Math.abs(changePercent) < 1 ? 'stable' : 
                 changePercent > 0 ? 'up' : 'down'

    // Update sparkline data (keep last 50 points)
    const sparklineData = [...existingMetric.sparklineData, { timestamp, value: newValue }]
    if (sparklineData.length > 50) {
      sparklineData.shift()
    }

    const updatedMetric: RealTimeMetrics = {
      currentValue: newValue,
      previousValue: existingMetric.currentValue,
      changePercent,
      trend,
      sparklineData,
      lastUpdated: timestamp
    }

    this.metrics.set(metricName, updatedMetric)
    
    // Notify subscribers
    this.notifySubscribers(`metric:${metricName}`, updatedMetric)
  }

  // Check for alert conditions
  private checkAlerts(metricName: string, value: number) {
    const relevantAlerts = this.alertConfigs.filter(
      alert => alert.metric === metricName && alert.enabled
    )

    relevantAlerts.forEach(alertConfig => {
      const shouldAlert = this.evaluateAlertCondition(alertConfig, value)
      
      if (shouldAlert) {
        const alert: RealTimeAlert = {
          id: `${alertConfig.metric}_${Date.now()}`,
          metric: alertConfig.metric,
          message: this.generateAlertMessage(alertConfig, value),
          severity: alertConfig.severity,
          timestamp: new Date(),
          acknowledged: false,
          value,
          threshold: alertConfig.threshold
        }
        
        this.alerts.unshift(alert) // Add to beginning
        
        // Keep only last 100 alerts
        if (this.alerts.length > 100) {
          this.alerts = this.alerts.slice(0, 100)
        }
        
        // Notify subscribers
        this.notifySubscribers('alert:new', alert)
      }
    })
  }

  // Evaluate alert condition
  private evaluateAlertCondition(config: AlertConfig, value: number): boolean {
    const metric = this.metrics.get(config.metric)
    
    switch (config.condition) {
      case 'above':
        return value > config.threshold
      case 'below':
        return value < config.threshold
      case 'equals':
        return Math.abs(value - config.threshold) < 0.001
      case 'change_percent':
        if (!metric) return false
        return metric.changePercent <= config.threshold // Negative threshold for decrease
      default:
        return false
    }
  }

  // Generate alert message
  private generateAlertMessage(config: AlertConfig, value: number): string {
    const metric = this.metrics.get(config.metric)
    
    switch (config.condition) {
      case 'above':
        return `${config.metric} exceeded threshold: ${value.toFixed(2)} > ${config.threshold}`
      case 'below':
        return `${config.metric} below threshold: ${value.toFixed(2)} < ${config.threshold}`
      case 'change_percent':
        const changePercent = metric?.changePercent || 0
        return `${config.metric} dropped ${Math.abs(changePercent).toFixed(1)}% (threshold: ${Math.abs(config.threshold)}%)`
      default:
        return `Alert triggered for ${config.metric}: ${value.toFixed(2)}`
    }
  }

  // Process real-time updates (runs periodically)
  private async processRealTimeUpdates() {
    this.isProcessing = true
    
    try {
      // Generate live insights from recent data
      const insights = await this.generateLiveInsights()
      
      // Detect anomalies in streaming data
      const anomalies = this.detectStreamingAnomalies()
      
      // Update correlation patterns
      this.updateCorrelationPatterns()
      
      // Notify subscribers of insights
      insights.forEach(insight => {
        this.notifySubscribers('insight:new', insight)
      })
      
    } catch (error) {
      console.error('Real-time processing error:', error)
    } finally {
      this.isProcessing = false
    }
  }

  // Generate live insights from streaming data
  private async generateLiveInsights(): Promise<LiveInsight[]> {
    const insights: LiveInsight[] = []
    const now = new Date()
    
    // Check for trend breaks
    this.metrics.forEach((metric, metricName) => {
      if (metric.sparklineData.length < 10) return
      
      const recentData = metric.sparklineData.slice(-10)
      const trend = this.detectTrendBreak(recentData)
      
      if (trend.hasBreak) {
        insights.push({
          type: 'trend_break',
          title: `Trend Break Detected in ${metricName}`,
          description: `${metricName} has experienced a significant trend change. Previous trend: ${trend.previousTrend}, new trend: ${trend.newTrend}`,
          confidence: trend.confidence,
          severity: trend.confidence > 80 ? 'high' : 'medium',
          timestamp: now,
          affectedMetrics: [metricName]
        })
      }
    })

    // Check for correlation shifts
    const correlationShifts = this.detectCorrelationShifts()
    correlationShifts.forEach(shift => {
      insights.push({
        type: 'correlation_shift',
        title: `Correlation Change: ${shift.metric1} vs ${shift.metric2}`,
        description: `The correlation between ${shift.metric1} and ${shift.metric2} has changed from ${shift.previousCorrelation.toFixed(3)} to ${shift.currentCorrelation.toFixed(3)}`,
        confidence: 85,
        severity: Math.abs(shift.currentCorrelation - shift.previousCorrelation) > 0.3 ? 'high' : 'medium',
        timestamp: now,
        affectedMetrics: [shift.metric1, shift.metric2]
      })
    })

    return insights
  }

  // Detect trend breaks in time series
  private detectTrendBreak(data: { timestamp: Date; value: number }[]): {
    hasBreak: boolean
    previousTrend: string
    newTrend: string
    confidence: number
  } {
    if (data.length < 6) return { hasBreak: false, previousTrend: 'unknown', newTrend: 'unknown', confidence: 0 }
    
    const midPoint = Math.floor(data.length / 2)
    const firstHalf = data.slice(0, midPoint)
    const secondHalf = data.slice(midPoint)
    
    const firstTrend = this.calculateLinearTrend(firstHalf.map(d => d.value))
    const secondTrend = this.calculateLinearTrend(secondHalf.map(d => d.value))
    
    const trendChange = Math.abs(firstTrend.slope - secondTrend.slope)
    const hasBreak = trendChange > 0.1 && Math.sign(firstTrend.slope) !== Math.sign(secondTrend.slope)
    
    return {
      hasBreak,
      previousTrend: firstTrend.slope > 0 ? 'increasing' : firstTrend.slope < 0 ? 'decreasing' : 'stable',
      newTrend: secondTrend.slope > 0 ? 'increasing' : secondTrend.slope < 0 ? 'decreasing' : 'stable',
      confidence: hasBreak ? Math.min(95, (trendChange * 100)) : 0
    }
  }

  // Calculate simple linear trend
  private calculateLinearTrend(values: number[]) {
    const n = values.length
    const x = Array.from({ length: n }, (_, i) => i)
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = values.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0
    const intercept = (sumY - slope * sumX) / n || 0
    
    return { slope, intercept }
  }

  // Detect streaming anomalies
  private detectStreamingAnomalies(): string[] {
    const detectedAnomalies: string[] = []
    
    this.metrics.forEach((metric, metricName) => {
      if (metric.sparklineData.length < 20) return
      
      const values = metric.sparklineData.map(d => d.value)
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const stdDev = Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length)
      
      const latestValue = metric.currentValue
      const zScore = Math.abs((latestValue - mean) / stdDev)
      
      if (zScore > 3) { // 3-sigma rule
        detectedAnomalies.push(metricName)
      }
    })
    
    return detectedAnomalies
  }

  // Update correlation patterns
  private updateCorrelationPatterns() {
    // Simplified correlation tracking
    const metricNames = Array.from(this.metrics.keys())
    
    if (metricNames.length < 2) return
    
    for (let i = 0; i < metricNames.length; i++) {
      for (let j = i + 1; j < metricNames.length; j++) {
        const metric1 = this.metrics.get(metricNames[i])!
        const metric2 = this.metrics.get(metricNames[j])!
        
        if (metric1.sparklineData.length < 10 || metric2.sparklineData.length < 10) continue
        
        // Calculate correlation for trend analysis (simplified for demo)
        this.calculateStreamingCorrelation(metric1.sparklineData, metric2.sparklineData)
      }
    }
  }

  // Calculate correlation between two streaming metrics
  private calculateStreamingCorrelation(
    data1: { timestamp: Date; value: number }[],
    data2: { timestamp: Date; value: number }[]
  ): number {
    const minLength = Math.min(data1.length, data2.length)
    const values1 = data1.slice(-minLength).map(d => d.value)
    const values2 = data2.slice(-minLength).map(d => d.value)
    
    const n = values1.length
    const sumX = values1.reduce((a, b) => a + b, 0)
    const sumY = values2.reduce((a, b) => a + b, 0)
    const sumXY = values1.reduce((sum, xi, i) => sum + xi * values2[i], 0)
    const sumXX = values1.reduce((sum, xi) => sum + xi * xi, 0)
    const sumYY = values2.reduce((sum, yi) => sum + yi * yi, 0)
    
    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
    
    return denominator === 0 ? 0 : numerator / denominator
  }

  // Detect correlation shifts
  private detectCorrelationShifts(): {
    metric1: string
    metric2: string
    previousCorrelation: number
    currentCorrelation: number
  }[] {
    // Simplified implementation - in real app would track historical correlations
    return []
  }

  // Subscribe to real-time updates
  public subscribe(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }
    this.subscribers.get(event)!.push(callback)
  }

  // Unsubscribe from real-time updates
  public unsubscribe(event: string, callback: Function) {
    const subscribers = this.subscribers.get(event)
    if (subscribers) {
      const index = subscribers.indexOf(callback)
      if (index > -1) {
        subscribers.splice(index, 1)
      }
    }
  }

  // Notify subscribers
  private notifySubscribers(event: string, data: any) {
    const subscribers = this.subscribers.get(event)
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Subscriber notification error:', error)
        }
      })
    }
  }

  // Public getters
  public getMetrics(): Map<string, RealTimeMetrics> {
    return new Map(this.metrics)
  }

  public getAlerts(): RealTimeAlert[] {
    return [...this.alerts]
  }

  public acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
    }
  }

  public updateAlertConfig(config: AlertConfig) {
    const index = this.alertConfigs.findIndex(c => c.metric === config.metric && c.condition === config.condition)
    if (index >= 0) {
      this.alertConfigs[index] = config
    } else {
      this.alertConfigs.push(config)
    }
  }

  public getAlertConfigs(): AlertConfig[] {
    return [...this.alertConfigs]
  }

  // Simulate real-time data for demo
  public startDemo() {
    // Demo metrics will be generated dynamically
    
    setInterval(() => {
      const point: StreamingDataPoint = {
        timestamp: new Date(),
        revenue: 1000 + Math.random() * 500 + Math.sin(Date.now() / 10000) * 200,
        users: 100 + Math.random() * 50 + Math.cos(Date.now() / 8000) * 25,
        conversion_rate: 0.05 + Math.random() * 0.03,
        bounce_rate: 0.4 + Math.random() * 0.3,
        page_views: 500 + Math.random() * 300 + Math.sin(Date.now() / 12000) * 150
      }
      
      this.addDataPoint(point)
    }, 2000) // Update every 2 seconds for demo
  }
}