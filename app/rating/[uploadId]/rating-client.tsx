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

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 8) return 'Excellent CV! 🎉'
    if (score >= 6) return 'Good CV with room for improvement'
    return 'Your CV needs significant improvements'
  }

  const handleCreateAccount = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
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
        title: 'Account created!',
        description: 'Check your email to confirm your account, then sign in to access your dashboard.',
      })

      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error: any) {
      toast({
        title: 'Error creating account',
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
            <CardTitle>Analysis in Progress</CardTitle>
            <CardDescription>
              Your CV is being analyzed. Please wait a moment...
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
            <Button variant="ghost" onClick={() => router.push('/landing')}>
              ← Back to Home
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
              <div className="text-sm text-gray-500">out of 10</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getScoreMessage(feedback.overall_score)}
          </h1>
          
          <Badge className={`text-lg px-4 py-2 ${getScoreColor(feedback.overall_score)}`}>
            <Star className="h-4 w-4 mr-2" />
            CV Score: {feedback.overall_score}/10
          </Badge>
        </div>

        {/* Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed">{feedback.summary}</p>
          </CardContent>
        </Card>

        {/* Quick Preview of Feedback */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                Key Strengths
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
                    +{feedback.strengths.length - 3} more insights available
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                Areas to Improve
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
                    +{feedback.areas_for_improvement.length - 3} more suggestions available
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Email Capture CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Want the Complete Analysis?</CardTitle>
            <CardDescription className="text-blue-100">
              Get detailed feedback, specific suggestions, keyword analysis, and save your results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showEmailCapture ? (
              <div className="text-center">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                    <h4 className="font-semibold">Detailed Suggestions</h4>
                    <p className="text-sm text-blue-100">Section-by-section improvements</p>
                  </div>
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-green-300" />
                    <h4 className="font-semibold">Keyword Analysis</h4>
                    <p className="text-sm text-blue-100">ATS optimization tips</p>
                  </div>
                  <div className="text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                    <h4 className="font-semibold">Track Progress</h4>
                    <p className="text-sm text-blue-100">Save and compare versions</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setShowEmailCapture(true)}
                >
                  Unlock Full Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Create Free Account
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                    onClick={() => setShowEmailCapture(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-blue-100 text-center">
                  We'll send you a confirmation email. No spam, unsubscribe anytime.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Try Again CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Have another CV to analyze?</p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/landing')}
            className="mr-4"
          >
            Analyze Another CV
          </Button>
          <Button 
            onClick={() => router.push('/login')}
          >
            Sign In to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}