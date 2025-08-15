import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import pdf from 'pdf-parse'
import type { CVFeedback, Json } from '@/lib/supabase/types'
import { randomUUID } from 'crypto'

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
Tu es un(e) expert(e) en accompagnement de carrière et un(e) professionnel(le) RH. Analyse le CV suivant et fournis un retour complet.

Contenu du CV :
${cvText}

RENVOIE STRICTEMENT un JSON valide (aucun texte avant/après). IMPORTANT : **les clés du JSON doivent rester en anglais**, mais **toutes les valeurs textuelles doivent être en français (France)**.
Format attendu :
{
  "overall_score": <number 1-10>,
  "summary": "<évaluation globale brève en français>",
  "strengths": ["<force 1>", "<force 2>", ...],
  "areas_for_improvement": ["<axe d'amélioration 1>", "<axe d'amélioration 2>", ...],
  "specific_suggestions": [
    {
      "section": "<nom de la section>",
      "suggestion": "<suggestion précise en français>",
      "impact": "<high|medium|low>"
    }
  ],
  "formatting_feedback": "<retour sur la mise en page et le format>",
  "keyword_analysis": {
    "missing_keywords": ["<mot-clé manquant 1>", "<mot-clé manquant 2>", ...],
    "suggested_additions": ["<suggestion 1>", "<suggestion 2>", ...]
  }
}

Concentre-toi sur :
1. Pertinence et présentation de l'expérience professionnelle
2. Adéquation des compétences avec le marché actuel
3. Formation et certifications
4. Structure et mise en forme globales
5. Compatibilité ATS (Applicant Tracking System)
6. Mots-clés et terminologie spécifiques au secteur
7. Réalisations quantifiées et métriques
8. Efficacité du résumé/profil professionnel

Sois constructif(ve), spécifique et actionnable. Donne à la fois des points positifs et des pistes claires d'amélioration.`
  
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
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Use special anonymous user ID for all anonymous uploads
    const anonymousId = '00000000-0000-0000-0000-000000000000'
    const uploadId = randomUUID()

    const supabase = createClient()

    try {
      // Convert file to buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer())

      // Extract text from PDF
      const extractedText = await extractTextFromPDF(fileBuffer)

      // Generate feedback using Gemini
      const feedback = await generateCVFeedback(extractedText)

      // Store in database with anonymous flag
      const { error: insertError } = await supabase
        .from('cv_uploads')
        .insert({
          id: uploadId,
          user_id: anonymousId, // Use anonymous ID as user_id
          file_name: file.name,
          file_path: `anonymous/${uploadId}.pdf`, // Don't actually store file for anonymous
          original_text: extractedText,
          feedback: JSON.parse(JSON.stringify(feedback)) as Json,
          status: 'completed',
        })

      if (insertError) {
        console.error('Database insert error:', insertError)
        throw new Error('Failed to save analysis results')
      }

      return NextResponse.json({ 
        success: true, 
        uploadId,
        score: feedback.overall_score
      })

    } catch (processingError) {
      console.error('Processing error:', processingError)
      
      return NextResponse.json(
        { 
          error: processingError instanceof Error ? processingError.message : 'Analysis failed' 
        },
        { status: 500 }
      )
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