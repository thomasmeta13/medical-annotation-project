'use client'

import * as React from "react"
import { ChevronDown, ChevronUp, Download, MoreHorizontal, Search, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for the spreadsheet
const mockData = [
  {
    id: 1,
    expertId: 1,
    image: "https://c8.alamy.com/comp/E18EC6/sequence-of-vertical-sections-of-a-human-brain-mri-scan-E18EC6.jpg",
    input: "Patient presents with recurring headaches in the frontal lobe region. Need assessment of potential abnormalities.",
    expertFeedback: "Clear indication of small mass in the right frontal lobe. Requires immediate follow-up.",
    vote: "positive",
    feedbackNotes: "Annotation correctly identifies the mass location and provides appropriate urgency assessment.",
    timestamp: "2024-11-09T14:30:00Z",
    expert: {
      name: "Dr. Jane Smith",
      avatar: "/avatars/joe.jpg",
    },
    datasetVersion: "v2.3"
  },
  {
    id: 2,
    expertId: 1,
    image: "https://media.istockphoto.com/id/92408093/photo/brain-mri-scan.jpg?s=612x612&w=0&k=20&c=LhOLajIBecgUVwYuwMhnpyKbEmYvGqWlm5s6maYZYw4=",
    input: "Follow-up scan for post-operative monitoring of tumor resection site.",
    expertFeedback: "No signs of recurrence. Healing progressing as expected. Recommend follow-up in 6 months.",
    vote: "positive",
    feedbackNotes: "Thorough assessment of the resection site. Good catch on the normal healing patterns.",
    timestamp: "2024-11-09T15:45:00Z",
    expert: {
      name: "Dr. John Doe",
      avatar: "/avatars/joe.jpg",
    },
    datasetVersion: "v2.3"
  },
  {
    id: 3,
    expertId: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtK75NLL8Am-BHCYUpcxIKoKtuxaqt8wo7Xg&s",
    input: "Evaluate for signs of stroke in left hemisphere.",
    expertFeedback: "Missed subtle signs of ischemia in the left temporal region. Additional views recommended.",
    vote: "negative",
    feedbackNotes: "Initial assessment incomplete. Important to note all potential areas of concern.",
    timestamp: "2024-11-09T16:20:00Z",
    expert: {
      name: "Dr. Emily Brown",
      avatar: "/avatars/joe.jpg",
    },
    datasetVersion: "v2.4"
  },
]

interface SpreadsheetViewProps {
  expertId: string
}

export default function SpreadsheetView({ expertId }: SpreadsheetViewProps) {
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc")
  const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const toggleRow = (id: number) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  const filteredAndSortedData = React.useMemo(() => {
    return mockData
      .filter(row => row.expertId === parseInt(expertId))
      .filter(row =>
        row.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.expertFeedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.expert.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime()
        const dateB = new Date(b.timestamp).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      })
  }, [expertId, searchTerm, sortDirection])

  return (
    <Card className="w-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Expert Feedback Log</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Scan</TableHead>
            <TableHead className="w-[200px]">Model Response</TableHead>
            <TableHead className="w-[200px]">Expert Feedback</TableHead>
            <TableHead className="w-[80px]">Vote</TableHead>
            <TableHead 
              className="w-[100px] cursor-pointer hover:bg-muted/50"
              onClick={toggleSort}
            >
              <div className="flex items-center">
                Timestamp
                {sortDirection === "asc" ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[100px]">Dataset Version</TableHead>
            <TableHead className="w-[100px]">Expert</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedData.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow className="group">
                <TableCell>
                  <img
                    src={row.image}
                    alt="MRI Scan"
                    className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(row.image)}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.input}</TableCell>
                <TableCell>{row.expertFeedback}</TableCell>
                <TableCell>
                  {row.vote === "positive" ? (
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <ThumbsDown className="w-5 h-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {getRelativeTime(row.timestamp)}
                </TableCell>
                <TableCell>{row.datasetVersion}</TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={row.expert.avatar} alt={row.expert.name} />
                        <AvatarFallback>{row.expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{row.expert.name}</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleRow(row.id)}>
                        {expandedRows.has(row.id) ? "Hide" : "Show"} Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Download Scan</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {expandedRows.has(row.id) && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-muted/50">
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">Feedback Notes</h4>
                      <p className="text-sm text-muted-foreground">{row.feedbackNotes}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-none w-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Image Preview</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(selectedImage || '', '_blank')}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="relative">
            <img
              src={selectedImage || ''}
              alt="MRI Scan Preview"
              className="object-contain max-h-[80vh]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}