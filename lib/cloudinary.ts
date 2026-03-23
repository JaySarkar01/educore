import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

export interface UploadResult {
  secure_url: string
  public_id: string
  format: string
  bytes: number
}

/**
 * Upload a file buffer to Cloudinary.
 *
 * @param buffer   - The file contents as a Node.js Buffer.
 * @param folder   - Cloudinary folder, e.g. "educore/students".
 * @param options  - Extra upload options (resource_type, allowed_formats…).
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  options: Record<string, any> = {}
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        ...options,
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"))
        resolve({
          secure_url: result.secure_url,
          public_id:  result.public_id,
          format:     result.format,
          bytes:      result.bytes,
        })
      }
    )
    uploadStream.end(buffer)
  })
}

export default cloudinary
