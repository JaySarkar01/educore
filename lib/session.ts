import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { RoleName } from '@/lib/rbac'

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key-educore'
const encodedKey = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  role: 'ADMIN' | 'SCHOOL' | RoleName;
  schoolId?: string;
  userId?: string;
  roleId?: string;
  permissions?: string[];
  email?: string;
  mustChangePassword?: boolean;
  expiresAt: number;
};

export async function encrypt(payload: SessionPayload) {
  const safePayload = {
    role: payload.role,
    schoolId: payload.schoolId,
    userId: payload.userId,
    roleId: payload.roleId,
    permissions: Array.isArray(payload.permissions) ? payload.permissions.map((p) => String(p)) : [],
    email: payload.email,
    mustChangePassword: !!payload.mustChangePassword,
    expiresAt: Number(payload.expiresAt),
  }

  return new SignJWT(safePayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch (error) {
    return null
  }
}

type CreateSessionInput =
  | {
      role: SessionPayload['role']
      schoolId?: string
      userId?: string
      roleId?: string
      permissions?: string[]
      email?: string
      mustChangePassword?: boolean
    }
  | SessionPayload['role']

export async function createSession(input: CreateSessionInput, schoolId?: string) {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
  const payload = typeof input === 'string'
    ? { role: input, schoolId }
    : input

  const session = await encrypt({
    role: payload.role,
    schoolId: payload.schoolId,
    userId: payload.userId,
    roleId: payload.roleId,
    permissions: payload.permissions,
    email: payload.email,
    mustChangePassword: payload.mustChangePassword,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt),
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
