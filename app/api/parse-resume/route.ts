import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek, parseJSONResponse } from '@/lib/deepseek';
import { PROMPTS } from '@/lib/prompts';
import { ParsedResume } from '@/types';
import { classifyExperienceAndProjects } from '@/lib/resume-classifier';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

export const maxDuration = 60; // 最大执行时间 60 秒

async function extractTextWithPdfParse(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default;
  const pdfData = await pdfParse(buffer);
  return pdfData.text;
}

async function extractTextWithPdftotext(buffer: Buffer): Promise<string> {
  const tempPath = join(tmpdir(), `resume-${Date.now()}.pdf`);
  try {
    await writeFile(tempPath, buffer);
    const { stdout } = await execAsync(`pdftotext "${tempPath}" -`);
    return stdout;
  } finally {
    await unlink(tempPath).catch(() => {});
  }
}

export async function POST(request: NextRequest) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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
      return NextResponse.json({ error: '文件大小不能超过 10MB' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 尝试用 pdf-parse 解析，如果失败或文本太少则用 pdftotext
    let rawText = '';
    try {
      rawText = await extractTextWithPdfParse(buffer);
    } catch {
      // pdf-parse 失败，忽略
    }

    // 如果 pdf-parse 提取的文本太少（<100字符），尝试 pdftotext
    if (rawText.trim().length < 100) {
      try {
        const pdftotextResult = await extractTextWithPdftotext(buffer);
        if (pdftotextResult.trim().length > rawText.trim().length) {
          rawText = pdftotextResult;
        }
      } catch {
        // pdftotext 也失败了，使用 pdf-parse 的结果
      }
    }

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
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
