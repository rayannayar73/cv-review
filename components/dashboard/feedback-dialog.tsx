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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Retour sur le CV : {upload.file_name}</span>
            <Badge className={getScoreColor(feedback.overall_score)}>
              <Star className="h-3 w-3 mr-1" />
              {feedback.overall_score}/10
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Évaluation globale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{feedback.summary}</p>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Forces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                Points à améliorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.areas_for_improvement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specific Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                Suggestions spécifiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.specific_suggestions.map((suggestion, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{suggestion.section}</h4>
                      <Badge className={getImpactColor(suggestion.impact)}>
                        {suggestion.impact === 'high'
                          ? 'élevé impact'
                          : suggestion.impact === 'medium'
                          ? 'moyen impact'
                          : suggestion.impact === 'low'
                          ? 'faible impact'
                          : suggestion.impact + ' impact'}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formatting Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mise en forme & Présentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{feedback.formatting_feedback}</p>
            </CardContent>
          </Card>

          {/* Keyword Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analyse des mots-clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedback.keyword_analysis.missing_keywords.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Mots-clés manquants</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.keyword_analysis.missing_keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {feedback.keyword_analysis.suggested_additions.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Ajouts suggérés</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.keyword_analysis.suggested_additions.map((addition, index) => (
                      <Badge key={index} variant="outline" className="text-green-600 border-green-200">
                        {addition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}