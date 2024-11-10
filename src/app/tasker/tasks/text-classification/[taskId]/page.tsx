'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react'

interface Task {
  id: number
  prompt: string
  response: string
}

const mockTask: Task = {
  id: 5,
  prompt: "For how long per day is it advised to take off a removable cast?",
  response: "After a removable cast is applied, it is important to follow the healthcare provider's instructions for its use and care to ensure proper healing of the fracture. When wearing a removable cast, it is generally recommended to keep it on at all times, except when performing specific activities, such as bathing or physical therapy exercises. However, it is important to take off the cast at regular intervals to allow the skin to breathe and to inspect the skin for any signs of irritation or sores. There is no specific guideline for how long a removable cast should be taken off each day. However, it is recommended to take it off for a few minutes at a time, two to three times a day, to allow the skin to breathe and to check for any signs of pressure sores, red marks, blisters, or skin irritation. It is important to handle the body part with care and to avoid any sudden movements that may cause pain or discomfort. The length of time a patient should wear a removable cast and the duration of physical therapy after a fracture can vary depending on the type and severity of the fracture, the patient's age, and other factors. Typically, a removable cast is worn for several weeks, and physical therapy may continue for several months. It is important to follow the healthcare provider's instructions for the proper use and care of a removable cast to ensure the best possible outcome for the fracture."
}

export default function TextClassification() {
  const [rating, setRating] = useState<number>(0)
  const [isRelevant, setIsRelevant] = useState<string | null>(null)
  const [correction, setCorrection] = useState('')
  const totalTasks = 4930
  const completedTasks = 435
  const progress = (completedTasks / totalTasks) * 100

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Text Classification</h1>
        
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Task ID: {mockTask.id}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{mockTask.id} of {totalTasks}</span>
              <div className="flex space-x-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="font-semibold mb-2">Prompt</h2>
              <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md">{mockTask.prompt}</p>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Response</h2>
              <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md min-h-[200px]">{mockTask.response}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-[400px] border-l overflow-auto">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Evaluation</h2>
          
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Progress: {progress.toFixed(2)}% ({completedTasks} of {totalTasks})
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Is the response relevant for the given prompt?</Label>
              <RadioGroup
                value={isRelevant || ''}
                onValueChange={setIsRelevant}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-2 block">Does the response include any of the following?</Label>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hate-speech" />
                  <Label htmlFor="hate-speech">Hate Speech</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="inappropriate" />
                  <Label htmlFor="inappropriate">Inappropriate content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="not-english" />
                  <Label htmlFor="not-english">Not English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="incorrect" />
                  <Label htmlFor="incorrect">Incorrect Information</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Rate the quality of the response:</Label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <Button
                    key={num}
                    variant={rating === num ? "default" : "outline"}
                    className="h-10 w-10"
                    onClick={() => setRating(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="correction" className="mb-2 block">Provide a correction to the response:</Label>
              <Textarea
                id="correction"
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                placeholder="Enter your correction here..."
                className="h-32"
              />
            </div>
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Discard
            </Button>
            <Button variant="outline" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button className="flex-1">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}