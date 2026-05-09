import mongoose, { Schema, Document } from "mongoose"

export interface ISystemSettings extends Document {
  appName: string
  appVersion: string
  appLogo: string
  supportEmail: string
  
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun'
  emailFrom: string
  emailHost?: string
  emailPort?: number
  emailUser?: string
  emailPassword?: string
  
  smsProvider: 'twilio' | 'aws' | 'none'
  smsApiKey?: string
  smsAccountId?: string
  
  maintenanceMode: boolean
  maintenanceMessage?: string
  
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
  
  createdAt: Date
  updatedAt: Date
}

const SystemSettingsSchema = new Schema<ISystemSettings>(
  {
    appName: { type: String, default: 'EduCore', required: true },
    appVersion: { type: String, default: '1.0.0', required: true },
    appLogo: { type: String, default: '', required: false },
    supportEmail: { type: String, default: 'support@educore.com', required: true },
    
    emailProvider: { type: String, enum: ['smtp', 'sendgrid', 'mailgun'], default: 'smtp' },
    emailFrom: { type: String, default: 'noreply@educore.com', required: true },
    emailHost: { type: String, default: '' },
    emailPort: { type: Number, default: 587 },
    emailUser: { type: String, default: '' },
    emailPassword: { type: String, default: '' },
    
    smsProvider: { type: String, enum: ['twilio', 'aws', 'none'], default: 'none' },
    smsApiKey: { type: String, default: '' },
    smsAccountId: { type: String, default: '' },
    
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'System under maintenance. Please try again later.' },
    
    enableStudentRegistration: { type: Boolean, default: true },
    enableSchoolRegistration: { type: Boolean, default: true },
    enablePayments: { type: Boolean, default: true },
    enableEmailNotifications: { type: Boolean, default: true },
    enableSmsNotifications: { type: Boolean, default: false },
    
    maxUploadSize: { type: Number, default: 50 }, // in MB
    backupEnabled: { type: Boolean, default: true },
    backupFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    
    defaultCurrency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    
    apiRateLimit: { type: Number, default: 1000 }, // requests per hour
    sessionTimeout: { type: Number, default: 3600 }, // in seconds
  },
  { timestamps: true }
)

export const SystemSettingsModel =
  mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema)
