'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CVUpload from '@/components/dashboard/cv-upload'
import { CVUploadsTable } from '@/components/dashboard/cv-uploads-table'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { useCVUploads } from '@/hooks/use-cv-uploads'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function DashboardClient() {
  const { data: uploads, isLoading } = useCVUploads()
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CV Review</h1>
              <p className="text-sm text-gray-500">AI-powered resume feedback</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <StatsCards />

          {/* Upload Section */}
          <CVUpload />

          {/* Uploads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your CV Uploads</CardTitle>
              <CardDescription>
                View and manage your uploaded CVs and their feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CVUploadsTable data={uploads || []} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}