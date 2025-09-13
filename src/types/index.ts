// Core application types
export interface User {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  subscriptionTier: SubscriptionTier
  createdAt: string
  updatedAt: string
}

export type SubscriptionTier = 'free' | 'professional' | 'enterprise' | 'strategic'

export interface Project {
  id: string
  userId: string
  name: string
  description: string | null
  settings: ProjectSettings | null
  dashboards?: Dashboard[]
  createdAt: string
  updatedAt: string
}

export interface ProjectSettings {
  theme?: 'light' | 'dark' | 'auto'
  defaultChartColors?: string[]
  dataRetention?: number
  collaborationSettings?: {
    allowPublicSharing: boolean
    defaultPermissions: 'view' | 'edit'
  }
}

export interface Dashboard {
  id: string
  projectId: string
  userId: string
  name: string
  layout: DashboardLayout
  config: DashboardConfig | null
  isPublic: boolean
  sharedWith: string[] | null
  components?: Component[]
  createdAt: string
  updatedAt: string
}

export interface DashboardLayout {
  grid: GridLayout[]
  breakpoints: {
    lg: number
    md: number
    sm: number
    xs: number
  }
}

export interface GridLayout {
  i: string // component id
  x: number
  y: number
  w: number
  h: number
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  static?: boolean
}

export interface DashboardConfig {
  theme?: 'light' | 'dark'
  filters?: FilterConfig[]
  globalSettings?: {
    showLegends: boolean
    animationsEnabled: boolean
    realTimeUpdates: boolean
  }
}

// Component types for dashboard builder
export type ComponentType = 'chart' | 'kpi' | 'text' | 'filter' | 'ai-insight'

export interface Component {
  id: string
  dashboardId: string
  type: ComponentType
  config: ComponentConfig
  dataBindings: DataBinding | null
  position: GridLayout
  styling: ComponentStyling | null
  createdAt: string
}

export interface ComponentConfig {
  title?: string
  subtitle?: string
  [key: string]: any
}

export interface DataBinding {
  datasetId: string
  fields: FieldMapping[]
  filters?: DataFilter[]
  aggregations?: Aggregation[]
}

export interface FieldMapping {
  sourceField: string
  targetField: string
  dataType: 'string' | 'number' | 'date' | 'boolean'
  format?: string
}

export interface DataFilter {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between'
  value: any
}

export interface Aggregation {
  field: string
  function: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median'
  groupBy?: string[]
}

export interface ComponentStyling {
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  padding?: number
  margin?: number
  customCSS?: string
}

// Chart specific types
export interface Chart {
  id: string
  componentId: string
  chartType: ChartType
  dataConfig: ChartDataConfig
  styleConfig: ChartStyleConfig | null
  interactions: ChartInteractions | null
}

export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'area' 
  | 'pie' 
  | 'scatter' 
  | 'bubble' 
  | 'heatmap' 
  | 'treemap' 
  | 'sankey' 
  | 'funnel' 
  | 'gauge' 
  | 'radar'

export interface ChartDataConfig {
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  series: ChartSeries[]
  categories?: string[]
}

export interface ChartAxis {
  field: string
  label?: string
  type: 'category' | 'value' | 'time'
  format?: string
  min?: number
  max?: number
}

export interface ChartSeries {
  name: string
  field: string
  color?: string
  type?: ChartType
  stack?: string
}

export interface ChartStyleConfig {
  colors: string[]
  fontSize: number
  fontFamily: string
  showLegend: boolean
  legendPosition: 'top' | 'bottom' | 'left' | 'right'
  showGrid: boolean
  showTooltip: boolean
  animations: boolean
}

export interface ChartInteractions {
  zoom: boolean
  pan: boolean
  brush: boolean
  clickToFilter: boolean
  hover: boolean
}

// Dataset types
export interface Dataset {
  id: string
  projectId: string
  name: string
  filePath: string
  size: number
  schema: DataSchema | null
  metadata: DatasetMetadata | null
  rowCount: number
  uploadedAt: string
}

export interface DataSchema {
  fields: SchemaField[]
  primaryKey?: string
  relationships?: DataRelationship[]
}

export interface SchemaField {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'json'
  nullable: boolean
  unique: boolean
  description?: string
}

export interface DataRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  fromField: string
  toDataset: string
  toField: string
}

export interface DatasetMetadata {
  encoding?: string
  delimiter?: string
  hasHeader?: boolean
  sampleData?: any[]
  statistics?: FieldStatistics[]
}

export interface FieldStatistics {
  field: string
  count: number
  nullCount: number
  uniqueCount: number
  min?: number | string
  max?: number | string
  mean?: number
  median?: number
  standardDeviation?: number
}

// AI and insights types
export type InsightPersona = 'phd_analyst' | 'ceo_narrative' | 'manager_actions'

export type InsightType = 'correlation' | 'causation' | 'anomaly' | 'prediction' | 'recommendation'

export interface AIInsight {
  id: string
  dashboardId: string
  persona: InsightPersona
  insightType: InsightType
  content: string
  confidenceScore: number
  dataSources: string[]
  createdAt: string
}

export interface ActionPlan {
  id: string
  insightId: string
  userId: string
  title: string
  description: string
  status: ActionStatus
  priority: PriorityLevel
  assignedTo: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical'

// Filter types
export interface FilterConfig {
  id: string
  dashboardId: string
  name: string
  type: FilterType
  config: FilterTypeConfig
  appliesTo: string[]
}

export type FilterType = 'dropdown' | 'multiselect' | 'daterange' | 'slider' | 'search'

export interface FilterTypeConfig {
  options?: FilterOption[]
  defaultValue?: any
  placeholder?: string
  min?: number
  max?: number
  step?: number
}

export interface FilterOption {
  label: string
  value: any
}

// API response types
export interface APIResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
  error: string | null
}

// Export types
export type ExportFormat = 'pdf' | 'powerpoint' | 'png' | 'svg' | 'csv' | 'excel'

export interface ExportOptions {
  format: ExportFormat
  includeData: boolean
  includeInsights: boolean
  template?: string
  branding?: {
    logo?: string
    colors?: string[]
    companyName?: string
  }
}