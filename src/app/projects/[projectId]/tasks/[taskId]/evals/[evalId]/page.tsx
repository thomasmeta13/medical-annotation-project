'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration
const mockDataPoints = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  status: Math.random() > 0.3 ? 'passed' : 'failed'
}))

export default function EvalRunProgressPage() {
  const params = useParams()
  const router = useRouter()
  const [currentCheck, setCurrentCheck] = useState(1)
  const [dataPoints, setDataPoints] = useState(mockDataPoints)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (currentCheck < 20 && isRunning) {
      const timer = setTimeout(() => {
        setCurrentCheck(prev => prev + 1)
      }, 500) // Simulate check every 500ms
      return () => clearTimeout(timer)
    } else if (currentCheck === 20) {
      setIsRunning(false)
    }
  }, [currentCheck, isRunning])

  const passedChecks = dataPoints.filter(dp => dp.status === 'passed').length
  const failedChecks = dataPoints.filter(dp => dp.status === 'failed').length

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Evaluation Run Progress</h1>
        <Link href={`/projects/${params.projectId}/evals`} passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run {params.evalId}</CardTitle>
          <CardDescription>Progress of current evaluation run</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.floor((currentCheck / 30) * 100)}%</span>
            </div>
            <Progress value={(currentCheck / 30) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Point Checks</CardTitle>
            <CardDescription>Status of individual data point checks</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {dataPoints.map((dataPoint, index) => (
                <div key={dataPoint.id} className="flex items-center space-x-2 mb-2">
                  {index < currentCheck ? (
                    dataPoint.status === 'passed' ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )
                  ) : index === currentCheck - 1 ? (
                    <AlertCircle className="text-yellow-500 animate-pulse" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={index < currentCheck ? 'text-foreground' : 'text-muted-foreground'}>
                    Check {dataPoint.id}: {index < currentCheck ? dataPoint.status : 'Pending'}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evaluation Summary</CardTitle>
            <CardDescription>Overview of the evaluation results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Checks:</span>
                <span className="font-semibold">{dataPoints.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Completed Checks:</span>
                <span className="font-semibold">{currentCheck - 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Passed Checks:</span>
                <span className="font-semibold text-green-600">{passedChecks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Failed Checks:</span>
                <span className="font-semibold text-red-600">{failedChecks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Success Rate:</span>
                <span className="font-semibold">
                  {((passedChecks / (currentCheck - 1)) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              disabled={isRunning}
              onClick={() => router.push(`/projects/${params.projectId}/evals/${params.evalId}/details`)}
            >
              {isRunning ? 'Evaluation in Progress...' : 'View Detailed Results'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}