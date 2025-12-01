import { useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react'

interface FileUploadProps {
  onUploadComplete: (fileUrl: string, file: any) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
}

export default function FileUpload({ 
  onUploadComplete, 
  accept = 'image/*,.pdf,.dwg,.dxf',
  multiple = false,
  maxSize = 10 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    setError('')
    setUploading(true)

    try {
      for (const file of files) {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Max size is ${maxSize}MB`)
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('http://localhost:5000/api/upload/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Upload failed')
        }

        const data = await response.json()
        setUploadedFiles(prev => [...prev, data.file])
        onUploadComplete(data.file.url, data.file)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = async (filename: string) => {
    try {
      await fetch(`http://localhost:5000/api/upload/delete/${filename}`, {
        method: 'DELETE'
      })
      setUploadedFiles(prev => prev.filter(f => f.filename !== filename))
    } catch (err) {
      console.error('Failed to delete file:', err)
    }
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    }
    return <FileText className="h-8 w-8 text-gray-500" />
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
          dragActive
            ? 'border-eagle-blue bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eagle-blue mb-3"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-1">
              Drag and drop files here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-eagle-blue hover:text-blue-700 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500">
              {accept.includes('image') && 'Images, '}
              {accept.includes('pdf') && 'PDFs, '}
              {accept.includes('dwg') && 'CAD files '}
              (max {maxSize}MB)
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              {getFileIcon(file.mimetype)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <button
                onClick={() => removeFile(file.filename)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
