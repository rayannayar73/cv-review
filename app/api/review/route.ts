import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import pdf from 'pdf-parse'
import type { CVFeedback } from '@/lib/supabase/types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

/**
 * Extract text from PDF file using pdf-parse
 */
async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    const data = await pdf(fileBuffer)
    return data.text
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

/**
 * Generate CV feedback using Google Gemini
 */
async function generateCVFeedback(cvText: string): Promise<CVFeedback> {
  const prompt = `
You are an expert career coach and HR professional. Please analyze the following CV and provide comprehensive feedback.

CV Content:
${cvText}

Please provide feedback in the following JSON format (return only valid JSON, no additional text):
{
  "overall_score": <number 1-10>,
  "summary": "<brief overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "areas_for_improvement": ["<area 1>", "<area 2>", ...],
  "specific_suggestions": [
    {
      "section": "<section name>",
      "suggestion": "<specific suggestion>",
      "impact": "<high|medium|low>"
    }
  ],
  "formatting_feedback": "<feedback on layout and formatting>",
  "keyword_analysis": {
    "missing_keywords": ["<keyword 1>", "<keyword 2>", ...],
    "suggested_additions": ["<suggestion 1>", "<suggestion 2>", ...]
  }
}

Focus on:
1. Professional experience relevance and presentation
2. Skills alignment with modern job market
3. Education and certifications
4. Overall structure and formatting
5. ATS (Applicant Tracking System) compatibility
6. Industry-specific keywords and terminology
7. Quantifiable achievements and metrics
8. Professional summary effectiveness

Be constructive, specific, and actionable in your feedback. Provide both positive reinforcement and clear improvement suggestions.
`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response and extract JSON
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    let feedback: CVFeedback
    try {
      feedback = JSON.parse(cleanText)
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response')
      }
      feedback = JSON.parse(jsonMatch[0])
    }

    // Validate the response has required fields
    if (!feedback.overall_score || !feedback.summary) {
      throw new Error('Invalid feedback format from Gemini')
    }

    return feedback
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate CV feedback with Gemini')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uploadId, filePath } = await request.json()

    if (!uploadId || !filePath) {
      return NextResponse.json(
        { error: 'Missing uploadId or filePath' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Update status to processing
    await supabase
      .from('cv_uploads')
      .update({ status: 'processing' })
      .eq('id', uploadId)

    try {
      // Download file from Supabase Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('cv-uploads')
        .download(filePath)

      if (downloadError) {
        throw new Error('Failed to download file')
      }

      // Convert file to buffer
      const fileBuffer = Buffer.from(await fileData.arrayBuffer())

      // Extract text from PDF
      const extractedText = await extractTextFromPDF(fileBuffer)

      // Generate feedback using Claude
      const feedback = await generateCVFeedback(extractedText)

      // Update upload record with results
      const { error: updateError } = await supabase
        .from('cv_uploads')
        .update({
          original_text: extractedText,
          feedback: feedback,
          status: 'completed',
        })
        .eq('id', uploadId)

      if (updateError) {
        throw new Error('Failed to save results')
      }

      return NextResponse.json({ 
        success: true, 
        uploadId,
        feedback 
      })

    } catch (processingError) {
      console.error('Processing error:', processingError)
      
      // Update status to failed
      await supabase
        .from('cv_uploads')
        .update({ 
          status: 'failed',
          feedback: { 
            error: processingError instanceof Error ? processingError.message : 'Unknown error' 
          }
        })
        .eq('id', uploadId)

      throw processingError
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}