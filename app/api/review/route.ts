import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import pdf from 'pdf-parse'
import type { CVFeedback, Json } from '@/lib/supabase/types'

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
          feedback: JSON.parse(JSON.stringify(feedback)) as Json,
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
          } as unknown as Json
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