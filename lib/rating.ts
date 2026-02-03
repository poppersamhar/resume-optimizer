import {
  ResumeRating,
  IssuePriority,
  ResumeSection,
  ResumeIssue,
  SectionIssues,
  IssueCounts,
  ProblemType,
} from '@/types';

// Problem type to priority mapping
const PROBLEM_PRIORITY_MAP: Record<ProblemType, IssuePriority> = {
  // Personal Info
  IMPORTANT_FIELDS_MISSING: 'URGENT',
  // Summary
  MISSING_SUMMARY: 'URGENT',
  SUMMARY_NEEDS_IMPROVEMENT: 'CRITICAL',
  // Skills
  INSUFFICIENT_RELEVANT_SKILLS: 'URGENT',
  // Working Experience - URGENT
  METHODOLOGY_EXPLANATION: 'URGENT',
  LACK_OF_ACCOMPLISHMENT: 'URGENT',
  INCORRECT_SPELLING_GRAMMAR: 'URGENT',
  IRRELEVANT_WORK_EXP_TITLE: 'URGENT',
  // Working Experience - CRITICAL
  BULLET_POINT_TOO_LONG: 'CRITICAL',
  BULLET_POINT_TOO_SHORT: 'CRITICAL',
  // Working Experience - OPTIONAL
  LACK_OF_ACTION_VERBS: 'OPTIONAL',
  USE_OF_FILLER_WORDS: 'OPTIONAL',
};

export function countIssuesByPriority(issues: ResumeIssue[]): IssueCounts {
  return issues.reduce(
    (counts, issue) => {
      switch (issue.priority) {
        case 'URGENT':
          counts.urgent++;
          break;
        case 'CRITICAL':
          counts.critical++;
          break;
        case 'OPTIONAL':
          counts.optional++;
          break;
      }
      return counts;
    },
    { urgent: 0, critical: 0, optional: 0 }
  );
}

export function calculateRating(counts: IssueCounts): ResumeRating {
  const { urgent, critical, optional } = counts;

  // A: EXCELLENT - urgent=0, critical≤2, optional≤2
  if (urgent === 0 && critical <= 2 && optional <= 2) {
    return 'A';
  }

  // B: GOOD - urgent≤5, critical≤3
  if (urgent <= 5 && critical <= 3) {
    return 'B';
  }

  // C: SATISFACTORY - everything else
  return 'C';
}

export function groupIssuesBySection(issues: ResumeIssue[]): SectionIssues[] {
  const sectionOrder: ResumeSection[] = [
    'personal_info',
    'summary',
    'education',
    'skills',
    'working_experience',
  ];

  const grouped = new Map<ResumeSection, ResumeIssue[]>();

  // Initialize all sections
  for (const section of sectionOrder) {
    grouped.set(section, []);
  }

  // Group issues
  for (const issue of issues) {
    const sectionIssues = grouped.get(issue.section);
    if (sectionIssues) {
      sectionIssues.push(issue);
    }
  }

  // Convert to array and filter out empty sections
  return sectionOrder
    .map((section) => ({
      section,
      issues: sortIssuesByPriority(grouped.get(section) || []),
    }))
    .filter((si) => si.issues.length > 0);
}

export function sortIssuesByPriority(issues: ResumeIssue[]): ResumeIssue[] {
  const priorityOrder: Record<IssuePriority, number> = {
    URGENT: 0,
    CRITICAL: 1,
    OPTIONAL: 2,
  };

  return [...issues].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

export function normalizeIssuePriority(issue: ResumeIssue): ResumeIssue {
  const expectedPriority = PROBLEM_PRIORITY_MAP[issue.problemType];
  if (expectedPriority && issue.priority !== expectedPriority) {
    return { ...issue, priority: expectedPriority };
  }
  return issue;
}

export function normalizeAllIssues(issues: ResumeIssue[]): ResumeIssue[] {
  return issues.map(normalizeIssuePriority);
}
