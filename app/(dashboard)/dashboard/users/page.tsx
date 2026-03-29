import { UserManagement } from "@/components/dashboard/user-management"
import { authorizePermission } from "@/lib/auth"

export default async function UsersManagementPage() {
  const auth = await authorizePermission("user.manage")

  if (!auth.allowed) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-fg">Access Denied</h1>
        <p className="text-muted-fg mt-2">You do not have permission to manage users.</p>
      </div>
    )
  }

  return <UserManagement />
}
