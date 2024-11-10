'use client'

import { useParams } from 'next/navigation'
import SpreadsheetView from '@/components/SpreadsheetView'
import { taskData } from '@/data/tasks' // Make sure to import your task data

export default function ExpertSpreadsheetPage() {
  const params = useParams()
  const expertId = params.expertId as string
  
  // Find the expert from taskData
  const expert = taskData.experts.find(e => e.id.toString() === expertId)
  const expertName = expert?.name || 'Expert'

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{expertName}'s Spreadsheet View</h1>
      <SpreadsheetView expertId={expertId} />
    </div>
  )
}