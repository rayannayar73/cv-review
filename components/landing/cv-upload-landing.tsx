'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export function CVUploadLanding() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

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

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const file = files[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)

    try {
      // Create form data for anonymous upload
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/anonymous-review', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload CV')
      }

      const { uploadId } = await response.json()

      // Redirect to rating page with upload ID
      router.push(`/rating/${uploadId}`)

    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Try CV Review Free</CardTitle>
        <CardDescription>
          Upload your CV and get instant AI feedback - no account required
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <p className="text-xl font-medium text-gray-900 mb-2">
              Drop your CV here, or{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
            <p className="text-gray-500 mb-4">PDF files only, up to 10MB</p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <span>✓ Instant Analysis</span>
              <span>✓ Professional Feedback</span>
              <span>✓ Completely Free</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
              <FileText className="h-10 w-10 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Analyzing Your CV...
                  </>
                ) : (
                  'Get My CV Analysis'
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By uploading, you agree to our analysis. Your CV will be processed securely.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}