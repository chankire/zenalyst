import { useState, useEffect } from 'react'
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
  CheckCircle
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart as RechartsLineChart,
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

const DashboardPage = () => {
  const [searchParams] = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'
  const [activeInsightPersona, setActiveInsightPersona] = useState<'phd' | 'ceo' | 'manager'>('ceo')
  const [showAIChat, setShowAIChat] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days')
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'users', 'conversion'])
  const [showDataSchema, setShowDataSchema] = useState(false)

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
                  {isDemoMode ? 'Demo: Sales Analytics Dashboard' : 'Analytics Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isDemoMode ? 'Sample data showcasing cognitive insights' : 'Real-time business analytics'}
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
                <span>Ask AI</span>
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
                <h4 className="font-semibold">{insights[activeInsightPersona].title}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span>Confidence: {insights[activeInsightPersona].confidence}%</span>
                  </div>
                  {activeInsightPersona === 'ceo' && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4 text-accent" />
                      <span>Risk: {insights.ceo.riskLevel}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                {insights[activeInsightPersona].content}
              </p>

              {activeInsightPersona === 'ceo' && insights.ceo.keyActions && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Key Strategic Actions:</h5>
                  <ul className="space-y-1">
                    {insights.ceo.keyActions.map((action, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeInsightPersona === 'manager' && (
                <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Timeline</p>
                    <p className="text-sm text-muted-foreground">{insights.manager.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Resources</p>
                    <p className="text-sm text-muted-foreground">{insights.manager.resources}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Priority</p>
                    <p className="text-sm text-muted-foreground">{insights.manager.priority}</p>
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
                    <h3 className="text-lg font-semibold">AI Data Assistant</h3>
                    <p className="text-sm text-muted-foreground">Ask questions about your data</p>
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
                <div className="ai-message">
                  <p className="text-sm">
                    Hello! I'm your cognitive analytics assistant. I can help you understand your data with PhD-level analysis, 
                    CEO strategic insights, or manager action plans. What would you like to explore?
                  </p>
                </div>
                
                <div className="user-message">
                  <p className="text-sm">Why did our conversion rate drop in April?</p>
                </div>
                
                <div className="ai-message">
                  <p className="text-sm">
                    Based on my analysis, the conversion rate decline (-2.1%) correlates with the pricing changes implemented in April. 
                    The statistical significance (p&lt;0.05) suggests this isn't random variance. I recommend A/B testing the new pricing 
                    structure and analyzing user behavior at the checkout stage.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask a question about your data..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button className="px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all">
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