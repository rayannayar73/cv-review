'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CV Review</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Sign In
              </Button>
              <Button onClick={() => router.push('/login')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            ✨ Powered by AI • Completely Free
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get Professional CV <br />
            <span className="text-blue-600">Feedback in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your CV and get detailed, actionable feedback from AI. 
            Improve your resume with expert suggestions on content, formatting, and keywords.
          </p>
          
          {/* Upload Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <CVUploadLanding />
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">CV Rating</h3>
              <p className="text-gray-600 text-sm">Get an overall score from 1-10 based on industry standards</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Detailed Feedback</h3>
              <p className="text-gray-600 text-sm">Specific suggestions for each section of your CV</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Client Dashboard</h3>
              <p className="text-gray-600 text-sm">Track all your CV submissions and improvements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CV Review?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional CV analysis that helps you stand out from the competition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle>Instant Analysis</CardTitle>
                <CardDescription>
                  Get feedback in under 2 minutes using advanced AI technology
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Professional Standards</CardTitle>
                <CardDescription>
                  Evaluated against industry best practices and ATS compatibility
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Actionable Insights</CardTitle>
                <CardDescription>
                  Specific suggestions with priority levels for maximum impact
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Upload className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Easy Upload</CardTitle>
                <CardDescription>
                  Simply drag & drop your PDF CV - no signup required to try
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-indigo-500 mb-2" />
                <CardTitle>Keyword Analysis</CardTitle>
                <CardDescription>
                  Optimize for applicant tracking systems with keyword suggestions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-pink-500 mb-2" />
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor improvements across multiple CV versions over time
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
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get professional CV feedback in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your CV</h3>
              <p className="text-gray-600">
                Drag and drop your PDF CV or click to browse. No account needed to try.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your CV for content, structure, keywords, and formatting.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Feedback</h3>
              <p className="text-gray-600">
                Receive detailed feedback with actionable suggestions to improve your CV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Improve Your CV?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have improved their CVs with our AI-powered feedback
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Try It Free Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileText className="h-6 w-6" />
              <span className="text-lg font-semibold">CV Review</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 CV Review. All rights reserved. Powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}