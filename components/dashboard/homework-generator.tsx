"use client"

import { useState, useEffect } from "react"
import { 
  generateHomework, 
  regenerateHomework, 
  getTeacherSubjects,
  getTeacherClasses,
  type HomeworkGeneratorInput 
} from "@/app/actions/homework-generator"
import { Wand2, Copy, Download, RotateCw, BookOpen, Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface Subject {
  id: string
  name: string
  code: string
}

interface AcademicClass {
  id: string
  name: string
  gradeLevel: string
}

export function HomeworkGeneratorTab() {
  const [generating, setGenerating] = useState(false)
  const [output, setOutput] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [lastInput, setLastInput] = useState<HomeworkGeneratorInput | null>(null)
  
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<AcademicClass[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [form, setForm] = useState<HomeworkGeneratorInput>({
    topic: "Quadratic Equations",
    classId: "",
    subjectId: "",
    gradeLevel: "10",
    assignmentType: "mixed",
    difficulty: "medium",
    numberOfItems: 5,
    includeAnswers: true,
  })

  // Load subjects and classes on mount
  useEffect(() => {
    async function loadData() {
      setLoadingData(true)
      try {
        const [subjectsData, classesData] = await Promise.all([
          getTeacherSubjects(),
          getTeacherClasses(),
        ])
        setSubjects(subjectsData)
        setClasses(classesData)
        
        // Auto-select first subject and class if available
        if (subjectsData.length > 0 && !form.subjectId) {
          setForm(prev => ({ ...prev, subjectId: subjectsData[0].id }))
        }
        if (classesData.length > 0 && !form.classId) {
          setForm(prev => ({ ...prev, classId: classesData[0].id }))
        }
      } catch (err) {
        setError("Failed to load subjects and classes")
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [])

  async function handleGenerate() {
    if (!form.topic.trim()) {
      setError("Please fill in topic")
      return
    }
    if (!form.subjectId) {
      setError("Please select a subject")
      return
    }
    if (!form.classId) {
      setError("Please select a class")
      return
    }

    setGenerating(true)
    setError(null)
    setOutput(null)

    try {
      const result = await generateHomework(form)
      if (result.error) {
        setError(result.error)
      } else {
        setOutput(result.homework)
        setLastInput(form)
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate homework")
    } finally {
      setGenerating(false)
    }
  }

  async function handleRegenerate() {
    if (!lastInput) return
    setGenerating(true)
    setError(null)

    try {
      const result = await regenerateHomework(lastInput)
      if (result.error) {
        setError(result.error)
      } else {
        setOutput(result.homework)
      }
    } catch (err: any) {
      setError(err.message || "Failed to regenerate")
    } finally {
      setGenerating(false)
    }
  }

  function downloadAsText() {
    if (!output) return

    const content = `
HOMEWORK: ${output.title}
Subject: ${output.subject}
Grade Level: ${output.gradeLevel}
Topic: ${output.topic}
Difficulty: ${output.difficulty}
Estimated Time: ${output.estimatedTime}

INSTRUCTIONS:
${output.instructions}

QUESTIONS/ITEMS:
${output.items.map((item: string, i: number) => `${i + 1}. ${item}`).join("\n")}

${
  output.answers
    ? `\nANSWER KEY:\n${output.answers.map((answer: string, i: number) => `${i + 1}. ${answer}`).join("\n")}`
    : ""
}

Learning Objectives:
${output.learningObjectives.map((obj: string) => `- ${obj}`).join("\n")}
    `.trim()

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
    element.setAttribute("download", `${output.title.replace(/\s+/g, "_")}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  function copyToClipboard() {
    if (!output) return
    const text = `
HOMEWORK: ${output.title}

${output.instructions}

${output.items.map((item: string, i: number) => `${i + 1}. ${item}`).join("\n")}
    `.trim()

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        
        <p className="text-slate-600 dark:text-slate-400">
          Enter a topic and class, and let AI generate customized homework assignments in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Configuration</h3>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g., Photosynthesis, Linear Equations"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>

        {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Subject *
              </label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                disabled={loadingData}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm disabled:opacity-50"
              >
                <option value="">Select a subject...</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {subjects.length === 0 && !loadingData && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">No subjects available</p>
              )}
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Class *
              </label>
              <select
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                disabled={loadingData}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm disabled:opacity-50"
              >
                <option value="">Select a class...</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} (Grade {classItem.gradeLevel})
                  </option>
                ))}
              </select>
              {classes.length === 0 && !loadingData && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">No classes available</p>
              )}
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Grade Level
              </label>
              <select
                value={form.gradeLevel}
                onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              >
                {["6", "7", "8", "9", "10", "11", "12"].map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Type */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Assignment Type
              </label>
              <select
                value={form.assignmentType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    assignmentType: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              >
                <option value="questions">Practice Questions</option>
                <option value="quiz">Quiz</option>
                <option value="worksheet">Worksheet</option>
                <option value="mixed">Mixed (Questions & Problems)</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Difficulty Level
              </label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              >
                <option value="easy">Easy (Foundational)</option>
                <option value="medium">Medium (Intermediate)</option>
                <option value="hard">Hard (Advanced)</option>
              </select>
            </div>

            {/* Number of Items */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white">
                  Number of Items
                </label>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {form.numberOfItems}
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={form.numberOfItems}
                onChange={(e) =>
                  setForm({ ...form, numberOfItems: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>3</span>
                <span>15</span>
              </div>
            </div>

            {/* Include Answers */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="answers"
                checked={form.includeAnswers}
                onChange={(e) => setForm({ ...form, includeAnswers: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <label htmlFor="answers" className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer">
                Include Answer Key
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Homework
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Error</h3>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!output && !generating && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                Configure settings and click "Generate" to create homework
              </p>
            </div>
          )}

          {generating && (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3 animate-spin" />
              <p className="text-slate-900 dark:text-white font-medium">
                Creating your homework assignment...
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">This may take a moment</p>
            </div>
          )}

          {output && !generating && (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 p-6 text-white space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{output.title}</h3>
                    <p className="text-blue-100 text-sm mt-1">{output.subject} • {output.class} • Grade {output.gradeLevel}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      title="Copy to clipboard"
                      className="p-2 hover:bg-blue-500 dark:hover:bg-blue-700 rounded transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={downloadAsText}
                      title="Download as text file"
                      className="p-2 hover:bg-blue-500 dark:hover:bg-blue-700 rounded transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleRegenerate}
                      disabled={generating}
                      title="Regenerate with same settings"
                      className="p-2 hover:bg-blue-500 dark:hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded p-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Difficulty</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                      {output.difficulty}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded p-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Time</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {output.estimatedTime}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded p-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Items</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {output.items.length}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded p-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Type</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                      {output.type}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                {output.instructions && (
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Instructions</h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      {output.instructions}
                    </p>
                  </div>
                )}

                {/* Questions/Items */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Items</h4>
                  <div className="space-y-3">
                    {output.items.map((item: string, idx: number) => (
                      <div
                        key={idx}
                        className="border border-slate-200 dark:border-slate-600 rounded p-3 bg-slate-50 dark:bg-slate-700/50"
                      >
                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                          {idx + 1}.
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answers */}
                {output.answers && output.answers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Answer Key</h4>
                    <div className="space-y-3 bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                      {output.answers.map((answer: string, idx: number) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium text-slate-900 dark:text-white mb-1">{idx + 1}.</p>
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Objectives */}
                {output.learningObjectives && output.learningObjectives.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                      Learning Objectives
                    </h4>
                    <ul className="space-y-2">
                      {output.learningObjectives.map((objective: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                            ✓
                          </span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
