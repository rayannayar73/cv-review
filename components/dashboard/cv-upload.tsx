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
      if (!user) throw new Error("Vous devez être connecté pour téléverser des fichiers")

      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `cvs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, file)

      if (uploadError) throw new Error('Échec du téléversement du fichier')

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

      if (dbError) throw new Error(`Échec de l’enregistrement du téléversement : ${dbError.message}`)

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
        throw new Error('Échec du traitement du CV')
      }

      return upload
    },
    onSuccess: () => {
      toast({
        title: 'CV téléversé avec succès !',
        description: 'Votre CV est en cours de traitement. Vous verrez le retour sous peu.',
      })
      queryClient.invalidateQueries({ queryKey: ['cv-uploads'] })
    },
    onError: (error: Error) => {
      toast({
        title: 'Échec du téléversement',
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
    <Card className="border-0 shadow-sm">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Téléversez votre CV</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Téléversez votre CV au format PDF pour obtenir un retour propulsé par l'IA
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Déposez votre CV ici, ou{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                parcourez
              </button>
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Fichiers PDF uniquement, jusqu'à 10 Mo</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3 p-3 sm:p-4 border rounded-lg">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate">{selectedFile.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={uploadMutation.isPending}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="w-full sm:flex-1 text-sm sm:text-base py-2 h-auto"
              >
                {uploadMutation.isPending ? 'Téléversement…' : 'Téléverser et analyser'}
              </Button>
              <Button 
                variant="outline" 
                onClick={clearFile} 
                disabled={uploadMutation.isPending}
                className="w-full sm:w-auto text-sm sm:text-base py-2 h-auto"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}