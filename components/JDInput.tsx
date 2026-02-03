'use client';

import { useState } from 'react';

interface JDInputProps {
  onSubmit: (jdText: string) => void;
  isLoading: boolean;
}

export default function JDInput({ onSubmit, isLoading }: JDInputProps) {
  const [jdText, setJdText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jdText.trim()) {
      onSubmit(jdText.trim());
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Paste Job Description</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!jdText.trim() || isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Match'}
        </button>
      </form>
    </div>
  );
}
