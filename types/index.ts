// Resume types
export interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface WorkExperience {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
  skills: string[];
  education: Education[];
  experience: WorkExperience[];
  projects?: Project[];
  certifications?: string[];
  languages?: string[];
  rawText: string;
}

// JD types
export interface ParsedJD {
  title: string;
  company?: string;
  location?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits?: string[];
  rawText: string;
}

// Analysis types (legacy)
export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedQualifications: string[];
  missingQualifications: string[];
  suggestions: Suggestion[];
}

export interface Suggestion {
  category: 'skill' | 'experience' | 'keyword' | 'format' | 'general';
  priority: 'high' | 'medium' | 'low';
  original?: string;
  suggested: string;
  reason: string;
}

// New Rating System Types
export type ResumeRating = 'A' | 'B' | 'C';
export type IssuePriority = 'URGENT' | 'CRITICAL' | 'OPTIONAL';
export type ResumeSection = 'personal_info' | 'summary' | 'education' | 'skills' | 'working_experience';

// Problem types by section
export type PersonalInfoProblem = 'IMPORTANT_FIELDS_MISSING';
export type SummaryProblem = 'MISSING_SUMMARY' | 'SUMMARY_NEEDS_IMPROVEMENT';
export type EducationProblem = 'IMPORTANT_FIELDS_MISSING';
export type SkillsProblem = 'INSUFFICIENT_RELEVANT_SKILLS';
export type WorkingExperienceProblem =
  | 'METHODOLOGY_EXPLANATION'
  | 'LACK_OF_ACCOMPLISHMENT'
  | 'INCORRECT_SPELLING_GRAMMAR'
  | 'IMPORTANT_FIELDS_MISSING'
  | 'IRRELEVANT_WORK_EXP_TITLE'
  | 'BULLET_POINT_TOO_LONG'
  | 'BULLET_POINT_TOO_SHORT'
  | 'LACK_OF_ACTION_VERBS'
  | 'USE_OF_FILLER_WORDS';

export type ProblemType =
  | PersonalInfoProblem
  | SummaryProblem
  | EducationProblem
  | SkillsProblem
  | WorkingExperienceProblem;

export interface ResumeIssue {
  section: ResumeSection;
  problemType: ProblemType;
  priority: IssuePriority;
  location?: string;
  originalText?: string;
  suggestion: string;
  reason: string;
}

export interface SectionIssues {
  section: ResumeSection;
  issues: ResumeIssue[];
}

export interface IssueCounts {
  urgent: number;
  critical: number;
  optional: number;
}

export interface AnalysisSummary {
  professionalIdentity: string;
  strengths: string;
  improvementSuggestions: string;
}

export interface RatingMatchResult {
  rating: ResumeRating;
  issueCounts: IssueCounts;
  summary: AnalysisSummary;
  matchedSkills: string[];
  missingSkills: string[];
  issues: ResumeIssue[];
  sectionIssues: SectionIssues[];
}

// Optimized resume
export interface OptimizedResume extends ParsedResume {
  optimizedSummary: string;
  optimizedExperience: WorkExperience[];
  addedKeywords: string[];
}

// App state
export interface AppState {
  step: 'upload' | 'jd' | 'analysis' | 'edit' | 'export';
  resume: ParsedResume | null;
  jd: ParsedJD | null;
  matchResult: MatchResult | null;
  optimizedResume: OptimizedResume | null;
  isLoading: boolean;
  error: string | null;
}
