"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, X, MessageSquare, Trash2 } from 'lucide-react'
import { chatWithAssistant } from '@/app/actions/chat'
import { cn } from '@/lib/utils'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Educore AI Assistant. How can I help you today? I can provide student counts, fee summaries, or recent activities.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const result = await chatWithAssistant([...messages, userMsg])
      if ('error' in result) {
        setMessages(prev => [...prev, { role: 'assistant', content: JSON.stringify(result.error) || "Error occurred" }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: result.content || "No response received." }])
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again later." }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat history cleared. How can I help you now?' }])
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[380px] sm:w-[420px] h-[580px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Educore AI Assistant</h3>
                <p className="text-white/70 text-[10px]">Real-time School Insights</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={clearChat}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 bg-slate-950/50" ref={scrollRef}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                  m.role === 'assistant' ? "bg-indigo-600/20 border-indigo-500/50" : "bg-slate-700 border-slate-600"
                )}>
                  {m.role === 'assistant' ? <Bot className="w-4 h-4 text-indigo-400" /> : <User className="w-4 h-4 text-slate-300" />}
                </div>
                
                <div className={cn(
                  "max-w-[85%] rounded-2xl p-3 text-[13px] leading-relaxed shadow-sm",
                  m.role === 'assistant' 
                    ? "bg-slate-800/80 text-slate-100 border border-white/5" 
                    : "bg-indigo-600 text-white font-medium"
                )}>
                  {m.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 animate-in fade-in items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl flex items-center gap-2 border border-white/5">
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                  <span className="text-[11px] font-medium text-slate-400 italic">Analyzing ERP...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none bg-slate-900 border-t border-white/5">
            {["Student count", "Fee summary", "Activities"].map(tip => (
              <button
                key={tip}
                onClick={() => setInput(tip)}
                className="text-[10px] whitespace-nowrap text-slate-400 px-3 py-1 rounded-full border border-white/10 bg-slate-800/50 hover:bg-slate-700 hover:text-white transition-all"
              >
                {tip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-900 border-t border-white/10">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="flex items-center gap-2"
            >
              <input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-white/10 focus:ring-1 focus:ring-indigo-500/50 outline-none h-10 rounded-xl px-4 text-xs text-white placeholder-slate-500"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-lg active:scale-95 shrink-0"
              >
                <Send className="h-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 relative",
          isOpen ? "bg-slate-800 rotate-90" : "bg-indigo-600 hover:bg-indigo-500 hover:scale-110"
        )}
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <>
            <MessageSquare className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 group-hover:scale-125 transition-transform" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full animate-ping opacity-75" />
          </>
        )}
      </button>
    </div>
  )
}
