import { API_BASE_URL } from '@/shared/api/client'
import { STORAGE_KEYS } from '@/shared/constants'
import type { AuthSession } from '@/shared/types'

interface RemoteState {
  key: string
  value: string
}

const nativeSetItem = Storage.prototype.setItem
const nativeRemoveItem = Storage.prototype.removeItem
let installed = false
let hydrating = false

function realAccessToken(): string | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.authSession)
    if (!raw) return null
    const token = (JSON.parse(raw) as AuthSession).accessToken
    return token?.startsWith('mock_token_') ? null : token
  } catch {
    return null
  }
}

function isCloudKey(key: string): boolean {
  return key.startsWith('dw-') || key.startsWith('dw_')
}

async function syncValue(key: string, value?: string): Promise<void> {
  const token = realAccessToken()
  if (!token || hydrating || !isCloudKey(key) || key === STORAGE_KEYS.registeredUsers) return

  try {
    await fetch(`${API_BASE_URL}/state/${encodeURIComponent(key)}`, {
      method: value === undefined ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(value === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: value === undefined ? undefined : JSON.stringify({ value }),
    })
  } catch {
    // Local writes remain available if the network is temporarily unavailable.
  }
}

export function installCloudStorageSync(): void {
  if (installed || typeof window === 'undefined') return
  installed = true

  Storage.prototype.setItem = function setItem(key: string, value: string): void {
    nativeSetItem.call(this, key, value)
    if (this === window.localStorage) void syncValue(key, value)
  }

  Storage.prototype.removeItem = function removeItem(key: string): void {
    nativeRemoveItem.call(this, key)
    if (this === window.localStorage) void syncValue(key)
  }
}

export async function hydrateCloudStorage(): Promise<void> {
  const token = realAccessToken()
  if (!token) return

  try {
    const response = await fetch(`${API_BASE_URL}/state`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return
    const payload = await response.json() as { states: RemoteState[] }
    hydrating = true
    payload.states.forEach(({ key, value }) => nativeSetItem.call(window.localStorage, key, value))
    window.dispatchEvent(new Event('dw:cloud-storage-hydrated'))
  } catch {
    // The browser cache remains the offline fallback.
  } finally {
    hydrating = false
  }
}
