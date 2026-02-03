import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek, parseJSONResponse } from '@/lib/deepseek';
import { PROMPTS, fillPrompt } from '@/lib/prompts';
import { ParsedResume, ParsedJD, RatingMatchResult, ResumeIssue, AnalysisSummary } from '@/types';
import { normalizeAllIssues, countIssuesByPriority, calculateRating, groupIssuesBySection } from '@/lib/rating';

interface AIAnalysisResponse {
  summary: AnalysisSummary;
  matchedSkills: string[];
  missingSkills: string[];
  issues: ResumeIssue[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, jdText } = body as { resume: ParsedResume; jdText: string };

    if (!resume) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    if (!jdText || jdText.trim().length === 0) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    // Parse the JD
    const jdResponse = await callDeepSeek([
      { role: 'system', content: PROMPTS.parseJD },
      { role: 'user', content: jdText },
    ], { temperature: 0.3 });

    const parsedJD = parseJSONResponse<Omit<ParsedJD, 'rawText'>>(jdResponse);
    const jd: ParsedJD = { ...parsedJD, rawText: jdText };

    // Analyze resume with new rating system
    const analysisPrompt = fillPrompt(PROMPTS.analyzeResumeRating, {
      resume: JSON.stringify(resume, null, 2),
      jd: JSON.stringify(jd, null, 2),
    });

    const analysisResponse = await callDeepSeek([
      { role: 'user', content: analysisPrompt },
    ], { temperature: 0.5 });

    const aiResult = parseJSONResponse<AIAnalysisResponse>(analysisResponse);

    // Post-process: normalize priorities based on problem types
    const normalizedIssues = normalizeAllIssues(aiResult.issues);

    // Calculate issue counts and rating
    const issueCounts = countIssuesByPriority(normalizedIssues);
    const rating = calculateRating(issueCounts);

    // Group issues by section
    const sectionIssues = groupIssuesBySection(normalizedIssues);

    const matchResult: RatingMatchResult = {
      rating,
      issueCounts,
      summary: aiResult.summary,
      matchedSkills: aiResult.matchedSkills,
      missingSkills: aiResult.missingSkills,
      issues: normalizedIssues,
      sectionIssues,
    };

    return NextResponse.json({ jd, matchResult });
  } catch (error) {
    console.error('Error analyzing:', error);
    const message = error instanceof Error ? error.message : 'Failed to analyze';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
