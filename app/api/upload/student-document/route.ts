import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { authorizeApiRequest } from "@/lib/auth"

const MAX_BYTES = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeApiRequest(req, "student.edit")
    if (!auth.allowed) return auth.response

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only images (JPG/PNG), PDFs, or Word documents are accepted." }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File must be smaller than 2 MB." }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const isImage = file.type.startsWith("image/")

    const result = await uploadToCloudinary(buffer, "educore/documents", {
      resource_type: isImage ? "image" : "raw",
      use_filename: true,
      unique_filename: true,
    })

    return NextResponse.json({
      url:      result.secure_url,
      publicId: result.public_id,
      mimeType: file.type,
      name:     file.name,
    })
  } catch (err: any) {
    console.error("[upload/student-document]", err)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
