"use client"
import { useState, useTransition, useRef } from "react"
import { uploadStudentDocument, deleteStudentDocument } from "@/app/actions/student"
import { FileText, Trash2, Eye, AlertCircle, Loader2, FilePlus, Download, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DOC_TYPES = [
  "Birth Certificate",
  "Transfer Certificate",
  "Aadhaar Card",
  "Passport Photo",
  "Medical Certificate",
  "Previous Report Card",
  "Income Certificate",
  "Caste Certificate",
  "Address Proof",
  "Other",
]

interface Doc {
  name: string
  type: string
  fileData: string   // stores Cloudinary URL (field reused for compat)
  mimeType: string
  uploadedAt: string
}

interface Props {
  studentId: string
  initialDocs: Doc[]
}

export function DocumentsTab({ studentId, initialDocs }: Props) {
  const [docs, setDocs] = useState<Doc[]>(initialDocs || [])
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewDoc, setPreviewDoc] = useState<Doc | null>(null)
  const [fileError, setFileError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [uploadValues, setUploadValues] = useState({ type: "", name: "" })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("")
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setFileError("File must be smaller than 2 MB.")
      e.target.value = ""
      return
    }
    setSelectedFile(file)
    if (!uploadValues.name) {
      setUploadValues(v => ({ ...v, name: file.name.replace(/\.[^/.]+$/, "") }))
    }
  }

  const handleUpload = async () => {
    setError("")
    setSuccess("")
    if (!selectedFile) { setError("Please select a file."); return }
    if (!uploadValues.type) { setError("Please select a document type."); return }

    // Step 1: Upload file to Cloudinary via API route
    setUploading(true)
    setUploadProgress(0)

    const fd = new FormData()
    fd.append("file", selectedFile)

    let cloudinaryUrl = ""
    let mimeType = selectedFile.type

    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/upload/student-document")
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        setUploading(false)
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText)
          cloudinaryUrl = data.url || ""
          if (!cloudinaryUrl) setError(data.error || "Upload failed.")
        } else {
          const data = JSON.parse(xhr.responseText || "{}")
          setError(data.error || "Upload failed. Please try again.")
        }
        resolve()
      }
      xhr.onerror = () => {
        setUploading(false)
        setError("Network error. Please try again.")
        resolve()
      }
      xhr.send(fd)
    })

    if (!cloudinaryUrl) return

    // Step 2: Save URL to MongoDB via server action
    const saveFd = new FormData()
    saveFd.append("url",      cloudinaryUrl)
    saveFd.append("type",     uploadValues.type)
    saveFd.append("name",     uploadValues.name || selectedFile.name)
    saveFd.append("mimeType", mimeType)

    startTransition(async () => {
      const res = await uploadStudentDocument(studentId, saveFd)
      if (res?.error) {
        setError(res.error)
      } else {
        setSuccess("Document uploaded successfully!")
        const newDoc: Doc = {
          name:       uploadValues.name || selectedFile!.name,
          type:       uploadValues.type,
          fileData:   cloudinaryUrl,
          mimeType,
          uploadedAt: new Date().toISOString(),
        }
        setDocs(prev => [...prev, newDoc])
        setSelectedFile(null)
        setUploadValues({ type: "", name: "" })
        setUploadProgress(0)
        if (fileRef.current) fileRef.current.value = ""
        setTimeout(() => setSuccess(""), 3000)
      }
    })
  }

  const handleDelete = (idx: number) => {
    setIsDeleting(idx)
    startTransition(async () => {
      const res = await deleteStudentDocument(studentId, idx)
      if (res?.error) setError(res.error)
      else setDocs(prev => prev.filter((_, i) => i !== idx))
      setIsDeleting(null)
    })
  }

  const isImageUrl = (doc: Doc) =>
    doc.mimeType?.startsWith("image/") || doc.fileData?.match(/\.(jpg|jpeg|png|webp|gif)($|\?)/i)

  return (
    <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">

      {/* Upload Panel */}
      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20 flex items-center gap-2">
          <FilePlus className="w-4 h-4 text-brand-500" />
          <h3 className="font-bold text-fg">Upload New Document</h3>
        </div>
        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-3">
              ✅ {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Document Type *</Label>
              <select
                value={uploadValues.type}
                onChange={e => setUploadValues(v => ({ ...v, type: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-brand-500"
              >
                <option value="" disabled>Select type…</option>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                placeholder="e.g. Birth Certificate 2024"
                value={uploadValues.name}
                onChange={e => setUploadValues(v => ({ ...v, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>File * <span className="text-muted-fg font-normal">(max 2 MB)</span></Label>
              <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
              <Button
                type="button" variant="outline"
                className="w-full gap-2 justify-start font-normal text-left truncate"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-4 h-4 flex-shrink-0 text-muted-fg" />
                <span className="truncate">{selectedFile ? selectedFile.name : "Choose file…"}</span>
              </Button>
              {fileError && <p className="text-xs text-red-500">{fileError}</p>}
            </div>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-1">
              <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-xs text-muted-fg text-right">Uploading to Cloudinary… {uploadProgress}%</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={uploading || isPending} className="gap-2">
              {(uploading || isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading…" : isPending ? "Saving…" : "Upload Document"}
            </Button>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            <h3 className="font-bold text-fg">Uploaded Documents</h3>
          </div>
          <span className="text-xs text-muted-fg font-semibold uppercase tracking-wider">{docs.length} file{docs.length !== 1 ? "s" : ""}</span>
        </div>
        {docs.length === 0 ? (
          <div className="p-12 text-center text-muted-fg">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {docs.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-100/40 dark:hover:bg-surface-900/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {isImageUrl(doc) ? (
                    <img src={doc.fileData} alt={doc.name} className="w-10 h-10 object-cover rounded-lg" />
                  ) : (
                    <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-fg text-sm truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs bg-surface-200 dark:bg-surface-800 text-muted-fg rounded px-1.5 py-0.5 font-medium">{doc.type}</span>
                    <span className="text-xs text-muted-fg">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isImageUrl(doc) && (
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-fg hover:text-fg" onClick={() => setPreviewDoc(doc)} title="Preview">
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <a href={doc.fileData} target="_blank" rel="noopener noreferrer" title="Download / View">
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-fg hover:text-brand-600">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-fg hover:text-red-600 dark:hover:text-red-400" onClick={() => handleDelete(idx)} disabled={isDeleting === idx} title="Delete">
                    {isDeleting === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-surface-50 dark:bg-surface-950 rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <div>
                <p className="font-semibold text-fg">{previewDoc.name}</p>
                <p className="text-xs text-muted-fg">{previewDoc.type}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(null)}><X className="w-4 h-4" /></Button>
            </div>
            <img src={previewDoc.fileData} alt={previewDoc.name} className="w-full object-contain max-h-[70vh]" />
          </div>
        </div>
      )}
    </div>
  )
}
