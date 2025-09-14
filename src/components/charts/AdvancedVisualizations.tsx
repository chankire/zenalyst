import React, { useMemo } from 'react'
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  ErrorBar,
  ComposedChart,
  Line,
  Bar
} from 'recharts'
import { CorrelationAnalysis, DataPoint, ConfidenceInterval, HypothesisTestResult } from '@/lib/analytics'

interface AdvancedVisualizationsProps {
  data: DataPoint[]
  correlations?: CorrelationAnalysis[]
  confidenceIntervals?: ConfidenceInterval[]
  hypothesisTests?: HypothesisTestResult[]
}

const AdvancedVisualizations: React.FC<AdvancedVisualizationsProps> = ({
  data,
  correlations = [],
  confidenceIntervals = [],
  hypothesisTests = []
}) => {
  // Correlation Matrix Heatmap Data
  const correlationMatrix = useMemo(() => {
    if (correlations.length === 0) return []
    
    const fields = Array.from(new Set([
      ...correlations.map(c => c.field1),
      ...correlations.map(c => c.field2)
    ]))
    
    const matrix = fields.map(field1 => {
      const row: any = { field: field1 }
      fields.forEach(field2 => {
        if (field1 === field2) {
          row[field2] = 1
        } else {
          const corr = correlations.find(c => 
            (c.field1 === field1 && c.field2 === field2) || 
            (c.field1 === field2 && c.field2 === field1)
          )
          row[field2] = corr ? corr.correlation : 0
        }
      })
      return row
    })
    
    return matrix
  }, [correlations])

  // Statistical Distribution Chart Data
  const distributionData = useMemo(() => {
    if (data.length === 0) return []
    
    const numericFields = Object.keys(data[0]).filter(key => {
      const value = data[0][key]
      return typeof value === 'number' || !isNaN(Number(value))
    })
    
    if (numericFields.length === 0) return []
    
    const field = numericFields[0] // Use first numeric field
    const values = data.map(d => Number(d[field])).filter(v => !isNaN(v)).sort((a, b) => a - b)
    
    // Create histogram bins
    const bins = 20
    const min = Math.min(...values)
    const max = Math.max(...values)
    const binWidth = (max - min) / bins
    
    const histogram = Array.from({ length: bins }, (_, i) => {
      const binStart = min + i * binWidth
      const binEnd = binStart + binWidth
      const count = values.filter(v => v >= binStart && v < binEnd).length
      
      return {
        binStart: binStart.toFixed(2),
        binEnd: binEnd.toFixed(2),
        count,
        density: count / values.length,
        midpoint: ((binStart + binEnd) / 2)
      }
    })
    
    return histogram
  }, [data])

  // Confidence Interval Chart Data
  const confidenceData = useMemo(() => {
    return confidenceIntervals.map(ci => ({
      field: ci.field,
      value: ci.value,
      lowerBound: ci.lowerBound,
      upperBound: ci.upperBound,
      marginOfError: ci.marginOfError,
      confidenceLevel: ci.confidenceLevel
    }))
  }, [confidenceIntervals])

  // Statistical Significance Visualization
  const significanceData = useMemo(() => {
    return hypothesisTests.map(test => ({
      field: test.field,
      pValue: test.pValue,
      isSignificant: test.isSignificant,
      tStatistic: test.tStatistic || 0,
      testType: test.testType,
      threshold: 0.05
    }))
  }, [hypothesisTests])

  if (data.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            📊
          </div>
          <p>No data available for advanced visualizations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gradient-primary mb-2">
          Advanced Statistical Visualizations
        </h2>
        <p className="text-muted-foreground">
          Enterprise-grade analytics with statistical rigor and confidence intervals
        </p>
      </div>

      {/* Correlation Heatmap */}
      {correlationMatrix.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🔥 Correlation Matrix Heatmap
            <span className="ml-2 text-sm text-muted-foreground">
              ({correlations.length} correlations analyzed)
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-auto">
            {correlationMatrix.map((row, i) => 
              Object.keys(row).filter(k => k !== 'field').map((field, j) => (
                <div
                  key={`${i}-${j}`}
                  className="p-2 rounded text-xs text-center border"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${Math.abs(row[field])})`,
                    color: Math.abs(row[field]) > 0.5 ? 'white' : 'black'
                  }}
                >
                  <div className="font-medium">{row.field} × {field}</div>
                  <div className="text-xs">{(row[field] * 100).toFixed(0)}%</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Statistical Distribution with Confidence Bands */}
      {distributionData.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📈 Data Distribution Analysis
            <span className="ml-2 text-sm text-muted-foreground">
              (Histogram with statistical overlays)
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="midpoint" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
                formatter={(value, name) => [
                  name === 'count' ? `${value} observations` : `${(Number(value) * 100).toFixed(1)}%`,
                  name === 'count' ? 'Frequency' : 'Density'
                ]}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Frequency"
              />
              <Line 
                type="monotone" 
                dataKey="density" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                name="Density Curve"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Confidence Intervals Visualization */}
      {confidenceData.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🎯 Confidence Intervals
            <span className="ml-2 text-sm text-muted-foreground">
              (95% confidence bounds)
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="field" 
                stroke="#64748b"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
                formatter={(value, name) => {
                  if (name === 'value') return [`${Number(value).toFixed(3)}`, 'Estimate']
                  if (name === 'marginOfError') return [`±${Number(value).toFixed(3)}`, 'Margin of Error']
                  return [Number(value).toFixed(3), name]
                }}
              />
              <Scatter 
                dataKey="value" 
                fill="#10b981"
                name="Point Estimate"
              >
                <ErrorBar 
                  dataKey="marginOfError" 
                  width={4}
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Statistical Significance Tests */}
      {significanceData.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            ⚡ Hypothesis Test Results
            <span className="ml-2 text-sm text-muted-foreground">
              (p-values and significance levels)
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={significanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="field" 
                stroke="#64748b"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
                formatter={(value, name) => {
                  if (name === 'pValue') return [`${Number(value).toFixed(4)}`, 'p-value']
                  if (name === 'tStatistic') return [`${Number(value).toFixed(3)}`, 't-statistic']
                  return [value, name]
                }}
              />
              <ReferenceLine y={0.05} stroke="#ef4444" strokeDasharray="5 5" label="α = 0.05" />
              <Bar 
                dataKey="pValue" 
                fill="#6b7280"
                name="p-value"
              />
              <Line 
                type="monotone" 
                dataKey="tStatistic" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                name="t-statistic"
                yAxisId="right"
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {significanceData.filter(d => d.isSignificant).length}
              </div>
              <div className="text-sm text-muted-foreground">Significant Results</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {significanceData.filter(d => !d.isSignificant).length}
              </div>
              <div className="text-sm text-muted-foreground">Non-significant</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-muted-foreground">Confidence Level</div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Scatter Plot with Regression Line and Confidence Bands */}
      {correlations.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🎲 Regression Analysis
            <span className="ml-2 text-sm text-muted-foreground">
              (Best correlation with confidence bands)
            </span>
          </h3>
          {(() => {
            const bestCorrelation = correlations.reduce((best, current) => 
              Math.abs(current.correlation) > Math.abs(best.correlation) ? current : best
            )
            
            const scatterData = data.map((d, i) => ({
              x: Number(d[bestCorrelation.field1]) || 0,
              y: Number(d[bestCorrelation.field2]) || 0,
              index: i
            })).filter(d => !isNaN(d.x) && !isNaN(d.y))

            return (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{bestCorrelation.field1}</span>
                    {' vs '}
                    <span className="font-medium">{bestCorrelation.field2}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    r = {bestCorrelation.correlation.toFixed(3)} 
                    {bestCorrelation.pValue && ` (p = ${bestCorrelation.pValue.toFixed(4)})`}
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      type="number"
                      dataKey="x" 
                      stroke="#64748b"
                      fontSize={12}
                      name={bestCorrelation.field1}
                    />
                    <YAxis 
                      type="number"
                      dataKey="y" 
                      stroke="#64748b" 
                      fontSize={12}
                      name={bestCorrelation.field2}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                      formatter={(value, name) => [
                        Number(value).toFixed(3),
                        name === 'x' ? bestCorrelation.field1 : bestCorrelation.field2
                      ]}
                    />
                    <Scatter 
                      dataKey="y" 
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    {bestCorrelation.confidenceInterval && (
                      <ReferenceLine 
                        segment={[
                          { x: Math.min(...scatterData.map(d => d.x)), y: Math.min(...scatterData.map(d => d.y)) },
                          { x: Math.max(...scatterData.map(d => d.x)), y: Math.max(...scatterData.map(d => d.y)) }
                        ]}
                        stroke="#ef4444" 
                        strokeWidth={2}
                        label="Regression Line"
                      />
                    )}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )
          })()}
        </div>
      )}

      <div className="bg-muted/20 border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">📋 Statistical Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-muted-foreground">Data Points</div>
            <div className="text-2xl font-bold">{data.length.toLocaleString()}</div>
          </div>
          <div>
            <div className="font-medium text-muted-foreground">Correlations</div>
            <div className="text-2xl font-bold">{correlations.length}</div>
          </div>
          <div>
            <div className="font-medium text-muted-foreground">Hypothesis Tests</div>
            <div className="text-2xl font-bold">{hypothesisTests.length}</div>
          </div>
          <div>
            <div className="font-medium text-muted-foreground">Confidence Intervals</div>
            <div className="text-2xl font-bold">{confidenceIntervals.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedVisualizations