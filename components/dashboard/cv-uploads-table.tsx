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
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, getScoreColor, getStatusColor } from '@/lib/utils'
import { Eye, Star } from 'lucide-react'
import type { CVUpload } from '@/lib/supabase/types'
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
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue()}</div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <Badge 
            variant="outline" 
            className={getStatusColor(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('feedback.overall_score', {
      header: 'Note',
      cell: ({ getValue }) => {
        const overall_score = getValue()
        return (
          <Badge 
            variant="outline" 
            className={getScoreColor(overall_score as number)}
          >
            <Star className="h-4 w-4 mr-2" />
            {overall_score as number}/10
          </Badge>
        )
      },
    }),
    columnHelper.accessor('created_at', {
      header: 'Téléversé le',
      cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const upload = row.original
        const hasCompletedFeedback = upload.status === 'completed' && upload.feedback

        return (
          <div className="flex space-x-2">
            {hasCompletedFeedback && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUpload(upload)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du fichier</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Téléversé le</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun CV téléversé. Téléversez votre premier CV pour commencer !
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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