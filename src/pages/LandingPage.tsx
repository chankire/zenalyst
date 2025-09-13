import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Brain, 
  BarChart3, 
  Zap, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "Multi-Persona AI Analysis",
      description: "PhD-level statistical insights, CEO strategic narratives, and manager action plans - all in one platform.",
      detail: "Every data point analyzed through three expert lenses for comprehensive business intelligence."
    },
    {
      icon: BarChart3,
      title: "Interactive Dashboard Builder", 
      description: "Drag-and-drop interface with AI-powered chart recommendations and professional templates.",
      detail: "Build stunning dashboards in minutes, not hours, with intelligent design assistance."
    },
    {
      icon: Zap,
      title: "Causal Inference Engine",
      description: "Go beyond correlation to understand WHY things happen and what actions to take.",
      detail: "Advanced algorithms identify root causes and predict business outcomes with confidence scores."
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Team workspaces with live editing, comments, and version control for dashboard creation.",
      detail: "Collaborate seamlessly with stakeholders across departments and organizations."
    }
  ]

  const testimonials = [
    {
      quote: "Zenalyst Nexus transformed how we analyze data. The multi-persona insights are game-changing.",
      author: "Sarah Chen",
      role: "Chief Data Officer",
      company: "TechCorp"
    },
    {
      quote: "Finally, an analytics platform that thinks like our team. The AI insights are incredibly accurate.",
      author: "Michael Rodriguez",
      role: "VP of Strategy", 
      company: "InnovateLabs"
    },
    {
      quote: "The dashboard builder is intuitive and the export quality is presentation-ready.",
      author: "Lisa Wang",
      role: "Director of Analytics",
      company: "DataFirst"
    }
  ]

  const pricingTiers = [
    {
      name: "Professional",
      price: "$150",
      period: "per user/month",
      description: "Perfect for growing teams",
      features: [
        "Multi-persona AI insights",
        "Interactive dashboard builder", 
        "Professional exports",
        "Basic collaboration",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Enterprise", 
      price: "$400",
      period: "per user/month",
      description: "Advanced features for scale",
      features: [
        "Advanced cognitive analytics",
        "Real-time collaboration",
        "Industry benchmarking", 
        "Implementation tracking",
        "Priority support",
        "Custom integrations"
      ],
      popular: true
    },
    {
      name: "Strategic",
      price: "$800", 
      period: "per user/month",
      description: "Enterprise-grade intelligence",
      features: [
        "Causal inference engine",
        "Competitive intelligence",
        "Custom AI training",
        "Dedicated success manager",
        "API access",
        "White-label options"
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">
                Zenalyst Nexus
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                Testimonials
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/auth" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth" 
                className="px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient-primary">Cognitive Intelligence</span>
              <br />
              <span className="text-foreground">for Modern Business</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              The world's first analytics platform that thinks like a PhD analyst, 
              communicates like a Fortune 10 CEO, and executes like a middle manager.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                to="/auth"
                className="px-8 py-4 gradient-primary text-white rounded-lg hover:shadow-xl transition-all flex items-center group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/auth"
                className="px-8 py-4 border border-border rounded-lg hover:bg-muted/50 transition-colors inline-block text-center"
              >
                Watch Demo
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Enterprise Security
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Real-time Analytics
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Proven ROI
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Revolutionary Analytics <span className="text-gradient-primary">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combining the best of human intelligence with AI-powered insights
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl border cursor-pointer transition-all ${
                    activeFeature === index 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      activeFeature === index ? 'gradient-primary' : 'bg-muted'
                    }`}>
                      <feature.icon className={`w-6 h-6 ${
                        activeFeature === index ? 'text-white' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-card border rounded-xl p-8">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="p-4 gradient-primary rounded-xl">
                    {(() => {
                      const IconComponent = features[activeFeature].icon
                      return IconComponent ? <IconComponent className="w-8 h-8 text-white" /> : null
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold ml-4">{features[activeFeature].title}</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {features[activeFeature].detail}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient-primary">Simple</span> Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that scales with your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-xl border ${
                  tier.popular 
                    ? 'border-primary bg-primary/5 shadow-xl' 
                    : 'border-border bg-card'
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-2 gradient-primary text-white text-sm rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground mb-4">{tier.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground ml-2">{tier.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/auth"
                  className={`w-full py-3 rounded-lg text-center transition-all block ${
                    tier.popular
                      ? 'gradient-primary text-white hover:shadow-lg'
                      : 'border border-border hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by <span className="text-gradient-primary">Industry Leaders</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers are saying about Zenalyst Nexus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 bg-card border rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your <span className="text-gradient-primary">Analytics?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of organizations using Zenalyst Nexus to make smarter, 
              faster business decisions with cognitive intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/auth"
                className="px-8 py-4 gradient-primary text-white rounded-lg hover:shadow-xl transition-all flex items-center group"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/auth"
                className="px-8 py-4 border border-border rounded-lg hover:bg-muted/50 transition-colors inline-block text-center"
              >
                Schedule Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">
                Zenalyst Nexus
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 Zenalyst Nexus. All rights reserved. The world's first cognitive dashboard intelligence platform.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage