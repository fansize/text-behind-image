'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

// 统一使用数据库格式
interface SurveyData {
  question1_answers: string[]
  question2_answers: string[]
  question3_answer: string
}

const STRINGS = {
  title: 'Help us improve your experience!',
  description: 'Your feedback helps us build better tools for you',
  questions: {
    useCases: {
      title: '1. What type of content do you create with Text Behind Image?',
      options: [
        'Instagram, Facebook, Twitter',
        'YouTube thumbnails',
        'Business presentations',
        'Marketing materials (ads, banners, flyers)',
        'Personal projects',
        'E-commerce product images',
        'Blog posts',
        'Website headers and hero sections',
        'Other'
      ]
    },
    struggles: {
      title: "2. What's your biggest challenge?",
      options: [
        'Unsatisfied with output quality',
        'Manual positioning takes too long',
        'Limited templates and styles',
        'Tools too complex to use',
      ]
    },
    suggestions: {
      title: '3. What should we build next?',
      placeholder: 'Share your feature suggestions...'
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
  onComplete?: () => void
}

export default function UserSurvey({ onComplete }: UserSurveyProps) {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    question1_answers: [],
    question2_answers: [],
    question3_answer: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // 生成会话ID用于匿名用户
 

  const handleUseCaseChange = (option: string, checked: boolean) => {
    setSurveyData(prev => ({
      ...prev,
      question1_answers: checked 
        ? [...prev.question1_answers, option]
        : prev.question1_answers.filter(item => item !== option)
    }))
  }

  const handleStruggleChange = (option: string, checked: boolean) => {
    setSurveyData(prev => ({
      ...prev,
      question2_answers: checked 
        ? [...prev.question2_answers, option]
        : prev.question2_answers.filter(item => item !== option)
    }))
  }

  const handleSuggestionsChange = (value: string) => {
    setSurveyData(prev => ({
      ...prev,
      question3_answer: value
    }))
  }

  const handleSubmit = async () => {
    // 验证必填项
    if (surveyData.question1_answers.length === 0) {
      toast({
        title: STRINGS.toast.validation.title,
        description: STRINGS.toast.validation.description,
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      })

      if (response.ok) {
        toast({
          title: STRINGS.toast.success.title,
          description: STRINGS.toast.success.description
        })
        
        // 重置表单
        setSurveyData({
          question1_answers: [],
          question2_answers: [],
          question3_answer: ''
        })
        
        // 调用完成回调
        onComplete?.()
      } else {
        throw new Error('Failed to save survey')
      }
    } catch (error) {
      console.error('Survey submission error:', error)
      toast({
        title: STRINGS.toast.error.title,
        description: STRINGS.toast.error.description,
        variant: "destructive"
      })
      // 即使出错也调用完成回调，不阻塞用户操作
      onComplete?.()
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
        {/* 第一个问题 */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">
            {STRINGS.questions.useCases.title}
          </Label>
          <div className="space-y-3">
            {STRINGS.questions.useCases.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`usecase-${option}`}
                  checked={surveyData.question1_answers.includes(option)}
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

        {/* 第二个问题 */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">
            {STRINGS.questions.struggles.title}
          </Label>
          <div className="space-y-3">
            {STRINGS.questions.struggles.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`struggle-${option}`}
                  checked={surveyData.question2_answers.includes(option)}
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

        {/* 第三个问题 */}
        <div className="space-y-4">
          <Label htmlFor="suggestions" className="text-lg font-semibold">
            {STRINGS.questions.suggestions.title}
          </Label>
          <Textarea
            id="suggestions"
            placeholder={STRINGS.questions.suggestions.placeholder}
            value={surveyData.question3_answer}
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