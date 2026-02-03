import { ResumeSection, IssuePriority, ResumeRating } from '@/types';

export const SECTION_CONFIG: Record<ResumeSection, { label: string; labelCn: string }> = {
  personal_info: { label: 'Personal Info', labelCn: '个人信息' },
  summary: { label: 'Summary', labelCn: '个人简介' },
  education: { label: 'Education', labelCn: '教育背景' },
  skills: { label: 'Skills', labelCn: '技能' },
  working_experience: { label: 'Working Experience', labelCn: '工作经历' },
};

export const PRIORITY_CONFIG: Record<IssuePriority, { label: string; labelCn: string; color: string; bgColor: string }> = {
  URGENT: {
    label: 'Immediate Revision',
    labelCn: '需要立刻修订',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  CRITICAL: {
    label: 'High Impact Revision',
    labelCn: '对结果影响较大',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  OPTIONAL: {
    label: 'Suggested Revision',
    labelCn: '建议性修订',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
};

export const RATING_CONFIG: Record<ResumeRating, { label: string; description: string; color: string; bgColor: string }> = {
  A: {
    label: 'EXCELLENT',
    description: 'Your resume is well-structured with minimal issues',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  B: {
    label: 'GOOD',
    description: 'Your resume is solid but has some areas for improvement',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  C: {
    label: 'SATISFACTORY',
    description: 'Your resume needs significant improvements',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
};
