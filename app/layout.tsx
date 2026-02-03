import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Resume Optimizer',
  description: 'Optimize your resume for specific job descriptions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900">Resume Optimizer</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
