'use client'

import * as React from "react"
import { BarChart2, Bot, ChevronDown, Download, FileText, MoreHorizontal, Plus, Search, Target, ThumbsDown, ThumbsUp, Upload, Users, Zap, MessageSquare, X, Send, CheckCircle, AlertCircle, XCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { AudioPlayer } from "@/components/ui/audio-player"

// Types
interface Expert {
  id: number
  name: string
  role: string
  avatar: string
}

interface ExpertFeedback {
  expertId: number
  feedback: string
  vote: 'positive' | 'negative' | 'neutral'
}

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
  audio?: string
  input: string
  modelResponse: string
  evalResponse: string
  grade: number
  comments: Comment[]
  expertFeedback: ExpertFeedback[]
  consensus: 'check' | 'alert' | 'cross'
  cumulativeFeedback: string
}

// Mock data
const mockExperts: Expert[] = [
  { id: 1, name: "Dr. John Doe", role: "Neurologist", avatar: "/avatars/john-doe.jpg" },
  { id: 2, name: "Dr. Jane Smith", role: "Radiologist", avatar: "/avatars/jane-smith.jpg" },
  { id: 3, name: "Dr. Mike Johnson", role: "Oncologist", avatar: "/avatars/mike-johnson.jpg" },
]

const mockData: DataRow[] = [
  {
    id: 1,
    image: "https://c8.alamy.com/comp/E18EC6/sequence-of-vertical-sections-of-a-human-brain-mri-scan-E18EC6.jpg",
    audio: "sample1.mp3",
    input: "Patient presents with recurring headaches in the frontal lobe region.",
    modelResponse: "Potential abnormality detected in the frontal lobe. Further investigation recommended.",
    evalResponse: "Clear indication of small mass in the right frontal lobe. Requires immediate follow-up.",
    grade: 4,
    comments: [
      {
        id: 1,
        text: "Good catch on the abnormality, but location specificity needs improvement.",
        author: "Dr. John Doe",
        role: "Neurologist",
        timestamp: "2024-11-09T15:00:00Z"
      }
    ],
    expertFeedback: [
      { expertId: 1, feedback: "Accurate detection, missed urgency", vote: 'positive' },
      { expertId: 2, feedback: "Correct identification, lacks specificity", vote: 'neutral' },
      { expertId: 3, feedback: "Good initial assessment", vote: 'positive' },
    ],
    consensus: "alert",
    cumulativeFeedback: "Model shows promise but needs improvement in specificity and urgency assessment",
  },
  {
    id: 2,
    image: "https://media.istockphoto.com/id/92408093/photo/brain-mri-scan.jpg?s=612x612&w=0&k=20&c=LhOLajIBecgUVwYuwMhnpyKbEmYvGqWlm5s6maYZYw4=",
    audio: "/audio/sample2.mp3",
    input: "Follow-up scan for post-operative monitoring of tumor resection site.",
    modelResponse: "No signs of recurrence detected. Healing progressing as expected.",
    evalResponse: "Concur with model assessment. No evidence of tumor regrowth.",
    grade: 5,
    comments: [],
    expertFeedback: [
      { expertId: 1, feedback: "Excellent assessment, agree with findings", vote: 'positive' },
      { expertId: 2, feedback: "Accurate evaluation of post-operative site", vote: 'positive' },
      { expertId: 3, feedback: "Concur, no concerning features observed", vote: 'positive' },
    ],
    consensus: "check",
    cumulativeFeedback: "Model performed exceptionally well in post-operative assessment",
  },
  {
    id: 3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtK75NLL8Am-BHCYUpcxIKoKtuxaqt8wo7Xg&s",
    audio: "/audio/sample3.mp3",
    input: "Evaluate for signs of stroke in left hemisphere.",
    modelResponse: "No significant abnormalities detected in the left hemisphere.",
    evalResponse: "Subtle signs of ischemia in the left temporal region. Additional views recommended.",
    grade: 2,
    comments: [],
    expertFeedback: [
      { expertId: 1, feedback: "Model missed early signs of ischemia", vote: 'negative' },
      { expertId: 2, feedback: "Agree with eval, model needs improvement", vote: 'negative' },
      { expertId: 3, feedback: "Critical miss, requires immediate attention", vote: 'negative' },
    ],
    consensus: "cross",
    cumulativeFeedback: "Model failed to detect subtle signs of ischemia. Requires significant improvement in sensitivity.",
  },
  {
    id: 4,
    image: "https://www.researchgate.net/publication/51089880/figure/fig1/AS:271610723704833@1441772665723/Axial-T2-weighted-MRI-scan-showing-a-left-temporal-lobe-tumor.png",
    audio: "/audio/sample4.mp3",
    input: "Assess for presence of temporal lobe abnormalities.",
    modelResponse: "Possible mass detected in left temporal lobe. Further investigation recommended.",
    evalResponse: "Confirmed presence of tumor in left temporal lobe. Immediate specialist referral required.",
    grade: 4,
    comments: [],
    expertFeedback: [
      { expertId: 1, feedback: "Good detection, but underestimated severity", vote: 'positive' },
      { expertId: 2, feedback: "Accurate location, missed definitive diagnosis", vote: 'neutral' },
      { expertId: 3, feedback: "Correct identification, needs improvement in urgency assessment", vote: 'positive' },
    ],
    consensus: "alert",
    cumulativeFeedback: "Model successfully detected abnormality but needs improvement in assessing severity and urgency.",
  },
  {
    id: 5,
    image: "https://radiopaedia.org/uploads/radio/2019/02/22/pre_1550827982_81_84178_big_gallery.jpeg",
    audio: "/audio/sample5.mp3",
    input: "Evaluate for signs of multiple sclerosis.",
    modelResponse: "Multiple hyperintense lesions detected in periventricular white matter. Consistent with multiple sclerosis.",
    evalResponse: "Agree with model assessment. Classic presentation of multiple sclerosis.",
    grade: 5,
    comments: [],
    expertFeedback: [
      { expertId: 1, feedback: "Excellent detection and interpretation", vote: 'positive' },
      { expertId: 2, feedback: "Accurate identification of MS lesions", vote: 'positive' },
      { expertId: 3, feedback: "Concur with model's assessment", vote: 'positive' },
    ],
    consensus: "check",
    cumulativeFeedback: "Model demonstrated high accuracy in detecting and interpreting multiple sclerosis lesions.",
  },
]

export default function DataPage() {
  const [dataSet, setDataSet] = React.useState<"labeled" | "eval">("labeled")
  const [dataVersion, setDataVersion] = React.useState("v1.0")
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = React.useState<number[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
  const [selectedRowForComment, setSelectedRowForComment] = React.useState<DataRow | null>(null)
  const [newComment, setNewComment] = React.useState("")
  const [data, setData] = React.useState(mockData)
  const [selectedExperts, setSelectedExperts] = React.useState<number[]>([])
  const [selectedItem, setSelectedItem] = React.useState<DataRow | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

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

  const toggleExpertSelection = (expertId: number) => {
    setSelectedExperts(prev =>
      prev.includes(expertId) ? prev.filter(id => id !== expertId) : [...prev, expertId]
    )
  }

  const filteredData = React.useMemo(() => {
    return data.filter(row =>
      row.modelResponse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.evalResponse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.cumulativeFeedback.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn as keyof DataRow]
      const bValue = b[sortColumn as keyof DataRow]
      
      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1
      if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1
      
      // Handle arrays (comments and expertFeedback)
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        return sortDirection === 'asc' 
          ? aValue.length - bValue.length 
          : bValue.length - aValue.length
      }
      
      // Handle strings and numbers
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  const getFeedbackColor = (vote: string) => {
    switch (vote) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900'
      case 'negative':
        return 'bg-red-100 dark:bg-red-900'
      default:
        return 'bg-yellow-100 dark:bg-yellow-900'
    }
  }

  const getConsensusIcon = (consensus: DataRow['consensus'], expertFeedback: ExpertFeedback[]) => {
    const positiveVotes = expertFeedback.filter(ef => ef.vote === 'positive').length
    const totalVotes = expertFeedback.length
    let icon

    switch (consensus) {
      case 'check':
        icon = <CheckCircle className="text-green-500 w-4 h-4" />
        break
      case 'alert':
        icon = <AlertCircle className="text-yellow-500 w-4 h-4" />
        break
      case 'cross':
        icon = <XCircle className="text-red-500 w-4 h-4" />
        break
    }

    return (
      <div className="flex items-center space-x-1">
        {icon}
        <span>{positiveVotes}/{totalVotes}</span>
      </div>
    )
  }

  const renderTable = () => {
    const tableContent = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedRows.length === sortedData.length}
                onCheckedChange={(checked) => {
                  setSelectedRows(checked ? sortedData.map(d => d.id) : [])
                }}
              />
            </TableHead>
            <TableHead className="w-[100px]">{dataVersion === "v2.0" ? "Audio" : "Scan"}</TableHead>
            {dataSet === "labeled" && (
              <>
                <TableHead className="w-[200px]">Model Response</TableHead>
                <TableHead className="w-[80px]" onClick={() => handleSort('grade')}>Grade</TableHead>
              </>
            )}
            <TableHead className="w-[200px]">Eval Response</TableHead>
            <TableHead className="w-[250px]">Consensus & Cumulative Feedback</TableHead>
            <TableHead className="w-[100px]">Comments</TableHead>
            {selectedExperts.map(expertId => (
              <TableHead key={expertId} className="w-[200px]">
                {mockExperts.find(e => e.id === expertId)?.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow 
              key={row.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                setSelectedItem(row)
                setIsTaskModalOpen(true)
              }}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  onCheckedChange={() => handleRowSelect(row.id)}
                />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                {dataVersion === "v2.0" ? (
                  <div className="w-[200px]">
                    <AudioPlayer 
                      src={`/audio/${row.audio}`} 
                      key={row.id}
                    />
                  </div>
                ) : (
                  <img
                    src={row.image}
                    alt="MRI Scan"
                    className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImage(row.image)
                    }}
                  />
                )}
              </TableCell>
              {dataSet === "labeled" && (
                <>
                  <TableCell>{row.modelResponse}</TableCell>
                  <TableCell>
                    <Badge variant={row.grade >= 4 ? "default" : row.grade >= 3 ? "secondary" : "destructive"}>
                      {row.grade}/5
                    </Badge>
                  </TableCell>
                </>
              )}
              <TableCell>{row.evalResponse}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getConsensusIcon(row.consensus, row.expertFeedback)}
                  <span>{row.cumulativeFeedback}</span>
                </div>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedRowForComment(row)}>
                  <MessageSquare className="h-4 w-4" />
                  {row.comments.length > 0 && (
                    <span className="ml-1 text-xs">{row.comments.length}</span>
                  )}
                </Button>
              </TableCell>
              {selectedExperts.map(expertId => {
                const expertFeedback = row.expertFeedback.find(ef => ef.expertId === expertId)
                return (
                  <TableCell key={expertId} className={`${getFeedbackColor(expertFeedback?.vote || '')}`}>
                    {expertFeedback?.feedback}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )

    return (
      <div className="overflow-x-auto">
        {tableContent}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Data Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Accuracy Metrics</CardTitle>
          <CardDescription>Compare accuracy metrics from human and AI assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="human" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="human" className="text-sm">
                <Users className="w-4 h-4 mr-2" />
                Human Assessment
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-sm">
                <Bot className="w-4 h-4 mr-2" />
                AI Assessment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="human">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Agreement Rate</div>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last week</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Consensus Level</div>
                    <div className="text-2xl font-bold">92%</div>
                    <p className="text-xs text-muted-foreground">+1.2% from last week</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Expert Votes</div>
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="text-green-500 h-4 w-4" />
                      <span className="text-lg font-semibold">234</span>
                      <ThumbsDown className="text-red-500 h-4 w-4 ml-2" />
                      <span className="text-lg font-semibold">41</span>
                    </div>
                    <p className="text-xs text-muted-foreground">85% positive feedback</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Precision</div>
                    <div className="text-2xl font-bold">0.89</div>
                    <p className="text-xs text-muted-foreground">+0.03 from last run</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Recall</div>
                    <div className="text-2xl font-bold">0.92</div>
                    <p className="text-xs text-muted-foreground">+0.01 from last run</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">F1 Score</div>
                    <div className="text-2xl font-bold">0.90</div>
                    <p className="text-xs text-muted-foreground">+0.02 from last run</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Evaluation Results</CardTitle>
          <CardDescription>Model responses and evaluation feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <RadioGroup defaultValue="labeled" onValueChange={(value) => setDataSet(value as "labeled" | "eval")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="labeled" id="labeled" />
                  <Label htmlFor="labeled">Labeled Set</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="eval" id="eval" />
                  <Label htmlFor="eval">Eval Set</Label>
                </div>
              </RadioGroup>
              <Select value={dataVersion} onValueChange={setDataVersion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1.0">Version 1.0</SelectItem>
                  <SelectItem value="v1.1">Version 1.1</SelectItem>
                  <SelectItem value="v2.0">Version 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
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
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {mockExperts.map(expert => (
              <Button
                key={expert.id}
                variant={selectedExperts.includes(expert.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleExpertSelection(expert.id)}
              >
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={expert.avatar} alt={expert.name} />
                  <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {expert.name}
              </Button>
            ))}
          </div>
          {renderTable()}
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

      {/* Comment Modal */}
      <Dialog open={!!selectedRowForComment} onOpenChange={() => setSelectedRowForComment(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              View and add comments for this evaluation.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              {dataVersion === "v2.0" ? (
                <div className="flex items-center justify-center h-full">
                  <AudioPlayer src={`/audio/${selectedRowForComment?.audio}`} className="w-full" />
                </div>
              ) : (
                <img src={selectedRowForComment?.image} alt="MRI Scan" className="w-full rounded-md" />
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Input:</h3>
                <p>{selectedRowForComment?.input}</p>
              </div>
              <div>
                <h3 className="font-semibold">Model Response:</h3>
                <p>{selectedRowForComment?.modelResponse}</p>
              </div>
              <div>
                <h3 className="font-semibold">Eval Response:</h3>
                <p>{selectedRowForComment?.evalResponse}</p>
              </div>
              <div>
                <h3 className="font-semibold">Comments:</h3>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {selectedRowForComment?.comments.map((comment, index) => (
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

      {/* Detailed View Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detailed View</DialogTitle>
            <DialogDescription>
              Detailed information about this annotation.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                {dataVersion === "v2.0" ? (
                  <div className="flex items-center justify-center h-full">
                    <AudioPlayer 
                      src={`/audio/${selectedItem?.audio}`}
                      key={`modal-${selectedItem?.id}`}
                    />
                  </div>
                ) : (
                  <img src={selectedItem?.image} alt="MRI Scan" className="w-full rounded-md" />
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Input:</h3>
                  <p>{selectedItem?.input}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Consensus:</h3>
                  <div className="flex items-center space-x-2">
                    {getConsensusIcon(selectedItem?.consensus, selectedItem?.expertFeedback)}
                    <span className="capitalize">{selectedItem?.consensus}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Cumulative Feedback:</h3>
                  <p>{selectedItem?.cumulativeFeedback}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Expert Feedback:</h3>
                  {selectedItem?.expertFeedback.map((ef, index) => {
                    const expert = mockExperts.find(e => e.id === ef.expertId)
                    return (
                      <div key={index} className="mt-2">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={expert?.avatar} alt={expert?.name} />
                            <AvatarFallback>{expert?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{expert?.name}</span>
                        </div>
                        <p className="mt-1">{ef.feedback}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}