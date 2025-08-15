'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useUploadStats } from '@/hooks/use-cv-uploads'

export function StatsCards() {
  const { data: stats, isLoading } = useUploadStats()

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-16 sm:w-20"></div>
              </CardTitle>
              <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-10 sm:w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total de CV',
      value: stats.total,
      icon: FileText,
      description: 'Téléversements totaux',
    },
    {
      title: 'Terminés',
      value: stats.completed,
      icon: CheckCircle,
      description: 'Analyses terminées',
      color: 'text-green-600',
    },
    {
      title: 'En cours',
      value: stats.processing,
      icon: Clock,
      description: 'Traitement en cours',
      color: 'text-blue-600',
    },
    {
      title: 'Échoués',
      value: stats.failed,
      icon: AlertCircle,
      description: 'Échec du traitement',
      color: 'text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${card.color || 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold">{card.value}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}