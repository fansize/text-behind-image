'use client'

import UserSurvey from '@/components/user-survey';
import Link from 'next/link';

export default function SurveyPage() {
  const handleSurveyComplete = () => {
    console.log('Survey completed successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 简化的导航栏 */}
      <nav className="flex items-center justify-between px-10 py-4 border-b bg-white dark:bg-zinc-900">
        <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
          TextBehindImage
        </Link>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <UserSurvey onComplete={handleSurveyComplete} />
        </div>
      </div>
    </div>
  );
}