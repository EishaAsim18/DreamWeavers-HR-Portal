import { useMemo, useState } from 'react'
import { BellRing, Building2, Check, Cloud, Globe2, KeyRound, Link2, LockKeyhole, Palette, Save, ShieldCheck, UsersRound } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer, PageHeader } from '@/shared/components/layouts'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useAuth } from '@/shared/hooks/use-auth'
import { useTheme } from '@/shared/hooks/use-theme'
import { cn } from '@/shared/lib/utils'
import type { ThemeMode } from '@/shared/types'

type Section = 'organization' | 'people' | 'security' | 'integrations' | 'preferences'
interface SettingsState { orgName: string; domain: string; timezone: string; workweek: string; sessionMinutes: string; requireMfa: boolean; allowInvites: boolean; google: boolean; slack: boolean; storage: boolean; emailAlerts: boolean; weeklyDigest: boolean }

function Switch({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', value ? 'bg-[var(--dw-color-brand-primary)]' : 'bg-[var(--dw-color-border-strong)]')}><span className={cn('absolute left-1 top-1 size-4 rounded-full bg-white shadow transition-transform', value && 'translate-x-5')} /></button>
}

function SettingRow({ title, description, value, onChange }: { title: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 border-b border-[var(--dw-color-border-default)] py-4 last:border-b-0"><div><p className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">{title}</p><p className="mt-0.5 text-xs text-[var(--dw-color-ink-tertiary)]">{description}</p></div><Switch value={value} onChange={onChange} /></div>
}

export function SettingsPage() {
  const { user, can } = useAuth()
  const { theme, setTheme } = useTheme()
  const canOrg = can('settings:org')
  const canSystem = can('settings:system')
  const sections = useMemo(() => [
    ...(canOrg ? [{ id: 'organization' as const, label: 'Organization', icon: Building2 }, { id: 'people' as const, label: 'People', icon: UsersRound }] : []),
    { id: 'security' as const, label: 'Security', icon: LockKeyhole },
    ...(canOrg ? [{ id: 'integrations' as const, label: 'Integrations', icon: Link2 }] : []),
    { id: 'preferences' as const, label: 'Preferences', icon: Palette },
  ], [canOrg])
  const [section, setSection] = useState<Section>(canOrg ? 'organization' : 'security')
  const [dirty, setDirty] = useState(false)
  const storageKey = `dw_settings_${user?.id ?? 'guest'}`
  const [settings, setSettings] = useState<SettingsState>(() => { try { return JSON.parse(localStorage.getItem(storageKey) ?? '') as SettingsState } catch { return { orgName: 'DreamWeavers', domain: 'dreamweavers.com', timezone: 'Asia/Karachi', workweek: 'Monday – Friday', sessionMinutes: '60', requireMfa: true, allowInvites: true, google: true, slack: false, storage: true, emailAlerts: true, weeklyDigest: true } } })
  const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => { setSettings((current) => ({ ...current, [key]: value })); setDirty(true) }
  const save = () => { localStorage.setItem(storageKey, JSON.stringify(settings)); setDirty(false); toast.success('Settings saved') }

  return (
    <PageContainer className="pb-24">
      <PageHeader title="Settings" description="Configure your workspace, security, and personal preferences." />
      <div className="grid gap-4 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-2.5 shadow-[var(--dw-shadow-sm)] lg:sticky lg:top-24"><nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">{sections.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setSection(item.id)} className={cn('flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold', section === item.id ? 'bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]' : 'text-[var(--dw-color-ink-secondary)] hover:bg-[var(--dw-color-surface-sunken)]')}><Icon className="size-4 shrink-0" /><span className="truncate">{item.label}</span></button> })}</nav><div className="mt-3 hidden rounded-xl bg-[var(--dw-color-surface-sunken)] p-3 lg:block"><p className="text-[10px] font-bold text-[var(--dw-color-ink-secondary)]">Signed in as</p><p className="mt-1 truncate text-xs text-[var(--dw-color-ink-primary)]">{user?.email}</p></div></aside>

        <section className="min-w-0 rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-4 shadow-[var(--dw-shadow-sm)] sm:p-6">
          {section === 'organization' && canOrg && <div className="max-w-2xl"><h2 className="flex items-center gap-2 text-base font-bold text-[var(--dw-color-ink-primary)]"><Building2 className="size-5 text-[var(--dw-color-brand-primary)]" /> Organization settings</h2><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Company identity and regional defaults used across the portal.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)] sm:col-span-2">Organization name<Input value={settings.orgName} onChange={(event) => update('orgName', event.target.value)} /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Company domain<Input value={settings.domain} onChange={(event) => update('domain', event.target.value)} /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Timezone<select value={settings.timezone} onChange={(event) => update('timezone', event.target.value)} className="h-9 w-full rounded-md border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] px-3 text-sm"><option>Asia/Karachi</option><option>UTC</option><option>Asia/Dubai</option></select></label><label className="space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)] sm:col-span-2">Working week<Input value={settings.workweek} onChange={(event) => update('workweek', event.target.value)} /></label></div></div>}

          {section === 'people' && canOrg && <div className="max-w-2xl"><h2 className="flex items-center gap-2 text-base font-bold text-[var(--dw-color-ink-primary)]"><UsersRound className="size-5 text-[var(--dw-color-brand-primary)]" /> People controls</h2><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Defaults for account invitations and directory visibility.</p><div className="mt-5"><SettingRow title="Allow HR invitations" description="HR administrators can invite standard employee accounts." value={settings.allowInvites} onChange={(value) => update('allowInvites', value)} /><div className="rounded-xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-sunken)] p-4"><p className="text-sm font-semibold text-[var(--dw-color-ink-primary)]">Account hierarchy</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{['Super Admin', 'HR Administrator', 'Employee'].map((role, index) => <div key={role} className="rounded-lg border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] p-3"><p className="text-xs font-bold text-[var(--dw-color-ink-primary)]">{role}</p><p className="mt-1 text-[10px] text-[var(--dw-color-ink-tertiary)]">{index === 0 ? 'System control' : index === 1 ? 'People operations' : 'Personal workspace'}</p></div>)}</div></div></div></div>}

          {section === 'security' && <div className="max-w-2xl"><h2 className="flex items-center gap-2 text-base font-bold text-[var(--dw-color-ink-primary)]"><ShieldCheck className="size-5 text-[var(--dw-color-brand-primary)]" /> Security</h2><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Protect access to your organization and account.</p><div className="mt-5"><SettingRow title="Require multi-factor authentication" description={canSystem ? 'Apply MFA to all administrator accounts.' : 'Require verification for your account.'} value={settings.requireMfa} onChange={(value) => update('requireMfa', value)} /><label className="mt-4 block max-w-xs space-y-1.5 text-xs font-semibold text-[var(--dw-color-ink-secondary)]">Session timeout (minutes)<Input type="number" min="15" value={settings.sessionMinutes} onChange={(event) => update('sessionMinutes', event.target.value)} /></label><div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="flex items-center gap-2 text-sm font-bold text-emerald-800"><KeyRound className="size-4" /> Password policy active</p><p className="mt-1 text-xs text-emerald-700">Minimum eight characters with secure session rotation.</p></div></div></div>}

          {section === 'integrations' && canOrg && <div className="max-w-2xl"><h2 className="flex items-center gap-2 text-base font-bold text-[var(--dw-color-ink-primary)]"><Cloud className="size-5 text-[var(--dw-color-brand-primary)]" /> Integrations</h2><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Connect services used by your organization.</p><div className="mt-5 space-y-2"><SettingRow title="Google Workspace" description="Calendar and directory synchronization." value={settings.google} onChange={(value) => update('google', value)} /><SettingRow title="Slack notifications" description="Send task and approval updates to Slack." value={settings.slack} onChange={(value) => update('slack', value)} /><SettingRow title="Cloud document storage" description="Securely retain uploaded company files." value={settings.storage} onChange={(value) => update('storage', value)} /></div></div>}

          {section === 'preferences' && <div className="max-w-2xl"><h2 className="flex items-center gap-2 text-base font-bold text-[var(--dw-color-ink-primary)]"><Palette className="size-5 text-[var(--dw-color-brand-primary)]" /> Preferences</h2><p className="mt-1 text-xs text-[var(--dw-color-ink-tertiary)]">Personalize appearance and updates on this device.</p><div className="mt-5"><p className="mb-2 text-xs font-bold text-[var(--dw-color-ink-secondary)]">Theme</p><div className="grid grid-cols-3 gap-2">{(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => <button key={mode} type="button" onClick={() => setTheme(mode)} className={cn('rounded-xl border p-3 text-xs font-semibold capitalize', theme === mode ? 'border-[var(--dw-color-brand-primary)] bg-[var(--dw-color-brand-primary-muted)] text-[var(--dw-color-brand-primary)]' : 'border-[var(--dw-color-border-default)] text-[var(--dw-color-ink-secondary)]')}>{theme === mode && <Check className="mx-auto mb-1 size-4" />}{mode === 'system' && <Globe2 className="mx-auto mb-1 size-4" />}{mode}</button>)}</div><div className="mt-5"><SettingRow title="Email alerts" description="Receive important HR and account updates." value={settings.emailAlerts} onChange={(value) => update('emailAlerts', value)} /><SettingRow title="Weekly workspace digest" description="Summary delivered every Monday morning." value={settings.weeklyDigest} onChange={(value) => update('weeklyDigest', value)} /></div></div></div>}
        </section>
      </div>
      {dirty && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)]/95 p-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:left-[var(--dw-sidebar-width)]"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3"><p className="text-xs font-medium text-[var(--dw-color-ink-secondary)]"><BellRing className="mr-1.5 inline size-4" />You have unsaved changes.</p><Button onClick={save}><Save className="size-4" /> Save changes</Button></div></div>}
    </PageContainer>
  )
}
