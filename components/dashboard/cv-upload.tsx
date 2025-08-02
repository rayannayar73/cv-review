'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook to handle CV upload and processing
 */
function useUploadCV() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (file: File) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to upload files')

      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `cvs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, file)

      if (uploadError) throw new Error('Failed to upload file')

      // 2. Create CV upload record
      const { data: upload, error: dbError } = await supabase
        .from('cv_uploads')
        .insert({
          user_id: user.id,  // Add the missing user_id field
          file_name: file.name,
          file_path: filePath,
          original_text: '', // Will be filled by the API
          status: 'pending',
        })
        .select()
        .single()

      if (dbError) throw new Error(`Failed to save upload record: ${dbError.message}`)

      // 3. Trigger processing via API
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId: upload.id,
          filePath,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process CV')
      }

      return upload
    },
    onSuccess: () => {
      toast({
        title: 'CV uploaded successfully!',
        description: 'Your CV is being processed. You will see the feedback shortly.',
      })
      queryClient.invalidateQueries({ queryKey: ['cv-uploads'] })
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export default function CVUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadCV()

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

  const handleUpload = () => {
    if (!selectedFile) return
    uploadMutation.mutate(selectedFile)
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const { toast } = useToast()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your CV</CardTitle>
        <CardDescription>
          Upload your resume in PDF format to get AI-powered feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your CV here, or{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">PDF files only, up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={uploadMutation.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="flex-1"
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload & Analyze'}
              </Button>
              <Button variant="outline" onClick={clearFile} disabled={uploadMutation.isPending}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}