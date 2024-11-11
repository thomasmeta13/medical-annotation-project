'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Clock, PlusCircle } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  tasksCompleted: number
  totalTasks: number
  status: 'On Track' | 'At Risk' | 'Behind Schedule'
  dueDate: string
}

interface Task {
  id: string
  title: string
  projectId: string
  projectName: string
  assignedAt: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: "AI Model Evaluation",
    description: "Evaluate the performance of our latest AI model on medical image analysis.",
    tasksCompleted: 15,
    totalTasks: 50,
    status: 'On Track',
    dueDate: '2024-12-14'
  },
  {
    id: '2',
    name: "Data Annotation",
    description: "Annotate a large dataset of X-ray images for machine learning training.",
    tasksCompleted: 80,
    totalTasks: 100,
    status: 'At Risk',
    dueDate: '2024-11-29'
  },
  {
    id: '3',
    name: "Algorithm Optimization",
    description: "Optimize our current algorithms for faster processing of medical data.",
    tasksCompleted: 5,
    totalTasks: 20,
    status: 'Behind Schedule',
    dueDate: '2024-12-01'
  },
  {
    id: '4',
    name: "User Interface Testing",
    description: "Conduct usability tests on the new radiologist interface.",
    tasksCompleted: 30,
    totalTasks: 40,
    status: 'On Track',
    dueDate: '2024-12-31'
  }
]

const mockTasks: Task[] = [
  {
    id: 't1',
    title: "Review MRI scan #1234",
    projectId: '1',
    projectName: "AI Model Evaluation",
    assignedAt: "2024-11-09T05:58:00Z"
  },
  {
    id: 't2',
    title: "Annotate chest X-ray batch #5678",
    projectId: '2',
    projectName: "Data Annotation",
    assignedAt: "2024-11-09T06:58:00Z"
  },
  {
    id: 't3',
    title: "Implement new image preprocessing algorithm",
    projectId: '3',
    projectName: "Algorithm Optimization",
    assignedAt: "2024-11-09T07:58:00Z"
  }
]

export default function TaskerDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setProjects(mockProjects)
    setTasks(mockTasks)
  }, [])

  const getStatusStyles = (status: Project['status']) => {
    switch (status) {
      case 'On Track':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'At Risk':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Behind Schedule':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60))
    return `${diffInHours} hours ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, Anon</h1>
          <p className="text-muted-foreground text-lg">Here's an overview of your active projects.</p>
        </div>
      </div>        

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(project => {
                const progress = (project.tasksCompleted / project.totalTasks) * 100
                return (
                  <Card key={project.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="p-6 space-y-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-gray-600 mt-1 text-sm">{project.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(project.status)}`}>
                          {project.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-200" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Tasks: {project.tasksCompleted}/{project.totalTasks}</span>
                          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4">
                      <Button 
                        className="w-full bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors duration-300"
                        onClick={() => router.push(`/tasker/projects/${project.id}/tasks`)}
                      >
                        Go to Tasks
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">New Tasks</h2>
            <Card className="overflow-hidden">
              <div className="divide-y divide-gray-200">
                {tasks.map((task, index) => (
                  <div key={task.id} className="p-6 space-y-4 transition-colors duration-300 hover:bg-gray-50">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.projectName}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(task.assignedAt)}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full text-blue-600 hover:bg-blue-50 border-blue-200 transition-colors duration-300"
                      onClick={() => router.push(`/tasker/projects/${task.projectId}/tasks`)}
                    >
                      View Task
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}