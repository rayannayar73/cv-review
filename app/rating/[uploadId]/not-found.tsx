import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <CardTitle>Analyse de CV introuvable</CardTitle>
          <CardDescription>
            L’analyse de CV que vous recherchez n’existe pas ou a expiré.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Cela peut arriver si :
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-1">
            <li>• Le lien d’analyse est incorrect</li>
            <li>• L’analyse a été supprimée</li>
            <li>• Le lien a expiré</li>
          </ul>
          <div className="pt-4">
            <Link href="/landing">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Analyser un nouveau CV
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}