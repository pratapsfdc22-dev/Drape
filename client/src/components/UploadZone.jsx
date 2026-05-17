import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { useDrape } from '../context/DrapeContext.jsx'
import {
  validateImage,
  createPreviewUrl,
  revokePreviewUrl,
  formatFileSize,
} from '../utils/imageHelpers.js'

export default function UploadZone() {
  const { uploadedFile, setUploadedFile, previewURL, setPreviewURL } = useDrape()
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [uploadError, setUploadError] = useState(null)

  // Clear local display state when context is reset externally (e.g. resetAll())
  useEffect(() => {
    if (!uploadedFile) {
      setFileName('')
      setFileSize('')
    }
  }, [uploadedFile])

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const code = rejectedFiles[0].errors[0]?.code
        if (code === 'file-too-large') {
          setUploadError('Image must be under 10 MB.')
        } else if (code === 'file-invalid-type') {
          setUploadError('Please upload a JPEG, PNG, or WebP image.')
        } else {
          setUploadError('Could not read that file. Please try another.')
        }
        return
      }

      const file = acceptedFiles[0]
      if (!file) return

      const { valid, error } = validateImage(file)
      if (!valid) {
        setUploadError(error)
        return
      }

      // Revoke previous object URL before creating a new one
      if (previewURL) revokePreviewUrl(previewURL)

      setPreviewURL(createPreviewUrl(file))
      setUploadedFile(file)
      setFileName(file.name)
      setFileSize(formatFileSize(file.size))
      setUploadError(null)
    },
    [previewURL, setPreviewURL, setUploadedFile],
  )

  function handleReset(e) {
    e.stopPropagation()
    if (previewURL) revokePreviewUrl(previewURL)
    setPreviewURL(null)
    setUploadedFile(null)
    // fileName/fileSize cleared by [uploadedFile] effect
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
    noClick: !!previewURL,
  })

  const hasPreview = !!previewURL

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        aria-label={
          hasPreview
            ? `Photo selected: ${fileName}. Use the Change Photo button to select a different image.`
            : 'Upload zone. Click or drag and drop a photo here.'
        }
        className={[
          'relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200',
          !hasPreview && 'cursor-pointer',
          isDragActive
            ? 'border-gold bg-gold/5 shadow-[0_0_0_4px_rgba(201,168,76,0.12)]'
            : uploadError
              ? 'border-red-400'
              : hasPreview
                ? 'border-gold/40'
                : 'border-charcoal/20 hover:border-gold/50 hover:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]',
        ].join(' ')}
      >
        <input {...getInputProps()} aria-label="Select a photo file from your device" />

        <AnimatePresence mode="wait">
          {hasPreview ? (
            // ── Preview state ──
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              <img
                src={previewURL}
                alt="Your uploaded photo preview"
                className="w-full max-h-96 object-cover object-top"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent px-4 pt-10 pb-4">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium text-cream truncate leading-tight">
                      {fileName}
                    </p>
                    <p className="font-body text-xs text-cream/55 mt-0.5">{fileSize}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Remove photo and choose a different one"
                    className="shrink-0 px-3.5 py-1.5 rounded-full bg-cream/10 border border-cream/20
                               font-body text-cream text-xs font-medium
                               hover:bg-cream/20 transition-colors duration-150 cursor-pointer"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // ── Default / drag-active state ──
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4 py-12 px-6 text-center"
            >
              <motion.div
                animate={isDragActive ? { scale: 1.12, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200
                  ${isDragActive ? 'bg-gold/20' : 'bg-gold/10'}`}
              >
                <svg
                  className={`w-7 h-7 transition-colors duration-200 ${isDragActive ? 'text-gold' : 'text-gold/70'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </motion.div>

              <div>
                <p className="font-body font-semibold text-charcoal text-sm">
                  {isDragActive
                    ? 'Drop to add your photo'
                    : 'Drop a full-body photo or click to browse'}
                </p>
                <p className="font-body text-charcoal/45 text-xs mt-1.5 leading-relaxed">
                  Head to toe · facing the camera · good lighting
                </p>
                <p className="font-body text-charcoal/30 text-xs mt-1">
                  JPEG, PNG or WebP · Up to 10 MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {uploadError && (
          <motion.p
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-2 flex items-center gap-1.5 font-body text-sm text-red-600"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            {uploadError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
