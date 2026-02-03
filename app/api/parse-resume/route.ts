import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek, parseJSONResponse } from '@/lib/deepseek';
import { PROMPTS } from '@/lib/prompts';
import { ParsedResume } from '@/types';
import { classifyExperienceAndProjects } from '@/lib/resume-classifier';

export const maxDuration = 60;

async function extractTextWithPdfParse(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default;
  const pdfData = await pdfParse(buffer);
  return pdfData.text;
}

export async function POST(request: NextRequest) {
  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel serverless limit)
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '文件大小不能超过 4MB，请压缩 PDF 后重试' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 使用 pdf-parse 解析 PDF
    let rawText = '';
    try {
      rawText = await extractTextWithPdfParse(buffer);
    } catch (err) {
      console.error('PDF parse error:', err);
      return NextResponse.json({ error: '无法解析 PDF 文件，请确保是文字型 PDF（非扫描件）' }, { status: 400 });
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json({ error: '无法从 PDF 提取足够文本，请确保是文字型 PDF（非扫描件）' }, { status: 400 });
    }

    // Use DeepSeek to parse the resume
    const response = await callDeepSeek([
      { role: 'system', content: PROMPTS.parseResume },
      { role: 'user', content: rawText },
    ], { temperature: 0.3 });

    const parsed = parseJSONResponse<Omit<ParsedResume, 'rawText'>>(response);

    // 后处理：使用规则对工作经历和项目经历进行重新分类
    const classified = classifyExperienceAndProjects({ ...parsed, rawText });

    return NextResponse.json(classified);
  } catch (error) {
    console.error('Error parsing resume:', error);
    const message = error instanceof Error ? error.message : 'Failed to parse resume';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
