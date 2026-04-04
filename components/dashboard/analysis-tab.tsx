"use client"

import { useState } from "react"
import { generateStudentAnalysis } from "@/app/actions/analysis"
import { Sparkles, Loader2, Info, TrendingUp, CalendarDays, AlertTriangle, BookOpen, CheckCircle, Target, BrainCircuit, Activity } from "lucide-react"

export function AnalysisTab({ studentId }: { studentId: string }) {
  const [analysis, setAnalysis] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    const result = await generateStudentAnalysis(studentId)
    // Now result.data is our structured JSON
    if (result.success && result.data) {
      setAnalysis(result.data)
    } else {
      setError(result.error || "Failed to generate AI analytics. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-indigo-950 dark:to-purple-950 rounded-2xl p-8 shadow-xl shadow-indigo-900/10 overflow-hidden relative border border-indigo-700/50">
        {/* Background glow effects */}
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-64 h-64 bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl text-white">
            <h3 className="text-2xl font-extrabold flex items-center gap-3 mb-3 tracking-tight">
              <BrainCircuit className="w-8 h-8 text-indigo-400 animate-pulse" /> 
              Nexus AI Analytics
            </h3>
            <p className="text-indigo-100/80 text-sm leading-relaxed mb-6">
              Harness the power of artificial intelligence to generate a bespoke, comprehensive deep-dive into this student's holistic performance, behavioral matrix, and longitudinal trends.
            </p>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="group relative px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold overflow-hidden transition-all shadow-lg hover:shadow-xl hover:shadow-white/20 disabled:opacity-80 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Synthesizing Data...</span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" /> Execute Deep Analysis</span>
              )}
            </button>
          </div>
          
          <div className="hidden lg:block relative w-32 h-32 mr-8">
             <div className="absolute inset-0 border-4 border-dashed border-indigo-400/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
             <div className="absolute inset-2 border-2 border-dashed border-purple-400/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 p-5 rounded-2xl border border-red-200 dark:border-red-900/50 flex items-start gap-3 animate-in fade-in">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
          
          {/* Executive Summary */}
          <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-sm uppercase tracking-widest text-muted-fg font-bold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-500" /> Executive Summary
            </h3>
            <p className="text-lg md:text-xl font-medium text-fg leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Card */}
            <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold tracking-wider text-muted-fg">Trajectory</span>
                  <div className={`font-black text-lg ${
                    analysis.academic?.trend?.toLowerCase().includes('positive') ? 'text-emerald-500' :
                    analysis.academic?.trend?.toLowerCase().includes('negative') ? 'text-red-500' : 'text-blue-500'
                  }`}>{analysis.academic?.trend}</div>
                </div>
              </div>
              <h4 className="text-xl font-bold text-fg mb-3">Academic Performance</h4>
              <p className="text-muted-fg text-sm leading-relaxed mb-6 flex-1">
                {analysis.academic?.details}
              </p>
              <div className="flex gap-4 border-t border-border/50 pt-4">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Top Strength</span>
                  <span className="font-bold text-fg text-sm">{analysis.academic?.topStrength || 'N/A'}</span>
                </div>
                <div className="w-px bg-border/50"></div>
                <div className="flex-1 pl-4">
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block mb-1">Focus Area</span>
                  <span className="font-bold text-fg text-sm">{analysis.academic?.weakness || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Attendance & Homework Column */}
            <div className="space-y-6 flex flex-col">
              {/* Attendance Impact */}
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl p-6 shadow-sm flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-fg">Attendance Correlation</h4>
                </div>
                <p className="text-muted-fg text-sm leading-relaxed">
                  {analysis.attendanceImpact}
                </p>
              </div>

              {/* Homework */}
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-fg">Homework Consistency</h4>
                  </div>
                  <span className={`px-3 py-1 text-xs font-black rounded-full border ${
                    analysis.homework?.consistency?.toLowerCase() === 'excellent' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' :
                    analysis.homework?.consistency?.toLowerCase() === 'poor' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
                  }`}>
                    {analysis.homework?.consistency}
                  </span>
                </div>
                <p className="text-muted-fg text-sm leading-relaxed">
                  {analysis.homework?.details}
                </p>
              </div>
            </div>
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Behavior Log */}
             <div className="lg:col-span-1 bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-fg leading-none">Behavior</h4>
                    <span className="text-xs text-muted-fg mt-1 block">Status: {analysis.behavior?.status}</span>
                  </div>
                </div>
                <p className="text-muted-fg text-sm leading-relaxed">
                  {analysis.behavior?.details}
                </p>
              </div>

            {/* Recommendations */}
            <div className="lg:col-span-2 bg-gradient-to-br from-brand-50 to-surface-50 dark:from-brand-950/20 dark:to-surface-950 border w-full border-brand-200/50 dark:border-brand-800/30 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xl font-bold text-brand-900 dark:text-brand-100 mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-500" /> Strategic Recommendations
              </h4>
              <div className="space-y-4">
                {analysis.recommendations?.map((rec: string, idx: number) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/50 dark:bg-surface-900/50 backdrop-blur-sm border border-black/5 dark:border-white/5">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-fg/90">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
