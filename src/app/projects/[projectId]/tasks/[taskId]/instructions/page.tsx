'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Link,
  Code,
  Save,
  Undo,
  Redo,
  PlusCircle,
  Settings,
  Trash2,
  Type,
  CheckSquare,
  AlignLeft
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Category = 'text-classification' | 'image-segmentation' | 'named-entity-recognition'
type ComponentType = 'text-input' | 'label' | 'checkbox' | 'text-area'

interface InstructionComponent {
  id: string
  type: ComponentType
  content: string
}

export default function InstructionPage() {
  const [markdown, setMarkdown] = useState('')
  const [category, setCategory] = useState<Category>('text-classification')
  const [instructionName, setInstructionName] = useState('')
  const [trainingExamples, setTrainingExamples] = useState('10')
  const [labels, setLabels] = useState<string[]>(['Positive', 'Negative', 'Neutral'])
  const [newLabel, setNewLabel] = useState('')
  const [components, setComponents] = useState<InstructionComponent[]>([])
  const [newComponentContent, setNewComponentContent] = useState('')

  useEffect(() => {
    updateInstructions()
  }, [category, labels, components])

  const updateInstructions = () => {
    let instructions = `# ${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Instructions\n\n`

    if (category === 'text-classification') {
      instructions += `## Task Description\n\nClassify the given text into one of the following categories: ${labels.join(', ')}.\n\n`
      instructions += `## Interface Elements\n\n`
      instructions += `1. Text Input: Enter the text to be classified\n`
      instructions += `2. Classification Buttons: ${labels.join(', ')}\n\n`
    } else if (category === 'image-segmentation') {
      instructions += `## Task Description\n\nSegment the given image by identifying and labeling specific regions.\n\n`
      instructions += `## Interface Elements\n\n`
      instructions += `1. Image Display: The image to be segmented\n`
      instructions += `2. Segmentation Tools: Use these to mark regions in the image\n`
      instructions += `3. Label Buttons: ${labels.join(', ')}\n\n`
    } else if (category === 'named-entity-recognition') {
      instructions += `## Task Description\n\nIdentify and label named entities in the given text.\n\n`
      instructions += `## Interface Elements\n\n`
      instructions += `1. Text Input: Enter the text for named entity recognition\n`
      instructions += `2. Entity Type Buttons: Person, Organization, Location\n\n`
    }

    instructions += `## Additional Components\n\n`
    components.forEach((component, index) => {
      instructions += `${index + 1}. ${component.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: ${component.content}\n`
    })

    instructions += `\n## Instructions\n\n${markdown}`

    setMarkdown(instructions)
  }

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value)
  }

  const insertComponent = (componentType: ComponentType) => {
    const newComponent: InstructionComponent = {
      id: Date.now().toString(),
      type: componentType,
      content: newComponentContent || `New ${componentType}`
    }
    setComponents([...components, newComponent])
    setNewComponentContent('')
  }

  const updateComponent = (id: string, content: string) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, content } : comp
    ))
  }

  const removeComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id))
  }

  const addLabel = () => {
    if (newLabel.trim() !== '') {
      setLabels([...labels, newLabel.trim()])
      setNewLabel('')
    }
  }

  const removeLabel = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index))
  }

  const applyMarkdownStyle = (style: string) => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let newText = ''
    switch (style) {
      case 'bold':
        newText = `**${selectedText}**`
        break
      case 'italic':
        newText = `*${selectedText}*`
        break
      case 'list':
        newText = `\n- ${selectedText}`
        break
      case 'code':
        newText = `\`${selectedText}\``
        break
      default:
        newText = selectedText
    }

    setMarkdown(prevMarkdown => 
      prevMarkdown.substring(0, start) + newText + prevMarkdown.substring(end)
    )
  }

  const renderPreview = () => {
    const renderComponents = components.map((component) => {
      switch (component.type) {
        case 'text-input':
          return <Input key={component.id} placeholder={component.content} className="mb-2" />
        case 'label':
          return <Label key={component.id}>{component.content}</Label>
        case 'checkbox':
          return (
            <div key={component.id} className="flex items-center space-x-2 mb-2">
              <Checkbox id={`checkbox-${component.id}`} />
              <label htmlFor={`checkbox-${component.id}`}>{component.content}</label>
            </div>
          )
        case 'text-area':
          return <Textarea key={component.id} placeholder={component.content} className="mb-2" />
        default:
          return null
      }
    })

    switch (category) {
      case 'image-segmentation':
        return (
          <div className="p-4 border rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Image Segmentation Interface</h2>
            <div className="mb-4">
              <img src="/placeholder.svg?height=300&width=400" alt="Segmentation" className="border rounded-lg" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {labels.map((label, index) => (
                <Button key={index} variant="outline">{label}</Button>
              ))}
            </div>
            {renderComponents}
          </div>
        )
      case 'text-classification':
        return (
          <div className="p-4 border rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Text Classification Interface</h2>
            <div className="mb-4">
              <Textarea placeholder="Enter text to classify" className="w-full h-32" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {labels.map((label, index) => (
                <Button key={index} variant="outline">{label}</Button>
              ))}
            </div>
            {renderComponents}
          </div>
        )
      case 'named-entity-recognition':
        return (
          <div className="p-4 border rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Named Entity Recognition Interface</h2>
            <div className="mb-4">
              <Textarea placeholder="Enter text for NER" className="w-full h-32" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="outline">Person</Button>
              <Button variant="outline">Organization</Button>
              <Button variant="outline">Location</Button>
            </div>
            {renderComponents}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Instruction Page Editor</h1>
      <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
        <ResizablePanel defaultSize={75}>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            {renderPreview()}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <Tabs defaultValue="settings">
            <TabsList className="w-full">
              <TabsTrigger value="settings" className="w-1/2">Settings</TabsTrigger>
              <TabsTrigger value="instructions" className="w-1/2">Instructions</TabsTrigger>
            </TabsList>
            <TabsContent value="settings">
              <ScrollArea className="h-[700px] w-full rounded-md border p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Instruction Settings</CardTitle>
                    <CardDescription>Configure settings for your instructions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Instruction Name</Label>
                        <Input 
                          id="name" 
                          value={instructionName}
                          onChange={(e) => setInstructionName(e.target.value)}
                          placeholder="Enter instruction name" 
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="category">Labeling Category</Label>
                        <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="text-classification">Text Classification</SelectItem>
                            <SelectItem value="image-segmentation">Image Segmentation</SelectItem>
                            <SelectItem value="named-entity-recognition">Named Entity Recognition</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="examples">Number of Training Examples</Label>
                        <Input 
                          id="examples" 
                          type="number" 
                          value={trainingExamples}
                          onChange={(e) => setTrainingExamples(e.target.value)}
                          placeholder="Enter number of examples" 
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="labels">Labels</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="labels" 
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder="Enter a label" 
                          />
                          <Button onClick={addLabel}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {labels.map((label, index) => (
                            <div key={index} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                              {label}
                              <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0" onClick={() => removeLabel(index)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label>Additional Components</Label>
                        <div className="flex space-x-2">
                          <Input 
                            value={newComponentContent}
                            onChange={(e) => setNewComponentContent(e.target.value)}
                            placeholder="Component content" 
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => insertComponent('text-input')}>
                                <Type className="mr-2 h-4 w-4" />
                                Text Input
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => insertComponent('label')}>
                                <AlignLeft className="mr-2 h-4 w-4" />
                                Label
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => insertComponent('checkbox')}>
                                <CheckSquare className="mr-2 h-4 w-4" />
                                Checkbox
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => insertComponent('text-area')}>
                                <AlignLeft className="mr-2 h-4 w-4" />
                                Text Area
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2 mt-2">
                          {components.map((component) => (
                            <div key={component.id} className="flex items-center justify-between bg-secondary text-secondary-foreground rounded-md px-3 py-2">
                              <span>{component.type}: {component.content}</span>
                              <div className="flex space-x-2">
                                <Input 
                                  value={component.content}
                                  onChange={(e) => updateComponent(component.id, e.target.value)}
                                  className="w-40"
                                />
                                <Button variant="ghost" size="sm" onClick={() => removeComponent(component.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="instructions">
              <ScrollArea className="h-[700px] w-full rounded-md border p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Button variant="outline" size="icon" onClick={() => applyMarkdownStyle('bold')}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => applyMarkdownStyle('italic')}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => applyMarkdownStyle('list')}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => applyMarkdownStyle('code')}>
                    <Code className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="icon">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  id="markdown-editor"
                  placeholder="Type your instructions here..."
                  value={markdown}
                  onChange={handleMarkdownChange}
                  className="min-h-[500px]"
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" className="mr-2">
          <Settings className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Instructions
        </Button>
      </div>
    </div>
  )
}