'use client';

import { RatingMatchResult, ParsedJD, ResumeIssue, IssuePriority, ResumeSection } from '@/types';
import { SECTION_CONFIG, PRIORITY_CONFIG, RATING_CONFIG } from '@/lib/constants';

interface MatchResultProps {
  matchResult: RatingMatchResult;
  jd: ParsedJD;
  onGenerateResume: () => void;
  isLoading: boolean;
}

function PriorityBadge({ priority }: { priority: IssuePriority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bgColor} ${config.color}`}>
      {priority}
    </span>
  );
}

function IssueCard({ issue }: { issue: ResumeIssue }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-2 mb-2">
        <PriorityBadge priority={issue.priority} />
        <span className="text-xs text-gray-500 font-mono">{issue.problemType}</span>
      </div>
      {issue.location && (
        <p className="text-xs text-gray-500 mb-2">{issue.location}</p>
      )}
      {issue.originalText && (
        <div className="mb-2 p-2 bg-gray-50 rounded text-sm text-gray-600 border-l-2 border-gray-300">
          &ldquo;{issue.originalText}&rdquo;
        </div>
      )}
      <p className="text-gray-800 font-medium">{issue.suggestion}</p>
      <p className="text-sm text-gray-500 mt-1">{issue.reason}</p>
    </div>
  );
}

function SectionBlock({ section, issues }: { section: ResumeSection; issues: ResumeIssue[] }) {
  const config = SECTION_CONFIG[section];

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 flex items-center gap-2">
        {config.label}
        <span className="text-sm text-gray-400">({config.labelCn})</span>
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
          {issues.length} issue{issues.length !== 1 ? 's' : ''}
        </span>
      </h4>
      <div className="space-y-3">
        {issues.map((issue, i) => (
          <IssueCard key={i} issue={issue} />
        ))}
      </div>
    </div>
  );
}

function PriorityLegend() {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      {(Object.entries(PRIORITY_CONFIG) as [IssuePriority, typeof PRIORITY_CONFIG[IssuePriority]][]).map(
        ([priority, config]) => (
          <div key={priority} className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bgColor} ${config.color}`}>
              {priority}
            </span>
            <span className="text-sm text-gray-600">{config.label}</span>
          </div>
        )
      )}
    </div>
  );
}

export default function MatchResultComponent({
  matchResult,
  jd,
  onGenerateResume,
  isLoading,
}: MatchResultProps) {
  const ratingConfig = RATING_CONFIG[matchResult.rating];
  const { issueCounts, summary, sectionIssues, matchedSkills, missingSkills } = matchResult;
  const totalIssues = issueCounts.urgent + issueCounts.critical + issueCounts.optional;

  return (
    <div className="w-full space-y-6">
      {/* Rating Header */}
      <div className="flex items-center justify-between p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${ratingConfig.bgColor}`}>
            <span className={`text-4xl font-bold ${ratingConfig.color}`}>
              {matchResult.rating}
            </span>
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${ratingConfig.color}`}>
              {ratingConfig.label}
            </h2>
            <p className="text-gray-600">{ratingConfig.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Issues Found</div>
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{issueCounts.urgent}</div>
              <div className="text-xs text-gray-500">Urgent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{issueCounts.critical}</div>
              <div className="text-xs text-gray-500">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{issueCounts.optional}</div>
              <div className="text-xs text-gray-500">Optional</div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Info */}
      {jd.title && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">{jd.title}</p>
          {jd.company && <p className="text-gray-600">{jd.company}</p>}
        </div>
      )}

      {/* Analysis Summary */}
      <div className="p-6 bg-blue-50 rounded-lg space-y-4">
        <h3 className="font-semibold text-blue-900">Analysis Summary</h3>
        <div className="space-y-3 text-gray-700">
          <p><span className="font-medium">Professional Identity:</span> {summary.professionalIdentity}</p>
          <p><span className="font-medium">Strengths:</span> {summary.strengths}</p>
          <p><span className="font-medium">Areas for Improvement:</span> {summary.improvementSuggestions}</p>
        </div>
      </div>

      {/* Skills Match */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">
            Matched Skills ({matchedSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-green-200 text-green-800 text-sm rounded">
                {skill}
              </span>
            ))}
            {matchedSkills.length === 0 && (
              <span className="text-green-700 text-sm">No matched skills identified</span>
            )}
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">
            Missing Skills ({missingSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-red-200 text-red-800 text-sm rounded">
                {skill}
              </span>
            ))}
            {missingSkills.length === 0 && (
              <span className="text-red-700 text-sm">No missing skills identified</span>
            )}
          </div>
        </div>
      </div>

      {/* Priority Legend */}
      <PriorityLegend />

      {/* Issues by Section */}
      {totalIssues > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg">
            Detailed Issues ({totalIssues})
          </h3>
          {sectionIssues.map((si) => (
            <SectionBlock key={si.section} section={si.section} issues={si.issues} />
          ))}
        </div>
      )}

      {totalIssues === 0 && (
        <div className="p-6 bg-green-50 rounded-lg text-center">
          <p className="text-green-800 font-medium">No issues found! Your resume looks great.</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={onGenerateResume}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating Optimized Resume...' : 'Generate Optimized Resume'}
      </button>
    </div>
  );
}
