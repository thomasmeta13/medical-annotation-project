'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, FileSpreadsheet, BarChart2, Search, Bell, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Info, X } from 'lucide-react'
import Link from 'next/link'

// Mock data for the task and experts
const taskData = {
  id: 'TASK-001',
  title: 'Annotate Medical Images',
  description: 'Identify and label key anatomical structures in a set of MRI scans.',
  version: '1.2',
  experts: [
    { id: 1, name: 'Dr. Jane Smith', avatar: '/avatars/jane-smith.jpg', progress: 75, version: '1.2', status: 'in-progress' as const, latestEdit: '2024-11-09T14:30:00Z' },
    { id: 2, name: 'Dr. John Doe', avatar: 'https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/64e6deed-a575-4435-b72b-690ea4499d25/7d3d2055-bc33-4a62-a099-3173fc10800f.png', progress: 100, version: '1.2', status: 'completed' as const, latestEdit: '2024-11-08T16:45:00Z' },
    { id: 3, name: 'Dr. Emily Brown', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiF6hZYQnt3GiOt4TN9fwazbqjFvDOEw5fiw&s', progress: 30, version: '1.1', status: 'in-progress' as const, latestEdit: '2024-11-09T10:15:00Z' },
    { id: 4, name: 'Dr. Michael Lee', avatar: 'https://www.imc-healthcare.com/wp-content/uploads/2022/08/international-medical-clinic-headshots-square-Dr-Chris-Eldridge.jpg', progress: 0, version: '1.2', status: 'not-started' as const, latestEdit: null },
  ]
}

// Updated mock data for insights and notifications
const insightsData = {
  alerts: [
    { expertId: 3, icon: AlertCircle, message: 'Dr. Emily Brown is behind schedule (30% complete).' },
    { expertId: 4, icon: AlertCircle, message: 'Dr. Michael Lee has not started the task.' },
  ],
  progress: [
    { expertId: 2, icon: CheckCircle, message: 'Dr. John Doe has completed all annotations.' },
    { expertId: 1, icon: Clock, message: 'Dr. Jane Smith: Average time per annotation: 3.5 minutes.' },
  ],
  quality: [
    { expertId: 1, icon: AlertTriangle, message: 'Dr. Jane Smith: High disagreement rate (15%) on tumor classification.' },
    { expertId: 2, icon: CheckCircle, message: 'Dr. John Doe: Inter-annotator agreement at 85% for critical structures.' },
  ],
  trends: [
    { expertId: 1, icon: TrendingUp, message: 'Dr. Jane Smith: Annotation speed improving by 5% week-over-week.' },
    { expertId: 3, icon: TrendingDown, message: 'Dr. Emily Brown: Slight decrease in overall annotation quality (-2%).' },
  ]
}

interface Expert {
  id: number
  name: string
  avatar: string
  progress: number
  version: string
  status: 'completed' | 'in-progress' | 'not-started'
  latestEdit: string | null
}

interface InsightItem {
  expertId: number
  icon: any // You might want to be more specific about the icon type
  message: string
}

interface InsightsData {
  alerts: InsightItem[]
  progress: InsightItem[]
  quality: InsightItem[]
  trends: InsightItem[]
}

export default function TaskView() {
  const params = useParams()
  const [taskId, setTaskId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (params.taskId) {
      setTaskId(params.taskId as string)
    }
  }, [params.taskId])

  const filteredExperts = taskData.experts
    .filter(expert => expert.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(expert => filterStatus === 'all' || expert.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'progress') return b.progress - a.progress
      if (sortBy === 'latestEdit') return new Date(b.latestEdit || 0).getTime() - new Date(a.latestEdit || 0).getTime()
      return 0
    })

  const openExpertDashboard = (expert: Expert) => {
    setSelectedExpert(expert)
    setIsModalOpen(true)
  }

  const getExpertInsights = (expertId: number) => {
    return Object.entries(insightsData).reduce<Record<keyof InsightsData, InsightItem[]>>((acc, [category, items]) => {
      const filteredItems = items.filter(item => item.expertId === expertId)
      if (filteredItems.length > 0) {
        acc[category as keyof InsightsData] = filteredItems
      }
      return acc
    }, {} as Record<keyof InsightsData, InsightItem[]>)
  }

  return (
    <div className="p-6 min-h-full w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{taskData.title}</h1>
            <p className="text-muted-foreground">{taskData.description}</p>
          </div>
          <Badge variant="outline">Version {taskData.version}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Domain Experts</CardTitle>
            <CardDescription>Manage and monitor the progress of experts working on this task.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search experts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Search className="text-muted-foreground" />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="latestEdit">Latest Edit</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expert</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Latest Edit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperts.map((expert) => (
                  <TableRow key={expert.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={expert.avatar} alt={expert.name} />
                          <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{expert.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={expert.progress} className="w-[100px]" />
                        <span>{expert.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{expert.version}</TableCell>
                    <TableCell>{expert.latestEdit ? new Date(expert.latestEdit).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/projects/${params.projectId}/tasks/${taskId}/spreadsheet/${expert.id}`} passHref>
                          <Button variant="outline" size="sm">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Spreadsheet
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => openExpertDashboard(expert)}>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Insights and Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="alerts" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-200 dark:bg-gray-700">
                  <TabsTrigger value="alerts" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Alerts</TabsTrigger>
                  <TabsTrigger value="progress" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Progress</TabsTrigger>
                  <TabsTrigger value="quality" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Quality</TabsTrigger>
                  <TabsTrigger value="trends" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Trends</TabsTrigger>
                </TabsList>
                {Object.entries(insightsData).map(([category, items]) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                          <div className={`p-2 rounded-full ${getCategoryColor(category)}`}>
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm">{item.message}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Data View
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Dashboard View
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Bell className="mr-2 h-4 w-4" />
                  Adjudication View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>{selectedExpert?.name} - Dashboard</span>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Insights and notifications specific to {selectedExpert?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {selectedExpert && Object.entries(getExpertInsights(selectedExpert.id)).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold mb-2 capitalize">{category}</h3>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                      <div className={`p-2 rounded-full ${getCategoryColor(category)}`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm">{item.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'alerts':
      return 'bg-red-500 dark:bg-red-600'
    case 'progress':
      return 'bg-blue-500 dark:bg-blue-600'
    case 'quality':
      return 'bg-yellow-500 dark:bg-yellow-600'
    case 'trends':
      return 'bg-green-500 dark:bg-green-600'
    default:
      return 'bg-gray-500 dark:bg-gray-600'
  }
}