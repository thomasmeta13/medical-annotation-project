'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brush, Eraser, Square, Circle, Undo, Redo, Save, ChevronRight, ChevronLeft } from 'lucide-react'

interface SegmentationTool {
  name: string
  icon: React.ReactNode
}

const tools: SegmentationTool[] = [
  { name: 'brush', icon: <Brush className="h-6 w-6" /> },
  { name: 'eraser', icon: <Eraser className="h-6 w-6" /> },
  { name: 'rectangle', icon: <Square className="h-6 w-6" /> },
  { name: 'circle', icon: <Circle className="h-6 w-6" /> },
]

interface Label {
  name: string
  color: string
  instruction: string
}

const labels: Label[] = [
  { name: 'Background', color: '#000000', instruction: 'Label all non-specific areas as background.' },
  { name: 'Object 1', color: '#FF0000', instruction: 'Segment the main subject of the image.' },
  { name: 'Object 2', color: '#00FF00', instruction: 'Identify and label any secondary objects.' },
  { name: 'Object 3', color: '#0000FF', instruction: 'Mark any additional objects of interest.' },
]

export default function ImageSegmentation() {
  const [selectedTool, setSelectedTool] = useState<string>('brush')
  const [selectedLabel, setSelectedLabel] = useState<string>(labels[0].name)
  const [brushSize, setBrushSize] = useState<number>(10)
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const image = new Image()
    image.src = '/placeholder.svg?height=600&width=800'
    image.onload = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (ctx && canvas) {
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        setImageLoaded(true)
      }
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setStartPos({ x, y })
    }
    if (['brush', 'eraser'].includes(selectedTool)) {
      draw(e)
    }
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false)
    if (['rectangle', 'circle'].includes(selectedTool)) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (ctx && canvas && startPos) {
        const rect = canvas.getBoundingClientRect()
        const endX = e.clientX - rect.left
        const endY = e.clientY - rect.top
        drawShape(ctx, startPos.x, startPos.y, endX, endY)
      }
    }
    setStartPos(null)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !imageLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ctx.strokeStyle = labels.find(label => label.name === selectedLabel)?.color || '#000000'
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'

      if (selectedTool === 'brush') {
        ctx.globalCompositeOperation = 'source-over'
      } else if (selectedTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
      }

      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const drawShape = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) => {
    const color = labels.find(label => label.name === selectedLabel)?.color || '#000000'
    ctx.strokeStyle = color
    ctx.fillStyle = color + '40' // Add 25% opacity for the fill
    ctx.lineWidth = brushSize

    if (selectedTool === 'rectangle') {
      ctx.beginPath()
      ctx.rect(startX, startY, endX - startX, endY - startY)
      ctx.stroke()
      ctx.fill()
    } else if (selectedTool === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
      ctx.beginPath()
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()
    }
  }

  const handleSubmit = () => {
    // In a real application, this would send the segmentation data to the server
    console.log('Submitting segmentation data')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Image Segmentation</h1>
        
        <div className="flex space-x-4 mb-4">
          {tools.map((tool) => (
            <Button
              key={tool.name}
              onClick={() => setSelectedTool(tool.name)}
              variant={selectedTool === tool.name ? "default" : "outline"}
            >
              {tool.icon}
              <span className="ml-2 capitalize">{tool.name}</span>
            </Button>
          ))}
        </div>

        <div className="mb-4">
          <Label>Brush Size</Label>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            max={50}
            step={1}
          />
        </div>

        <div className="mb-4">
          <Label>Select Label</Label>
          <RadioGroup value={selectedLabel} onValueChange={setSelectedLabel}>
            {labels.map((label) => (
              <div key={label.name} className="flex items-center space-x-2">
                <RadioGroupItem value={label.name} id={label.name} />
                <Label htmlFor={label.name}>
                  <span className="flex items-center">
                    <span
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: label.color }}
                    />
                    {label.name}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="border rounded-lg overflow-hidden mb-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            className="w-full h-auto cursor-crosshair"
          />
        </div>

        <div className="flex justify-between">
          <div>
            <Button variant="outline" className="mr-2">
              <Undo className="mr-2 h-4 w-4" />
              Undo
            </Button>
            <Button variant="outline">
              <Redo className="mr-2 h-4 w-4" />
              Redo
            </Button>
          </div>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      <div className={`bg-gray-100 border-l transition-all duration-300 ease-in-out ${isInstructionsOpen ? 'w-80' : 'w-12'}`}>
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full mb-4"
            onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
          >
            {isInstructionsOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">Toggle Instructions</span>
          </Button>
          {isInstructionsOpen && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Goal</h3>
                    <p>Segment the image by identifying and labeling different objects or regions according to the provided categories.</p>
                  </div>
                  {labels.map((label) => (
                    <div key={label.name}>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <span
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.name}
                      </h3>
                      <p>{label.instruction}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>
    </div>
  )
}