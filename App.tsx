import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, RefreshCw } from 'lucide-react';
import { PERSONAS } from './constants';
import { PersonaType, DebateState } from './types';
import { generatePersonaResponse, generateModeratorVerdict } from './services/geminiService';
import { PersonaCard } from './components/PersonaCard';
import { ModeratorSection } from './components/ModeratorSection';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [state, setState] = useState<DebateState>({
    topic: '',
    isDebating: false,
    messages: [],
    verdict: null,
    error: null,
  });
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleDebate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim() || state.isDebating) return;

    // Reset previous debate
    setState(prev => ({
      ...prev,
      topic: topic,
      isDebating: true,
      messages: [],
      verdict: null,
      error: null
    }));

    try {
      // 1. Generate responses from the 3 personas in parallel
      const personaPromises = [
        generatePersonaResponse(PersonaType.BOOMER, topic).then(res => ({ persona: PersonaType.BOOMER, content: res })),
        generatePersonaResponse(PersonaType.MILLENNIAL, topic).then(res => ({ persona: PersonaType.MILLENNIAL, content: res })),
        generatePersonaResponse(PersonaType.GENZ, topic).then(res => ({ persona: PersonaType.GENZ, content: res })),
      ];

      // We wait for all of them so we can show them simultaneously or "streaming" in
      const results = await Promise.all(personaPromises);

      // Add messages to state
      const newMessages = results.map((r, i) => ({
        id: `${Date.now()}-${i}`,
        persona: r.persona,
        content: r.content,
        timestamp: Date.now()
      }));

      setState(prev => ({
        ...prev,
        messages: newMessages
      }));

      // 2. Generate Verdict
      const verdict = await generateModeratorVerdict(topic, results);
      
      setState(prev => ({
        ...prev,
        isDebating: false,
        verdict: verdict
      }));

    } catch (error) {
      console.error(error);
      setState(prev => ({
        ...prev,
        isDebating: false,
        error: "The council has disbanded due to technical difficulties."
      }));
    }
  };

  useEffect(() => {
    if (state.messages.length > 0 || state.verdict) {
       bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, state.verdict]);

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 pb-20">
      
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-purple-500 w-6 h-6" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              GenWar Council
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            Powered by Gemini 2.5 Flash & 3.0 Pro
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
            What shall the Council <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-sky-500 to-fuchsia-500">
              Argue About?
            </span>
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Enter a topic and watch three generations tear it apart.
          </p>

          <form onSubmit={handleDebate} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative flex">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Remote Work, Skinny Jeans, Crypto..."
                className="w-full bg-slate-900 text-white placeholder-slate-500 px-6 py-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg border-none"
                disabled={state.isDebating}
              />
              <button
                type="submit"
                disabled={state.isDebating || !topic.trim()}
                className="bg-slate-900 text-white px-8 py-4 rounded-r-lg font-bold transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed border-l border-white/10 flex items-center gap-2"
              >
                {state.isDebating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Debate</span>
              </button>
            </div>
          </form>
          
          {/* Quick suggestions */}
          {!state.isDebating && state.messages.length === 0 && (
             <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['AI taking jobs', 'Pineapple on pizza', 'Marriage', 'Social Media'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setTopic(t); }} 
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-400 transition-colors border border-white/5"
                  >
                    {t}
                  </button>
                ))}
             </div>
          )}
        </div>

        {/* Error Message */}
        {state.error && (
           <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-center">
             {state.error}
           </div>
        )}

        {/* The Council Grid */}
        {(state.isDebating || state.messages.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Boomer */}
            <div className="md:mt-0 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <PersonaCard 
                config={PERSONAS[PersonaType.BOOMER]} 
                content={state.messages.find(m => m.persona === PersonaType.BOOMER)?.content || ""}
                loading={state.isDebating && !state.messages.length}
              />
            </div>

            {/* Millennial */}
            <div className="md:mt-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <PersonaCard 
                config={PERSONAS[PersonaType.MILLENNIAL]} 
                content={state.messages.find(m => m.persona === PersonaType.MILLENNIAL)?.content || ""}
                loading={state.isDebating && !state.messages.length}
              />
            </div>

            {/* Gen Z */}
            <div className="md:mt-16 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <PersonaCard 
                config={PERSONAS[PersonaType.GENZ]} 
                content={state.messages.find(m => m.persona === PersonaType.GENZ)?.content || ""}
                loading={state.isDebating && !state.messages.length}
              />
            </div>

          </div>
        )}

        {/* Moderator Section */}
        <div ref={bottomRef}>
            <ModeratorSection 
              verdict={state.verdict} 
              loading={state.isDebating && state.messages.length > 0} 
            />
        </div>

      </main>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        @keyframes fade-in-up {
           from { opacity: 0; transform: translateY(10px); }
           to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
           animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;