import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek, parseJSONResponse } from '@/lib/deepseek';
import { PROMPTS, fillPrompt } from '@/lib/prompts';
import { ParsedResume, ParsedJD, RatingMatchResult, OptimizedResume } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, jd, matchResult } = body as {
      resume: ParsedResume;
      jd: ParsedJD;
      matchResult: RatingMatchResult;
    };

    if (!resume || !jd || !matchResult) {
      return NextResponse.json(
        { error: 'Resume, JD, and match result are required' },
        { status: 400 }
      );
    }

    const optimizePrompt = fillPrompt(PROMPTS.optimizeResume, {
      resume: JSON.stringify(resume, null, 2),
      jd: JSON.stringify(jd, null, 2),
      analysis: JSON.stringify(matchResult, null, 2),
    });

    const response = await callDeepSeek([
      { role: 'user', content: optimizePrompt },
    ], { temperature: 0.7, maxTokens: 8192 });

    const optimizations = parseJSONResponse<{
      optimizedSummary: string;
      optimizedExperience: ParsedResume['experience'];
      addedKeywords: string[];
    }>(response);

    const optimizedResume: OptimizedResume = {
      ...resume,
      optimizedSummary: optimizations.optimizedSummary,
      optimizedExperience: optimizations.optimizedExperience,
      addedKeywords: optimizations.addedKeywords,
    };

    return NextResponse.json(optimizedResume);
  } catch (error) {
    console.error('Error generating resume:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate resume';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
