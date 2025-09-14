import React, { useState, useEffect, useRef } from 'react'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  BellOff,
  Zap,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts'
import { 
  RealTimeAnalyticsEngine, 
  RealTimeMetrics, 
  RealTimeAlert, 
  LiveInsight 
} from '@/lib/realtime-analytics'

interface RealTimeDashboardProps {
  onInsight?: (insight: LiveInsight) => void
  onAlert?: (alert: RealTimeAlert) => void
}

const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({ onInsight, onAlert }) => {
  const [metrics, setMetrics] = useState<Map<string, RealTimeMetrics>>(new Map())
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([])
  const [insights, setInsights] = useState<LiveInsight[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [showAlerts, setShowAlerts] = useState(true)
  const engineRef = useRef<RealTimeAnalyticsEngine | null>(null)

  useEffect(() => {
    // Initialize real-time analytics engine
    const engine = new RealTimeAnalyticsEngine()
    engineRef.current = engine
    
    // Subscribe to updates
    engine.subscribe('metric:revenue', (metric: RealTimeMetrics) => {
      setMetrics(prev => new Map(prev.set('revenue', metric)))
    })
    
    engine.subscribe('metric:users', (metric: RealTimeMetrics) => {
      setMetrics(prev => new Map(prev.set('users', metric)))
    })
    
    engine.subscribe('metric:conversion_rate', (metric: RealTimeMetrics) => {
      setMetrics(prev => new Map(prev.set('conversion_rate', metric)))
    })
    
    engine.subscribe('metric:bounce_rate', (metric: RealTimeMetrics) => {
      setMetrics(prev => new Map(prev.set('bounce_rate', metric)))
    })
    
    engine.subscribe('metric:page_views', (metric: RealTimeMetrics) => {
      setMetrics(prev => new Map(prev.set('page_views', metric)))
    })
    
    engine.subscribe('alert:new', (alert: RealTimeAlert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 19)]) // Keep last 20 alerts
      onAlert?.(alert)
    })
    
    engine.subscribe('insight:new', (insight: LiveInsight) => {
      setInsights(prev => [insight, ...prev.slice(0, 9)]) // Keep last 10 insights
      onInsight?.(insight)
    })
    
    // Start demo data stream
    engine.startDemo()
    setIsConnected(true)
    
    // Periodic update of metrics display
    const updateInterval = setInterval(() => {
      const currentMetrics = engine.getMetrics()
      setMetrics(new Map(currentMetrics))
      
      const currentAlerts = engine.getAlerts()
      setAlerts(currentAlerts.slice(0, 20))
    }, 1000)
    
    return () => {
      clearInterval(updateInterval)
    }
  }, [onInsight, onAlert])

  const acknowledgeAlert = (alertId: string) => {
    if (engineRef.current) {
      engineRef.current.acknowledgeAlert(alertId)
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ))
    }
  }

  const formatValue = (key: string, value: number): string => {
    switch (key) {
      case 'revenue':
        return `$${value.toFixed(0)}`
      case 'users':
        return value.toFixed(0)
      case 'conversion_rate':
        return `${(value * 100).toFixed(2)}%`
      case 'bounce_rate':
        return `${(value * 100).toFixed(1)}%`
      case 'page_views':
        return value.toFixed(0)
      default:
        return value.toFixed(2)
    }
  }

  const getMetricName = (key: string): string => {
    switch (key) {
      case 'revenue':
        return 'Revenue'
      case 'users':
        return 'Active Users'
      case 'conversion_rate':
        return 'Conversion Rate'
      case 'bounce_rate':
        return 'Bounce Rate'
      case 'page_views':
        return 'Page Views'
      default:
        return key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged)

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <div>
              <h3 className="text-lg font-semibold">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                {isConnected ? 'Live data streaming' : 'Disconnected'} • Updated every 2 seconds
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className={`p-2 rounded-lg transition-colors ${showAlerts ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {showAlerts ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            {unacknowledgedAlerts.length > 0 && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unacknowledgedAlerts.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(metrics.entries()).map(([key, metric]) => (
          <div key={key} className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                {getMetricName(key)}
              </h4>
              <div className="flex items-center space-x-1">
                {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                {metric.trend === 'stable' && <Activity className="w-4 h-4 text-gray-500" />}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-2xl font-bold">
                {formatValue(key, metric.currentValue)}
              </div>
              <div className={`text-sm ${
                metric.changePercent > 0 ? 'text-green-600' : 
                metric.changePercent < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}% from previous
              </div>
            </div>

            {/* Mini Sparkline */}
            {metric.sparklineData.length > 1 && (
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.sparklineData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={
                        metric.trend === 'up' ? '#10b981' : 
                        metric.trend === 'down' ? '#ef4444' : '#6b7280'
                      }
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [formatValue(key, Number(value)), getMetricName(key)]}
                      labelFormatter={(timestamp) => 
                        new Date(timestamp).toLocaleTimeString()
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="text-xs text-muted-foreground mt-2">
              Updated: {metric.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Live Insights */}
      {insights.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Live Insights</h3>
          </div>
          
          <div className="space-y-3">
            {insights.slice(0, 3).map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                insight.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                insight.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {insight.confidence.toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {insight.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Alerts */}
      {showAlerts && alerts.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Real-time Alerts</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              {unacknowledgedAlerts.length} unacknowledged
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${
                alert.acknowledged ? 'border-gray-200 bg-gray-50' : 
                alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium">{alert.metric}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                    <div className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.acknowledged ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-muted/20 border rounded-xl p-4">
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Auto-refresh: 2s</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>{metrics.size} metrics tracked</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>{alerts.length} alerts generated</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealTimeDashboard