import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PersonaConfig } from '../types';

interface PersonaCardProps {
  config: PersonaConfig;
  content: string;
  loading: boolean;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ config, content, loading }) => {
  return (
    <div className={`relative flex flex-col h-full rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`text-4xl p-2 rounded-full bg-black/20 shadow-inner ${config.borderColor} border`}>
          {config.avatar}
        </div>
        <div>
          <h3 className={`font-bold text-lg leading-tight ${config.color} uppercase tracking-wider`}>
            {config.name}
          </h3>
          <span className="text-xs text-slate-400 font-mono opacity-70">
            Model: {config.model}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className={`h-2 bg-white/10 rounded w-3/4`}></div>
            <div className={`h-2 bg-white/10 rounded w-full`}></div>
            <div className={`h-2 bg-white/10 rounded w-5/6`}></div>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm leading-relaxed text-slate-200">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Decorative quote mark */}
      <div className={`absolute top-4 right-4 text-6xl opacity-10 font-serif ${config.color}`}>
        "
      </div>
    </div>
  );
};