import React, { useState, useRef, useEffect } from 'react';
import { DeveloperProfile, Project } from '../types';
import { Icon } from '../components/Icon';
import { sound } from '../services/soundEngine';
import { getAIReplyingText } from '../services/aiEngine';

interface AIAssistantAppProps {
  profileData: DeveloperProfile;
  projectsData: Project[];
  openWindow?: (appId: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const AIAssistantApp: React.FC<AIAssistantAppProps> = ({ profileData, projectsData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "ai",
      text: `Greetings! I am the Persona Engine for ${profileData.name}. Ask me anything about his full-stack experience, technical stack, active GitHub projects, or engineering availability.`
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    `Who is ${profileData.name}?`,
    "What projects has he built?",
    "What is his core tech stack?",
    "Is he available for hire?",
    "How can I contact him?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isThinking) return;

    sound.playClick();
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const reply = getAIReplyingText(query, profileData, projectsData);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "ai", text: reply }]);
      setIsThinking(false);
      sound.playPop();
    }, 700);
  };

  return (
    <div className="h-full flex flex-col bg-os-bg">
      <div className="p-3.5 bg-os-panel border-b border-os-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white">
            <Icon name="Bot" className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Persona AI Assistant</span>
              <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">RAG Synced</span>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online & Telemetry Synced
            </div>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ id: "m1", sender: "ai", text: `Chat history cleared. How can I help you explore ${profileData.name}'s work?` }])}
          className="text-xs text-os-muted hover:text-white p-1"
          title="Clear Chat"
        >
          <Icon name="RotateCcw" className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
              msg.sender === 'user'
                ? 'bg-sky-500 text-white font-bold'
                : 'bg-os-panel border border-os-border text-sky-400'
            }`}>
              {msg.sender === 'user' ? 'U' : <Icon name="Bot" className="w-3.5 h-3.5" />}
            </div>
            <div className={`p-3 rounded-2xl text-xs leading-relaxed selectable-text ${
              msg.sender === 'user'
                ? 'bg-sky-500 text-white rounded-tr-none'
                : 'bg-os-panel border border-os-border text-slate-200 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-os-muted font-mono p-2">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Analyzing query...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-2.5 bg-os-panel/60 border-t border-os-border/70 overflow-x-auto flex gap-1.5 no-scrollbar">
        {suggestedQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-os-surface hover:bg-white/[0.08] border border-os-border text-[11px] text-os-muted hover:text-sky-300 shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-os-panel border-t border-os-border flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${profileData.name}'s background or projects...`}
          className="flex-1 px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white placeholder-os-muted focus:outline-none focus:border-sky-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span>Send</span>
          <Icon name="Send" className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
