'use client';

import { useState, useCallback } from 'react';
import { OptimizedResume, WorkExperience, Education, Project } from '@/types';

interface ResumeEditorProps {
  resume: OptimizedResume;
  onUpdate: (resume: OptimizedResume) => void;
  onExport: () => void;
}

type SectionType = 'info' | 'summary' | 'education' | 'experience' | 'skills' | 'projects';

interface Section {
  id: SectionType;
  label: string;
  labelCn: string;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'info', label: 'Personal Info', labelCn: '个人信息' },
  { id: 'summary', label: 'Summary', labelCn: '个人简介' },
  { id: 'education', label: 'Education', labelCn: '教育背景' },
  { id: 'experience', label: 'Work Experience', labelCn: '工作经历' },
  { id: 'skills', label: 'Skills', labelCn: '技能' },
  { id: 'projects', label: 'Projects', labelCn: '项目经历' },
];

function MoveButtons({
  index,
  total,
  onMoveUp,
  onMoveDown
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        onClick={onMoveUp}
        disabled={index === 0}
        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        title="上移"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        title="下移"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

function SectionHeader({
  section,
  index,
  total,
  onMoveUp,
  onMoveDown
}: {
  section: Section;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">
        {section.label}
        <span className="text-sm text-gray-400 ml-2">({section.labelCn})</span>
      </h3>
      <MoveButtons index={index} total={total} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
    </div>
  );
}

function InfoSection({ resume, onUpdate }: { resume: OptimizedResume; onUpdate: (r: OptimizedResume) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
        <input
          value={resume.name}
          onChange={(e) => onUpdate({ ...resume, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
        <input
          value={resume.email}
          onChange={(e) => onUpdate({ ...resume, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
        <input
          value={resume.phone || ''}
          onChange={(e) => onUpdate({ ...resume, phone: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">地点</label>
        <input
          value={resume.location || ''}
          onChange={(e) => onUpdate({ ...resume, location: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
        <input
          value={resume.linkedin || ''}
          onChange={(e) => onUpdate({ ...resume, linkedin: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
        <input
          value={resume.github || ''}
          onChange={(e) => onUpdate({ ...resume, github: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">个人网站</label>
        <input
          value={resume.website || ''}
          onChange={(e) => onUpdate({ ...resume, website: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

function SummarySection({ resume, onUpdate }: { resume: OptimizedResume; onUpdate: (r: OptimizedResume) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
      <textarea
        value={resume.optimizedSummary || resume.summary || ''}
        onChange={(e) => onUpdate({ ...resume, optimizedSummary: e.target.value })}
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="请输入个人简介..."
      />
    </div>
  );
}

function EducationSection({ resume, onUpdate }: { resume: OptimizedResume; onUpdate: (r: OptimizedResume) => void }) {
  const updateEducation = (index: number, edu: Education) => {
    const newEducation = [...resume.education];
    newEducation[index] = edu;
    onUpdate({ ...resume, education: newEducation });
  };

  const addEducation = () => {
    onUpdate({
      ...resume,
      education: [...resume.education, { school: '', degree: '', field: '', startDate: '', endDate: '' }],
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = resume.education.filter((_, i) => i !== index);
    onUpdate({ ...resume, education: newEducation });
  };

  return (
    <div className="space-y-4">
      {resume.education.map((edu, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">教育经历 #{index + 1}</span>
            <button
              onClick={() => removeEducation(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              删除
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">学校</label>
              <input
                value={edu.school}
                onChange={(e) => updateEducation(index, { ...edu, school: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">学位</label>
              <input
                value={edu.degree}
                onChange={(e) => updateEducation(index, { ...edu, degree: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">专业</label>
              <input
                value={edu.field}
                onChange={(e) => updateEducation(index, { ...edu, field: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">GPA</label>
              <input
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(index, { ...edu, gpa: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">开始时间</label>
              <input
                value={edu.startDate}
                onChange={(e) => updateEducation(index, { ...edu, startDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">结束时间</label>
              <input
                value={edu.endDate}
                onChange={(e) => updateEducation(index, { ...edu, endDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + 添加教育经历
      </button>
    </div>
  );
}

function ExperienceSection({ resume, onUpdate }: { resume: OptimizedResume; onUpdate: (r: OptimizedResume) => void }) {
  const experience = resume.optimizedExperience || resume.experience;

  const updateExperience = (index: number, exp: WorkExperience) => {
    const newExperience = [...experience];
    newExperience[index] = exp;
    onUpdate({ ...resume, optimizedExperience: newExperience });
  };

  const updateHighlight = (expIndex: number, highlightIndex: number, value: string) => {
    const newExperience = [...experience];
    const newHighlights = [...newExperience[expIndex].highlights];
    newHighlights[highlightIndex] = value;
    newExperience[expIndex] = { ...newExperience[expIndex], highlights: newHighlights };
    onUpdate({ ...resume, optimizedExperience: newExperience });
  };

  const addHighlight = (expIndex: number) => {
    const newExperience = [...experience];
    newExperience[expIndex] = {
      ...newExperience[expIndex],
      highlights: [...newExperience[expIndex].highlights, ''],
    };
    onUpdate({ ...resume, optimizedExperience: newExperience });
  };

  const removeHighlight = (expIndex: number, highlightIndex: number) => {
    const newExperience = [...experience];
    newExperience[expIndex] = {
      ...newExperience[expIndex],
      highlights: newExperience[expIndex].highlights.filter((_, i) => i !== highlightIndex),
    };
    onUpdate({ ...resume, optimizedExperience: newExperience });
  };

  const addExperience = () => {
    onUpdate({
      ...resume,
      optimizedExperience: [...experience, { company: '', title: '', startDate: '', endDate: '', highlights: [''] }],
    });
  };

  const removeExperience = (index: number) => {
    const newExperience = experience.filter((_, i) => i !== index);
    onUpdate({ ...resume, optimizedExperience: newExperience });
  };

  return (
    <div className="space-y-4">
      {experience.map((exp, expIndex) => (
        <div key={expIndex} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">工作经历 #{expIndex + 1}</span>
            <button
              onClick={() => removeExperience(expIndex)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              删除
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">公司</label>
              <input
                value={exp.company}
                onChange={(e) => updateExperience(expIndex, { ...exp, company: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">职位</label>
              <input
                value={exp.title}
                onChange={(e) => updateExperience(expIndex, { ...exp, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">地点</label>
              <input
                value={exp.location || ''}
                onChange={(e) => updateExperience(expIndex, { ...exp, location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">开始时间</label>
                <input
                  value={exp.startDate}
                  onChange={(e) => updateExperience(expIndex, { ...exp, startDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">结束时间</label>
                <input
                  value={exp.endDate}
                  onChange={(e) => updateExperience(expIndex, { ...exp, endDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">工作亮点</label>
            {exp.highlights.map((highlight, hIndex) => (
              <div key={hIndex} className="flex gap-2">
                <textarea
                  value={highlight}
                  onChange={(e) => updateHighlight(expIndex, hIndex, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <button
                  onClick={() => removeHighlight(expIndex, hIndex)}
                  className="text-red-500 hover:text-red-700 px-2"
                  title="删除"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => addHighlight(expIndex)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + 添加亮点
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addExperience}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + 添加工作经历
      </button>
    </div>
  );
}

function SkillsSection({ resume, onUpdate }: { resume: OptimizedResume; onUpdate: (r: OptimizedResume) => void }) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      onUpdate({ ...resume, skills: [...resume.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = resume.skills.filter((_, i) => i !== index);
    onUpdate({ ...resume, skills: newSkills });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...resume.skills];
    newSkills[index] = value;
    onUpdate({ ...resume, skills: newSkills });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {resume.skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            <input
              value={skill}
              onChange={(e) => updateSkill(i, e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-auto min-w-[60px]"
              style={{ width: `${Math.max(60, skill.length * 8)}px` }}
            />
            <button
              onClick={() => removeSkill(i)}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          placeholder="输入新技能..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          添加
        </button>
      </div>
    </div>
  );
}

function ProjectsSection({ resume, onUpdate }: { resume: OptimizedResume; onUpdate: (r: OptimizedResume) => void }) {
  const projects = resume.projects || [];

  const updateProject = (index: number, project: Project) => {
    const newProjects = [...projects];
    newProjects[index] = project;
    onUpdate({ ...resume, projects: newProjects });
  };

  const addProject = () => {
    onUpdate({
      ...resume,
      projects: [...projects, { name: '', description: '', technologies: [], highlights: [''] }],
    });
  };

  const removeProject = (index: number) => {
    const newProjects = projects.filter((_, i) => i !== index);
    onUpdate({ ...resume, projects: newProjects });
  };

  const updateHighlight = (projIndex: number, highlightIndex: number, value: string) => {
    const newProjects = [...projects];
    const newHighlights = [...newProjects[projIndex].highlights];
    newHighlights[highlightIndex] = value;
    newProjects[projIndex] = { ...newProjects[projIndex], highlights: newHighlights };
    onUpdate({ ...resume, projects: newProjects });
  };

  const addHighlight = (projIndex: number) => {
    const newProjects = [...projects];
    newProjects[projIndex] = {
      ...newProjects[projIndex],
      highlights: [...newProjects[projIndex].highlights, ''],
    };
    onUpdate({ ...resume, projects: newProjects });
  };

  const removeHighlight = (projIndex: number, highlightIndex: number) => {
    const newProjects = [...projects];
    newProjects[projIndex] = {
      ...newProjects[projIndex],
      highlights: newProjects[projIndex].highlights.filter((_, i) => i !== highlightIndex),
    };
    onUpdate({ ...resume, projects: newProjects });
  };

  return (
    <div className="space-y-4">
      {projects.map((proj, projIndex) => (
        <div key={projIndex} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">项目 #{projIndex + 1}</span>
            <button
              onClick={() => removeProject(projIndex)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              删除
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">项目名称</label>
              <input
                value={proj.name}
                onChange={(e) => updateProject(projIndex, { ...proj, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">技术栈</label>
              <input
                value={proj.technologies.join(', ')}
                onChange={(e) => updateProject(projIndex, { ...proj, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="用逗号分隔"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">项目描述</label>
            <textarea
              value={proj.description}
              onChange={(e) => updateProject(projIndex, { ...proj, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">项目亮点</label>
            {proj.highlights.map((highlight, hIndex) => (
              <div key={hIndex} className="flex gap-2">
                <textarea
                  value={highlight}
                  onChange={(e) => updateHighlight(projIndex, hIndex, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <button
                  onClick={() => removeHighlight(projIndex, hIndex)}
                  className="text-red-500 hover:text-red-700 px-2"
                  title="删除"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => addHighlight(projIndex)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + 添加亮点
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addProject}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + 添加项目经历
      </button>
    </div>
  );
}

export default function ResumeEditor({ resume, onUpdate, onExport }: ResumeEditorProps) {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);

  const moveSection = useCallback((index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
  }, [sections]);

  const renderSection = (section: Section, index: number) => {
    const sectionProps = {
      resume,
      onUpdate,
    };

    const headerProps = {
      section,
      index,
      total: sections.length,
      onMoveUp: () => moveSection(index, 'up'),
      onMoveDown: () => moveSection(index, 'down'),
    };

    return (
      <div key={section.id} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <SectionHeader {...headerProps} />
        {section.id === 'info' && <InfoSection {...sectionProps} />}
        {section.id === 'summary' && <SummarySection {...sectionProps} />}
        {section.id === 'education' && <EducationSection {...sectionProps} />}
        {section.id === 'experience' && <ExperienceSection {...sectionProps} />}
        {section.id === 'skills' && <SkillsSection {...sectionProps} />}
        {section.id === 'projects' && <ProjectsSection {...sectionProps} />}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-4 z-10">
        <h2 className="text-xl font-semibold">编辑优化后的简历</h2>
        <button
          onClick={onExport}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          导出 PDF
        </button>
      </div>

      {resume.addedKeywords && resume.addedKeywords.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">已添加的关键词：</span>{' '}
            {resume.addedKeywords.join(', ')}
          </p>
        </div>
      )}

      <div className="text-sm text-gray-500 mb-2">
        提示：使用每个模块右上角的箭头按钮可以调整模块顺序
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
}
