import FeeStructureClient from "./fee-structure-client"
import { getFeeStructures, getFeeStudentClassOptions } from "@/app/actions/fees"

export const metadata = {
  title: "Fee Structure",
}

export default async function FeeStructurePage() {
  const structures = await getFeeStructures()
  const classes = await getFeeStudentClassOptions()

  return <FeeStructureClient initialStructures={structures} classes={classes} />
}
