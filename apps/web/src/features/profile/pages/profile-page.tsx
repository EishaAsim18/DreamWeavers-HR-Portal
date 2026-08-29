import { useMemo, useState } from 'react'
import { Bell, Briefcase, Check, KeyRound, Laptop, Lock, Mail, MapPin, Moon, Palette, Phone, Save, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer, PageHeader } from '@/shared/components/layouts'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useAuth } from '@/shared/hooks/use-auth'
import { useTheme } from '@/shared/hooks/use-theme'
import { ROLE_LABELS } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'
import type { ThemeMode } from '@/shared/types'

type Tab = 'personal' | 'security' | 'preferences' | 'sessions'
interface ProfileDraft { firstName: string; lastName: string; phone: string; location: string; bio: string }

const TABS: { id: Tab; label: string; icon: typeof UserRound }[] = [
  { id: 'personal', label: 'Personal', icon: UserRound },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'sessions', label: 'Sessions', icon: Laptop },
]

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (value: boolean) => void; label: string; description: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--dw-color-border-default)] p-3.5"><div><p className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">{label}</p><p className="mt-0.5 text-xs text-[var(--dw-color-ink-tertiary)]">{description}</p></div><button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-[var(--dw-color-brand-primary)]' : 'bg-[var(--dw-color-border-strong)]')}><span className={cn('absolute left-1 top-1 size-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} /></button></div>
}

export function ProfilePage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState<Tab>('personal')
  const storageKey = `dw_profile_${user?.id ?? 'guest'}`
  const defaults = useMemo<ProfileDraft>(() => ({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', phone: '+92 300 1234567', location: 'Karachi, Pakistan', bio: 'Building thoughtful products and better ways of working together.' }), [user])
  const [profile, setProfile] = useState<ProfileDraft>(() => { try { return JSON.parse(localStorage.getItem(storageKey) ?? '') as ProfileDraft } catch { return defaults } })
  const [draft, setDraft] = useState(profile)
  const [editing, setEditing] = useState(false)
  const [alerts, setAlerts] = useState(() => ({ email: true, tasks: true, documents: false, weekly: true }))
  const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()

  const saveProfile = () => {
    setProfile(draft)
    localStorage.setItem(storageKey, JSON.stringify(draft))
    setEditing(false)
    toast.success('Profile saved')
  }

  return (
    <PageContainer>
      <PageHeader title="My Profile" description="Manage your identity, security, and workspace preferences." />
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-5 text-center shadow-[var(--dw-shadow-sm)] lg:sticky lg:top-24">
          <div className="mx-auto flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--dw-color-brand-primary)] to-cyan-700 text-2xl font-bold text-white shadow-[var(--dw-shadow-brand)]">{initials}</div>
          <h2 className="mt-4 text-xl font-bold text-[var(--dw-color-ink-primary)]">{profile.firstName} {profile.lastName}</h2>
          <p className="mt-1 text-sm text-[var(--dw-color-ink-secondary)]">{user?.jobTitle ?? 'Team member'}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" /> Active · {user ? ROLE_LABELS[user.role] : ''}</span>
          <div className="mt-5 space-y-2.5 border-t border-[var(--dw-color-border-default)] pt-4 text-left text-xs text-[var(--dw-color-ink-secondary)]"><p className="flex items-center gap-2"><Mail className="size-4 text-[var(--dw-color-ink-tertiary)]" /><span className="truncate">{user?.email}</span></p><p className="flex items-center gap-2"><Phone className="size-4 text-[var(--dw-color-ink-tertiary)]" />{profile.phone}</p><p className="flex items-center gap-2"><MapPin className="size-4 text-[var(--dw-color-ink-tertiary)]" />{profile.location}</p><p className="flex items-center gap-2"><Briefcase className="size-4 text-[var(--dw-color-ink-tertiary)]" />{user?.department ?? 'Workspace'}</p></div>
          <Button variant="secondary" className="mt-5 w-full" onClick={() => { setTab('personal'); setEditing(true) }}><UserRound className="size-4" /> Edit profile</Button>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-sm)]">
          <div className="flex overflow-x-auto border-b border-[var(--dw-color-border-default)] px-2 sm:px-4">{TABS.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setTab(item.id)} className={cn('flex h-12 shrink-0 items-center gap-2 border-b-2 px-3 text-xs font-semibold transition-colors', tab === item.id ? 'border-[var(--dw-color-brand-primary)] text-[var(--dw-color-brand-primary)]' : 'border-transparent text-[var(--dw-color-ink-tertiary)] hover:text-[var(--dw-color-ink-primary)]')}><Icon className="size-4" />{item.label}</button> })}</div>

          <div className="p-4 sm:p-6">
            {tab === 'personal' && <div className="max-w-2xl"><div className="mb-5 flex items-center justify-between gap-3"><div><h3 className="text-base font-bold text-[var(--dw-color-ink-primary)]">Personal information</h3><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Keep your contact details current for your team.</p></div>{!editing && <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Button>}</div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">First name<Input value={draft.firstName} disabled={!editing} onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Last name<Input value={draft.lastName} disabled={!editing} onChange={(event) => setDraft({ ...draft, lastName: event.target.value })} /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Phone<Input value={draft.phone} disabled={!editing} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Location<Input value={draft.location} disabled={!editing} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)] sm:col-span-2">Bio<textarea value={draft.bio} disabled={!editing} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} className="min-h-28 w-full resize-none rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3 text-sm font-normal text-[var(--dw-color-ink-primary)] outline-none focus:border-[var(--dw-color-brand-primary)] disabled:bg-[var(--dw-color-surface-sunken)]" /></label></div>{editing && <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => { setDraft(profile); setEditing(false) }}>Cancel</Button><Button onClick={saveProfile}><Save className="size-4" /> Save profile</Button></div>}</div>}

            {tab === 'security' && <div className="max-w-2xl space-y-5"><div><h3 className="text-base font-bold text-[var(--dw-color-ink-primary)]">Password & security</h3><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Use a strong, unique password for this account.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)] sm:col-span-2">Current password<Input type="password" placeholder="Enter current password" /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">New password<Input type="password" placeholder="At least 8 characters" /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Confirm password<Input type="password" placeholder="Repeat new password" /></label></div><Button onClick={() => toast.success('Password updated')}><KeyRound className="size-4" /> Update password</Button><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="flex items-center gap-2 text-sm font-bold text-emerald-800"><ShieldCheck className="size-4" /> Two-factor authentication</p><p className="mt-1 text-xs text-emerald-700">Your account is protected with email verification.</p></div></div>}

            {tab === 'preferences' && <div className="max-w-2xl space-y-5"><div><h3 className="text-base font-bold text-[var(--dw-color-ink-primary)]">Appearance</h3><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Choose how DreamWeavers looks on this device.</p></div><div className="grid grid-cols-3 gap-2">{([{ id: 'light', label: 'Light', icon: Sun }, { id: 'dark', label: 'Dark', icon: Moon }, { id: 'system', label: 'System', icon: Laptop }] as { id: ThemeMode; label: string; icon: typeof Sun }[]).map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setTheme(item.id)} className={cn('flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-semibold', theme === item.id ? 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]' : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-secondary)]')}><Icon className="size-5" />{item.label}{theme === item.id && <Check className="size-3" />}</button> })}</div><div className="border-t border-[var(--dw-color-border-default)] pt-5"><h3 className="mb-3 flex items-center gap-2 text-base font-bold text-[var(--dw-color-ink-primary)]"><Bell className="size-4" /> Notifications</h3><div className="space-y-2"><Toggle checked={alerts.email} onChange={(value) => setAlerts({ ...alerts, email: value })} label="Email notifications" description="Important account and HR updates." /><Toggle checked={alerts.tasks} onChange={(value) => setAlerts({ ...alerts, tasks: value })} label="Task reminders" description="Due dates and review requests." /><Toggle checked={alerts.documents} onChange={(value) => setAlerts({ ...alerts, documents: value })} label="Document activity" description="Sharing and document expiry alerts." /><Toggle checked={alerts.weekly} onChange={(value) => setAlerts({ ...alerts, weekly: value })} label="Weekly digest" description="A Monday summary of your workspace." /></div></div></div>}

            {tab === 'sessions' && <div className="max-w-2xl"><div><h3 className="text-base font-bold text-[var(--dw-color-ink-primary)]">Active sessions</h3><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Review devices currently signed in to your account.</p></div><div className="mt-5 space-y-2">{[{ device: 'Windows · Codex Browser', location: 'Karachi, Pakistan', current: true, time: 'Active now' }, { device: 'Chrome on Android', location: 'Lahore, Pakistan', current: false, time: '2 days ago' }].map((session) => <div key={session.device} className="flex items-center gap-3 rounded-xl border border-[var(--dw-color-border-default)] p-3.5"><span className="flex size-10 items-center justify-center rounded-xl bg-[var(--dw-color-surface-sunken)]"><Laptop className="size-5 text-[var(--dw-color-ink-secondary)]" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">{session.device}</p><p className="text-xs text-[var(--dw-color-ink-tertiary)]">{session.location} · {session.time}</p></div>{session.current ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Current</span> : <Button variant="ghost" size="sm" onClick={() => toast.success('Session revoked')}>Revoke</Button>}</div>)}</div></div>}
          </div>
        </section>
      </div>
    </PageContainer>
  )
}
