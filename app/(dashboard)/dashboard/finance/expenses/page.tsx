import { getExpenses, getExpenseSummary, getVendors } from "@/app/actions/finance"
import ExpensesClient from "./expenses-client"

export const metadata = {
  title: "Expenses Management",
}

export default async function ExpensesPage() {
  const expenses = await getExpenses()
  const summary = await getExpenseSummary()
  const vendors = await getVendors()

  return <ExpensesClient expenses={expenses} summary={summary} vendors={vendors} />
}