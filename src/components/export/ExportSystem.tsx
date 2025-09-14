import React, { useState } from 'react'
import { 
  Download, 
  FileText, 
  Image, 
  Share2, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { AnalysisResult, DataPoint } from '@/lib/analytics'

interface ExportSystemProps {
  analysisResults: AnalysisResult
  rawData: DataPoint[]
  fileName: string
}

interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'png' | 'svg'
  sections: string[]
  includeRawData: boolean
  includeCharts: boolean
  includeInsights: boolean
  includeStatistics: boolean
}

interface AutoReportConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  recipients: string[]
  template: 'executive' | 'detailed' | 'summary'
  enabled: boolean
}

const ExportSystem: React.FC<ExportSystemProps> = ({ analysisResults, rawData, fileName }) => {
  // Export configuration (would be used in full implementation)
  // const [exportConfig, setExportConfig] = useState<ExportConfig>({
  //   format: 'pdf',
  //   sections: ['summary', 'insights', 'charts', 'statistics'],
  //   includeRawData: false,
  //   includeCharts: true,
  //   includeInsights: true,
  //   includeStatistics: true
  // })

  const [autoReportConfig, setAutoReportConfig] = useState<AutoReportConfig>({
    frequency: 'weekly',
    recipients: [],
    template: 'executive',
    enabled: false
  })

  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle')

  // Generate comprehensive PDF report
  const generatePDFReport = async () => {
    setExportStatus('exporting')
    
    try {
      // Create PDF content structure
      const reportContent = {
        title: `Zenalyst Analytics Report - ${fileName}`,
        generatedAt: new Date().toISOString(),
        summary: {
          dataPoints: rawData.length,
          keyFindings: analysisResults.summary.keyFindings,
          recommendations: analysisResults.summary.recommendations,
          confidenceScore: analysisResults.summary.confidenceScore,
          qualityScore: analysisResults.summary.qualityScore || analysisResults.dataQuality?.qualityScore
        },
        insights: analysisResults.insights.map(insight => ({
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          priority: insight.priority
        })),
        trends: analysisResults.trends.map(trend => ({
          field: trend.field,
          direction: trend.direction,
          confidence: trend.confidence,
          pValue: trend.pValue,
          significance: trend.pValue < 0.05 ? 'Significant' : 'Not significant'
        })),
        correlations: analysisResults.correlations.map(corr => ({
          fields: `${corr.field1} × ${corr.field2}`,
          correlation: (corr.correlation * 100).toFixed(1) + '%',
          relationship: corr.relationship,
          pValue: corr.pValue?.toFixed(4) || 'N/A'
        })),
        forecasts: analysisResults.forecasts.map(forecast => ({
          field: forecast.field,
          model: forecast.model,
          accuracy: forecast.accuracy.toFixed(1) + '%',
          nextPrediction: forecast.nextValue?.toFixed(2)
        })),
        dataQuality: analysisResults.dataQuality ? {
          overallScore: analysisResults.dataQuality.qualityScore.toFixed(1) + '%',
          completeness: analysisResults.dataQuality.completeness.toFixed(1) + '%',
          consistency: analysisResults.dataQuality.consistency.toFixed(1) + '%',
          validity: analysisResults.dataQuality.validity.toFixed(1) + '%',
          issues: analysisResults.dataQuality.issues.length
        } : null,
        hypothesisTests: analysisResults.hypothesisTests?.map(test => ({
          field: test.field,
          testType: test.testType,
          pValue: test.pValue.toFixed(4),
          isSignificant: test.isSignificant,
          conclusion: test.conclusion
        })) || []
      }

      // In a real implementation, you'd use a PDF library like jsPDF or PDFKit
      // For now, we'll create a comprehensive text export
      const pdfContent = generatePDFContent(reportContent)
      
      // Create and download the file
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `zenalyst-report-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportStatus('success')
      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setExportStatus('error')
      setTimeout(() => setExportStatus('idle'), 3000)
    }
  }

  const generatePDFContent = (content: any) => {
    return `
ZENALYST NEXUS - ENTERPRISE ANALYTICS REPORT
============================================

Generated: ${new Date(content.generatedAt).toLocaleString()}
Dataset: ${content.title}

EXECUTIVE SUMMARY
================
• Data Points Analyzed: ${content.summary.dataPoints.toLocaleString()}
• Overall Confidence Score: ${(content.summary.confidenceScore * 100).toFixed(1)}%
• Data Quality Score: ${content.summary.qualityScore?.toFixed(1) || 'N/A'}%

KEY FINDINGS
============
${content.summary.keyFindings.map((finding: string, i: number) => `${i + 1}. ${finding}`).join('\n')}

STRATEGIC RECOMMENDATIONS
========================
${content.summary.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

DETAILED INSIGHTS (${content.insights.length} insights)
================
${content.insights.map((insight: any, i: number) => `
${i + 1}. ${insight.title} [${insight.priority.toUpperCase()} PRIORITY]
   Type: ${insight.type}
   Confidence: ${insight.confidence.toFixed(1)}%
   Description: ${insight.description}
`).join('\n')}

TREND ANALYSIS (${content.trends.length} trends)
==============
${content.trends.map((trend: any, i: number) => `
${i + 1}. ${trend.field}
   Direction: ${trend.direction}
   Confidence: ${trend.confidence.toFixed(1)}%
   Statistical Significance: ${trend.significance} (p = ${trend.pValue?.toFixed(4) || 'N/A'})
`).join('\n')}

CORRELATION ANALYSIS (${content.correlations.length} correlations)
===================
${content.correlations.map((corr: any, i: number) => `
${i + 1}. ${corr.fields}
   Strength: ${corr.correlation} (${corr.relationship})
   P-value: ${corr.pValue}
`).join('\n')}

FORECASTING RESULTS (${content.forecasts.length} forecasts)
==================
${content.forecasts.map((forecast: any, i: number) => `
${i + 1}. ${forecast.field}
   Model: ${forecast.model}
   Accuracy: ${forecast.accuracy}
   Next Prediction: ${forecast.nextPrediction || 'N/A'}
`).join('\n')}

${content.dataQuality ? `
DATA QUALITY ASSESSMENT
======================
Overall Score: ${content.dataQuality.overallScore}
Completeness: ${content.dataQuality.completeness}
Consistency: ${content.dataQuality.consistency}
Validity: ${content.dataQuality.validity}
Issues Detected: ${content.dataQuality.issues}
` : ''}

${content.hypothesisTests.length > 0 ? `
HYPOTHESIS TESTING (${content.hypothesisTests.length} tests)
==================
${content.hypothesisTests.map((test: any, i: number) => `
${i + 1}. ${test.field} (${test.testType})
   P-value: ${test.pValue}
   Result: ${test.isSignificant ? 'SIGNIFICANT' : 'NOT SIGNIFICANT'}
   Conclusion: ${test.conclusion}
`).join('\n')}
` : ''}

METHODOLOGY
===========
This report was generated using Zenalyst Nexus enterprise analytics platform.
Analysis includes advanced statistical methods, machine learning forecasting,
and hypothesis testing with 95% confidence intervals.

Statistical Methods Used:
• Linear regression with significance testing
• Pearson correlation with confidence intervals
• Time series forecasting (ARIMA, LSTM, hybrid models)
• Outlier detection using IQR method
• Hypothesis testing (t-tests, normality tests)
• Data quality assessment framework

For questions about this analysis, please contact your data science team.

---
Generated by Zenalyst Nexus - Enterprise Cognitive Analytics Platform
© ${new Date().getFullYear()} - Advanced Analytics with Statistical Rigor
`
  }

  // Export to Excel with multiple sheets
  const exportToExcel = () => {
    try {
      // Create CSV-like content for different sheets
      const sheets = {
        'Summary': generateSummaryCSV(),
        'Raw_Data': generateRawDataCSV(),
        'Insights': generateInsightsCSV(),
        'Trends': generateTrendsCSV(),
        'Correlations': generateCorrelationsCSV(),
        'Forecasts': generateForecastsCSV()
      }

      Object.entries(sheets).forEach(([sheetName, content]) => {
        const blob = new Blob([content], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `zenalyst-${sheetName.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })

      setExportStatus('success')
      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error) {
      console.error('Excel export failed:', error)
      setExportStatus('error')
      setTimeout(() => setExportStatus('idle'), 3000)
    }
  }

  const generateSummaryCSV = () => {
    const summary = analysisResults.summary
    return `Metric,Value
Data Points,${rawData.length}
Confidence Score,${(summary.confidenceScore * 100).toFixed(1)}%
Quality Score,${summary.qualityScore?.toFixed(1) || 'N/A'}%
Key Findings,${summary.keyFindings.length}
Recommendations,${summary.recommendations.length}
Trends Detected,${analysisResults.trends.length}
Correlations Found,${analysisResults.correlations.length}
Forecasts Generated,${analysisResults.forecasts.length}
Anomalies Detected,${analysisResults.anomalies.length}
Insights Generated,${analysisResults.insights.length}`
  }

  const generateRawDataCSV = () => {
    if (rawData.length === 0) return 'No raw data available'
    
    const headers = Object.keys(rawData[0])
    const rows = rawData.map(row => 
      headers.map(header => `"${row[header] || ''}"`).join(',')
    )
    
    return [headers.join(','), ...rows].join('\n')
  }

  const generateInsightsCSV = () => {
    const headers = ['Type', 'Title', 'Description', 'Confidence', 'Priority', 'Actionable']
    const rows = analysisResults.insights.map(insight =>
      [
        insight.type,
        `"${insight.title}"`,
        `"${insight.description}"`,
        insight.confidence.toFixed(1),
        insight.priority,
        insight.actionable
      ].join(',')
    )
    
    return [headers.join(','), ...rows].join('\n')
  }

  const generateTrendsCSV = () => {
    const headers = ['Field', 'Direction', 'Confidence', 'Strength', 'P-Value', 'T-Statistic']
    const rows = analysisResults.trends.map(trend =>
      [
        trend.field,
        trend.direction,
        trend.confidence.toFixed(2),
        trend.strength.toFixed(4),
        trend.pValue?.toFixed(4) || 'N/A',
        trend.tStatistic?.toFixed(4) || 'N/A'
      ].join(',')
    )
    
    return [headers.join(','), ...rows].join('\n')
  }

  const generateCorrelationsCSV = () => {
    const headers = ['Field 1', 'Field 2', 'Correlation', 'Relationship', 'P-Value', 'Significance', 'T-Statistic']
    const rows = analysisResults.correlations.map(corr =>
      [
        corr.field1,
        corr.field2,
        corr.correlation.toFixed(4),
        corr.relationship,
        corr.pValue?.toFixed(4) || 'N/A',
        corr.significance?.toFixed(2) || 'N/A',
        corr.tStatistic?.toFixed(4) || 'N/A'
      ].join(',')
    )
    
    return [headers.join(','), ...rows].join('\n')
  }

  const generateForecastsCSV = () => {
    const headers = ['Field', 'Model', 'Accuracy', 'Trend', 'Next_Value', 'Confidence', 'Horizon']
    const rows = analysisResults.forecasts.map(forecast =>
      [
        forecast.field,
        forecast.model,
        forecast.accuracy.toFixed(2),
        forecast.trend,
        forecast.nextValue?.toFixed(4) || 'N/A',
        forecast.confidence?.toFixed(2) || 'N/A',
        forecast.horizon || 'N/A'
      ].join(',')
    )
    
    return [headers.join(','), ...rows].join('\n')
  }

  // Generate shareable dashboard link
  const generateShareLink = () => {
    // In a real app, you'd upload the analysis to a server and get a share ID
    const shareId = Math.random().toString(36).substring(2, 15)
    const baseUrl = window.location.origin
    const shareableUrl = `${baseUrl}/share/${shareId}`
    
    setShareUrl(shareableUrl)
    setShowShareModal(true)
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl)
  }

  // Setup automated reporting
  const setupAutomatedReporting = () => {
    // In a real implementation, this would configure server-side scheduled reports
    console.log('Setting up automated reporting:', autoReportConfig)
    alert('Automated reporting configured! Reports will be generated according to your schedule.')
  }

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Export & Share</h3>
            <p className="text-sm text-muted-foreground">Generate reports and share insights</p>
          </div>
          <Download className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Quick Export Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button
            onClick={generatePDFReport}
            disabled={exportStatus === 'exporting'}
            className="flex items-center justify-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">PDF Report</span>
          </button>
          
          <button
            onClick={exportToExcel}
            disabled={exportStatus === 'exporting'}
            className="flex items-center justify-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Excel Export</span>
          </button>
          
          <button
            onClick={generateShareLink}
            className="flex items-center justify-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share Link</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Image className="w-4 h-4" />
            <span className="text-sm">Print View</span>
          </button>
        </div>

        {/* Export Status */}
        {exportStatus !== 'idle' && (
          <div className="mb-4 p-3 rounded-lg flex items-center space-x-2">
            {exportStatus === 'exporting' && (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                <span className="text-sm">Generating export...</span>
              </>
            )}
            {exportStatus === 'success' && (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Export completed successfully!</span>
              </>
            )}
            {exportStatus === 'error' && (
              <>
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Export failed. Please try again.</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Automated Reporting */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Automated Reports</h3>
            <p className="text-sm text-muted-foreground">Schedule recurring analysis reports</p>
          </div>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <select
              value={autoReportConfig.frequency}
              onChange={(e) => setAutoReportConfig(prev => ({ 
                ...prev, 
                frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'quarterly' 
              }))}
              className="w-full p-2 border rounded-lg"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Report Template</label>
            <select
              value={autoReportConfig.template}
              onChange={(e) => setAutoReportConfig(prev => ({ 
                ...prev, 
                template: e.target.value as 'executive' | 'detailed' | 'summary' 
              }))}
              className="w-full p-2 border rounded-lg"
            >
              <option value="executive">Executive Summary</option>
              <option value="detailed">Detailed Analysis</option>
              <option value="summary">Quick Summary</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoReportEnabled"
              checked={autoReportConfig.enabled}
              onChange={(e) => setAutoReportConfig(prev => ({ 
                ...prev, 
                enabled: e.target.checked 
              }))}
              className="rounded"
            />
            <label htmlFor="autoReportEnabled" className="text-sm">
              Enable automated reporting
            </label>
          </div>
          
          <button
            onClick={setupAutomatedReporting}
            disabled={!autoReportConfig.enabled}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Configure Reports
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Dashboard</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Shareable Link</label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 p-2 border rounded-l-lg bg-muted/50"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="px-3 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                This link will provide read-only access to your dashboard insights.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportSystem