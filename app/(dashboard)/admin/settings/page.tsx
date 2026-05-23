'use client'

import { useState, useEffect } from 'react'
import { getSystemSettings, updateSystemSettings, testEmailSettings, testSmsSettings } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Mail, MessageSquare, Lock, Database, Bell, Zap, Save, Check, AlertCircle } from 'lucide-react'

interface SettingsData {
  id: string
  appName: string
  appVersion: string
  appLogo: string
  supportEmail: string
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun'
  emailFrom: string
  emailHost: string
  emailPort: number
  emailUser: string
  emailPassword: string
  smsProvider: 'twilio' | 'aws' | 'none'
  smsApiKey: string
  smsAccountId: string
  maintenanceMode: boolean
  maintenanceMessage: string
  enableStudentRegistration: boolean
  enableSchoolRegistration: boolean
  enablePayments: boolean
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  maxUploadSize: number
  backupEnabled: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  defaultCurrency: string
  timezone: string
  apiRateLimit: number
  sessionTimeout: number
}

type TabName = 'general' | 'email' | 'sms' | 'features' | 'security' | 'backup'

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabName>('general')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)
  const [testingSms, setTestingSms] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const data = await getSystemSettings()
      if (data) {
        setSettings(data)
      }
    } catch (err) {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!settings) return
    
    setIsSaving(true)
    setError('')
    setSaved(false)

    try {
      const result = await updateSystemSettings(settings)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      setError('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleTestEmail() {
    setTestingEmail(true)
    try {
      const result = await testEmailSettings(settings || {})
      if (result?.error) {
        setError(result.error)
      } else {
        setError('')
      }
    } finally {
      setTestingEmail(false)
    }
  }

  async function handleTestSms() {
    setTestingSms(true)
    try {
      const result = await testSmsSettings(settings || {})
      if (result?.error) {
        setError(result.error)
      } else {
        setError('')
      }
    } finally {
      setTestingSms(false)
    }
  }

  const updateField = (key: keyof SettingsData, value: any) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null)
  }

  if (loading) {
    return (
      <div className="flex-1 p-8 pt-24 bg-surface-50 dark:bg-surface-950 min-h-screen flex items-center justify-center">
        <div className="text-muted-fg">Loading settings...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex-1 p-8 pt-24 bg-surface-50 dark:bg-surface-950 min-h-screen flex items-center justify-center">
        <div className="text-red-600">Failed to load settings</div>
      </div>
    )
  }

  const tabs: Array<{ id: TabName; label: string; icon: React.ElementType }> = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'backup', label: 'Backup', icon: Database },
  ]

  return (
    <div className="flex-1 p-8 pt-24 bg-surface-50 dark:bg-surface-950 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fg flex items-center gap-2">
            <Settings className="w-8 h-8" />
            System Settings
          </h1>
          <p className="text-muted-fg mt-2">Configure application settings and integrations</p>
        </div>

        {/* Alerts */}
        {error && (
          <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 mb-6">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </CardContent>
          </Card>
        )}

        {saved && (
          <Card className="border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/40 mb-6">
            <CardContent className="pt-6 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">Settings saved successfully</span>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeTab === tab.id
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30'
                  : 'border-border bg-bg dark:bg-surface-900 hover:border-border-light'
              }`}
            >
              <tab.icon className={`w-5 h-5 mb-2 ${activeTab === tab.id ? 'text-brand-600' : 'text-muted-fg'}`} />
              <div className={`text-sm font-semibold ${activeTab === tab.id ? 'text-brand-600' : 'text-fg'}`}>
                {tab.label}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-fg">Application Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appName">Application Name</Label>
                      <Input
                        id="appName"
                        value={settings.appName}
                        onChange={(e) => updateField('appName', e.target.value)}
                        placeholder="EduCore"
                      />
                    </div>
                    <div>
                      <Label htmlFor="appVersion">Version</Label>
                      <Input
                        id="appVersion"
                        value={settings.appVersion}
                        onChange={(e) => updateField('appVersion', e.target.value)}
                        placeholder="1.0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => updateField('supportEmail', e.target.value)}
                        placeholder="support@educore.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        value={settings.timezone}
                        onChange={(e) => updateField('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-bg dark:bg-surface-800 text-fg dark:text-fg-light focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Input
                        id="currency"
                        value={settings.defaultCurrency}
                        onChange={(e) => updateField('defaultCurrency', e.target.value)}
                        placeholder="INR"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <hr className="border-border/50" />

                  <h3 className="text-lg font-semibold text-fg">Maintenance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Maintenance Mode</Label>
                        <p className="text-xs text-muted-fg mt-1">Enable to temporarily disable the application</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateField('maintenanceMode', !settings.maintenanceMode)}
                        className={`relative w-12 h-6 p-0.5 rounded-full overflow-hidden transition-colors ${
                          settings.maintenanceMode ? 'bg-red-600 dark:bg-red-700' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                            settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {settings.maintenanceMode && (
                      <div>
                        <Label htmlFor="maintenanceMsg">Maintenance Message</Label>
                        <textarea
                          id="maintenanceMsg"
                          value={settings.maintenanceMessage}
                          onChange={(e) => updateField('maintenanceMessage', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-bg dark:bg-surface-800 text-fg dark:text-fg-light focus:outline-none focus:ring-2 focus:ring-brand-500"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-fg">Email Configuration</h3>

                  <div>
                    <Label htmlFor="emailProvider">Email Provider</Label>
                    <select
                      id="emailProvider"
                      value={settings.emailProvider}
                      onChange={(e) => updateField('emailProvider', e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-bg dark:bg-surface-800 text-fg dark:text-fg-light focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="smtp">SMTP</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailgun">Mailgun</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="emailFrom">From Email Address</Label>
                    <Input
                      id="emailFrom"
                      type="email"
                      value={settings.emailFrom}
                      onChange={(e) => updateField('emailFrom', e.target.value)}
                      placeholder="noreply@educore.com"
                    />
                  </div>

                  {settings.emailProvider === 'smtp' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emailHost">SMTP Host</Label>
                          <Input
                            id="emailHost"
                            value={settings.emailHost}
                            onChange={(e) => updateField('emailHost', e.target.value)}
                            placeholder="smtp.gmail.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="emailPort">SMTP Port</Label>
                          <Input
                            id="emailPort"
                            type="number"
                            value={settings.emailPort}
                            onChange={(e) => updateField('emailPort', parseInt(e.target.value))}
                            placeholder="587"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emailUser">Email Username</Label>
                          <Input
                            id="emailUser"
                            value={settings.emailUser}
                            onChange={(e) => updateField('emailUser', e.target.value)}
                            placeholder="your-email@gmail.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="emailPassword">Email Password</Label>
                          <Input
                            id="emailPassword"
                            type="password"
                            value={settings.emailPassword}
                            onChange={(e) => updateField('emailPassword', e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleTestEmail}
                        disabled={testingEmail || !settings.emailHost}
                        variant="outline"
                        className="w-full"
                      >
                        {testingEmail ? 'Testing...' : 'Test Email Settings'}
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* SMS Settings */}
              {activeTab === 'sms' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-fg">SMS Configuration</h3>

                  <div>
                    <Label htmlFor="smsProvider">SMS Provider</Label>
                    <select
                      id="smsProvider"
                      value={settings.smsProvider}
                      onChange={(e) => updateField('smsProvider', e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-bg dark:bg-surface-800 text-fg dark:text-fg-light focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="none">Disabled</option>
                      <option value="twilio">Twilio</option>
                      <option value="aws">AWS SNS</option>
                    </select>
                  </div>

                  {settings.smsProvider !== 'none' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="smsApiKey">API Key</Label>
                          <Input
                            id="smsApiKey"
                            type="password"
                            value={settings.smsApiKey}
                            onChange={(e) => updateField('smsApiKey', e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <Label htmlFor="smsAccountId">Account ID / Phone Number</Label>
                          <Input
                            id="smsAccountId"
                            value={settings.smsAccountId}
                            onChange={(e) => updateField('smsAccountId', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleTestSms}
                        disabled={testingSms || !settings.smsApiKey}
                        variant="outline"
                        className="w-full"
                      >
                        {testingSms ? 'Testing...' : 'Test SMS Settings'}
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Features */}
              {activeTab === 'features' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-fg">Feature Toggles</h3>

                  <div className="space-y-3">
                    {[
                      { key: 'enableStudentRegistration', label: 'Student Registration', desc: 'Allow new students to register' },
                      { key: 'enableSchoolRegistration', label: 'School Registration', desc: 'Allow new schools to register' },
                      { key: 'enablePayments', label: 'Payment Processing', desc: 'Enable fee payment functionality' },
                      { key: 'enableEmailNotifications', label: 'Email Notifications', desc: 'Send email notifications to users' },
                      { key: 'enableSmsNotifications', label: 'SMS Notifications', desc: 'Send SMS notifications to users' },
                    ].map(feature => (
                      <div key={feature.key} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                        <div>
                          <Label className="text-base">{feature.label}</Label>
                          <p className="text-xs text-muted-fg mt-1">{feature.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateField(feature.key as keyof SettingsData, !settings[feature.key as keyof SettingsData])}
                          className={`relative w-12 h-6 p-0.5 rounded-full overflow-hidden transition-colors ${
                            settings[feature.key as keyof SettingsData] ? 'bg-green-600 dark:bg-green-700' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                              settings[feature.key as keyof SettingsData] ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-fg">Security Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                      <Input
                        id="apiRateLimit"
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) => updateField('apiRateLimit', parseInt(e.target.value))}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => updateField('sessionTimeout', parseInt(e.target.value))}
                        placeholder="3600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                    <Input
                      id="maxUploadSize"
                      type="number"
                      value={settings.maxUploadSize}
                      onChange={(e) => updateField('maxUploadSize', parseInt(e.target.value))}
                      placeholder="50"
                    />
                  </div>
                </div>
              )}

              {/* Backup */}
              {activeTab === 'backup' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-fg">Backup Configuration</h3>

                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div>
                      <Label className="text-base">Automatic Backups</Label>
                      <p className="text-xs text-muted-fg mt-1">Automatically backup database</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField('backupEnabled', !settings.backupEnabled)}
                      className={`relative w-12 h-6 p-0.5 rounded-full overflow-hidden transition-colors ${
                        settings.backupEnabled ? 'bg-green-600 dark:bg-green-700' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                          settings.backupEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.backupEnabled && (
                    <div>
                      <Label htmlFor="backupFreq">Backup Frequency</Label>
                      <select
                        id="backupFreq"
                        value={settings.backupFrequency}
                        onChange={(e) => updateField('backupFrequency', e.target.value as any)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-bg dark:bg-surface-800 text-fg dark:text-fg-light focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="outline" onClick={loadSettings}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
