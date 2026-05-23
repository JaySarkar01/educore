"use client"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"

interface SiteMaintenanceNoticeProps {
  maintenanceMode: boolean
  maintenanceMessage: string
}

export function SiteMaintenanceNotice({ maintenanceMode, maintenanceMessage }: SiteMaintenanceNoticeProps) {
  const [dismissed, setDismissed] = useState(false)

  if (!maintenanceMode || dismissed) return null

  return (
    <div className="fixed bottom-6 left-6 z-60 max-w-sm rounded-2xl border border-amber-200/80 bg-white/95 p-4 shadow-2xl shadow-amber-500/10 backdrop-blur dark:border-amber-500/30 dark:bg-surface-950/95">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-fg">EduCore Maintenance</p>
              <p className="mt-1 text-sm leading-5 text-muted-fg">{maintenanceMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-full p-1 text-muted-fg transition-colors hover:bg-surface-100 hover:text-fg dark:hover:bg-surface-800"
              aria-label="Dismiss maintenance notice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}