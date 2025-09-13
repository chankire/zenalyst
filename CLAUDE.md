# ZENALYST NEXUS - CLAUDE DEVELOPMENT NOTES

## 🎯 Project Overview
**Zenalyst Nexus** is the world's first cognitive dashboard intelligence platform that combines:
- **Multi-persona AI analysis** (PhD Analyst + Fortune 10 CEO + Middle Manager)
- **Interactive dashboard builder** with drag-and-drop capabilities
- **Professional export suite** for presentations and reports
- **Real-time collaboration** for teams
- **Causal inference engine** for deep business insights

## 🧠 AI Context & Cognitive Architecture

### Multi-Persona System
```typescript
interface PersonaEngine {
  phdAnalyst: {
    focus: "Statistical analysis, methodology, significance testing"
    output: "Technical insights with confidence intervals"
  }
  ceoNarrative: {
    focus: "Strategic implications, board-ready communications"
    output: "Executive summaries and strategic recommendations"
  }
  managerActions: {
    focus: "Tactical recommendations and implementation plans" 
    output: "Actionable tasks with timelines and ownership"
  }
}
```

### Cognitive Capabilities
- **Causal Inference**: Goes beyond correlation to identify root causes
- **Scenario Modeling**: Monte Carlo simulations for risk assessment
- **Industry Intelligence**: Benchmarking against competitors and market data
- **Implementation Tracking**: Converts insights into trackable action plans

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** + TypeScript for type safety
- **Tailwind CSS** + shadcn/ui for enterprise design system
- **Recharts** for advanced data visualizations  
- **React DnD** for drag-and-drop dashboard builder
- **Framer Motion** for smooth animations
- **TanStack Query** for optimized data fetching

### Backend Infrastructure
- **Supabase** for PostgreSQL database and real-time subscriptions
- **Edge Functions** for AI processing and advanced analytics
- **Row-Level Security** for enterprise data isolation
- **File Storage** with CDN for datasets and exports

### AI Integration
- **OpenAI GPT-4** for natural language insights generation
- **Custom ML models** for statistical analysis
- **Vector embeddings** for semantic search and similarity
- **Streaming responses** for real-time chat interface

## 📊 Database Schema

### Core Tables
```sql
-- Users (extends Supabase auth)
users: id, email, full_name, subscription_tier, created_at

-- Projects (workspace containers)  
projects: id, user_id, name, description, settings, created_at

-- Dashboards (interactive visualizations)
dashboards: id, project_id, name, layout, config, is_public, created_at

-- Components (dashboard elements)
components: id, dashboard_id, type, config, position, styling

-- Datasets (uploaded data)
datasets: id, project_id, name, file_path, schema, row_count

-- AI Insights (cognitive analysis)
ai_insights: id, dashboard_id, persona, insight_type, content, confidence_score

-- Action Plans (implementation tracking)
action_plans: id, insight_id, title, status, priority, assigned_to, due_date
```

## 🚀 Implementation Phases

### Phase 1: Foundation (Weeks 1-4) ✅ IN PROGRESS
- [x] Project setup with Vite + React + TypeScript
- [x] Supabase integration with authentication
- [x] Database schema and types definition
- [x] Basic styling with Tailwind CSS
- [ ] Landing page with Zenalyst Nexus branding
- [ ] User authentication flow (signup/signin)
- [ ] Project creation and management

### Phase 2: Core Intelligence (Weeks 5-8)
- [ ] Multi-persona AI engine implementation
- [ ] Data upload and processing pipeline
- [ ] Basic chart visualization with Recharts
- [ ] Statistical analysis algorithms
- [ ] Natural language insight generation

### Phase 3: Dashboard Builder (Weeks 9-12)  
- [ ] Drag-and-drop canvas implementation
- [ ] Component palette with chart types
- [ ] Interactive filtering system
- [ ] Real-time collaboration features
- [ ] Professional export (PDF/PowerPoint)

### Phase 4: Advanced Features (Weeks 13-16)
- [ ] Causal inference engine
- [ ] Industry benchmarking system
- [ ] Implementation tracking
- [ ] Enterprise security and compliance
- [ ] API marketplace and integrations

## 🎨 Design System

### Brand Colors
```css
:root {
  --primary: 243 75% 59%; /* #6366f1 - Indigo */
  --primary-glow: 243 75% 69%; /* Lighter primary */
  --secondary: 142 71% 45%; /* #10b981 - Emerald */
  --accent: 47 96% 53%; /* #eab308 - Yellow */
}
```

### Component Patterns
- **Cards**: Subtle shadows with rounded corners
- **Buttons**: Gradient backgrounds with hover states  
- **Charts**: Consistent color palette with animations
- **Forms**: Floating labels with validation states

## 💰 Business Model

### Pricing Tiers
```
Professional: $150/user/month
├── Multi-persona AI insights
├── Interactive dashboard builder
├── Professional exports
└── Basic collaboration

Enterprise: $400/user/month  
├── Advanced cognitive analytics
├── Real-time collaboration
├── Industry benchmarking
└── Implementation tracking

Strategic: $800/user/month
├── Causal inference engine
├── Competitive intelligence
├── Custom AI training
└── Dedicated success manager
```

## 🔧 Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm run test
```

### Supabase Commands
```bash
# Start Supabase locally
supabase start

# Create new migration
supabase migration new [name]

# Apply migrations
supabase db push

# Deploy edge functions
supabase functions deploy
```

## 🎯 Success Metrics

### Phase 1 Goals
- [ ] Multi-persona AI generating 3 different insight types
- [ ] User authentication and project management working
- [ ] Basic data upload and visualization functional
- [ ] 90% uptime and sub-2s response times

### Business Goals
- **Year 1**: $2M ARR (80 enterprise customers)
- **Year 2**: $12M ARR (land-and-expand strategy)
- **Year 3**: $35M ARR (Fortune 500 penetration)

## 🚨 Critical Implementation Notes

### Security Considerations
- Row-level security for data isolation
- API rate limiting on edge functions
- Input validation with Zod schemas
- HTTPS everywhere with secure headers

### Performance Optimizations
- Lazy loading for dashboard components
- Virtual scrolling for large datasets
- Chart optimization with data sampling
- CDN delivery for static assets

### AI Best Practices
- Confidence scores for all AI-generated insights
- Transparent data sources and methodology
- User feedback loops for continuous learning
- Fallback options when AI is unavailable

## 📝 Next Actions

1. **Complete infrastructure setup** (current phase)
2. **Build AI persona system** for multi-perspective analysis
3. **Implement dashboard builder** with drag-and-drop
4. **Create export system** for professional presentations
5. **Add collaboration features** for team workflows

---

**Note**: This is a living document that gets updated as the project evolves. Always refer to the latest version for current status and priorities.