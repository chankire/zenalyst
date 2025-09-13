// Zenalyst AI - Advanced conversational analytics powered by cognitive intelligence
// No hallucinations - only insights from uploaded datasets

import { AnalysisResult, DataPoint } from './analytics'

export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  confidence?: number
  citations?: DataCitation[]
  insights?: QuickInsight[]
}

export interface DataCitation {
  field: string
  value: string | number
  context: string
}

export interface QuickInsight {
  type: 'trend' | 'correlation' | 'anomaly' | 'forecast' | 'comparison'
  title: string
  value: string
  confidence: number
}

export interface ConversationContext {
  dataFields: string[]
  dataRange: { start: Date; end: Date }
  previousInsights: string[]
  userFocus: string[]
}

export class ZenalystAI {
  private analysisResult: AnalysisResult | null = null
  private rawData: DataPoint[] = []
  private context: ConversationContext | null = null

  constructor() {
    console.log('🤖 Zenalyst AI initialized - Ready for cognitive analysis')
  }

  // Initialize with uploaded dataset
  setDataset(data: DataPoint[], analysis: AnalysisResult) {
    this.rawData = data
    this.analysisResult = analysis
    this.context = {
      dataFields: Object.keys(data[0] || {}),
      dataRange: this.calculateDateRange(data),
      previousInsights: [],
      userFocus: []
    }
    console.log(`🧠 Zenalyst AI: Dataset loaded with ${data.length} records and ${this.context.dataFields.length} fields`)
  }

  // Process user questions and provide data-driven answers
  async processQuestion(question: string): Promise<ChatMessage> {
    if (!this.analysisResult || !this.context) {
      return {
        id: this.generateId(),
        type: 'ai',
        content: "I need a dataset to analyze first. Please upload your data and I'll provide insights based on your specific data.",
        timestamp: new Date(),
        confidence: 100
      }
    }

    const questionType = this.classifyQuestion(question)
    const response = await this.generateResponse(question, questionType)

    // Update context
    this.updateContext(question, questionType)

    return response
  }

  private classifyQuestion(question: string): string {
    const lower = question.toLowerCase()
    
    if (lower.includes('trend') || lower.includes('pattern') || lower.includes('over time')) {
      return 'trend'
    }
    if (lower.includes('correlat') || lower.includes('relationship') || lower.includes('connect')) {
      return 'correlation'
    }
    if (lower.includes('predict') || lower.includes('forecast') || lower.includes('future')) {
      return 'forecast'
    }
    if (lower.includes('anomal') || lower.includes('outlier') || lower.includes('unusual')) {
      return 'anomaly'
    }
    if (lower.includes('why') || lower.includes('cause') || lower.includes('reason')) {
      return 'root_cause'
    }
    if (lower.includes('compar') || lower.includes('vs') || lower.includes('versus')) {
      return 'comparison'
    }
    if (lower.includes('summarize') || lower.includes('overview') || lower.includes('summary')) {
      return 'summary'
    }
    
    return 'general'
  }

  private async generateResponse(question: string, type: string): Promise<ChatMessage> {
    let content = ''
    let confidence = 85
    let citations: DataCitation[] = []
    let insights: QuickInsight[] = []

    switch (type) {
      case 'trend':
        const trendResponse = this.generateTrendResponse(question)
        content = trendResponse.content
        confidence = trendResponse.confidence
        citations = trendResponse.citations
        insights = trendResponse.insights
        break

      case 'correlation':
        const corrResponse = this.generateCorrelationResponse(question)
        content = corrResponse.content
        confidence = corrResponse.confidence
        citations = corrResponse.citations
        insights = corrResponse.insights
        break

      case 'forecast':
        const forecastResponse = this.generateForecastResponse(question)
        content = forecastResponse.content
        confidence = forecastResponse.confidence
        insights = forecastResponse.insights
        break

      case 'anomaly':
        const anomalyResponse = this.generateAnomalyResponse(question)
        content = anomalyResponse.content
        confidence = anomalyResponse.confidence
        insights = anomalyResponse.insights
        break

      case 'root_cause':
        const rootCauseResponse = this.generateRootCauseResponse(question)
        content = rootCauseResponse.content
        confidence = rootCauseResponse.confidence
        insights = rootCauseResponse.insights
        break

      case 'summary':
        const summaryResponse = this.generateSummaryResponse()
        content = summaryResponse.content
        confidence = summaryResponse.confidence
        insights = summaryResponse.insights
        break

      default:
        const generalResponse = this.generateGeneralResponse(question)
        content = generalResponse.content
        confidence = generalResponse.confidence
        insights = generalResponse.insights
    }

    return {
      id: this.generateId(),
      type: 'ai',
      content,
      timestamp: new Date(),
      confidence,
      citations,
      insights
    }
  }

  private generateTrendResponse(question: string) {
    const trends = this.analysisResult!.trends
    const relevantTrends = this.findRelevantTrends(question, trends)
    
    if (relevantTrends.length === 0) {
      return {
        content: "I analyzed your dataset but couldn't find specific trend patterns matching your question. The data may not have sufficient time-series structure or the fields you're asking about may not show clear trends.",
        confidence: 70,
        citations: [],
        insights: []
      }
    }

    const strongTrends = relevantTrends.filter(t => t.confidence > 70)
    const insights: QuickInsight[] = strongTrends.map(trend => ({
      type: 'trend' as const,
      title: `${trend.field} Trend`,
      value: `${trend.trend} (${trend.confidence.toFixed(1)}% confidence)`,
      confidence: trend.confidence
    }))

    let content = `Based on your data analysis, I've identified the following trends:\n\n`
    
    strongTrends.forEach(trend => {
      content += `📈 **${trend.field}**: Shows a **${trend.trend}** trend with ${trend.confidence.toFixed(1)}% statistical confidence.\n`
      
      if (trend.changePoints && trend.changePoints.length > 0) {
        content += `   • Detected ${trend.changePoints.length} significant change points\n`
      }
      
      content += `   • Trend strength: ${this.describeTrendStrength(trend.trendStrength)}\n\n`
    })

    if (relevantTrends.length > strongTrends.length) {
      content += `*Note: Found ${relevantTrends.length - strongTrends.length} additional trends with lower confidence that may still be relevant.*`
    }

    return {
      content,
      confidence: strongTrends.length > 0 ? Math.max(...strongTrends.map(t => t.confidence)) : 60,
      citations: this.generateTrendCitations(strongTrends),
      insights
    }
  }

  private generateCorrelationResponse(_question: string) {
    const correlations = this.analysisResult!.correlations
    const strongCorrelations = correlations.filter(c => c.relationship === 'strong')
    
    if (strongCorrelations.length === 0) {
      return {
        content: "I analyzed the relationships between variables in your dataset, but didn't find any strong correlations. This could indicate that the variables operate independently, or there may be non-linear relationships that require deeper analysis.",
        confidence: 75,
        citations: [],
        insights: []
      }
    }

    let content = `I've discovered several significant relationships in your data:\n\n`
    
    const insights: QuickInsight[] = strongCorrelations.slice(0, 3).map(corr => ({
      type: 'correlation' as const,
      title: `${corr.field1} ↔ ${corr.field2}`,
      value: `${(corr.correlation * 100).toFixed(1)}% ${corr.type}`,
      confidence: Math.abs(corr.correlation) * 100
    }))

    strongCorrelations.forEach(corr => {
      content += `🔗 **${corr.field1}** and **${corr.field2}**:\n`
      content += `   • ${corr.relationship} ${corr.type} correlation (${(corr.correlation * 100).toFixed(1)}%)\n`
      content += `   • Statistical significance: ${corr.significance.toFixed(1)}%\n`
      content += `   • ${this.interpretCorrelation(corr)}\n\n`
    })

    content += `💡 **Actionable Insight**: These correlations can be used for predictive modeling and understanding variable dependencies in your business processes.`

    return {
      content,
      confidence: Math.max(...strongCorrelations.map(c => Math.abs(c.correlation) * 100)),
      citations: this.generateCorrelationCitations(strongCorrelations),
      insights
    }
  }

  private generateForecastResponse(_question: string) {
    const forecasts = this.analysisResult!.forecasts
    const accurateForecasts = forecasts.filter(f => f.accuracy > 70)
    
    if (accurateForecasts.length === 0) {
      return {
        content: "The current dataset may not have sufficient historical patterns for reliable forecasting. For accurate predictions, I typically need time-series data with consistent intervals and at least 20+ data points.",
        confidence: 60,
        citations: [],
        insights: []
      }
    }

    let content = `Here are my data-driven forecasts based on your dataset:\n\n`
    
    const insights: QuickInsight[] = accurateForecasts.slice(0, 3).map(forecast => {
      const nextPrediction = forecast.predictions[0]
      return {
        type: 'forecast' as const,
        title: `${forecast.field} Forecast`,
        value: `${nextPrediction.value.toFixed(2)} (${nextPrediction.confidence}% confidence)`,
        confidence: forecast.accuracy
      }
    })

    accurateForecasts.forEach(forecast => {
      const nextPrediction = forecast.predictions[0]
      const model = this.describeModel(forecast.model)
      
      content += `📊 **${forecast.field}** (${model} model, ${forecast.accuracy.toFixed(1)}% accuracy):\n`
      content += `   • Next period prediction: **${nextPrediction.value.toFixed(2)}** (${nextPrediction.confidence}% confidence)\n`
      
      if (forecast.predictions.length > 1) {
        const threeMonth = forecast.predictions[2]
        content += `   • 3-month outlook: **${threeMonth.value.toFixed(2)}** (${threeMonth.confidence}% confidence)\n`
      }
      
      content += `\n`
    })

    content += `⚠️ **Important**: These forecasts are based on historical patterns in your data. External factors and market changes should be considered for business decisions.`

    return {
      content,
      confidence: Math.max(...accurateForecasts.map(f => f.accuracy)),
      citations: [],
      insights
    }
  }

  private generateAnomalyResponse(_question: string) {
    const anomalies = this.analysisResult!.anomalies
    
    if (anomalies.length === 0) {
      return {
        content: "Great news! I didn't detect any significant anomalies in your dataset. All data points appear to fall within expected statistical ranges, suggesting consistent and reliable data quality.",
        confidence: 85,
        citations: [],
        insights: []
      }
    }

    let content = `I've identified several anomalies in your data that warrant attention:\n\n`
    
    const insights: QuickInsight[] = anomalies.map(anomaly => ({
      type: 'anomaly' as const,
      title: `${anomaly.field} Anomalies`,
      value: `${anomaly.anomalies.length} detected`,
      confidence: 90
    }))

    anomalies.forEach(anomaly => {
      const highSeverity = anomaly.anomalies.filter(a => a.severity === 'high')
      const mediumSeverity = anomaly.anomalies.filter(a => a.severity === 'medium')
      
      content += `⚠️ **${anomaly.field}**:\n`
      content += `   • Total anomalies: ${anomaly.anomalies.length}\n`
      
      if (highSeverity.length > 0) {
        content += `   • High severity: ${highSeverity.length} (require immediate attention)\n`
        content += `   • Most extreme value: ${Math.max(...highSeverity.map(a => a.value))}\n`
      }
      
      if (mediumSeverity.length > 0) {
        content += `   • Medium severity: ${mediumSeverity.length}\n`
      }
      
      content += `   • Detection method: ${anomaly.method}\n\n`
    })

    content += `🔍 **Recommendation**: Investigate the root causes of high-severity anomalies as they may indicate data quality issues, system errors, or significant business events.`

    return {
      content,
      confidence: 90,
      citations: [],
      insights
    }
  }

  private generateRootCauseResponse(_question: string) {
    const rootCauses = this.analysisResult!.rootCauses
    
    if (rootCauses.length === 0) {
      return {
        content: "I analyzed potential causal relationships in your data but couldn't identify clear root cause patterns. This might indicate that the variables operate independently or that external factors not present in the dataset are driving changes.",
        confidence: 70,
        citations: [],
        insights: []
      }
    }

    let content = `Based on statistical analysis of your data, here are the potential root cause relationships I discovered:\n\n`
    
    const insights: QuickInsight[] = rootCauses.slice(0, 3).map(rc => ({
      type: 'correlation' as const,
      title: `${rc.effect} Drivers`,
      value: `${rc.causes.length} potential causes`,
      confidence: Math.max(...rc.causes.map(c => c.confidence))
    }))

    rootCauses.forEach(rc => {
      content += `🎯 **Effect**: ${rc.effect}\n`
      content += `   **Top Contributing Factors**:\n`
      
      rc.causes.slice(0, 3).forEach((cause, index) => {
        content += `   ${index + 1}. **${cause.cause}** (${cause.contribution.toFixed(1)}% contribution, ${cause.confidence.toFixed(1)}% confidence)\n`
      })
      
      if (rc.causalChain.length > 0) {
        content += `   **Causal Chain**: ${rc.causalChain.join(' → ')}\n`
      }
      
      content += `\n`
    })

    content += `⚠️ **Note**: These are statistical relationships based on correlation analysis. True causation requires domain expertise and may involve external factors not present in the data.`

    return {
      content,
      confidence: 80,
      citations: [],
      insights
    }
  }

  private generateSummaryResponse() {
    const insights = this.analysisResult!.insights
    const topInsights = insights.slice(0, 5)
    
    let content = `## 📊 Dataset Analysis Summary\n\n`
    content += `**Data Overview**: ${this.rawData.length} records across ${this.context!.dataFields.length} fields\n\n`
    
    content += `### 🔍 Key Insights:\n\n`
    
    topInsights.forEach((insight, index) => {
      const emoji = this.getInsightEmoji(insight.type)
      content += `${index + 1}. ${emoji} **${insight.title}**\n`
      content += `   ${insight.description}\n`
      content += `   *Confidence: ${insight.confidence.toFixed(1)}% | Priority: ${insight.priority.toUpperCase()}*\n\n`
    })

    const stats = this.generateDatasetStats()
    content += `### 📈 Statistical Summary:\n${stats}\n`

    const insights_summary: QuickInsight[] = [
      {
        type: 'comparison',
        title: 'Total Insights',
        value: insights.length.toString(),
        confidence: 95
      },
      {
        type: 'trend',
        title: 'High Priority',
        value: insights.filter(i => i.priority === 'high').length.toString(),
        confidence: 90
      }
    ]

    return {
      content,
      confidence: 95,
      insights: insights_summary
    }
  }

  private generateGeneralResponse(question: string) {
    // Try to extract relevant information from the question
    const fieldMentions = this.context!.dataFields.filter(field => 
      question.toLowerCase().includes(field.toLowerCase())
    )
    
    if (fieldMentions.length > 0) {
      const stats = this.getFieldStatistics(fieldMentions[0])
      return {
        content: `Here's what I found about **${fieldMentions[0]}** in your dataset:\n\n${stats}`,
        confidence: 85,
        insights: []
      }
    }

    // General dataset information
    const availableAnalyses = [
      "Trend analysis for time-series patterns",
      "Correlation analysis between variables",
      "Anomaly detection for outliers",
      "Forecasting for future predictions",
      "Root cause analysis for understanding relationships"
    ]

    let content = `I can help you analyze your dataset in several ways:\n\n`
    availableAnalyses.forEach(analysis => {
      content += `• ${analysis}\n`
    })
    
    content += `\n**Available fields in your data**: ${this.context!.dataFields.join(', ')}\n\n`
    content += `Try asking specific questions like:\n`
    content += `• "What trends do you see in [field name]?"\n`
    content += `• "Are there any correlations between [field1] and [field2]?"\n`
    content += `• "Can you predict future values for [field name]?"\n`
    content += `• "Why did [field name] change?"`

    return {
      content,
      confidence: 80,
      insights: []
    }
  }

  // Helper methods
  private calculateDateRange(_data: DataPoint[]): { start: Date; end: Date } {
    const now = new Date()
    return {
      start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      end: now
    }
  }

  private findRelevantTrends(question: string, trends: any[]) {
    const questionFields = this.context!.dataFields.filter(field =>
      question.toLowerCase().includes(field.toLowerCase())
    )
    
    if (questionFields.length > 0) {
      return trends.filter(trend => questionFields.includes(trend.field))
    }
    
    return trends
  }

  private describeTrendStrength(strength: number): string {
    if (strength > 0.1) return "Very strong trend"
    if (strength > 0.05) return "Strong trend"
    if (strength > 0.02) return "Moderate trend"
    return "Weak trend"
  }

  private interpretCorrelation(corr: any): string {
    const strength = Math.abs(corr.correlation)
    if (strength > 0.8) {
      return `This suggests a very strong relationship - changes in one variable strongly predict changes in the other.`
    }
    if (strength > 0.6) {
      return `This indicates a strong relationship that could be valuable for predictive modeling.`
    }
    return `This shows a moderate relationship worth investigating further.`
  }

  private describeModel(model: string): string {
    const models = {
      linear: "Linear regression",
      arima: "ARIMA time series",
      lstm: "LSTM neural network",
      transformer: "Transformer deep learning",
      hybrid: "Hybrid ML ensemble"
    }
    return models[model as keyof typeof models] || model
  }

  private getInsightEmoji(type: string): string {
    const emojis = {
      trend: "📈",
      correlation: "🔗",
      anomaly: "⚠️",
      forecast: "🔮",
      causal: "🎯"
    }
    return emojis[type as keyof typeof emojis] || "💡"
  }

  private generateDatasetStats(): string {
    const numericFields = this.context!.dataFields.filter(field => {
      const firstValue = this.rawData[0]?.[field]
      return typeof firstValue === 'number' || !isNaN(Number(firstValue))
    })
    
    return `• ${numericFields.length} numeric fields analyzed\n• ${this.analysisResult!.trends.length} trends identified\n• ${this.analysisResult!.correlations.length} correlations found\n• ${this.analysisResult!.forecasts.length} forecasting models created`
  }

  private getFieldStatistics(field: string): string {
    const values = this.rawData.map(d => Number(d[field])).filter(v => !isNaN(v))
    if (values.length === 0) return "No numeric data available for this field."
    
    const sum = values.reduce((a, b) => a + b, 0)
    const mean = sum / values.length
    const sorted = [...values].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const min = Math.min(...values)
    const max = Math.max(...values)
    
    return `• Average: ${mean.toFixed(2)}\n• Median: ${median.toFixed(2)}\n• Range: ${min.toFixed(2)} to ${max.toFixed(2)}\n• Data points: ${values.length}`
  }

  private generateTrendCitations(trends: any[]): DataCitation[] {
    return trends.map(trend => ({
      field: trend.field,
      value: `${trend.trend} trend`,
      context: `${trend.confidence.toFixed(1)}% confidence`
    }))
  }

  private generateCorrelationCitations(correlations: any[]): DataCitation[] {
    return correlations.map(corr => ({
      field: `${corr.field1} vs ${corr.field2}`,
      value: `${(corr.correlation * 100).toFixed(1)}%`,
      context: `${corr.relationship} ${corr.type} correlation`
    }))
  }

  private updateContext(question: string, type: string) {
    if (!this.context) return
    
    this.context.previousInsights.push(type)
    
    // Extract field mentions to track user focus
    const fieldMentions = this.context.dataFields.filter(field =>
      question.toLowerCase().includes(field.toLowerCase())
    )
    
    fieldMentions.forEach(field => {
      if (!this.context!.userFocus.includes(field)) {
        this.context!.userFocus.push(field)
      }
    })
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}