'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Users, UserCog, Edit, Check } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { AvatarGroup } from "@/components/ui/avatar-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

// Mock data
const tasks = [
  { 
    id: 1, 
    name: 'Annotate Medical Images', 
    status: 'active', 
    coverage: 75, 
    lastEdit: '2023-04-01', 
    accuracy: 92,
    assignees: [
      { id: 1, name: 'John Doe', avatar: '/avatars/joe.jpg', lastSubmission: new Date().toISOString() },
      { id: 2, name: 'Jane Smith', avatar: '/avatars/jane-smith.jpg', lastSubmission: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
      { id: 3, name: 'Bob Johnson', avatar: '/avatars/bob-johnson.jpg', lastSubmission: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString() },
    ]
  },
  { 
    id: 2, 
    name: 'Sentence equivalence questions', 
    status: 'pending', 
    coverage: 50, 
    lastEdit: '2023-03-28', 
    accuracy: 88,
    assignees: [
      { id: 1, name: 'John Doe', avatar: '/avatars/joe.jpg', lastSubmission: new Date().toISOString() },
      { id: 2, name: 'Jane Smith', avatar: '/avatars/jane-smith.jpg', lastSubmission: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
      { id: 3, name: 'Bob Johnson', avatar: '/avatars/bob-johnson.jpg', lastSubmission: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString() },
      { id: 4, name: 'Alice Williams', avatar: '/avatars/alice-williams.png', lastSubmission: new Date().toISOString() },
      { id: 5, name: 'Charlie Brown', avatar: '/avatars/charlie-brown.png', lastSubmission: new Date().toISOString() },
    ]
  },
  { 
    id: 3, 
    name: 'Reading comprehension questions', 
    status: 'completed', 
    coverage: 100, 
    lastEdit: '2023-03-25', 
    accuracy: 95,
    assignees: [
      { id: 2, name: 'Jane Smith', avatar: '/avatars/jane-smith.png', lastSubmission: new Date().toISOString() },
    ]
  },
]

const teamMembers = [
  { id: 1, name: 'John Doe', role: 'Developer', avatar: '/avatars/joe.jpg', lastSubmission: '2024-03-15 14:30' },
  { id: 2, name: 'Jane Smith', role: 'QA', avatar: '/avatars/jane-smith.jpg', lastSubmission: '2024-03-14 16:45' },
  { id: 3, name: 'Bob Johnson', role: 'QA', avatar: '/avatars/bob-johnson.jpg', lastSubmission: '2024-03-15 09:15' },
]

const getStatusColor = (lastSubmission: string) => {
  const now = new Date();
  const submission = new Date(lastSubmission);
  const hoursDiff = (now.getTime() - submission.getTime()) / (1000 * 60 * 60);

  if (hoursDiff < 24) return 'border-green-500';  // Less than 24 hours
  if (hoursDiff < 72) return 'border-yellow-500'; // Less than 3 days
  return 'border-red-500';                        // More than 3 days
}


export default function ProjectView() {
    const [projectId] = useState('PROJ-123')
    const [isCopied, setIsCopied] = useState(false)
    const { toast } = useToast()
  
    const copyProjectId = () => {
      navigator.clipboard.writeText(projectId)
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "Project ID copied to clipboard",
        duration: 2000,
      })
      setTimeout(() => setIsCopied(false), 2000)
    }

  return (
    <div className="p-6 min-h-full w-full">
      <div className="max-w-full mx-auto space-y-8">
        <div className="space-y-4 border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Project Alpha</h1>
              <p className="text-muted-foreground">A revolutionary AI-powered application</p>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2  p-2 rounded-md cursor-pointer" onClick={copyProjectId}>
                  <Badge variant="outline" className="font-normal">
                        ID: {projectId}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-6 w-6 ml-1 transition-colors ${isCopied ? 'text-green-500' : 'text-muted-foreground'}`}
                    >
                      {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? 'Copied!' : 'Click to copy'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Start: Jan 15, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Due: Mar 31, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <AvatarGroup>
                {teamMembers.slice(0, 3).map((member) => (
                  <Avatar key={member.id}>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <span>{teamMembers.length} team members</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr),400px] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Overview of project tasks and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <Link 
                    href={`/projects/${projectId}/tasks/${task.id}`} 
                    key={task.id}
                    className="block hover:bg-accent/50 transition-colors"
                  >
                    <li 
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4 gap-2"
                    >
                      <div className="space-y-2 flex-grow">
                        <h3 className="font-semibold">{task.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge 
                            variant={
                              task.status === 'active' 
                                ? 'default' 
                                : task.status === 'pending' 
                                ? 'secondary' 
                                : 'outline'
                            }
                          >
                            {task.status}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span>Coverage:</span>
                            <Progress value={task.coverage} className="w-20" />
                            <span>{task.coverage}%</span>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AvatarGroup className="hover:cursor-pointer -space-x-2">
                                  {task.assignees.slice(0, 3).map((assignee) => (
                                    <Avatar key={assignee.id} className={`border-2 ${getStatusColor(assignee.lastSubmission)}`}>
                                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                      <AvatarFallback>{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {task.assignees.length > 3 && (
                                    <Avatar className="border-2 border-background">
                                      <AvatarFallback>+{task.assignees.length - 3}</AvatarFallback>
                                    </Avatar>
                                  )}
                                </AvatarGroup>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {task.assignees.map((assignee) => (
                                    <div key={assignee.id}>{assignee.name} - Last submission: {assignee.lastSubmission}</div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm text-muted-foreground">Last edit: {task.lastEdit}</p>
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-medium">Accuracy:</span>
                          <span className="text-sm font-medium">{task.accuracy}%</span>
                        </div>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Developers and QAs working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    Developers
                  </h3>
                  <ul className="space-y-2">
                    {teamMembers.filter(member => member.role === 'Developer').map((member) => (
                      <li key={member.id} className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar>
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Last submission: {member.lastSubmission}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <UserCog className="h-4 w-4" />
                    QA
                  </h3>
                  <ul className="space-y-2">
                    {teamMembers.filter(member => member.role === 'QA').map((member) => (
                      <li key={member.id} className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newMember">Add Team Member</Label>
                  <div className="flex flex-col gap-2">
                    <Input id="newMember" placeholder="Enter email" />
                    <Button className="w-full">Add</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}