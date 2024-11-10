'use client'

import { useState } from 'react'
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
import { BarChart2, ChevronDown, Download, FileText, MoreHorizontal, Plus, ThumbsUp, ThumbsDown, Users, Bot, Target, Zap, Upload } from 'lucide-react'

// Mock data for demonstration purposes
const datasetVersions = [
  { id: 1, version: "1.0", createdAt: "2024-11-01", author: "John Doe", accuracy: 0.85 },
  { id: 2, version: "1.1", createdAt: "2024-11-05", author: "Jane Smith", accuracy: 0.87 },
  { id: 3, version: "1.2", createdAt: "2024-11-10", author: "Alice Johnson", accuracy: 0.89 },
]

const evaluationRuns = [
  { id: 1, name: "Run 1", date: "2024-11-02", status: "Completed", accuracy: 0.86 },
  { id: 2, name: "Run 2", date: "2024-11-07", status: "In Progress", progress: 65 },
  { id: 3, name: "Run 3", date: "2024-11-12", status: "Failed", error: "API Timeout" },
]

export default function EvalViewPage() {
  const [isRunModalOpen, setIsRunModalOpen] = useState(false)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [selectedVersions, setSelectedVersions] = useState<number[]>([])

  const toggleVersionSelection = (id: number) => {
    setSelectedVersions(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Evaluation Dashboard</h1>

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
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Consensus Level</div>
                    <div className="text-2xl font-bold">92%</div>
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
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Recall</div>
                    <div className="text-2xl font-bold">0.92</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">F1 Score</div>
                    <div className="text-2xl font-bold">0.90</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <BarChart2 className="mr-2 h-4 w-4" /> View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setIsCompareModalOpen(true)}>Compare</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evaluation Runs</CardTitle>
            <CardDescription>Manage and monitor evaluation runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Dialog open={isRunModalOpen} onOpenChange={setIsRunModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Run Eval
                  </Button>
                </DialogTrigger>
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
                      <Input id="endpoint" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dataset" className="text-right">
                        Dataset
                      </Label>
                      <Input id="dataset" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Start Run</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluationRuns.map((run) => (
                  <TableRow key={run.id}>
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
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Compare</DropdownMenuItem>
                          {run.status === "Failed" && (
                            <DropdownMenuItem>Retry</DropdownMenuItem>
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
      </div>

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