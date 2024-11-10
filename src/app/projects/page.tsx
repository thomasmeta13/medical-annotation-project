 'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/ui/avatar-group"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowRight, BarChart2 } from 'lucide-react'

// Mock data for active projects
const activeProjects = [
  {
    id: 'PROJ-123',
    title: 'Project Alpha',
    description: 'A revolutionary AI-powered application',
    teamMembers: [
      { id: 1, name: 'John Doe', avatar: '/avatars/joe.jpg' },
      { id: 2, name: 'Jane Smith', avatar: '/avatars/bob-johnson.jpg' },
      { id: 3, name: 'Bob Johnson', avatar: '/avatars/jane-smith.jpg' },
    ],
    tasksAvailable: 5,
    progress: 65,
  },
  {
    id: 'PROJ-456',
    title: 'Project Beta',
    description: 'Next-generation data analytics platform',
    teamMembers: [
      { id: 2, name: 'Jane Smith', avatar: '/avatars/jane-smith.jpg' },
      { id: 4, name: 'Alice Williams', avatar: '/avatars/bob-johnson.jpg' },
    ],
    tasksAvailable: 3,
    progress: 40,
  },
  {
    id: 'PROJ-789',
    title: 'Project Gamma',
    description: 'Blockchain-based supply chain solution',
    teamMembers: [
      { id: 1, name: 'John Doe', avatar: '/avatars/bob-johnson.jpg' },
      { id: 3, name: 'Bob Johnson', avatar: '/avatars/jane-smith.jpg' },
      { id: 5, name: 'Eva Brown', avatar: '/avatars/joe.jpg' },
    ],
    tasksAvailable: 7,
    progress: 80,
  },
]

export default function HomePage() {
  return (
    <div className="p-6 min-h-full w-full bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, User</h1>
            <p className="text-muted-foreground text-lg">Here's an overview of your active projects.</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id} className="block group">
              <Card className="h-full transition-all duration-300 group-hover:shadow-lg border-2 border-border group-hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {project.title}
                    <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {project.tasksAvailable} {project.tasksAvailable === 1 ? 'task' : 'tasks'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <AvatarGroup>
                      {project.teamMembers.map((member) => (
                        <Avatar key={member.id}>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      {project.progress}% complete
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mb-4">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    View Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}