'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useUploadStats } from '@/hooks/use-cv-uploads'

export function StatsCards() {
  const { data: stats, isLoading } = useUploadStats()

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total CVs',
      value: stats.total,
      icon: FileText,
      description: 'Total uploads',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      description: 'Reviews completed',
      color: 'text-green-600',
    },
    {
      title: 'Processing',
      value: stats.processing,
      icon: Clock,
      description: 'Currently processing',
      color: 'text-blue-600',
    },
    {
      title: 'Failed',
      value: stats.failed,
      icon: AlertCircle,
      description: 'Processing failed',
      color: 'text-red-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color || 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}