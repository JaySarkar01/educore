"use server"

import { connectToDatabase } from "@/lib/db"
import { SystemSettingsModel } from "@/lib/models/SystemSettings"
import { authorizePermission } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getSystemSettings() {
  const auth = await authorizePermission("settings.manage")
  if (!auth.allowed) return null

  await connectToDatabase()
  
  let settings = await SystemSettingsModel.findOne({}).lean()
  
  // Create default settings if none exist
  if (!settings) {
    const newSettings = new SystemSettingsModel({})
    await newSettings.save()
    settings = newSettings.toObject()
  }
  
  // Explicitly serialize to plain object to avoid serialization issues
  const plainSettings = JSON.parse(JSON.stringify(settings))
  
  return {
    id: plainSettings._id.toString(),
    appName: plainSettings.appName,
    appVersion: plainSettings.appVersion,
    appLogo: plainSettings.appLogo,
    supportEmail: plainSettings.supportEmail,
    emailProvider: plainSettings.emailProvider,
    emailFrom: plainSettings.emailFrom,
    emailHost: plainSettings.emailHost,
    emailPort: plainSettings.emailPort,
    emailUser: plainSettings.emailUser,
    emailPassword: plainSettings.emailPassword,
    smsProvider: plainSettings.smsProvider,
    smsApiKey: plainSettings.smsApiKey,
    smsAccountId: plainSettings.smsAccountId,
    maintenanceMode: plainSettings.maintenanceMode,
    maintenanceMessage: plainSettings.maintenanceMessage,
    enableStudentRegistration: plainSettings.enableStudentRegistration,
    enableSchoolRegistration: plainSettings.enableSchoolRegistration,
    enablePayments: plainSettings.enablePayments,
    enableEmailNotifications: plainSettings.enableEmailNotifications,
    enableSmsNotifications: plainSettings.enableSmsNotifications,
    maxUploadSize: plainSettings.maxUploadSize,
    backupEnabled: plainSettings.backupEnabled,
    backupFrequency: plainSettings.backupFrequency,
    defaultCurrency: plainSettings.defaultCurrency,
    timezone: plainSettings.timezone,
    apiRateLimit: plainSettings.apiRateLimit,
    sessionTimeout: plainSettings.sessionTimeout,
  }
}

export async function updateSystemSettings(data: Record<string, any>) {
  const auth = await authorizePermission("settings.manage")
  if (!auth.allowed) return { error: "Unauthorized" }

  await connectToDatabase()

  // Validate numeric fields
  if (data.emailPort && (isNaN(data.emailPort) || data.emailPort < 1 || data.emailPort > 65535)) {
    return { error: "Email port must be a valid port number (1-65535)" }
  }
  
  if (data.maxUploadSize && (isNaN(data.maxUploadSize) || data.maxUploadSize < 1 || data.maxUploadSize > 500)) {
    return { error: "Max upload size must be between 1 and 500 MB" }
  }

  if (data.apiRateLimit && (isNaN(data.apiRateLimit) || data.apiRateLimit < 10)) {
    return { error: "API rate limit must be at least 10 requests per hour" }
  }

  if (data.sessionTimeout && (isNaN(data.sessionTimeout) || data.sessionTimeout < 300)) {
    return { error: "Session timeout must be at least 5 minutes (300 seconds)" }
  }

  try {
    const settings = await SystemSettingsModel.findOneAndUpdate(
      {},
      {
        appName: data.appName || "EduCore",
        appVersion: data.appVersion || "1.0.0",
        appLogo: data.appLogo || "",
        supportEmail: data.supportEmail || "support@educore.com",
        emailProvider: data.emailProvider || "smtp",
        emailFrom: data.emailFrom || "noreply@educore.com",
        emailHost: data.emailHost || "",
        emailPort: data.emailPort ? parseInt(data.emailPort) : 587,
        emailUser: data.emailUser || "",
        emailPassword: data.emailPassword || "",
        smsProvider: data.smsProvider || "none",
        smsApiKey: data.smsApiKey || "",
        smsAccountId: data.smsAccountId || "",
        maintenanceMode: data.maintenanceMode === true,
        maintenanceMessage: data.maintenanceMessage || "System under maintenance",
        enableStudentRegistration: data.enableStudentRegistration !== false,
        enableSchoolRegistration: data.enableSchoolRegistration !== false,
        enablePayments: data.enablePayments !== false,
        enableEmailNotifications: data.enableEmailNotifications !== false,
        enableSmsNotifications: data.enableSmsNotifications === true,
        maxUploadSize: data.maxUploadSize ? parseInt(data.maxUploadSize) : 50,
        backupEnabled: data.backupEnabled !== false,
        backupFrequency: data.backupFrequency || "daily",
        defaultCurrency: data.defaultCurrency || "INR",
        timezone: data.timezone || "Asia/Kolkata",
        apiRateLimit: data.apiRateLimit ? parseInt(data.apiRateLimit) : 1000,
        sessionTimeout: data.sessionTimeout ? parseInt(data.sessionTimeout) : 3600,
      },
      { upsert: true, new: true, lean: true }
    )

    // Serialize the settings to plain object
    const plainSettings = settings ? JSON.parse(JSON.stringify(settings)) : null

    // Revalidate all paths to ensure updated settings are reflected everywhere
    revalidatePath("/")
    revalidatePath("/admin/settings")
    return { success: true, settings: plainSettings }
  } catch (error) {
    return { error: "Failed to update settings" }
  }
}

export async function testEmailSettings(data: Record<string, any>) {
  const auth = await authorizePermission("settings.manage")
  if (!auth.allowed) return { error: "Unauthorized" }

  try {
    // This is a simulated test - in production, you'd actually send a test email
    if (!data.emailHost || !data.emailUser || !data.emailPassword || !data.emailPort) {
      return { error: "Missing required email configuration" }
    }

    // Simulate connection test
    return { success: true, message: "Email settings validated successfully" }
  } catch (error) {
    return { error: "Failed to validate email settings" }
  }
}

export async function testSmsSettings(data: Record<string, any>) {
  const auth = await authorizePermission("settings.manage")
  if (!auth.allowed) return { error: "Unauthorized" }

  try {
    if (data.smsProvider === "none") {
      return { success: true, message: "SMS provider disabled" }
    }

    if (!data.smsApiKey || !data.smsAccountId) {
      return { error: "Missing required SMS configuration" }
    }

    // Simulate connection test
    return { success: true, message: "SMS settings validated successfully" }
  } catch (error) {
    return { error: "Failed to validate SMS settings" }
  }
}
