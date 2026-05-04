import { getAuthContext } from "@/lib/auth"
import { HomeworkGeneratorTab } from "@/components/dashboard/homework-generator"
import { redirect } from "next/navigation"

export const metadata = {
  title: "AI Homework Generator | EduCore",
  description:
    "Generate homework assignments, quizzes, and worksheets with AI. Save time and create better assignments.",
}

export default async function HomeworkGeneratorPage() {
  const auth = await getAuthContext()

  // Only teachers can access this
  if (auth?.roleName !== "TEACHER" && auth?.roleName !== "SCHOOL_ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
          AI Homework Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Create homework assignments, quizzes, and worksheets in seconds. Let AI handle the
          tedious work.
        </p>
      </div>

      <HomeworkGeneratorTab />
    </div>
  )
}
