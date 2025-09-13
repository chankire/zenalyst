import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart,
  Brain,
  MessageCircle,
  Download,
  Share,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Network,
  TrendingUp as TrendIcon,
  Zap,
  FileText
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { AnalysisResult } from '@/lib/analytics'
import { ZenalystAI } from '@/lib/zenalyst-ai'
import KnowledgeGraph from '@/components/charts/KnowledgeGraph'

const DashboardPage = () => {
  const [searchParams] = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'
  const isUploadedData = searchParams.get('uploaded') === 'true'
  const [activeInsightPersona, setActiveInsightPersona] = useState<'phd' | 'ceo' | 'manager'>('ceo')
  const [showAIChat, setShowAIChat] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days')
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'users', 'conversion'])
  const [showDataSchema, setShowDataSchema] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [fileName, setFileName] = useState('')
  const [zenalystAI, setZenalystAI] = useState<ZenalystAI | null>(null)
  const [aiMessages, setAIMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([])
  const [aiInput, setAIInput] = useState('')

  // Load analysis results if uploaded data
  useEffect(() => {
    if (isUploadedData) {
      const storedResults = localStorage.getItem('zenalyst_analysis_results')
      const storedData = localStorage.getItem('zenalyst_raw_data')
      const storedFileName = localStorage.getItem('zenalyst_file_name')
      
      if (storedResults && storedData) {
        const results = JSON.parse(storedResults) as AnalysisResult
        const data = JSON.parse(storedData)
        
        setAnalysisResults(results)
        setRawData(data)
        setFileName(storedFileName || 'uploaded_data.csv')
        
        // Initialize Zenalyst AI with the uploaded data
        const ai = new ZenalystAI(data)
        setZenalystAI(ai)
        
        // Set welcome message for uploaded data
        setAIMessages([{
          type: 'ai',
          content: `Hello! I've analyzed your ${storedFileName || 'uploaded data'} and discovered ${results.summary.keyFindings.length} key insights. I can provide detailed analysis from PhD statistical perspective, strategic CEO insights, or actionable manager recommendations. What would you like to explore?`
        }])
      }
    } else if (isDemoMode) {
      // Initialize demo AI
      const demoAI = new ZenalystAI([]) // Empty data for demo
      setZenalystAI(demoAI)
      setAIMessages([{
        type: 'ai',
        content: 'Hello! I\'m your Zenalyst AI assistant. I can help you understand your data with PhD-level analysis, CEO strategic insights, or manager action plans. What would you like to explore?'
      }])
    }
  }, [isUploadedData, isDemoMode])

  // Handle AI chat
  const handleAIMessage = async () => {
    if (!aiInput.trim() || !zenalystAI) return

    const userMessage = aiInput.trim()
    setAIMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setAIInput('')

    try {
      const response = await zenalystAI.processQuestion(userMessage)
      setAIMessages(prev => [...prev, { type: 'ai', content: response }])
    } catch (error) {
      console.error('AI Error:', error)
      setAIMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'I apologize, but I encountered an error processing your question. Please try again or rephrase your question.' 
      }])
    }
  }

  // Generate insights based on analysis results
  const enhancedInsights = useMemo(() => {
    if (!analysisResults) return insights

    const { summary, trends, correlations, rootCauses, forecasts, anomalies } = analysisResults

    return {
      phd: {
        title: "PhD Statistical Analysis",
        content: `Advanced statistical analysis of ${fileName} reveals ${summary.keyFindings.length} significant findings. ${trends.length > 0 ? `Trend analysis shows ${trends[0].direction} pattern with ${(trends[0].strength * 100).toFixed(1)}% confidence.` : ''} ${correlations.length > 0 ? `Correlation analysis identified ${correlations.length} significant relationships, with strongest correlation (r=${correlations[0].correlation.toFixed(3)}) between ${correlations[0].field1} and ${correlations[0].field2}.` : ''} ${anomalies.length > 0 ? `Anomaly detection flagged ${anomalies.length} outliers requiring investigation.` : ''}`,
        confidence: Math.round(summary.confidenceScore * 100),
        dataQuality: summary.dataQuality,
        methodology: "Multi-variate statistical analysis with ML-enhanced pattern recognition"
      },
      ceo: {
        title: "Strategic Executive Summary",
        content: `Analysis of ${fileName} reveals critical business insights: ${summary.keyFindings.slice(0, 3).join(', ')}. ${forecasts.length > 0 ? `Forecasting models predict ${forecasts[0].trend} trajectory with ${(forecasts[0].confidence * 100).toFixed(1)}% confidence.` : ''} ${rootCauses.length > 0 ? `Root cause analysis indicates ${rootCauses[0].effect} is primarily driven by ${rootCauses[0].causes[0]?.cause}.` : ''} Immediate strategic focus required on key performance drivers.`,
        confidence: Math.round(summary.confidenceScore * 100),
        keyActions: summary.recommendations.slice(0, 3),
        riskLevel: anomalies.length > 2 ? "High" : anomalies.length > 0 ? "Medium" : "Low"
      },
      manager: {
        title: "Operational Action Plan",
        content: `Immediate operational priorities from ${fileName} analysis: ${summary.recommendations.join(', ')}. ${trends.length > 0 ? `Primary trend shows ${trends[0].direction} pattern requiring ${trends[0].strength > 0.7 ? 'immediate' : 'planned'} intervention.` : ''} Focus on data-driven execution of identified opportunities.`,
        confidence: Math.round(summary.confidenceScore * 100),
        timeline: "1-2 weeks",
        resources: `${Math.ceil(summary.keyFindings.length / 2)} team members`,
        priority: anomalies.length > 1 ? "High" : "Medium"
      }
    }
  }, [analysisResults, fileName])

  // Sample data for demo
  const kpiData = [
    { 
      title: 'Total Revenue', 
      value: '$2.4M', 
      change: '+12.3%', 
      trend: 'up',
      icon: DollarSign,
      description: 'Monthly recurring revenue'
    },
    { 
      title: 'Active Users', 
      value: '48.2K', 
      change: '+8.1%', 
      trend: 'up',
      icon: Users,
      description: 'Monthly active users'
    },
    { 
      title: 'Conversion Rate', 
      value: '3.24%', 
      change: '-2.1%', 
      trend: 'down',
      icon: Target,
      description: 'Lead to customer conversion'
    },
    { 
      title: 'Avg Order Value', 
      value: '$156', 
      change: '+5.7%', 
      trend: 'up',
      icon: ShoppingCart,
      description: 'Average transaction value'
    }
  ]

  const revenueData = [
    { month: 'Jan', revenue: 185000, target: 200000, users: 35000 },
    { month: 'Feb', revenue: 210000, target: 200000, users: 38000 },
    { month: 'Mar', revenue: 195000, target: 200000, users: 42000 },
    { month: 'Apr', revenue: 230000, target: 200000, users: 45000 },
    { month: 'May', revenue: 240000, target: 200000, users: 48000 },
    { month: 'Jun', revenue: 235000, target: 200000, users: 47000 }
  ]

  const channelData = [
    { name: 'Organic Search', value: 35, color: '#6366f1' },
    { name: 'Paid Ads', value: 28, color: '#10b981' },
    { name: 'Social Media', value: 20, color: '#eab308' },
    { name: 'Email', value: 12, color: '#f59e0b' },
    { name: 'Direct', value: 5, color: '#ef4444' }
  ]

  const regionalData = [
    { region: 'North America', sales: 450000, growth: 15.2 },
    { region: 'Europe', sales: 320000, growth: 12.8 },
    { region: 'Asia Pacific', sales: 280000, growth: 22.1 },
    { region: 'Latin America', sales: 180000, growth: 8.9 },
    { region: 'Middle East', sales: 95000, growth: 18.5 }
  ]

  const insights = {
    phd: {
      title: "PhD Analyst Perspective",
      content: "Statistical analysis reveals a significant correlation (r=0.847, p<0.001) between user engagement metrics and revenue growth. The observed 12.3% revenue increase demonstrates strong seasonal variance (σ²=0.23) with 95% confidence intervals suggesting sustainable growth trajectory. Cohort analysis indicates improving user retention rates across all segments.",
      confidence: 94,
      dataQuality: "High",
      methodology: "Multivariate regression analysis with seasonal decomposition"
    },
    ceo: {
      title: "Strategic Executive Summary", 
      content: "Our Q2 performance significantly exceeded targets with $2.4M in revenue (+12.3% MoM). Key strategic wins include expanding our Asia Pacific presence (+22.1% growth) and improving conversion efficiency. However, we're seeing a concerning dip in conversion rates (-2.1%) that requires immediate attention. Recommend accelerating product development and customer success initiatives.",
      confidence: 92,
      keyActions: ["Expand APAC team", "Address conversion bottleneck", "Accelerate product roadmap"],
      riskLevel: "Medium"
    },
    manager: {
      title: "Operational Action Plan",
      content: "Immediate priorities: 1) Investigate conversion rate decline - likely due to pricing changes implemented in April. 2) Capitalize on strong APAC growth by increasing marketing spend by 30%. 3) Optimize organic search strategy to maintain 35% channel share. Timeline: Complete analysis by Friday, implement fixes by end of month.",
      confidence: 88,
      timeline: "2 weeks",
      resources: "3 team members",
      priority: "High"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                ← Back to Projects
              </Link>
              <div>
                <h1 className="text-xl font-semibold">
                  {isUploadedData ? `Analytics: ${fileName}` : isDemoMode ? 'Demo: Sales Analytics Dashboard' : 'Analytics Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isUploadedData 
                    ? `${rawData.length} records • Advanced ML insights available` 
                    : isDemoMode 
                      ? 'Sample data showcasing cognitive insights' 
                      : 'Real-time business analytics'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button 
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-10 p-4">
                    <h3 className="font-semibold mb-3">Filter Dashboard</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Date Range</label>
                        <select 
                          value={selectedDateRange}
                          onChange={(e) => setSelectedDateRange(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="last-7-days">Last 7 Days</option>
                          <option value="last-30-days">Last 30 Days</option>
                          <option value="last-90-days">Last 90 Days</option>
                          <option value="last-year">Last Year</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Metrics</label>
                        <div className="space-y-2">
                          {['revenue', 'users', 'conversion', 'engagement'].map((metric) => (
                            <label key={metric} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedMetrics.includes(metric)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedMetrics([...selectedMetrics, metric])
                                  } else {
                                    setSelectedMetrics(selectedMetrics.filter(m => m !== metric))
                                  }
                                }}
                                className="mr-2"
                              />
                              <span className="capitalize">{metric}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setShowFilterDropdown(false)}
                        className="w-full px-3 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Last 6 months</span>
              </button>
              <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button 
                onClick={() => setShowDataSchema(!showDataSchema)}
                className="px-3 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Build Dashboard</span>
              </button>
              <button className="px-3 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.trend === 'up' ? 'bg-secondary/10' : 'bg-destructive/10'}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.trend === 'up' ? 'text-secondary' : 'text-destructive'}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-secondary' : 'text-destructive'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{kpi.value}</h3>
                <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="p-6 bg-card border rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Revenue & User Growth</h3>
                <p className="text-sm text-muted-foreground">Monthly performance vs targets</p>
              </div>
              <LineChart className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                      name === 'revenue' ? 'Revenue' : name === 'target' ? 'Target' : 'Users'
                    ]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    fill="#6366f1" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channel Distribution */}
          <div className="p-6 bg-card border rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Traffic Sources</h3>
                <p className="text-sm text-muted-foreground">User acquisition channels</p>
              </div>
              <PieChart className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Share']}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="mb-8">
          <div className="p-6 bg-card border rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Regional Performance</h3>
                <p className="text-sm text-muted-foreground">Sales by geographic region</p>
              </div>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="region" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'sales' ? `$${value.toLocaleString()}` : `${value}%`,
                      name === 'sales' ? 'Sales' : 'Growth'
                    ]}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Sections - Only show for uploaded data */}
        {isUploadedData && analysisResults && (
          <>
            {/* Trends and Forecasting */}
            {analysisResults.trends.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Trend Analysis */}
                <div className="p-6 bg-card border rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Trend Analysis</h3>
                      <p className="text-sm text-muted-foreground">Statistical trend detection</p>
                    </div>
                    <TrendIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-4">
                    {analysisResults.trends.slice(0, 3).map((trend, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{trend.field}</span>
                          <span className={`text-sm font-medium px-2 py-1 rounded ${
                            trend.direction === 'increasing' ? 'bg-secondary/20 text-secondary' :
                            trend.direction === 'decreasing' ? 'bg-destructive/20 text-destructive' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {trend.direction}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Strength: {(trend.strength * 100).toFixed(1)}%</span>
                          <span>p-value: {trend.pValue?.toFixed(4) || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forecasting */}
                {analysisResults.forecasts.length > 0 && (
                  <div className="p-6 bg-card border rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">ML Forecasting</h3>
                        <p className="text-sm text-muted-foreground">Predictive analytics</p>
                      </div>
                      <Zap className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-4">
                      {analysisResults.forecasts.slice(0, 3).map((forecast, index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{forecast.field}</span>
                            <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">
                              {forecast.model}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="block">Trend: {forecast.trend}</span>
                              <span className="block">Confidence: {(forecast.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="block">Next Value: {forecast.nextValue?.toFixed(2) || 'N/A'}</span>
                              <span className="block">Horizon: {forecast.horizon} periods</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Knowledge Graph and Correlations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Knowledge Graph */}
              {(analysisResults.correlations.length > 0 || analysisResults.rootCauses.length > 0) && (
                <div className="p-6 bg-card border rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Knowledge Graph</h3>
                      <p className="text-sm text-muted-foreground">Data relationships visualization</p>
                    </div>
                    <Network className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <KnowledgeGraph 
                    correlations={analysisResults.correlations}
                    rootCauses={analysisResults.rootCauses}
                    width={500}
                    height={300}
                  />
                </div>
              )}

              {/* Key Findings */}
              <div className="p-6 bg-card border rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Key Insights</h3>
                    <p className="text-sm text-muted-foreground">Auto-discovered findings</p>
                  </div>
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  {analysisResults.summary.keyFindings.map((finding, index) => (
                    <div key={index} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm">{finding}</p>
                    </div>
                  ))}
                  {analysisResults.summary.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      {analysisResults.summary.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2 mb-2">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                          <p className="text-sm text-muted-foreground">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Cognitive Insights Panel */}
        <div className="mb-8">
          <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Cognitive Insights</h3>
                  <p className="text-sm text-muted-foreground">AI-powered multi-persona analysis</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIChat(true)}
                className="px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Zenalyst AI</span>
              </button>
            </div>

            {/* Persona Tabs */}
            <div className="flex space-x-1 mb-6 bg-background/50 p-1 rounded-lg">
              {([
                { key: 'phd', label: 'PhD Analyst', icon: '🔬' },
                { key: 'ceo', label: 'CEO Narrative', icon: '👔' },
                { key: 'manager', label: 'Manager Actions', icon: '⚡' }
              ] as const).map((persona) => (
                <button
                  key={persona.key}
                  onClick={() => setActiveInsightPersona(persona.key)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeInsightPersona === persona.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="mr-2">{persona.icon}</span>
                  {persona.label}
                </button>
              ))}
            </div>

            {/* Insight Content */}
            <div className="p-6 bg-card border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">{enhancedInsights[activeInsightPersona].title}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span>Confidence: {enhancedInsights[activeInsightPersona].confidence}%</span>
                  </div>
                  {activeInsightPersona === 'ceo' && enhancedInsights.ceo.riskLevel && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4 text-accent" />
                      <span>Risk: {enhancedInsights.ceo.riskLevel}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                {enhancedInsights[activeInsightPersona].content}
              </p>

              {activeInsightPersona === 'ceo' && enhancedInsights.ceo.keyActions && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Key Strategic Actions:</h5>
                  <ul className="space-y-1">
                    {enhancedInsights.ceo.keyActions.map((action, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeInsightPersona === 'manager' && enhancedInsights.manager.timeline && (
                <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Timeline</p>
                    <p className="text-sm text-muted-foreground">{enhancedInsights.manager.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Resources</p>
                    <p className="text-sm text-muted-foreground">{enhancedInsights.manager.resources}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Priority</p>
                    <p className="text-sm text-muted-foreground">{enhancedInsights.manager.priority}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        {isDemoMode && (
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-center">
            <p className="text-accent font-medium">
              🌟 This is a demo dashboard showcasing Zenalyst Nexus capabilities with sample data. 
              <Link to="/auth" className="underline ml-1">Sign up to connect your real data!</Link>
            </p>
          </div>
        )}
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Zenalyst AI</h3>
                    <p className="text-sm text-muted-foreground">
                      {isUploadedData ? 'Dataset-specific insights and analysis' : 'Ask questions about your data'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIChat(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {aiMessages.map((message, index) => (
                  <div key={index} className={message.type === 'ai' ? 'ai-message' : 'user-message'}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'ai' 
                        ? 'bg-primary/5 border border-primary/20' 
                        : 'bg-muted/50 ml-8'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={isUploadedData ? "Ask about your data analysis..." : "Ask a question about your data..."}
                  value={aiInput}
                  onChange={(e) => setAIInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIMessage()}
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button 
                  onClick={handleAIMessage}
                  disabled={!aiInput.trim() || !zenalystAI}
                  className="px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Schema Builder */}
      {showDataSchema && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Interactive Dashboard Builder</h2>
                <p className="text-muted-foreground">
                  Customize your dashboard by selecting data fields and visualization types
                </p>
              </div>
              <button
                onClick={() => setShowDataSchema(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Data Schema */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Data Fields</h3>
                <div className="space-y-3">
                  {[
                    { field: 'revenue', type: 'currency', description: 'Monthly revenue data' },
                    { field: 'users', type: 'number', description: 'Active user count' },
                    { field: 'conversion_rate', type: 'percentage', description: 'Conversion rate %' },
                    { field: 'traffic_source', type: 'category', description: 'Marketing channels' },
                    { field: 'region', type: 'category', description: 'Geographic regions' },
                    { field: 'date', type: 'date', description: 'Time dimension' },
                    { field: 'product_category', type: 'category', description: 'Product categories' },
                    { field: 'customer_segment', type: 'category', description: 'Customer segments' }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{item.field}</span>
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {item.type}
                          </span>
                        </div>
                        <button className="text-xs text-primary hover:underline">
                          Add to Chart
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Builder */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Chart Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chart Type</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="line">Line Chart</option>
                      <option value="bar">Bar Chart</option>
                      <option value="area">Area Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="scatter">Scatter Plot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">X-Axis</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="">Select field...</option>
                      <option value="date">Date</option>
                      <option value="region">Region</option>
                      <option value="product_category">Product Category</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Y-Axis</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="">Select field...</option>
                      <option value="revenue">Revenue</option>
                      <option value="users">Users</option>
                      <option value="conversion_rate">Conversion Rate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Group By (Optional)</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="">None</option>
                      <option value="traffic_source">Traffic Source</option>
                      <option value="customer_segment">Customer Segment</option>
                      <option value="region">Region</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button className="w-full px-4 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all">
                      Generate Chart
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 border border-border rounded-lg bg-muted/20">
                  <h4 className="text-sm font-medium mb-2">Chart Preview</h4>
                  <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Select fields above to preview your chart
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage