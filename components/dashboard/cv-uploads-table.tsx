'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, getScoreColor } from '@/lib/utils'
import { Eye, Star } from 'lucide-react'
import type { CVUpload, CVFeedback } from '@/lib/supabase/types'
import { FeedbackDialog } from './feedback-dialog'

const columnHelper = createColumnHelper<CVUpload>()

interface CVUploadsTableProps {
  data: CVUpload[]
  isLoading?: boolean
}

export function CVUploadsTable({ data, isLoading }: CVUploadsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true }
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedUpload, setSelectedUpload] = useState<CVUpload | null>(null)
  const columns = [
    columnHelper.accessor('file_name', {
      header: 'Nom du fichier',
      cell: ({ row }) => {
        const upload = row.original
        const feedback = upload.feedback as CVFeedback | null
        const overall_score = feedback?.overall_score
        const isFailed = upload.status === 'failed'

        return (
          <div 
            className="flex items-center gap-3 group"
          >
            <Badge 
              variant="outline" 
              className={`flex-shrink-0 ${isFailed ? 'text-red-500 border-red-200' : getScoreColor(overall_score as number)}`}
            >
              {isFailed ? (
                'Échec'
              ) : (
                <>
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  {overall_score}/10
                </>
              )}
            </Badge>
            <div className="min-w-0">
              <div className="font-medium truncate group-hover:text-blue-600 transition-colors">
                {upload.file_name}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                {formatDate(upload.created_at)}
              </div>
            </div>
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const upload = row.original
        return (
          <div className="flex justify-end">
            {upload.status === 'completed' && upload.feedback && (
              <Eye className="h-4 w-4 text-gray-400 group-hover/row:text-gray-900 transition-colors" />
            )}
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Nom du fichier</TableHead>
                <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="min-w-[300px]">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    <div className="flex justify-end">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap text-xs sm:text-sm">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                                     <TableRow 
                    key={row.id}
                    className={`group/row hover:bg-gray-50 ${
                      row.original.status === 'completed' ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => {
                      if (row.original.status === 'completed' && row.original.feedback) {
                        setSelectedUpload(row.original)
                      }
                    }}
                   >
                     {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className={`whitespace-nowrap text-xs sm:text-sm ${
                          cell.column.id === 'file_name' ? 'min-w-[180px]' :
                          cell.column.id === 'status' ? 'min-w-[100px]' :
                          cell.column.id === 'feedback.overall_score' ? 'min-w-[100px]' :
                          cell.column.id === 'created_at' ? 'min-w-[120px]' :
                          cell.column.id === 'actions' ? 'min-w-[100px]' : ''
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-sm">
                    Aucun CV téléversé. Téléversez votre premier CV pour commencer !
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedUpload && (
        <FeedbackDialog
          upload={selectedUpload}
          open={!!selectedUpload}
          onOpenChange={() => setSelectedUpload(null)}
        />
      )}
    </>
  )
}