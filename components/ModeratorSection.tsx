import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MODERATOR_CONFIG } from '../constants';
import { Sparkles, Gavel } from 'lucide-react';

interface ModeratorSectionProps {
  verdict: string | null;
  loading: boolean;
}

export const ModeratorSection: React.FC<ModeratorSectionProps> = ({ verdict, loading }) => {
  if (!verdict && !loading) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-b from-slate-900 to-black shadow-2xl">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-yellow-500/10 blur-[100px]"></div>

        <div className="relative p-8 md:p-12 text-center">
          
          <div className="flex justify-center mb-6">
             <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-40 animate-pulse"></div>
                <div className="relative bg-slate-950 p-4 rounded-full border border-yellow-500 text-5xl shadow-xl">
                  {MODERATOR_CONFIG.avatar}
                </div>
             </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 mb-2">
            The Final Verdict
          </h2>
          <p className="text-yellow-500/60 font-mono text-sm mb-8 uppercase tracking-widest">
            Presided by {MODERATOR_CONFIG.model}
          </p>

          {loading ? (
             <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Gavel className="w-12 h-12 text-yellow-500 animate-bounce" />
                <p className="text-yellow-200/50 animate-pulse">Deliberating the absolute nonsense just witnessed...</p>
             </div>
          ) : (
            <div className="text-left bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 shadow-inner">
               <div className="prose prose-invert prose-lg max-w-none text-slate-200">
                  <ReactMarkdown>{verdict || ""}</ReactMarkdown>
               </div>
            </div>
          )}
          
          <div className="flex justify-center gap-2 mt-6 text-yellow-500/40 text-sm">
             <Sparkles className="w-4 h-4" />
             <span>Council Ruling is Final</span>
             <Sparkles className="w-4 h-4" />
          </div>

        </div>
      </div>
    </div>
  );
};