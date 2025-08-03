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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('cv_uploads')
        .select('*')
        .eq('user_id', user.id)  // Filter by current user
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
    queryFn: async (): Promise<(CVUpload & { profiles: { email: string; full_name: string | null } | null })[]> => {
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

      // Transform the data to handle missing profiles
      const transformedData = (data || []).map(item => ({
        ...item,
        profiles: item.profiles && typeof item.profiles === 'object' && 'email' in item.profiles 
          ? item.profiles 
          : null
      }))

      return transformedData
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get upload statistics for current user
 */
export function useUploadStats() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['upload-stats'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('cv_uploads')
        .select('status')
        .eq('user_id', user.id)  // Filter by current user

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