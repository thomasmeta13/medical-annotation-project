'use client'

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronDown, ChevronUp, Download, MessageSquare, MoreHorizontal, Search, Send, X } from "lucide-react"

// Types
interface Comment {
  id: number
  text: string
  author: string
  role: string
  timestamp: string
}

interface DataRow {
  id: number
  image: string
  modelResponse: string
  evalResponse: string
  grade: number
  aiFeedback: string
  comments: Comment[]
}

// Mock data
const mockData: DataRow[] = [
  {
    id: 1,
    image: "https://c8.alamy.com/comp/E18EC6/sequence-of-vertical-sections-of-a-human-brain-mri-scan-E18EC6.jpg",
    modelResponse: "Patient presents with recurring headaches in the frontal lobe region. Need assessment of potential abnormalities.",
    evalResponse: "Clear indication of small mass in the right frontal lobe. Requires immediate follow-up.",
    grade: 4,
    aiFeedback: "The model correctly identified the presence of an abnormality but missed the specific location and urgency.",
    comments: [
      {
        id: 1,
        text: "Good catch on the abnormality, but location specificity needs improvement.",
        author: "Dr. John Doe",
        role: "Neurologist",
        timestamp: "2024-11-09T15:00:00Z"
      }
    ]
  },
  {
    id: 2,
    image: "https://media.istockphoto.com/id/92408093/photo/brain-mri-scan.jpg?s=612x612&w=0&k=20&c=LhOLajIBecgUVwYuwMhnpyKbEmYvGqWlm5s6maYZYw4=",
    modelResponse: "Follow-up scan for post-operative monitoring of tumor resection site shows no signs of recurrence.",
    evalResponse: "Concur with the assessment. No signs of recurrence. Healing progressing as expected. Recommend follow-up in 6 months.",
    grade: 5,
    aiFeedback: "Excellent assessment. The model accurately identified the post-operative state and lack of recurrence.",
    comments: []
  },
  {
    id: 3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtK75NLL8Am-BHCYUpcxIKoKtuxaqt8wo7Xg&s",
    modelResponse: "No significant abnormalities detected in the left hemisphere.",
    evalResponse: "Missed subtle signs of ischemia in the left temporal region. Additional views recommended.",
    grade: 2,
    aiFeedback: "The model failed to detect early signs of ischemia. More training on subtle ischemic changes is needed.",
    comments: []
  },
]

export default function EvalPage() {
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc")
  const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
  const [selectedRowForComment, setSelectedRowForComment] = React.useState<DataRow | null>(null)
  const [newComment, setNewComment] = React.useState("")
  const [data, setData] = React.useState(mockData)

  const accuracy = 0.92
  const completeness = 0.88
  const previousAccuracy = 0.89
  const previousCompleteness = 0.85
  const timeTaken = "2 hours 15 minutes"
  const evalSize = 500
  const dataPoints = 10000

  const aiInsights = [
    "Improved performance in identifying subtle abnormalities, particularly in the frontal and temporal lobes.",
    "Notable increase in accuracy for post-operative assessments.",
    "Room for improvement in detecting early signs of ischemia.",
    "Suggestion to include more diverse cases of early-stage pathologies in the training data."
  ]

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

  const filteredAndSortedData = React.useMemo(() => {
    return data
      .filter(row =>
        row.modelResponse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.evalResponse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.aiFeedback.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        return sortDirection === "asc" ? a.grade - b.grade : b.grade - a.grade
      })
  }, [data, searchTerm, sortDirection])

  const handleAddComment = () => {
    if (selectedRowForComment && newComment.trim()) {
      const updatedData = data.map(row => {
        if (row.id === selectedRowForComment.id) {
          return {
            ...row,
            comments: [
              ...row.comments,
              {
                id: row.comments.length + 1,
                text: newComment.trim(),
                author: "Current User",
                role: "QA Engineer",
                timestamp: new Date().toISOString()
              }
            ]
          }
        }
        return row
      })
      setData(updatedData)
      setNewComment("")
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Evaluation Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accuracy & Completeness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="text-sm text-muted-foreground">
                    {((accuracy - previousAccuracy) * 100).toFixed(1)}% change
                  </span>
                </div>
                <div className="text-2xl font-bold">{(accuracy * 100).toFixed(1)}%</div>
                <Progress value={accuracy * 100} className="mt-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Completeness</span>
                  <span className="text-sm text-muted-foreground">
                    {((completeness - previousCompleteness) * 100).toFixed(1)}% change
                  </span>
                </div>
                <div className="text-2xl font-bold">{(completeness * 100).toFixed(1)}%</div>
                <Progress value={completeness * 100} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {aiInsights.map((insight, index) => (
                <li key={index} className="text-sm text-muted-foreground">{insight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Time Taken:</span>
                <span className="text-sm">{timeTaken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Eval Size:</span>
                <span className="text-sm">{evalSize} samples</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Data Points:</span>
                <span className="text-sm">{dataPoints.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Evaluation Results</CardTitle>
          <CardDescription>Model responses and evaluation feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Scan</TableHead>
                <TableHead className="w-[200px]">Model Response</TableHead>
                <TableHead className="w-[200px]">Eval Response</TableHead>
                <TableHead 
                  className="w-[80px] cursor-pointer hover:bg-muted/50"
                  onClick={toggleSort}
                >
                  <div className="flex items-center">
                    Grade
                    {sortDirection === "asc" ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[200px]">AI Feedback</TableHead>
                <TableHead className="w-[100px]">Comments</TableHead>
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
                    <TableCell className="font-medium">{row.modelResponse}</TableCell>
                    <TableCell>{row.evalResponse}</TableCell>
                    <TableCell>
                      <Badge variant={row.grade >= 4 ? "default" : row.grade >= 3 ? "secondary" : "destructive"}>
                        {row.grade}/5
                      </Badge>
                    </TableCell>
                    <TableCell>{row.aiFeedback}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedRowForComment(row)}>
                            <MessageSquare className="h-4 w-4" />
                            {row.comments.length > 0 && (
                              <span className="ml-1 text-xs">{row.comments.length}</span>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Comments</DialogTitle>
                            <DialogDescription>
                              View and add comments for this evaluation.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <img src={row.image} alt="MRI Scan" className="w-full rounded-md" />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold">Model Response:</h3>
                                <p>{row.modelResponse}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Eval Response:</h3>
                                <p>{row.evalResponse}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Comments:</h3>
                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                  {row.comments.map((comment, index) => (
                                    <div key={index} className="mb-4 last:mb-0">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-semibold">{comment.author}</span>
                                        <Badge variant="secondary">{comment.role}</Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(comment.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-sm">{comment.text}</p>
                                    </div>
                                  ))}
                                </ScrollArea>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">Add a Comment:</h3>
                                <div className="flex items-center space-x-2">
                                  <Textarea
                                    placeholder="Type your comment here..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-grow"
                                  />
                                  <Button onClick={handleAddComment} size="icon">
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                      <TableCell colSpan={7} className="bg-muted/50">
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">AI Feedback</h4>
                          <p className="text-sm text-muted-foreground">{row.aiFeedback}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
    </div>
  )
}