"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, X, ImageIcon, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface CloudinaryUploaderProps {
  /** API endpoint, e.g. "/api/upload/student-photo" */
  endpoint: string
  /** Accepted MIME types for the file picker, e.g. "image/*" */
  accept?: string
  /** Max file size in MB (default 2) */
  maxMB?: number
  /** Label shown in the drop zone */
  label?: string
  /** Current uploaded URL (controlled) */
  value?: string
  /** Called when upload completes successfully */
  onChange?: (url: string) => void
  /** Called when the user removes the uploaded file */
  onRemove?: () => void
  /** Show a round avatar-style preview instead of a rectangle */
  avatarMode?: boolean
}

export function CloudinaryUploader({
  endpoint,
  accept = "image/*",
  maxMB = 2,
  label = "Drag & drop or click to upload",
  value,
  onChange,
  onRemove,
  avatarMode = false,
}: CloudinaryUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const maxBytes = maxMB * 1024 * 1024

  // Sync external value
  useEffect(() => {
    if (value !== undefined) setPreview(value || null)
  }, [value])

  const isImage = (mimeType: string) => mimeType.startsWith("image/")

  const uploadFile = useCallback(
    (file: File) => {
      setError("")
      setDone(false)
      setProgress(0)

      if (file.size > maxBytes) {
        setError(`File must be smaller than ${maxMB} MB.`)
        return
      }

      // Show local preview immediately for images
      if (isImage(file.type)) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      }

      setUploading(true)
      const fd = new FormData()
      fd.append("file", file)

      const xhr = new XMLHttpRequest()
      xhr.open("POST", endpoint)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
      }

      xhr.onload = () => {
        setUploading(false)
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText)
          if (data.url) {
            setPreview(data.url)
            setDone(true)
            onChange?.(data.url)
          } else {
            setError(data.error || "Upload failed.")
            setPreview(null)
          }
        } else {
          const data = JSON.parse(xhr.responseText || "{}")
          setError(data.error || "Upload failed. Please try again.")
          setPreview(null)
        }
      }

      xhr.onerror = () => {
        setUploading(false)
        setError("Network error. Please try again.")
      }

      xhr.send(fd)
    },
    [endpoint, maxBytes, maxMB, onChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setDone(false)
    setProgress(0)
    setError("")
    if (inputRef.current) inputRef.current.value = ""
    onRemove?.()
    onChange?.("")
  }

  const isPdf = preview && !preview.startsWith("data:image") && preview.includes("cloudinary") && !preview.match(/\.(jpg|jpeg|png|webp|gif)($|\?)/i)

  return (
    <div className="space-y-2">
      {preview ? (
        /* ── Preview state ────────────────────────────────────────────────── */
        <div className={`relative group ${avatarMode ? "inline-block" : ""}`}>
          {isImage(preview.split(";")[0]?.replace("data:", "") || "") || preview.startsWith("https://res.cloudinary.com") && !isPdf ? (
            <img
              src={preview}
              alt="Preview"
              className={
                avatarMode
                  ? "w-24 h-24 rounded-full object-cover border-4 border-border shadow-md"
                  : "w-full max-h-48 object-contain rounded-xl border border-border shadow-sm"
              }
            />
          ) : (
            <div className="flex items-center gap-3 p-4 bg-surface-100 dark:bg-surface-900 rounded-xl border border-border">
              <FileText className="w-8 h-8 text-brand-500 flex-shrink-0" />
              <a href={preview} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 underline truncate">
                View uploaded file
              </a>
            </div>
          )}
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className={`absolute ${avatarMode ? "-top-1 -right-1" : "top-2 right-2"} w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors opacity-0 group-hover:opacity-100`}
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {done && (
            <span className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <CheckCircle className="w-3 h-3" /> Uploaded
            </span>
          )}
        </div>
      ) : (
        /* ── Drop zone ────────────────────────────────────────────────────── */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all cursor-pointer select-none
            ${avatarMode ? "w-24 h-24 rounded-full" : "p-8 min-h-[120px]"}
            ${dragging
              ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
              : "border-border hover:border-brand-400 hover:bg-surface-100/50 dark:hover:bg-surface-900/30"
            }
            ${uploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          ) : avatarMode ? (
            <ImageIcon className="w-8 h-8 text-muted-fg opacity-50" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <p className="text-sm text-muted-fg text-center leading-snug">
                <span className="font-semibold text-brand-600 dark:text-brand-400">{label}</span>
              </p>
              <p className="text-xs text-muted-fg">Max {maxMB} MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-fg text-right">{progress}%</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
        </p>
      )}

      {/* Change button when preview is set */}
      {preview && !uploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 text-xs h-7"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-3 h-3" /> Change file
        </Button>
      )}
      {preview && <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />}
    </div>
  )
}
