'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart2, ChevronDown, Download, FileText, MoreHorizontal, Plus, ThumbsUp, ThumbsDown, Users, Bot, Target, Zap, Upload } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration purposes
const datasetVersions = [
  { id: 1, version: "1.0", createdAt: "2024-11-01", author: "John Doe", accuracy: 0.85, precision: 0.86, humanRating: 0.84, aiRating: 0.85 },
  { id: 2, version: "1.1", createdAt: "2024-11-05", author: "Jane Smith", accuracy: 0.87, precision: 0.88, humanRating: 0.86, aiRating: 0.87 },
  { id: 3, version: "1.2", createdAt: "2024-11-10", author: "Alice Johnson", accuracy: 0.89, precision: 0.90, humanRating: 0.88, aiRating: 0.89 },
  { id: 4, version: "1.3", createdAt: "2024-11-15", author: "Bob Wilson", accuracy: 0.91, precision: 0.92, humanRating: 0.90, aiRating: 0.91 },
]

const evaluationRuns = [
  { id: 1, name: "Run 1", date: "2024-11-02", status: "Completed", accuracy: 0.86, completeness: 0.88, dataVersion: "1.0", insights: "Improved accuracy on edge cases" },
  { id: 2, name: "Run 2", date: "2024-11-07", status: "In Progress", progress: 65, dataVersion: "1.1" },
  { id: 3, name: "Run 3", date: "2024-11-12", status: "Failed", error: "API Timeout", dataVersion: "1.2" },
  { id: 4, name: "Run 4", date: "2024-11-17", status: "Completed", accuracy: 0.90, completeness: 0.92, dataVersion: "1.3", insights: "Significant improvement in overall performance" },
]

const latestEvalStats = {
  precision: 0.89,
  precisionChange: 0.03,
  humanRating: 0.92,
  humanRatingChange: 0.01,
  aiRating: 0.90,
  aiRatingChange: 0.02,
}

export default function EvalViewPage() {
  const params = useParams()
  const router = useRouter()
  const [isRunModalOpen, setIsRunModalOpen] = useState(false)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [selectedVersions, setSelectedVersions] = useState<number[]>([])
  const [selectedDataset, setSelectedDataset] = useState<string>("")
  const [apiEndpoint, setApiEndpoint] = useState<string>("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("versions")

  const toggleVersionSelection = (id: number) => {
    setSelectedVersions(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  const handleRunEval = () => {
    const newEvalId = nanoid()
    console.log(`Starting new evaluation with ID: ${newEvalId}, Dataset: ${selectedDataset || uploadedFile?.name}, API Endpoint: ${apiEndpoint}`)
    setIsRunModalOpen(false)
    router.push(`/projects/${params.projectId}/evals/${newEvalId}`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setSelectedDataset("")
    }
  }

  const navigateToRunPage = (runId: number) => {
    router.push(`/projects/${params.projectId}/evals/${runId}/details`)
  }

  const renderComparisonChart = () => {
    const chartData = datasetVersions.map(version => ({
      version: version.version,
      accuracy: version.accuracy,
      precision: version.precision,
      humanRating: version.humanRating,
      aiRating: version.aiRating,
    }))

    return (
      <ChartContainer
        config={{
          accuracy: { label: 'Accuracy', color: 'hsl(var(--chart-1))' },
          precision: { label: 'Precision', color: 'hsl(var(--chart-2))' },
          humanRating: { label: 'Human Rating', color: 'hsl(var(--chart-3))' },
          aiRating: { label: 'AI Rating', color: 'hsl(var(--chart-4))' },
        }}
        className="h-[200px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="version" />
            <YAxis domain={[0.8, 1]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="accuracy" stroke="var(--color-accuracy)" />
            <Line type="monotone" dataKey="precision" stroke="var(--color-precision)" />
            <Line type="monotone" dataKey="humanRating" stroke="var(--color-humanRating)" />
            <Line type="monotone" dataKey="aiRating" stroke="var(--color-aiRating)" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Evaluation Dashboard</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Dataset Version Comparison</CardTitle>
            <CardDescription>Compare metrics across different dataset versions</CardDescription>
          </div>
          <div className="space-x-2">
            <Button variant="default" size="sm" onClick={() => setIsRunModalOpen(true)}>
              Run Eval
            </Button>
            <Button variant="outline" size="sm">
              <BarChart2 className="mr-2 h-4 w-4" /> View Detailed Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr,200px] gap-4">
            <div className="w-full">
              {renderComparisonChart()}
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Precision</div>
                <div className="text-2xl font-bold">{latestEvalStats.precision.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {latestEvalStats.precisionChange > 0 ? '+' : ''}
                  {latestEvalStats.precisionChange.toFixed(2)} from last run
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Human Rating</div>
                <div className="text-2xl font-bold">{latestEvalStats.humanRating.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {latestEvalStats.humanRatingChange > 0 ? '+' : ''}
                  {latestEvalStats.humanRatingChange.toFixed(2)} from last run
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">AI Rating</div>
                <div className="text-2xl font-bold">{latestEvalStats.aiRating.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {latestEvalStats.aiRatingChange > 0 ? '+' : ''}
                  {latestEvalStats.aiRatingChange.toFixed(2)} from last run
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2 mx-auto">
            <TabsTrigger value="versions">
              <FileText className="mr-2 h-4 w-4" />
              Dataset Versions
            </TabsTrigger>
            <TabsTrigger value="runs">
              <Zap className="mr-2 h-4 w-4" />
              Evaluation Runs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="versions">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Versions</CardTitle>
                <CardDescription>Manage and compare evaluation dataset versions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Precision</TableHead>
                      <TableHead>Human Rating</TableHead>
                      <TableHead>AI Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datasetVersions.map((version) => (
                      <TableRow key={version.id}>
                        <TableCell>{version.version}</TableCell>
                        <TableCell>{version.createdAt}</TableCell>
                        <TableCell>{version.author}</TableCell>
                        <TableCell>{version.accuracy.toFixed(2)}</TableCell>
                        <TableCell>{version.precision.toFixed(2)}</TableCell>
                        <TableCell>{version.humanRating.toFixed(2)}</TableCell>
                        <TableCell>{version.aiRating.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Compare</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="runs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Evaluation Runs</CardTitle>
                <div className="space-x-2">
                  <Button onClick={() => setIsRunModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Run Eval
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" /> Export
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" /> Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" /> Export as JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Completeness</TableHead>
                      <TableHead>Data Version</TableHead>
                      <TableHead>Insights</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluationRuns.map((run) => (
                      <TableRow key={run.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigateToRunPage(run.id)}>
                        <TableCell>{run.name}</TableCell>
                        <TableCell>{run.date}</TableCell>
                        <TableCell>
                          {run.status === "Completed" && <Badge>Completed</Badge>}
                          {run.status === "In Progress" && (
                            <div className="flex items-center">
                              <Progress value={run.progress} className="w-[60px] mr-2" />
                              <span>{run.progress}%</span>
                            </div>
                          )}
                          {run.status === "Failed" && <Badge variant="destructive">Failed</Badge>}
                        </TableCell>
                        <TableCell>{run.accuracy ? run.accuracy.toFixed(2) : '-'}</TableCell>
                        <TableCell>{run.completeness ? run.completeness.toFixed(2) : '-'}</TableCell>
                        <TableCell>{run.dataVersion}</TableCell>
                        <TableCell>{run.insights || '-'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                navigateToRunPage(run.id)
                              }}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Compare</DropdownMenuItem>
                              {run.status === "Failed" && (
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Retry</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isRunModalOpen} onOpenChange={setIsRunModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Evaluation Run</DialogTitle>
            <DialogDescription>
              Set up the parameters for your evaluation run.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endpoint" className="text-right">
                API Endpoint
              </Label>
              <Input 
                id="endpoint" 
                className="col-span-3" 
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataset" className="text-right">
                Dataset
              </Label>
              <Select 
                value={selectedDataset} 
                onValueChange={(value) => {
                  setSelectedDataset(value)
                  setUploadedFile(null)
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a dataset" />
                </SelectTrigger>
                <SelectContent>
                  {datasetVersions.map((version) => (
                    <SelectItem key={version.id} value={version.version}>
                      Version {version.version} ({version.createdAt})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upload" className="text-right">
                Upload New Data
              </Label>
              <Input
                id="upload"
                type="file"
                className="col-span-3"
                onChange={handleFileUpload}
              />
            </div>
            {uploadedFile && (
              <div className="col-span-4 text-sm text-muted-foreground">
                Uploaded: {uploadedFile.name}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleRunEval}>Start Run</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Compare Dataset Versions</DialogTitle>
            <DialogDescription>
              Select the versions you want to compare or upload a new dataset.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {datasetVersions.map((version) => (
              <div key={version.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`version-${version.id}`}
                  checked={selectedVersions.includes(version.id)}
                  onCheckedChange={() => toggleVersionSelection(version.id)}
                />
                <Label htmlFor={`version-${version.id}`}>
                  Version {version.version} ({version.createdAt})
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Dataset
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={selectedVersions.length < 2}>Compare Selected</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}