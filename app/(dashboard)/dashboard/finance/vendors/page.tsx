import VendorsClient from "./vendors-client"
import { getVendors } from "@/app/actions/finance"

export const metadata = {
  title: "Vendors & Suppliers",
}

export default async function VendorsPage() {
  const vendors = await getVendors()
  
  return <VendorsClient initialVendors={vendors} />
}
