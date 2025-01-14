import React, { useState } from 'react';

interface SummaryProps {
  sessionId: string;
  username: string;
}

export default function Summary({ sessionId, username }: SummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/summarize_conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, username }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate summary');
      
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Generating summary...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!summary) {
    return (
      <button
        onClick={generateSummary}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate Summary
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold mb-4">Conversation Summary</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
    </div>
  );
}