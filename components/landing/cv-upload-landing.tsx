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
        title: 'Type de fichier invalide',
        description: 'Veuillez télécharger un fichier PDF.',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'Veuillez télécharger un fichier de moins de 10 Mo.',
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
        throw new Error('Échec du téléversement du CV')
      }

      const { uploadId } = await response.json()

      // Redirect to rating page with upload ID
      router.push(`/rating/${uploadId}`)

    } catch (error: any) {
      toast({
        title: 'Échec du téléversement',
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
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Essayez CV Review gratuitement</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Téléchargez votre CV et obtenez un retour instantané de l'IA – aucun compte requis
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 sm:p-12 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4 sm:mb-6" />
            <p className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              Déposez votre CV ici, ou{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                parcourez
              </button>
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-4">Fichiers PDF uniquement, jusqu'à 10 Mo</p>
            <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-gray-500">
              <span>✓ Analyse instantanée</span>
              <span>✓ Retour professionnel</span>
              <span>✓ Essai gratuit</span>
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg bg-gray-50">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={isUploading}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-3 sm:py-4"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    <span className="truncate">Analyse de votre CV…</span>
                  </>
                ) : (
                  'Obtenir l\'analyse de mon CV'
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500 px-2">
                  En téléversant, vous acceptez notre analyse. Votre CV sera traité en toute sécurité.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}