'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { AlertCircle, FileSpreadsheet, BarChart2, Search, Bell, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, LayoutDashboard, Users, CheckSquare } from 'lucide-react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const taskData = {
  id: 'TASK-001',
  title: 'Annotate Medical Images',
  description: 'Identify and label key anatomical structures in a set of MRI scans.',
  version: '1.2',
  experts: [
    { id: 1, name: 'Dr. Jane Smith', avatar: '/avatars/jane-smith.jpg', progress: 75, version: '1.2', status: 'in-progress' as const, latestEdit: '2024-11-09T14:30:00Z', timeSpent: 26, tasksCompleted: 52 },
    { id: 2, name: 'Dr. John Doe', avatar: 'https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/64e6deed-a575-4435-b72b-690ea4499d25/7d3d2055-bc33-4a62-a099-3173fc10800f.png', progress: 100, version: '1.2', status: 'completed' as const, latestEdit: '2024-11-08T16:45:00Z', timeSpent: 28, tasksCompleted: 60 },
    { id: 3, name: 'Dr. Emily Brown', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiF6hZYQnt3GiOt4TN9fwazbqjFvDOEw5fiw&s', progress: 30, version: '1.1', status: 'in-progress' as const, latestEdit: '2024-11-09T10:15:00Z', timeSpent: 22, tasksCompleted: 18 },
    { id: 4, name: 'Dr. Michael Lee', avatar: 'https://www.imc-healthcare.com/wp-content/uploads/2022/08/international-medical-clinic-headshots-square-Dr-Chris-Eldridge.jpg', progress: 0, version: '1.2', status: 'not-started' as const, latestEdit: null, timeSpent: 0, tasksCompleted: 0 },
  ]
}

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

const timeSpentData = [
  { name: 'Dr. Jane Smith', Monday: 5, Tuesday: 4, Wednesday: 6, Thursday: 3, Friday: 5, Saturday: 2, Sunday: 1 },
  { name: 'Dr. John Doe', Monday: 4, Tuesday: 5, Wednesday: 4, Thursday: 6, Friday: 4, Saturday: 3, Sunday: 2 },
  { name: 'Dr. Emily Brown', Monday: 3, Tuesday: 3, Wednesday: 5, Thursday: 4, Friday: 6, Saturday: 1, Sunday: 0 },
  { name: 'Dr. Michael Lee', Monday: 6, Tuesday: 5, Wednesday: 4, Thursday: 5, Friday: 3, Saturday: 2, Sunday: 1 },
]

const lastWeekTimeSpentData = [
  { name: 'Dr. Jane Smith', total: 24 },
  { name: 'Dr. John Doe', total: 26 },
  { name: 'Dr. Emily Brown', total: 20 },
  { name: 'Dr. Michael Lee', total: 23 },
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const expertColors = {
  'Dr. Jane Smith': 'hsl(180, 70%, 45%)',  // Teal
  'Dr. John Doe': 'hsl(45, 90%, 50%)',     // Gold
  'Dr. Emily Brown': 'hsl(330, 70%, 60%)', // Pink
  'Dr. Michael Lee': 'hsl(100, 60%, 50%)', // Lime Green
}

const additionalMetrics = {
  avgTaskTime: 4.2,
  avgAgreement: 82,
  accuracyProgress: 78,
  consistencyScore: 85,
  efficiencyRating: 76,
}

const taskMetricsData = [
  { metric: 'Avg Task Time', value: additionalMetrics.avgTaskTime, fullMark: 10 },
  { metric: 'Avg Agreement', value: additionalMetrics.avgAgreement, fullMark: 100 },
  { metric: 'Accuracy Progress', value: additionalMetrics.accuracyProgress, fullMark: 100 },
  { metric: 'Consistency Score', value: additionalMetrics.consistencyScore, fullMark: 100 },
  { metric: 'Efficiency Rating', value: additionalMetrics.efficiencyRating, fullMark: 100 },
]

function TimeSpentChart({ data, visibleExperts }: { data: typeof timeSpentData, visibleExperts: string[] }) {
  const chartData = days.map(day => ({
    name: day,
    ...Object.fromEntries(
      data
        .filter(expert => visibleExperts.includes(expert.name))
        .map(expert => [expert.name, expert[day as keyof typeof expert]])
    )
  }))

  return (
    <ChartContainer
      config={Object.fromEntries(
        data.map(expert => [
          expert.name,
          { label: expert.name, color: expertColors[expert.name as keyof typeof expertColors] }
        ])
      )}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {data
            .filter(expert => visibleExperts.includes(expert.name))
            .map(expert => (
              <Bar key={expert.name} dataKey={expert.name} stackId="a" fill={expertColors[expert.name as keyof typeof expertColors]} />
            ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

function TaskMetricsChart() {
  return (
    <ChartContainer 
      config={{
        'Task Metrics': { label: 'Task Metrics', color: '#8884d8' }
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={taskMetricsData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Task Metrics" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

function MetricCard({ title, value, unit = '%' }: { title: string; value: number; unit?: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="text-sm font-medium">
        {value}{unit}
      </span>
    </div>
  )
}

interface Expert {
  id: number
  name: string
  avatar: string
  progress: number
  version: string
  status: 'completed' | 'in-progress' | 'not-started'
  latestEdit: string | null
  timeSpent: number
  tasksCompleted: number
}

interface InsightItem {
  expertId: number
  icon: LucideIcon
  message: string
}

interface InsightsData {
  alerts: InsightItem[]
  progress: InsightItem[]
  quality: InsightItem[]
  trends: InsightItem[]
}

function formatTimeAgo(date: string | null) {
  if (!date) return 'N/A'
  const now = new Date()
  const editDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - editDate.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

function InsightCard({ category, items, className }: { category: string; items: InsightItem[]; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-3 capitalize">{category}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className={`p-2 rounded-full ${getCategoryColor(category)}`}>
              <item.icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm">{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TaskView() {
  const params = useParams()
  const [taskId, setTaskId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterStatus, setFilterStatus] = useState('all')
  const [visibleExperts, setVisibleExperts] = useState(taskData.experts.map(expert => expert.name))
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
      if (sortBy === 'timeSpent') return b.timeSpent - a.timeSpent
      return 0
    })

  const toggleExpertVisibility = (expertName: string) => {
    setVisibleExperts(prev =>
      prev.includes(expertName)
        ? prev.filter(name => name !== expertName)
        : [...prev, expertName]
    )
  }

  const totalHoursThisWeek = useMemo(() => {
    return timeSpentData.reduce((total, expert) => {
      return total + Object.values(expert).filter(value => typeof value === 'number').reduce((sum, value) => sum + value, 0)
    }, 0)
  }, [])

  const totalHoursLastWeek = useMemo(() => {
    return lastWeekTimeSpentData.reduce((total, expert) => total + expert.total, 0)
  }, [])

  const mostActiveAnnotator = useMemo(() => {
    return timeSpentData.reduce((mostActive, expert) => {
      const expertTotal = Object.values(expert).filter(value => typeof value === 'number').reduce((sum, value) => sum + value, 0)
      return expertTotal > mostActive.total ? { name: expert.name, total: expertTotal } : mostActive
    }, { name: '', total: 0 })
  }, [])

  const openExpertInsights = (expert: Expert) => {
    setSelectedExpert(expert)
    setIsModalOpen(true)
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

        <div className="grid gap-6">
          <Card>
            {/* <CardHeader>
              <CardTitle>Insights and Notifications</CardTitle>
            </CardHeader> */}
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                <InsightCard category="alerts" items={insightsData.alerts} />
                <InsightCard category="progress" items={insightsData.progress} />
                <InsightCard category="quality" items={insightsData.quality} />
                <InsightCard category="trends" items={insightsData.trends} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Tabs defaultValue="experts" className="w-full">
              <TabsList className="grid w-[400px] grid-cols-2 mx-auto">
                <TabsTrigger value="experts">
                  <Users className="mr-2 h-4 w-4" />
                  Domain Experts
                </TabsTrigger>
                <TabsTrigger value="dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </TabsTrigger>
              </TabsList>
              <TabsContent value="experts" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Domain Experts</CardTitle>
                        <CardDescription>Manage and monitor the progress of experts working on this task.</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Search experts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-64"
                        />
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="progress">Progress</SelectItem>
                            <SelectItem value="latestEdit">Last Edit</SelectItem>
                            <SelectItem value="timeSpent">Time Spent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Expert</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Last Edit</TableHead>
                          <TableHead>Time Spent</TableHead>
                          <TableHead>Tasks Completed</TableHead>
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
                            <TableCell>{formatTimeAgo(expert.latestEdit)}</TableCell>
                            <TableCell>{expert.timeSpent} hours</TableCell>
                            <TableCell>{expert.tasksCompleted}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Link href={`/projects/${params.projectId}/tasks/${taskId}/spreadsheet/${expert.id}`} passHref>
                                  <Button variant="outline" size="sm">
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Spreadsheet
                                  </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => openExpertInsights(expert)}>
                                  <BarChart2 className="mr-2 h-4 w-4" />
                                  Insights
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="dashboard" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Time Spent on Labeling (Past Week)</CardTitle>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">Total Hours: {totalHoursThisWeek}</p>
                          <p className="text-muted-foreground">
                            {totalHoursThisWeek > totalHoursLastWeek ? (
                              <span className="text-green-500">▲ {((totalHoursThisWeek - totalHoursLastWeek) / totalHoursLastWeek * 100).toFixed(1)}%</span>
                            ) : (
                              <span className="text-red-500">▼ {((totalHoursLastWeek - totalHoursThisWeek) / totalHoursLastWeek * 100).toFixed(1)}%</span>
                            )} vs last week
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Most Active: {mostActiveAnnotator.name}</p>
                          <p className="text-muted-foreground">{mostActiveAnnotator.total} hours</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end space-x-2 mb-6">
                        {taskData.experts.map(expert => (
                          <button
                            key={expert.id}
                            onClick={() => toggleExpertVisibility(expert.name)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              visibleExperts.includes(expert.name) ? 'ring-2 ring-primary ring-offset-2' : 'opacity-50'
                            }`}
                          >
                            <Avatar className="w-full h-full">
                              <AvatarImage src={expert.avatar} alt={expert.name} />
                              <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          </button>
                        ))}
                      </div>
                      <TimeSpentChart data={timeSpentData} visibleExperts={visibleExperts} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Task Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <TaskMetricsChart />
                      <div className="grid grid-cols-2 gap-2">
                        <MetricCard title="Avg Task Time" value={additionalMetrics.avgTaskTime} unit=" min" />
                        <MetricCard title="Avg Agreement" value={additionalMetrics.avgAgreement} />
                        <MetricCard title="Accuracy Progress" value={additionalMetrics.accuracyProgress} />
                        <MetricCard title="Consistency Score" value={additionalMetrics.consistencyScore} />
                        <MetricCard title="Efficiency Rating" value={additionalMetrics.efficiencyRating} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>{selectedExpert?.name} - Insights</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-6 bg-muted p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium mr-2">Time Spent:</span>
                <span className="text-lg font-bold">{selectedExpert?.timeSpent} hours</span>
              </div>
              <div className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium mr-2">Tasks Completed:</span>
                <span className="text-lg font-bold">{selectedExpert?.tasksCompleted}</span>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {selectedExpert && Object.entries(insightsData).map(([category, items]) => {
                const expertItems = items.filter(item => item.expertId === selectedExpert.id)
                if (expertItems.length === 0) return null
                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 capitalize">{category}</h3>
                    <div className="space-y-4">
                      {expertItems.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                          <div className={`p-2 rounded-full ${getCategoryColor(category)}`}>
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm">{item.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
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