'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ChevronRight, Edit3, SortAsc, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'

interface Task {
  id: string
  name: string
  description: string
  version: string
  completionPercentage: number
  type: 'text-classification' | 'img-segmentation'
}

interface Project {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
}

const mockProject: Project = {
  id: '123',
  name: 'Medical Image Analysis',
  totalTasks: 50,
  completedTasks: 22
}

const mockTasks: Task[] = [
  { id: '1', name: "Review MRI Scans", description: "Analyze a set of MRI scans for potential abnormalities.", version: "v2", completionPercentage: 75, type: 'img-segmentation' },
  { id: '2', name: "Medical Report Classification", description: "Classify medical reports into diagnostic categories.", version: "v1", completionPercentage: 100, type: 'text-classification' },
  { id: '3', name: "Patient Symptom Analysis", description: "Categorize patient symptoms into disease groups.", version: "v3", completionPercentage: 30, type: 'text-classification' },
  { id: '4', name: "Segment Brain Tumors", description: "Outline and segment brain tumors in MRI scans.", version: "v2", completionPercentage: 0, type: 'img-segmentation' },
  { id: '5', name: "Treatment Response Classification", description: "Classify patient treatment responses.", version: "v1", completionPercentage: 60, type: 'text-classification' },
  { id: '6', name: "Process Ultrasound Data", description: "Enhance and interpret ultrasound images for diagnostic purposes.", version: "v2", completionPercentage: 45, type: 'img-segmentation' },
  { id: '7', name: "Medical Notes Analysis", description: "Classify medical notes into severity levels.", version: "v1", completionPercentage: 80, type: 'text-classification' },
  { id: '8', name: "Analyze Retinal Images", description: "Detect retinal diseases from high-resolution fundus photographs.", version: "v3", completionPercentage: 20, type: 'img-segmentation' },
  { id: '9', name: "Diagnostic Report Classification", description: "Classify diagnostic reports by condition type.", version: "v2", completionPercentage: 55, type: 'text-classification' },
  { id: '10', name: "Analyze Bone Density Scans", description: "Evaluate bone mineral density from DEXA scan images.", version: "v1", completionPercentage: 90, type: 'img-segmentation' },
]

export default function TaskView() {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [sortCriteria, setSortCriteria] = useState<'name' | 'completionPercentage' | 'version'>('name')
  const [isProposingData, setIsProposingData] = useState(false)
  const [proposedData, setProposedData] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  useEffect(() => {
    setProject(mockProject)
    setTasks(mockTasks)
  }, [])

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortCriteria === 'name') return a.name.localeCompare(b.name)
    if (sortCriteria === 'completionPercentage') return b.completionPercentage - a.completionPercentage
    return a.version.localeCompare(b.version)
  })

  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage)

  const handleLabelTask = (task: Task) => {
    const route = task.type === 'text-classification' 
      ? `/tasker/tasks/text-classification/${task.id}`
      : `/tasker/tasks/img-segmentation/${task.id}`
    router.push(route)
  }

  const handleProposeData = () => {
    console.log('Submitting proposed data:', proposedData)
    setIsProposingData(false)
    setProposedData('')
  }

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-gray-800">{project.name}</CardTitle>
            <div className="text-sm font-medium text-gray-500">
              Project ID: {project.id}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 w-full">
              <div className="text-lg font-semibold text-gray-700 mb-2">Overall Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                >
                  {((project.completedTasks / project.totalTasks) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="flex-1 w-full md:w-auto">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-800">{project.completedTasks}</div>
                  <div className="text-sm text-gray-500">Completed Tasks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">{project.totalTasks}</div>
                  <div className="text-sm text-gray-500">Total Tasks</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Task List</h2>
            <div className="flex items-center space-x-4">
              <Select onValueChange={(value) => setSortCriteria(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="completionPercentage">Completion</SelectItem>
                  <SelectItem value="version">Version</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsProposingData(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Propose New Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead className="w-[400px]">Description</TableHead>
              <TableHead className="w-[100px]">Version</TableHead>
              <TableHead className="w-[200px]">Completion</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.version}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${task.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{task.completionPercentage}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleLabelTask(task)}>
                    {task.type === 'text-classification' ? 'Label' : 'Annotate'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isProposingData} onOpenChange={setIsProposingData}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose New Data</DialogTitle>
            <DialogDescription>
              Submit your own queries or prompt sets to enhance the dataset.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="proposedData">Your Proposal</Label>
              <Textarea
                id="proposedData"
                placeholder="Enter your queries or prompt sets here..."
                value={proposedData}
                onChange={(e) => setProposedData(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleProposeData}>Submit Proposal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}