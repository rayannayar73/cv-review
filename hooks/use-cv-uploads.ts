'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CVUpload } from '@/lib/supabase/types'

/**
 * Hook to fetch user's CV uploads
 */
export function useCVUploads() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['cv-uploads'],
    queryFn: async (): Promise<CVUpload[]> => {
      const { data, error } = await supabase
        .from('cv_uploads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch uploads: ${error.message}`)
      }

      return data || []
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to fetch all CV uploads (admin only)
 */
export function useAllCVUploads() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['all-cv-uploads'],
    queryFn: async (): Promise<(CVUpload & { profiles: { email: string; full_name: string | null } })[]> => {
      const { data, error } = await supabase
        .from('cv_uploads')
        .select(`
          *,
          profiles (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch all uploads: ${error.message}`)
      }

      return data || []
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get upload statistics
 */
export function useUploadStats() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['upload-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cv_uploads')
        .select('status')

      if (error) {
        throw new Error(`Failed to fetch stats: ${error.message}`)
      }

      const stats = {
        total: data.length,
        pending: data.filter(upload => upload.status === 'pending').length,
        processing: data.filter(upload => upload.status === 'processing').length,
        completed: data.filter(upload => upload.status === 'completed').length,
        failed: data.filter(upload => upload.status === 'failed').length,
      }

      return stats
    },
    staleTime: 60 * 1000, // 1 minute
  })
}