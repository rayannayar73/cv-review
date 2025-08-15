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
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:h-16 gap-4 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CV Review</h1>
              <p className="text-xs sm:text-sm text-gray-500">Retour sur CV propulsé par l'IA</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md w-full sm:w-auto">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full sm:w-auto text-xs sm:text-sm py-1.5 h-auto"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="hidden sm:block">
            <StatsCards />
          </div>

          {/* Upload Section */}
          <CVUpload />

          {/* Uploads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vos CV téléversés</CardTitle>
              <CardDescription>
                Affichez et gérez vos CV téléversés et leurs retours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CVUploadsTable data={uploads || []} isLoading={isLoading} />
            </CardContent>
          </Card>

          {/* Portfolio Service CTA - Dashboard Style */}
          <Card className="bg-gradient-to-r from-purple-900 to-blue-900 text-white overflow-hidden">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                </div>
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                      Crée ton portfolio professionnel avec moi
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                      Après avoir optimisé ton CV, passe à l'étape suivante. Je crée des portfolios web qui captent l'attention des recruteurs et mettent en valeur ton parcours professionnel de manière interactive.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <a
                        href="https://ravelojaona-rayan.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-purple-900 rounded-full text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors"
                      >
                        Explorer mon portfolio
                      </a>
                      <a
                        href="https://wa.me/261343139059"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-white text-white rounded-full text-sm sm:text-base font-medium hover:bg-white/10 transition-colors"
                      >
                        Me contacter
                      </a>
                    </div>
                  </div>
                  <div className="w-full md:w-auto text-left md:text-right space-y-2 sm:space-y-3 bg-white/10 p-4 sm:p-6 rounded-xl">
                    <h4 className="text-base sm:text-lg font-semibold text-purple-200">Contact Direct</h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      <a href="mailto:ry.ravelojaona@gmail.com" className="block text-sm sm:text-base text-blue-200 hover:text-white transition-colors">
                        ry.ravelojaona@gmail.com
                      </a>
                      <a href="tel:+261343139059" className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors">
                        +261 34 31 390 59
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}