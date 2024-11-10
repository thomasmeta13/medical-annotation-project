'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Tag } from 'lucide-react'

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

export default function TaskerProjectsPage() {
  const router = useRouter()

  const handleStartLabeling = (projectId: string) => {
    // For now, we'll use a hardcoded taskId - in reality this would come from your API
    const taskId = "task-123"
    router.push(`/tasker/tasks/text-classification/${taskId}`)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Available Projects</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {mockProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.tasksCompleted} / {project.totalTasks} tasks</span>
                  </div>
                  <Progress value={(project.tasksCompleted / project.totalTasks) * 100} />
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => handleStartLabeling(project.id)}
                    className="flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    Start Labeling
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}