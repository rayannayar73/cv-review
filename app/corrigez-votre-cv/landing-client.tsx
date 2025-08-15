'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Upload, Users, Zap, FileText, ArrowRight } from 'lucide-react'
import { CVUploadLanding } from '@/components/landing/cv-upload-landing'

export function LandingClient() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">CV Review</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/login')}
                className="text-sm sm:text-base px-2 sm:px-4"
              >
                Se connecter
              </Button>
              <Button 
                onClick={() => router.push('/login')}
                className="hidden sm:inline-flex text-sm sm:text-base px-2 sm:px-4"
              >
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            ✨ Propulsé par l'IA • Entièrement gratuit
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Corrigez votre CV <br />
            <span className="text-blue-600">en quelques minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Téléchargez votre CV et recevez un retour détaillé grâce à l'IA.
          </p>
          
          {/* Upload Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <CVUploadLanding />
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Évaluation du CV</h3>
              <p className="text-gray-600 text-sm">Obtenez une note globale de 1 à 10 basée sur les standards du secteur</p>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Retour détaillé</h3>
              <p className="text-gray-600 text-sm">Suggestions spécifiques pour chaque section de votre CV</p>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tableau de bord client</h3>
              <p className="text-gray-600 text-sm">Suivez toutes vos soumissions et améliorations de CV</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir CV Review ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Analyse professionnelle du CV qui vous aide à vous démarquer de la concurrence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="space-y-2">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                <CardTitle className="text-lg sm:text-xl">Analyse instantanée</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Obtenez un retour en moins de 2 minutes grâce à une technologie IA avancée
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="space-y-2">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                <CardTitle className="text-lg sm:text-xl">Normes professionnelles</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Évalué selon les meilleures pratiques du secteur et la compatibilité ATS
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="space-y-2">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                <CardTitle className="text-lg sm:text-xl">Informations exploitables</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Suggestions spécifiques avec niveaux de priorité pour un impact maximal
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="space-y-2">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                <CardTitle className="text-lg sm:text-xl">Téléchargement facile</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Glissez-déposez simplement votre CV PDF - aucun compte requis pour essayer
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="space-y-2">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
                <CardTitle className="text-lg sm:text-xl">Analyse des mots-clés</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Optimisez pour les systèmes de suivi des candidatures avec des suggestions de mots-clés
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="space-y-2">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500" />
                <CardTitle className="text-lg sm:text-xl">Suivi des progrès</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Suivez les améliorations sur plusieurs versions de CV au fil du temps
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche
            </h2>
            <p className="text-xl text-gray-600">
              Obtenez un retour professionnel sur votre CV en 3 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 sm:px-6">
            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-lg sm:text-xl font-bold">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Téléchargez votre CV</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Glissez-déposez votre CV PDF ou cliquez pour parcourir. Aucun compte nécessaire pour essayer.
              </p>
            </div>

            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-lg sm:text-xl font-bold">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Analyse IA</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Notre IA analyse votre CV pour le contenu, la structure, les mots-clés et la mise en forme.
              </p>
            </div>

            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-lg sm:text-xl font-bold">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Recevez un retour</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Recevez un retour détaillé avec des suggestions exploitables pour améliorer votre CV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Prêt à améliorer votre CV ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8">
            Rejoignez des milliers de professionnels qui ont amélioré leur CV grâce à notre retour alimenté par l'IA
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6"
            onClick={() => router.push('/login')}
          >
            Essayez-le gratuitement maintenant
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}