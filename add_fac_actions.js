const fs = require('fs');

const content = `

export async function getTransportRoutes() {
  const auth = await authorizePermission("fees.view")
  if (!auth.allowed || !auth.context.schoolId) return []
  
  await connectToDatabase()
  const { TransportRouteModel } = await import("@/lib/models/TransportRoute")
  const routes = await TransportRouteModel.find({ schoolId: auth.context.schoolId }).sort({ routeName: 1 }).lean()
  return JSON.parse(JSON.stringify(routes))
}

export async function addTransportRoute(formData: FormData) {
  const auth = await authorizePermission("fees.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const { TransportRouteModel } = await import("@/lib/models/TransportRoute")

  const routeName = formData.get("routeName")?.toString()
  const monthlyFee = parseFloat(formData.get("monthlyFee")?.toString() || "0")
  const capacity = parseInt(formData.get("capacity")?.toString() || "0")
  const vehicleReg = formData.get("vehicleReg")?.toString() || ""
  const driverName = formData.get("driverName")?.toString() || ""
  const stops = formData.get("stops")?.toString() || ""

  if (!routeName || monthlyFee <= 0) return { error: "Invalid data" }

  await TransportRouteModel.create({
    schoolId: auth.context.schoolId,
    routeName, monthlyFee, capacity, vehicleReg, driverName, stops
  })

  revalidatePath('/dashboard/finance/transport')
  return { success: true }
}

export async function deleteTransportRoute(id: string) {
  const auth = await authorizePermission("fees.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const { TransportRouteModel } = await import("@/lib/models/TransportRoute")
  await TransportRouteModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath('/dashboard/finance/transport')
  return { success: true }
}

export async function getHostelRooms() {
  const auth = await authorizePermission("fees.view")
  if (!auth.allowed || !auth.context.schoolId) return []
  
  await connectToDatabase()
  const { HostelRoomModel } = await import("@/lib/models/HostelRoom")
  const rooms = await HostelRoomModel.find({ schoolId: auth.context.schoolId }).sort({ block: 1, roomType: 1 }).lean()
  return JSON.parse(JSON.stringify(rooms))
}

export async function addHostelRoom(formData: FormData) {
  const auth = await authorizePermission("fees.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const { HostelRoomModel } = await import("@/lib/models/HostelRoom")

  const block = formData.get("block")?.toString()
  const roomType = formData.get("roomType")?.toString()
  const monthlyFee = parseFloat(formData.get("monthlyFee")?.toString() || "0")
  const totalRooms = parseInt(formData.get("totalRooms")?.toString() || "0")

  if (!block || !roomType || monthlyFee <= 0) return { error: "Invalid data" }

  await HostelRoomModel.create({
    schoolId: auth.context.schoolId,
    block, roomType, monthlyFee, totalRooms
  })

  revalidatePath('/dashboard/finance/hostel')
  return { success: true }
}

export async function deleteHostelRoom(id: string) {
  const auth = await authorizePermission("fees.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const { HostelRoomModel } = await import("@/lib/models/HostelRoom")
  await HostelRoomModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath('/dashboard/finance/hostel')
  return { success: true }
}
`;

fs.appendFileSync('app/actions/finance.ts', content);
console.log('done');
