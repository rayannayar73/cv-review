'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ArrowRight, CheckCircle, AlertCircle, Lightbulb, Mail, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import type { CVUpload, CVFeedback } from '@/lib/supabase/types'
import { getScoreColor } from '@/lib/utils'

interface RatingClientProps {
  upload: CVUpload
}

export function RatingClient({ upload }: RatingClientProps) {
  const [email, setEmail] = useState('')
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const feedback = upload.feedback as unknown as CVFeedback

  const getScoreMessage = (score: number) => {
    if (score >= 8) return 'Excellent CV ! 🎉'
    if (score >= 6) return 'Bon CV avec des marges d’amélioration'
    return 'Votre CV nécessite des améliorations importantes'
  }

  const handleCreateAccount = async () => {
    if (!email) {
      toast({
        title: 'E‑mail requis',
        description: 'Veuillez saisir votre adresse e‑mail',
        variant: 'destructive',
      })
      return
    }

    setIsCreatingAccount(true)

    try {
      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8), // Temporary password
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (signUpError) throw signUpError

      toast({
        title: 'Compte créé !',
        description: 'Vérifiez votre e‑mail pour confirmer votre compte, puis connectez-vous pour accéder à votre tableau de bord.',
      })

      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error: any) {
      toast({
        title: 'Erreur lors de la création du compte',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsCreatingAccount(false)
    }
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Analyse en cours</CardTitle>
            <CardDescription>
              Votre CV est en cours d’analyse. Veuillez patienter un instant…
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CV Review</span>
            </div>
            <Button variant="ghost" onClick={() => router.push('/')}>
              ← Retour à l’accueil
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Score Display */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg border-4 border-gray-100 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{feedback.overall_score}</div>
              <div className="text-sm text-gray-500">sur 10</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getScoreMessage(feedback.overall_score)}
          </h1>
          
          <Badge className={`text-lg px-4 py-2 ${getScoreColor(feedback.overall_score)}`}>
            <Star className="h-4 w-4 mr-2" />
            Score du CV : {feedback.overall_score}/10
          </Badge>
        </div>

        {/* Quick Preview of Feedback */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                Forces clés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.strengths.slice(0, 3).map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
                {feedback.strengths.length > 3 && (
                  <li className="text-gray-500 text-sm">
                    +{feedback.strengths.length - 3} autres informations disponibles
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                Points à améliorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.areas_for_improvement.slice(0, 3).map((area, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
                {feedback.areas_for_improvement.length > 3 && (
                  <li className="text-gray-500 text-sm">
                    +{feedback.areas_for_improvement.length - 3} autres suggestions disponibles
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Évaluation globale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed">{feedback.summary}</p>
          </CardContent>
        </Card>
        
        {/* Email Capture CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Vous voulez l’analyse complète&nbsp;?</CardTitle>
            <CardDescription className="text-blue-100">
              Obtenez un retour détaillé, des suggestions spécifiques, une analyse des mots-clés et enregistrez vos résultats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showEmailCapture ? (
              <div className="text-center">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                    <h4 className="font-semibold">Suggestions détaillées</h4>
                    <p className="text-sm text-blue-100">Améliorations section par section</p>
                  </div>
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-green-300" />
                    <h4 className="font-semibold">Analyse des mots-clés</h4>
                    <p className="text-sm text-blue-100">Conseils d’optimisation ATS</p>
                  </div>
                  <div className="text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                    <h4 className="font-semibold">Suivi des progrès</h4>
                    <p className="text-sm text-blue-100">Enregistrez et comparez les versions</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setShowEmailCapture(true)}
                >
                  Débloquer l’analyse complète
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Adresse e‑mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="bg-white text-gray-900"
                  />
                </div>
                <div className="flex space-x-4">
                  <Button
                    onClick={handleCreateAccount}
                    disabled={isCreatingAccount}
                    className="flex-1 bg-white text-blue-600 hover:bg-gray-100"
                  >
                    {isCreatingAccount ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2" />
                        Création du compte…
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Créer un compte gratuit
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                    onClick={() => setShowEmailCapture(false)}
                  >
                    Annuler
                  </Button>
                </div>
                <p className="text-xs text-blue-100 text-center">
                  Nous vous enverrons un e‑mail de confirmation. Pas de spam, désinscription à tout moment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Service CTA */}
        <Card className="mt-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-2 border-indigo-100">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-indigo-900">
                  Transformez votre CV en Portfolio Interactif
                </h3>
                <p className="text-gray-600">
                  Démarquez-vous avec un portfolio web professionnel qui raconte votre histoire. En tant que développeur fullstack, je crée des sites personnalisés qui mettent en valeur vos compétences uniques.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://ravelojaona-rayan.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Voir un exemple
                  </a>
                  <a
                    href="https://wa.me/261343139059"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Discuter de mon projet
                  </a>
                </div>
              </div>
              <div className="text-center md:text-right space-y-3">
                <div className="flex flex-col items-center md:items-end space-y-2">
                  <a href="mailto:ry.ravelojaona@gmail.com" className="text-indigo-600 hover:text-indigo-800">
                    ry.ravelojaona@gmail.com
                  </a>
                  <a href="tel:+261343139059" className="text-gray-600 hover:text-gray-800">
                    +261 34 31 390 59
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Try Again CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Vous avez un autre CV à analyser&nbsp;?</p>
          <Button 
            onClick={() => router.push('/login')}
          >
            Se connecter au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  )
}