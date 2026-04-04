"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SelectContextType = {
  value: string
  onChange: (v: string) => void
  open: boolean
  setOpen: (v: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

export function Select({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const ctx = React.useMemo(() => ({ value, onChange: onValueChange, open, setOpen }), [value, onValueChange, open])
  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return <div>{children}</div>
  return (
    <button type="button" onClick={() => ctx.setOpen(!ctx.open)} className={cn("w-full text-left px-3 py-2 rounded-md", className)}>
      {children}
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return <span>{placeholder}</span>
  return <span>{ctx.value && ctx.value !== "All" ? ctx.value : placeholder}</span>
}

export function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return <div className={className}>{children}</div>
  if (!ctx.open) return null
  return (
    <div className={cn("mt-2 bg-white rounded-lg shadow-lg z-50 p-2", className)} role="listbox">
      {children}
    </div>
  )
}

export function SelectItem({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return <div>{children}</div>
  return (
    <div
      role="option"
      onClick={() => {
        ctx.onChange(value)
        ctx.setOpen(false)
      }}
      className={cn("px-3 py-2 rounded-md hover:bg-slate-100 cursor-pointer text-sm", className)}
    >
      {children}
    </div>
  )
}
