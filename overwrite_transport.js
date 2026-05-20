const fs = require('fs');

const content = `import TransportClient from "./transport-client"
import { getTransportRoutes } from "@/app/actions/finance"

export default async function TransportPage() {
  const routes = await getTransportRoutes()

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Transport Fees</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Manage bus routes and specific transport billing mapping.</p>
        </div>
      </div>

      <TransportClient initialRoutes={routes} />
    </div>
  )
}
`;

fs.writeFileSync('app/(dashboard)/dashboard/finance/transport/page.tsx', content);
