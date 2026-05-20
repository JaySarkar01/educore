const fs = require('fs');

const content = `import HostelClient from "./hostel-client"
import { getHostelRooms } from "@/app/actions/finance"

export default async function HostelPage() {
  const rooms = await getHostelRooms()

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Hostel Fees</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Accommodation ledger and boarding charges.</p>
        </div>
      </div>

      <HostelClient initialRooms={rooms} />
    </div>
  )
}
`;

fs.writeFileSync('app/(dashboard)/dashboard/finance/hostel/page.tsx', content);
