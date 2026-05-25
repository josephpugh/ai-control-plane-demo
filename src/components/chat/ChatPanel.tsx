import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { ChatMessage } from '../../types';

const SUGGESTED_QUESTIONS = [
  'What happens if I add Market-Data-MCP?',
  'Show me recent signals for my initiatives',
  'What gates are blocking the Claims Copilot release?',
  'Which initiatives need recertification?',
];

interface ChatPanelProps {
  contextLabel?: string;
  initialMessages?: ChatMessage[];
}

export function ChatPanel({ contextLabel, initialMessages = [] }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`, role: 'user', content: input, timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}`, role: 'assistant', content: response, timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-105"
      >
        <Sparkles size={18} />
        <span className="text-sm font-medium">AI Assistant</span>
      </button>
    );
  }

  return (
    <div className={clsx(
      'fixed z-50 flex flex-col bg-surface-950 border border-surface-700/50 rounded-2xl shadow-2xl shadow-black/50 transition-all',
      isExpanded
        ? 'bottom-4 right-4 w-[600px] h-[80vh]'
        : 'bottom-4 right-4 w-[400px] h-[520px]',
    )}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/50 bg-gradient-to-r from-brand-600/10 to-purple-600/10 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-brand-400" />
          <span className="text-sm font-semibold text-surface-200">Control Plane Assistant</span>
          {contextLabel && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30">
              {contextLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-surface-800 rounded-lg transition-colors">
            {isExpanded ? <Minimize2 size={14} className="text-surface-400" /> : <Maximize2 size={14} className="text-surface-400" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-surface-800 rounded-lg transition-colors">
            <X size={14} className="text-surface-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-surface-500 text-center mb-4">Ask about any initiative, control, or impact analysis</p>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q); }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700/30 text-surface-400 hover:text-surface-200 hover:border-brand-500/30 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={clsx(
              'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
              msg.role === 'user'
                ? 'bg-brand-600 text-white rounded-br-md'
                : 'bg-surface-800 text-surface-200 rounded-bl-md border border-surface-700/30',
            )}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-800 rounded-2xl rounded-bl-md px-4 py-3 border border-surface-700/30">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-surface-700/50">
        <div className="flex items-center gap-2 bg-surface-800/80 rounded-xl px-3 py-2 border border-surface-700/30 focus-within:border-brand-500/50 transition-colors">
          <MessageSquare size={14} className="text-surface-500 shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your initiatives..."
            className="flex-1 bg-transparent text-sm text-surface-200 placeholder:text-surface-600 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-1.5 rounded-lg hover:bg-brand-500/20 transition-colors disabled:opacity-30"
          >
            <Send size={14} className="text-brand-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('market-data') || lower.includes('mcp') && lower.includes('add')) {
    return `Adding Market-Data-MCP to the Advisor Knowledge Assistant would trigger significant classification changes:

**Dimension Changes:**
• IC: Information Sources — IC2 → IC4 (exception-only)
• ID: Data Reach — ID2 → ID5 (exception-only)

**Impact:**
• Tier escalates from Medium → Critical
• Approval pathway shifts to Exception-Only
• 4 new controls required (connector allow-listing, domain allow-lists, strict instruction hierarchy, enhanced monitoring)
• Formal risk-acceptance review required
• Immediate recertification triggered
• Prompt injection test suite becomes mandatory

Consider using a bounded Market-Data-MCP variant that restricts to approved data providers only — this would keep you at IC2/ID2.`;
  }
  if (lower.includes('signal') || lower.includes('alert')) {
    return `Here are the active signals for your initiatives:

🔴 **Critical** — PII detected in Claims Copilot response samples (2 hours ago)
🟠 **High** — Advisor Assistant service principal added to SG-AI-MarketData AD group (unplanned)
🟠 **High** — Golden dataset tests failed for Claims Copilot v0.9.0-rc.3
🟡 **Medium** — Unusual spike in Portfolio-Analytics-MCP tool calls (3x baseline)
🟡 **Medium** — Annual recertification due for Internal Policy Q&A

Would you like me to drill into any of these signals?`;
  }
  if (lower.includes('gate') || lower.includes('claims') || lower.includes('block')) {
    return `The Claims Processing Copilot v0.9.0-rc.3 has **2 gate failures** blocking promotion:

1. **Golden Dataset Tests** — 189/203 passed (93.1%), below the 95% threshold. 14 failures are in edge-case document formats.

2. **PII Detection Tests** — 3 test cases showed PII leakage in response text for certain claim document types.

Additionally, the **Bias Evaluation** gate is pending — it's awaiting re-run on the updated golden dataset.

The **Enhanced Controls Review** is also blocked until these failures are resolved.

Recommended actions:
• Fix PII redaction in document extraction pipeline
• Add failing document formats to the golden dataset
• Re-run full test suite after fixes`;
  }
  if (lower.includes('recertif')) {
    return `**Recertification Status:**

• **Internal Policy Q&A** — Annual recertification due (last certified Jan 20, 2026). No classification changes detected; this should be straightforward.

• **Advisor Knowledge Assistant** — Change-triggered recertification recommended due to the detected AD group change (SG-AI-MarketData). This needs investigation before the next evaluation cycle.

No other initiatives are due for recertification in the next 30 days.`;
  }
  return `I can help with that. Based on the current state of your AI initiatives, I can provide analysis on:

• **Impact Analysis** — What-if scenarios for adding MCP servers, changing models, or expanding scope
• **Gate Status** — Current release gate results and blocking issues
• **Runtime Health** — Quality scores, latency, and anomaly detection
• **Compliance** — Classification validation and control enforcement status
• **Signals** — Active alerts and their resolution status

What specific aspect would you like to explore?`;
}
