import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Download,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    insights: boolean
    alerts: boolean
  }
  privacy: {
    dataRetention: number // days
    analyticsTracking: boolean
    shareUsage: boolean
  }
  display: {
    language: string
    timezone: string
    dateFormat: string
    numberFormat: string
  }
}

const SettingsPage = () => {
  const { user, signOut } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      insights: true,
      alerts: true
    },
    privacy: {
      dataRetention: 90,
      analyticsTracking: true,
      shareUsage: false
    },
    display: {
      language: 'en-US',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'en-US'
    }
  })

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => {
      const currentSection = prev[section]
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [key]: value
          }
        }
      }
      return prev
    })
  }

  const saveSettings = () => {
    // In a real app, this would save to backend
    localStorage.setItem('zenalyst_settings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  const exportData = () => {
    const userData = {
      profile: user,
      settings,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `zenalyst-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'display', name: 'Display & Language', icon: Globe },
    { id: 'data', name: 'Data Management', icon: Database }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and application settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-4">
              <nav className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.name}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-xl p-6">
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</div>
                          <div className="text-sm text-muted-foreground">{user?.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Member since {new Date(user?.created_at || '').toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <input
                            type="text"
                            defaultValue={user?.user_metadata?.full_name || ''}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue={user?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border rounded-lg bg-muted/50 text-muted-foreground"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Change Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">Receive analysis reports and updates via email</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={(e) => updateSettings('notifications', 'email', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Push Notifications</div>
                            <div className="text-sm text-muted-foreground">Real-time alerts for important insights</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.push}
                            onChange={(e) => updateSettings('notifications', 'push', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <SettingsIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Insight Notifications</div>
                            <div className="text-sm text-muted-foreground">Get notified when new insights are discovered</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.insights}
                            onChange={(e) => updateSettings('notifications', 'insights', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Data Retention</div>
                            <div className="text-sm text-muted-foreground">How long to keep your analysis data</div>
                          </div>
                        </div>
                        <select
                          value={settings.privacy.dataRetention}
                          onChange={(e) => updateSettings('privacy', 'dataRetention', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value={30}>30 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>6 months</option>
                          <option value={365}>1 year</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Analytics Tracking</div>
                            <div className="text-sm text-muted-foreground">Help improve Zenalyst by sharing usage analytics</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.analyticsTracking}
                            onChange={(e) => updateSettings('privacy', 'analyticsTracking', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'display' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Display & Language</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Theme</label>
                          <div className="flex space-x-2">
                            {(['light', 'dark', 'system'] as const).map(theme => (
                              <button
                                key={theme}
                                onClick={() => updateSettings('display', 'theme', theme)}
                                className={`flex items-center space-x-2 px-3 py-2 border rounded-lg ${
                                  settings.theme === theme ? 'border-primary bg-primary/10' : 'border-border'
                                }`}
                              >
                                {theme === 'light' && <Sun className="w-4 h-4" />}
                                {theme === 'dark' && <Moon className="w-4 h-4" />}
                                {theme === 'system' && <SettingsIcon className="w-4 h-4" />}
                                <span className="text-sm capitalize">{theme}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Language</label>
                          <select
                            value={settings.display.language}
                            onChange={(e) => updateSettings('display', 'language', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="es-ES">Español</option>
                            <option value="fr-FR">Français</option>
                            <option value="de-DE">Deutsch</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Timezone</label>
                          <select
                            value={settings.display.timezone}
                            onChange={(e) => updateSettings('display', 'timezone', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Date Format</label>
                          <select
                            value={settings.display.dateFormat}
                            onChange={(e) => updateSettings('display', 'dateFormat', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Data Management</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Download className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">Export Data</div>
                              <div className="text-sm text-muted-foreground">Download all your analysis data and settings</div>
                            </div>
                          </div>
                          <button
                            onClick={exportData}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                          >
                            Export
                          </button>
                        </div>
                      </div>

                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-red-600" />
                            <div>
                              <div className="font-medium text-red-800">Delete Account</div>
                              <div className="text-sm text-red-600">Permanently delete your account and all data</div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                signOut()
                                localStorage.clear()
                                alert('Account deleted successfully.')
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between">
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 border rounded-lg hover:bg-muted/50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSettings}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage