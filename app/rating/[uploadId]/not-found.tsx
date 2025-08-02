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
          <CardTitle>CV Analysis Not Found</CardTitle>
          <CardDescription>
            The CV analysis you're looking for doesn't exist or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            This could happen if:
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-1">
            <li>• The analysis link is incorrect</li>
            <li>• The analysis has been removed</li>
            <li>• The link has expired</li>
          </ul>
          <div className="pt-4">
            <Link href="/landing">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Analyze a New CV
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}