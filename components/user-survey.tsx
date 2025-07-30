'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface SurveyData {
  useCases: string[]
  struggles: string[]
  suggestions: string
}

const STRINGS = {
  title: 'Help us improve your experience!',
  description: 'Your feedback helps us build better tools for you',
  questions: {
    useCases: {
      title: '1.When do you need Text Behind Image?',
      options: [
        'Creating social media graphics',
        'Making video thumbnails',
        'Building presentation slides',
        'Other'
      ]
    },
    struggles: {
      title: "2.What's your struggle with current tools?",
      options: [
        'Lack of auto-layout adjustment',
        'Hard to blend text naturally with background'
      ]
    },
    suggestions: {
      title: '3.What should we build next?',
      placeholder: 'Tell us what features or improvements you\'d like to see...'
    }
  },
  button: {
    submit: 'Submit Feedback',
    submitting: 'Submitting...'
  },
  toast: {
    validation: {
      title: 'Please select use cases',
      description: 'Please select at least one scenario where you use Text Behind Image'
    },
    success: {
      title: 'Thank you for your feedback!',
      description: 'Your suggestions are very valuable to us and we will consider them carefully.'
    },
    error: {
      title: 'Submission failed',
      description: 'Please try again later'
    }
  }
}

interface UserSurveyProps {
  onComplete?: () => void // 添加完成回调
}

export default function UserSurvey({ onComplete }: UserSurveyProps) {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    useCases: [],
    struggles: [],
    suggestions: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleUseCaseChange = (option: string, checked: boolean) => {
    setSurveyData(prev => ({
      ...prev,
      useCases: checked 
        ? [...prev.useCases, option]
        : prev.useCases.filter(item => item !== option)
    }))
  }

  const handleStruggleChange = (option: string, checked: boolean) => {
    setSurveyData(prev => ({
      ...prev,
      struggles: checked 
        ? [...prev.struggles, option]
        : prev.struggles.filter(item => item !== option)
    }))
  }

  const handleSuggestionsChange = (value: string) => {
    setSurveyData(prev => ({
      ...prev,
      suggestions: value
    }))
  }

  const handleSubmit = async () => {
    if (surveyData.useCases.length === 0) {
      toast({
        title: STRINGS.toast.validation.title,
        description: STRINGS.toast.validation.description,
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // 这里可以添加提交到后端的逻辑
      console.log('Survey data:', surveyData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: STRINGS.toast.success.title,
        description: STRINGS.toast.success.description
      })
      
      // 重置表单
      setSurveyData({
        useCases: [],
        struggles: [],
        suggestions: ''
      })
      
      // 调用完成回调
      onComplete?.()
    } catch (error) {
      toast({
        title: STRINGS.toast.error.title,
        description: STRINGS.toast.error.description,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          {STRINGS.title}
        </h2>
      </div>
      <div className="space-y-8">
        {/* 第一个问题：使用场景 */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">
            {STRINGS.questions.useCases.title}
          </Label>
          <div className="space-y-3">
            {STRINGS.questions.useCases.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`usecase-${option}`}
                  checked={surveyData.useCases.includes(option)}
                  onCheckedChange={(checked) => 
                    handleUseCaseChange(option, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`usecase-${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* 第二个问题：遇到的困难 */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">
            {STRINGS.questions.struggles.title}
          </Label>
          <div className="space-y-3">
            {STRINGS.questions.struggles.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`struggle-${option}`}
                  checked={surveyData.struggles.includes(option)}
                  onCheckedChange={(checked) => 
                    handleStruggleChange(option, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`struggle-${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* 第三个问题：建议 */}
        <div className="space-y-4">
          <Label htmlFor="suggestions" className="text-lg font-semibold">
            {STRINGS.questions.suggestions.title}
          </Label>
          <Textarea
            id="suggestions"
            placeholder={STRINGS.questions.suggestions.placeholder}
            value={surveyData.suggestions}
            onChange={(e) => handleSuggestionsChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2"
          >
            {isSubmitting ? STRINGS.button.submitting : STRINGS.button.submit}
          </Button>
        </div>
      </div>
    </div>
  )
}