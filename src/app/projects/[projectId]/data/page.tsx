'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowUpDown, Download, Filter, Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

// Mock data for the spreadsheet
const mockData = [
  {
    id: 1,
    image: "https://c8.alamy.com/comp/E18EC6/sequence-of-vertical-sections-of-a-human-brain-mri-scan-E18EC6.jpg",
    input: "Patient presents with recurring headaches in the frontal lobe region. Need assessment of potential abnormalities.",
    consensus: "alert",
    cumulativeFeedback: "2 identified mass in frontal lobe, 1 suggested further tests",
    expertFeedback: [
      {
        expertId: 1,
        name: "Dr. Bob Smith",
        avatar: "/avatars/bob-johnson.jpg",
        feedback: "Clear indication of small mass in the right frontal lobe. Requires immediate follow-up.",
        vote: "positive",
      },
      {
        expertId: 2,
        name: "Dr. Jane Smith",
        avatar: "/avatars/jane-smith.jpg",
        feedback: "Possible mass in frontal lobe, but not conclusive. Recommend additional imaging.",
        vote: "neutral",
      },
      {
        expertId: 3,
        name: "Dr. Emily Brown",
        avatar: "/avatars/joe.jpg",
        feedback: "Abnormality detected in right frontal lobe. Urgent follow-up required.",
        vote: "positive",
      },
    ],
  },
  {
    id: 2,
    image: "https://media.istockphoto.com/id/92408093/photo/brain-mri-scan.jpg?s=612x612&w=0&k=20&c=LhOLajIBecgUVwYuwMhnpyKbEmYvGqWlm5s6maYZYw4=",
    input: "Follow-up scan for post-operative monitoring of tumor resection site.",
    consensus: "check",
    cumulativeFeedback: "All experts agree on no signs of recurrence",
    expertFeedback: [
      {
        expertId: 1,
        name: "Dr. Bob Smith",
        avatar: "/avatars/bob-johnson.jpg",
        feedback: "No signs of recurrence. Healing progressing as expected.",
        vote: "positive",
      },
      {
        expertId: 2,
        name: "Dr. John Doe",
        avatar: "/avatars/jane-smith.jpg",
        feedback: "Clear resection site, no evidence of tumor regrowth.",
        vote: "positive",
      },
      {
        expertId: 3,
        name: "Dr. Emily Brown",
        avatar: "/avatars/joe.jpg",
        feedback: "Post-operative site looks good. No concerning features.",
        vote: "positive",
      },
    ],
  },
  {
    id: 3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtK75NLL8Am-BHCYUpcxIKoKtuxaqt8wo7Xg&s",
    input: "Evaluate for signs of stroke in left hemisphere.",
    consensus: "cross",
    cumulativeFeedback: "Disagreement on presence and location of ischemia",
    expertFeedback: [
      {
        expertId: 1,
        name: "Dr. Bob Smith",
        avatar: "/avatars/bob-johnson.jpg",
        feedback: "No clear signs of acute stroke. Recommend clinical correlation.",
        vote: "negative",
      },
      {
        expertId: 2,
        name: "Dr. John Doe",
        avatar: "/avatars/jane-smith.jpg",
        feedback: "Subtle signs of ischemia in left parietal region. Further imaging advised.",
        vote: "positive",
      },
      {
        expertId: 3,
        name: "Dr. Emily Brown",
        avatar: "/avatars/joe.jpg",
        feedback: "Possible early ischemic changes in left temporal lobe. Needs immediate attention.",
        vote: "positive",
      },
    ],
  },
]

export default function DataViewPage() {
  const params = useParams()
  const [data, setData] = useState(mockData)
  const [selectedExperts, setSelectedExperts] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<typeof mockData[0] | null>(null)

  useEffect(() => {
    // Fetch data from API in a real application
    // For now, we'll use the mock data
  }, [])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const handleExpertSelect = (id: number) => {
    setSelectedExperts(prev => 
      prev.includes(id) ? prev.filter(expertId => expertId !== id) : [...prev, id]
    )
  }

  const filteredData = data
    .filter(item => item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.cumulativeFeedback.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const experts = Array.from(
    new Map(
      data.flatMap(item => 
        item.expertFeedback.map(expert => [
          expert.expertId,
          {
            expertId: expert.expertId,
            name: expert.name,
            avatar: expert.avatar
          }
        ])
      )
    ).values()
  )

  const getConsensusIcon = (consensus: string, expertFeedback: typeof mockData[0]['expertFeedback']) => {
    const totalExperts = expertFeedback.length
    const positiveVotes = expertFeedback.filter(ef => ef.vote === 'positive').length
    const consensusFraction = `${positiveVotes}/${totalExperts}`

    let icon
    switch (consensus) {
      case 'check':
        icon = <CheckCircle className="text-green-500" />
        break
      case 'alert':
        icon = <AlertCircle className="text-yellow-500" />
        break
      case 'cross':
        icon = <XCircle className="text-red-500" />
        break
      default:
        icon = null
    }

    return (
      <div className="flex items-center space-x-2">
        {icon}
        <span>{consensusFraction}</span>
      </div>
    )
  }

  const getFeedbackColor = (vote: string) => {
    switch (vote) {
      case 'positive':
        return 'bg-green-100'
      case 'negative':
        return 'bg-red-100'
      default:
        return 'bg-yellow-100'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data View</h1>
        <Button variant="outline" onClick={() => console.log("Export data")}>
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Data</CardTitle>
          <CardDescription>View and manage expert annotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search annotations..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex space-x-2">
              {experts.slice(0, 3).map(expert => (
                <TooltipProvider key={expert.expertId}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar
                        className={`cursor-pointer ${selectedExperts.includes(expert.expertId) ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleExpertSelect(expert.expertId)}
                      >
                        <AvatarImage src={expert.avatar} alt={expert.name} />
                        <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{expert.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.length === paginatedData.length}
                    onCheckedChange={(checked) => {
                      setSelectedRows(checked ? paginatedData.map(d => d.id) : [])
                    }}
                  />
                </TableHead>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead className="w-[200px]">Input</TableHead>
                <TableHead className="w-[120px]">Consensus</TableHead>
                <TableHead>Cumulative Feedback</TableHead>
                {selectedExperts.map(expertId => (
                  <TableHead key={expertId}>
                    {experts.find(e => e.expertId === expertId)?.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={() => handleRowSelect(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Image src={item.image} alt="MRI Scan" width={100} height={100} className="rounded-md" />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] overflow-hidden">
                      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-left whitespace-normal"
                            onClick={() => setSelectedItem(item)}
                          >
                            {item.input}
                          </Button>
                        </DialogTrigger>
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
                                <Image src={selectedItem.image} alt="MRI Scan" width={400} height={400} className="rounded-md" />
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold">Input:</h3>
                                  <p>{selectedItem.input}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Consensus:</h3>
                                  <div className="flex items-center space-x-2">
                                    {getConsensusIcon(selectedItem.consensus, selectedItem.expertFeedback)}
                                    <span className="capitalize">{selectedItem.consensus}</span>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Cumulative Feedback:</h3>
                                  <p>{selectedItem.cumulativeFeedback}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Expert Feedback:</h3>
                                  {selectedItem.expertFeedback.map((ef, index) => <div key={index} className="mt-2">
                                      <div className="flex items-center space-x-2">
                                        <Avatar>
                                          <AvatarImage src={ef.avatar} alt={ef.name} />
                                          <AvatarFallback>{ef.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <span>{ef.name}</span>
                                      </div>
                                      <p className="mt-1">{ef.feedback}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getConsensusIcon(item.consensus, item.expertFeedback)}
                  </TableCell>
                  <TableCell>{item.cumulativeFeedback}</TableCell>
                  {selectedExperts.map(expertId => {
                    const expertFeedback = item.expertFeedback.find(ef => ef.expertId === expertId)
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

          <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
                </p>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(prev => Math.max(1, prev - 1))
                      }} 
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink 
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(i + 1)
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(prev => Math.min(totalPages, prev + 1))
                      }} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}