'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Lightbulb, Star } from 'lucide-react'
import type { CVUpload, CVFeedback } from '@/lib/supabase/types'
import { getScoreColor } from '@/lib/utils'

interface FeedbackDialogProps {
  upload: CVUpload
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ upload, open, onOpenChange }: FeedbackDialogProps) {
  if (!upload.feedback || upload.status !== 'completed') {
    return null
  }

  const feedback = upload.feedback as unknown as CVFeedback

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 sm:gap-3">
            <span className="text-left text-base sm:text-lg font-semibold truncate">
              Note de votre CV: 
            </span>
            <Badge className={`${getScoreColor(feedback.overall_score)} whitespace-nowrap`}>
              <Star className="h-3 w-3 mr-1" />
              {feedback.overall_score}/10
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Summary */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Évaluation globale</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <p className="text-sm sm:text-base text-gray-700">{feedback.summary}</p>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg flex items-center">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
                Points à améliorer
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <ul className="space-y-3">
                {feedback.areas_for_improvement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specific Suggestions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                Corrections à faire
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4">
                {feedback.specific_suggestions.map((suggestion, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-3 sm:pl-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
                      <h4 className="font-medium text-sm sm:text-base text-gray-900">{suggestion.section}</h4>
                      <Badge className={`${getImpactColor(suggestion.impact)} text-xs sm:text-sm whitespace-nowrap`}>
                        {suggestion.impact === 'high'
                          ? 'impact élevé'
                          : suggestion.impact === 'medium'
                          ? 'moyen impact'
                          : suggestion.impact === 'low'
                          ? 'faible impact'
                          : suggestion.impact + ' impact'}
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                Vos Points forts
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <ul className="space-y-3">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Formatting Feedback */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Mise en forme & Présentation</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <p className="text-sm sm:text-base text-gray-700">{feedback.formatting_feedback}</p>
            </CardContent>
          </Card>

          {/* Keyword Analysis */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Analyse des mots-clés</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 space-y-4">
              {feedback.keyword_analysis.missing_keywords.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm sm:text-base text-yellow-700 mb-2">Mots-clés manquants</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {feedback.keyword_analysis.missing_keywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-yellow-600 border-yellow-200 text-xs sm:text-sm py-0.5 px-2"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {feedback.keyword_analysis.suggested_additions.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm sm:text-base text-green-700 mb-2">Ajouts suggérés</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {feedback.keyword_analysis.suggested_additions.map((addition, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-green-600 border-green-200 text-xs sm:text-sm py-0.5 px-2"
                      >
                        {addition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Portfolio Service CTA */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center text-blue-800">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                  Donne vie à ton profil professionnel
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 space-y-4">
                <p className="text-sm sm:text-base text-gray-700">
                  Transformez votre CV en un portfolio professionnel moderne et personnalisé. En tant que développeur fullstack expérimenté, je crée des sites web qui mettent en valeur votre parcours unique et augmentent votre visibilité en ligne.
                </p>
                <div className="flex flex-col space-y-2">
                  <p className="flex items-center text-xs sm:text-sm text-gray-600">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mr-2 flex-shrink-0" />
                    Design moderne et responsive
                  </p>
                  <p className="flex items-center text-xs sm:text-sm text-gray-600">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mr-2 flex-shrink-0" />
                    Personnalisation selon votre profil
                  </p>
                  <p className="flex items-center text-xs sm:text-sm text-gray-600">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mr-2 flex-shrink-0" />
                    Optimisé pour le référencement
                  </p>
                </div>
                <div className="pt-2 sm:pt-4 space-y-3">
                  <p className="font-medium text-sm sm:text-base text-blue-800">Contactez-moi pour en savoir plus :</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <a href="mailto:ry.ravelojaona@gmail.com" className="flex items-center text-blue-600 hover:text-blue-800">
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="truncate">ry.ravelojaona@gmail.com</span>
                    </a>
                    <a href="https://wa.me/261343139059" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <a href="tel:+261343139059" className="flex items-center text-blue-600 hover:text-blue-800">
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      +261 34 31 390 59
                    </a>
                    <a href="https://ravelojaona-rayan.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Voir mon portfolio
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
    </Dialog>
  )
}