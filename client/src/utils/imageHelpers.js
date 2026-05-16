const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 10

export function validateImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPEG, PNG, or WebP image.' }
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `Image must be under ${MAX_SIZE_MB}MB.` }
  }
  return { valid: true, error: null }
}

export function createPreviewUrl(file) {
  return URL.createObjectURL(file)
}

export function revokePreviewUrl(url) {
  URL.revokeObjectURL(url)
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
