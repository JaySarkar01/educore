import { connectToDatabase } from "@/lib/db"
import { PermissionModel } from "@/lib/models/Permission"
import { RoleModel } from "@/lib/models/Role"
import { PERMISSIONS, ROLE_LABELS, ROLE_PERMISSIONS, RoleName } from "@/lib/rbac"

let seeded = false

function splitPermission(permission: string) {
  const [module, action] = permission.split(".")
  return {
    module: module || "system",
    action: action || "all",
  }
}

export async function ensureRBACSeeded() {
  if (seeded) return

  await connectToDatabase()

  await Promise.all(
    PERMISSIONS.filter((p) => p !== "*").map(async (key) => {
      const { module, action } = splitPermission(key)
      await PermissionModel.updateOne(
        { key },
        {
          $set: {
            key,
            module,
            action,
            description: `${module} ${action}`,
          },
        },
        { upsert: true }
      )
    })
  )

  await Promise.all(
    (Object.keys(ROLE_PERMISSIONS) as RoleName[]).map(async (name) => {
      await RoleModel.updateOne(
        { name },
        {
          $set: {
            name,
            displayName: ROLE_LABELS[name],
            permissions: ROLE_PERMISSIONS[name],
            isSystem: true,
          },
        },
        { upsert: true }
      )
    })
  )

  await RoleModel.deleteOne({ name: "PARENT" })

  seeded = true
}
