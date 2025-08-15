import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { RatingClient } from './rating-client'

interface RatingPageProps {
  params: {
    uploadId: string
  }
}

export default async function RatingPage({ params }: RatingPageProps) {
  const supabase = createClient()

  // Fetch the CV upload data
  const { data: upload, error } = await supabase
    .from('cv_uploads')
    .select('*')
    .eq('id', params.uploadId)
    .single()

  if (error || !upload) {
    notFound()
  }

  return <RatingClient upload={upload} />
}