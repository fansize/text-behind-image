import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// 统一使用数据库格式
interface SurveyData {
  user_id?: string | null;
  session_id?: string | null;
  question1_answers?: string[] | null;
  question2_answers?: string[] | null;
  question3_answer?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const data: SurveyData = await request.json();
    
    // 使用类型断言绕过 TypeScript 检查
    const { error } = await (supabase as any)
      .from('user_surveys')
      .insert(data);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { error: 'Failed to save survey' },
      { status: 500 }
    );
  }
}