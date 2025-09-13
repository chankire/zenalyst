import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Upload, 
  BarChart3, 
  FileSpreadsheet, 
  Brain, 
  Calendar,
  TrendingUp,
  Database,
  Zap,
  Loader2,
  Sparkles,
  Activity
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AdvancedAnalytics } from '@/lib/analytics'

interface Project {
  id: string
  name: string
  description: string
  datasetsCount: number
  dashboardsCount: number
  lastActivity: string
  insights: number
}

const ProjectsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState('')
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Sales Analytics Q4',
      description: 'Quarterly sales performance analysis with regional breakdowns',
      datasetsCount: 3,
      dashboardsCount: 5,
      lastActivity: '2 hours ago',
      insights: 23
    },
    {
      id: '2', 
      name: 'Customer Behavior Study',
      description: 'Deep dive into customer journey and conversion patterns',
      datasetsCount: 7,
      dashboardsCount: 3,
      lastActivity: '1 day ago',
      insights: 41
    },
    {
      id: '3',
      name: 'Marketing ROI Analysis',
      description: 'Campaign effectiveness and budget optimization insights',
      datasetsCount: 4,
      dashboardsCount: 8,
      lastActivity: '3 days ago',
      insights: 17
    }
  ])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const parseFileToData = useCallback(async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const content = e.target?.result as string
        
        try {
          if (file.name.endsWith('.json')) {
            const data = JSON.parse(content)
            resolve(Array.isArray(data) ? data : [data])
          } else if (file.name.endsWith('.csv')) {
            // Simple CSV parser
            const lines = content.split('\n').filter(line => line.trim())
            const headers = lines[0].split(',').map(h => h.trim())
            const data = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim())
              const obj: any = {}
              headers.forEach((header, i) => {
                const value = values[i] || ''
                // Try to parse as number if possible
                obj[header] = isNaN(Number(value)) ? value : Number(value)
              })
              return obj
            })
            resolve(data)
          } else {
            reject(new Error('Unsupported file format'))
          }
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }, [])

  const handleCreateDashboard = async () => {
    if (selectedFile) {
      setIsAnalyzing(true)
      setAnalysisProgress('Reading file...')
      
      try {
        // Parse the uploaded file
        const data = await parseFileToData(selectedFile)
        
        setAnalysisProgress('Initializing advanced analytics...')
        const analytics = new AdvancedAnalytics()
        
        setAnalysisProgress('Performing instant analysis...')
        const analysisResults = await analytics.performInstantAnalysis(data)
        
        // Store analysis results in localStorage for dashboard to use
        localStorage.setItem('zenalyst_analysis_results', JSON.stringify(analysisResults))
        localStorage.setItem('zenalyst_raw_data', JSON.stringify(data))
        localStorage.setItem('zenalyst_file_name', selectedFile.name)
        
        setAnalysisProgress('Complete! Loading dashboard...')
        
        // Navigate to dashboard with uploaded data
        setShowUploadModal(false)
        setIsAnalyzing(false)
        navigate('/dashboard?uploaded=true')
      } catch (error) {
        console.error('Analysis failed:', error)
        setIsAnalyzing(false)
        setAnalysisProgress('')
        // Navigate to demo dashboard on error
        setShowUploadModal(false)
        navigate('/dashboard?demo=true')
      }
    } else {
      // Demo mode
      setShowUploadModal(false)
      navigate('/dashboard?demo=true')
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === 'text/csv' || 
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'application/json') {
        setSelectedFile(file)
      }
    }
  }

  const sampleDatasets = [
    { name: 'Sales Data Q4 2024', size: '2.3 MB', type: 'CSV', records: '15,423' },
    { name: 'Customer Survey Results', size: '1.8 MB', type: 'Excel', records: '8,901' },
    { name: 'Marketing Campaign Metrics', size: '987 KB', type: 'JSON', records: '3,245' },
    { name: 'Product Performance Data', size: '4.1 MB', type: 'CSV', records: '28,567' }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.full_name || 'Demo User'}!</h1>
          <p className="text-muted-foreground">
            Manage your analytics projects and discover cognitive insights
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Data</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/dashboard?demo=true" className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Try Demo Dashboard</h3>
              <p className="text-sm text-muted-foreground">Experience cognitive analytics with sample data</p>
            </div>
          </div>
        </Link>
        
        <button 
          onClick={() => setShowUploadModal(true)}
          className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all group text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
              <Upload className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Upload Dataset</h3>
              <p className="text-sm text-muted-foreground">Start with your own data files</p>
            </div>
          </div>
        </button>

        <button className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all group text-left">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
              <Brain className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Get insights with natural language</p>
            </div>
          </div>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id}
              to={`/dashboard?project=${project.id}`}
              className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <BarChart3 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{project.datasetsCount} datasets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{project.dashboardsCount} dashboards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{project.insights} insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{project.lastActivity}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last activity</span>
                  <span className="text-primary font-medium">{project.lastActivity}</span>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Create New Project Card */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-6 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center justify-center min-h-[280px]"
          >
            <Plus className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Create New Project</h3>
            <p className="text-muted-foreground text-sm text-center">
              Start a new analytics project with cognitive insights
            </p>
          </button>
        </div>
      </div>

      {/* Data Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold mb-2">Upload Your Data</h2>
              <p className="text-muted-foreground">
                Upload CSV, Excel, or JSON files to start analyzing with cognitive insights
              </p>
            </div>
            
            <div className="p-6">
              {/* File Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-all ${
                  isDragOver 
                    ? 'border-primary bg-primary/5 border-solid' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {isDragOver 
                      ? 'Drop your file here!' 
                      : selectedFile 
                        ? selectedFile.name 
                        : 'Drop your file here or click to browse'
                    }
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Supports CSV, Excel (.xlsx, .xls), and JSON files up to 100MB
                  </p>
                </label>
              </div>

              {/* Sample Datasets */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Or try with sample datasets:</h3>
                <div className="space-y-3">
                  {sampleDatasets.map((dataset, index) => (
                    <button
                      key={index}
                      onClick={handleCreateDashboard}
                      className="w-full p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">{dataset.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {dataset.records} records • {dataset.size} • {dataset.type}
                            </p>
                          </div>
                        </div>
                        <TrendingUp className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary mb-1">Analyzing Your Data</h4>
                      <p className="text-sm text-muted-foreground">{analysisProgress}</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="mt-3 bg-primary/10 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={isAnalyzing}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDashboard}
                  disabled={(!selectedFile && !isAnalyzing) || isAnalyzing}
                  className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      <span>Start Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold mb-2">Create New Project</h2>
              <p className="text-muted-foreground">
                Set up a new analytics project workspace
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="e.g., Marketing Analytics Q1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Brief description of your analytics project..."
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsPage