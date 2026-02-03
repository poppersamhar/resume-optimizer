'use client';

import { useState } from 'react';
import { ParsedResume, ParsedJD, RatingMatchResult, OptimizedResume } from '@/types';
import ResumeUploader from '@/components/ResumeUploader';
import JDInput from '@/components/JDInput';
import MatchResultComponent from '@/components/MatchResult';
import ResumeEditor from '@/components/ResumeEditor';
import dynamic from 'next/dynamic';

const PDFExport = dynamic(() => import('@/components/PDFExport'), { ssr: false });

type Step = 'upload' | 'jd' | 'analysis' | 'edit';

export default function Home() {
  const [step, setStep] = useState<Step>('upload');
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [jd, setJD] = useState<ParsedJD | null>(null);
  const [matchResult, setMatchResult] = useState<RatingMatchResult | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResumeUpload = (parsedResume: ParsedResume) => {
    setResume(parsedResume);
    setStep('jd');
    setError(null);
  };

  const handleJDSubmit = async (jdText: string) => {
    if (!resume) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jdText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }

      setJD(data.jd);
      setMatchResult(data.matchResult);
      setStep('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!resume || !jd || !matchResult) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jd, matchResult }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate resume');
      }

      setOptimizedResume(data);
      setStep('edit');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!optimizedResume) return;

    const { generatePDFBlob } = await import('@/components/PDFExport');
    const blob = await generatePDFBlob(optimizedResume);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${optimizedResume.name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    setStep('upload');
    setResume(null);
    setJD(null);
    setMatchResult(null);
    setOptimizedResume(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(['upload', 'jd', 'analysis', 'edit'] as const).map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? 'bg-blue-600 text-white'
                  : ['upload', 'jd', 'analysis', 'edit'].indexOf(step) > i
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
            {i < 3 && (
              <div
                className={`w-12 h-1 ${
                  ['upload', 'jd', 'analysis', 'edit'].indexOf(step) > i
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Resume preview when past upload step */}
      {resume && step !== 'upload' && (
        <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium">{resume.name}</p>
            <p className="text-sm text-gray-600">{resume.email}</p>
          </div>
          <button
            onClick={handleStartOver}
            className="text-sm text-blue-600 hover:underline"
          >
            Start over
          </button>
        </div>
      )}

      {/* Step content */}
      {step === 'upload' && (
        <ResumeUploader
          onUpload={handleResumeUpload}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
        />
      )}

      {step === 'jd' && (
        <JDInput onSubmit={handleJDSubmit} isLoading={isLoading} />
      )}

      {step === 'analysis' && matchResult && jd && (
        <MatchResultComponent
          matchResult={matchResult}
          jd={jd}
          onGenerateResume={handleGenerateResume}
          isLoading={isLoading}
        />
      )}

      {step === 'edit' && optimizedResume && (
        <ResumeEditor
          resume={optimizedResume}
          onUpdate={setOptimizedResume}
          onExport={handleExportPDF}
        />
      )}
    </div>
  );
}
