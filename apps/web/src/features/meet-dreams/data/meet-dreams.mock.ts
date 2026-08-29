import type { ChatMessage, Conversation } from '../types/chat.types'

/**
 * Seed channels + DMs. Member ids match `CALENDAR_PEOPLE`
 * (`@/features/calendar/data/calendar.mock`) so chat, tasks, and teams all
 * share one identity space.
 */
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'chan_general',
    kind: 'channel',
    name: 'general',
    description: 'Company-wide chatter and announcements.',
    memberIds: ['usr_super_1', 'usr_admin_1', 'usr_admin_2', 'usr_emp_1', 'usr_emp_2', 'usr_emp_3', 'usr_emp_4', 'usr_emp_5'],
    createdById: 'usr_super_1',
    createdAt: '2024-01-05T08:00:00Z',
  },
  {
    id: 'chan_engineering',
    kind: 'channel',
    name: 'engineering',
    description: 'Ship talk, code reviews, and on-call chatter.',
    memberIds: ['usr_super_1', 'usr_emp_1', 'usr_emp_2', 'usr_emp_4'],
    createdById: 'usr_super_1',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'chan_product_design',
    kind: 'channel',
    name: 'product-design',
    description: 'Roadmap, specs, and design reviews.',
    memberIds: ['usr_super_1', 'usr_emp_5', 'usr_emp_3'],
    createdById: 'usr_emp_5',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'chan_people_ops',
    kind: 'channel',
    name: 'people-ops',
    description: 'HR policy, hiring, and operations coordination.',
    memberIds: ['usr_super_1', 'usr_admin_1', 'usr_admin_2'],
    createdById: 'usr_admin_1',
    createdAt: '2024-01-05T08:00:00Z',
  },
  {
    id: 'dm_omar_zara',
    kind: 'dm',
    memberIds: ['usr_admin_1', 'usr_emp_1'],
    createdAt: '2026-07-18T09:00:00Z',
  },
  {
    id: 'dm_ayesha_nadia',
    kind: 'dm',
    memberIds: ['usr_super_1', 'usr_emp_5'],
    createdAt: '2026-07-17T10:00:00Z',
  },
  {
    id: 'dm_omar_bilal',
    kind: 'dm',
    memberIds: ['usr_admin_1', 'usr_emp_2'],
    createdAt: '2026-07-19T08:00:00Z',
  },
  {
    id: 'dm_ayesha_omar',
    kind: 'dm',
    memberIds: ['usr_super_1', 'usr_admin_1'],
    createdAt: '2026-07-16T08:00:00Z',
  },
]

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  // ── #general ──────────────────────────────────────────────────────────────
  { id: 'msg_g1', conversationId: 'chan_general', authorId: 'usr_super_1', content: '🌙 Reminder — Company Foundation Day is this week! Cake in the main lobby at 4pm 🎂', createdAt: '2026-07-19T09:02:00Z' },
  { id: 'msg_g2', conversationId: 'chan_general', authorId: 'usr_admin_1', content: 'Also don\'t forget to fill your Q3 self-review forms before Friday.', createdAt: '2026-07-19T09:15:00Z' },
  { id: 'msg_g3', conversationId: 'chan_general', authorId: 'usr_emp_3', content: 'Congrats to the design team on shipping the new onboarding flow 🎉', createdAt: '2026-07-19T14:22:00Z' },
  { id: 'msg_g4', conversationId: 'chan_general', authorId: 'usr_emp_5', content: 'Huge team effort — thanks everyone who gave feedback in the review!', createdAt: '2026-07-19T14:30:00Z' },
  { id: 'msg_g5', conversationId: 'chan_general', authorId: 'usr_admin_2', content: 'Office wifi upgrade happening tonight, expect a short outage around 11pm.', createdAt: '2026-07-20T17:05:00Z' },
  { id: 'msg_g6', conversationId: 'chan_general', authorId: 'usr_emp_4', content: 'Noted, I\'ll pause the CI runners until it\'s back up.', createdAt: '2026-07-20T17:07:00Z' },

  // ── #engineering ──────────────────────────────────────────────────────────
  { id: 'msg_e1', conversationId: 'chan_engineering', authorId: 'usr_emp_1', content: 'Migration scripts for the Postgres 16 upgrade are ready — starting staging today.', createdAt: '2026-07-20T09:10:00Z' },
  { id: 'msg_e2', conversationId: 'chan_engineering', authorId: 'usr_super_1', content: 'Nice. Keep an eye on connection pool sizing after the cutover.', createdAt: '2026-07-20T09:14:00Z' },
  { id: 'msg_e3', conversationId: 'chan_engineering', authorId: 'usr_emp_4', content: 'CI/CD pipeline optimization is queued next sprint — targeting 40% faster builds.', createdAt: '2026-07-20T10:02:00Z' },
  { id: 'msg_e4', conversationId: 'chan_engineering', authorId: 'usr_emp_2', content: 'Pushed the Sprint 23 PRs, would love a review before EOD 🙏', createdAt: '2026-07-21T08:40:00Z' },
  { id: 'msg_e5', conversationId: 'chan_engineering', authorId: 'usr_emp_1', content: 'On it — will review after standup.', createdAt: '2026-07-21T08:44:00Z' },

  // ── #product-design ─────────────────────────────────────────────────────
  { id: 'msg_p1', conversationId: 'chan_product_design', authorId: 'usr_emp_5', content: 'Can we prioritize the data table and form components in the design system first?', createdAt: '2026-07-18T13:00:00Z' },
  { id: 'msg_p2', conversationId: 'chan_product_design', authorId: 'usr_emp_3', content: 'Yep, moving those to the top of the queue. Figma spec updated.', createdAt: '2026-07-18T13:12:00Z' },
  { id: 'msg_p3', conversationId: 'chan_product_design', authorId: 'usr_super_1', content: 'Great — let\'s demo progress in Thursday\'s design review.', createdAt: '2026-07-18T15:40:00Z' },

  // ── #people-ops ───────────────────────────────────────────────────────────
  { id: 'msg_o1', conversationId: 'chan_people_ops', authorId: 'usr_admin_1', content: 'Handbook 2026 draft is in review — remote work section fully updated.', createdAt: '2026-07-17T11:00:00Z' },
  { id: 'msg_o2', conversationId: 'chan_people_ops', authorId: 'usr_admin_2', content: 'Nice, I\'ll circulate to the ops team for a final pass.', createdAt: '2026-07-17T11:05:00Z' },
  { id: 'msg_o3', conversationId: 'chan_people_ops', authorId: 'usr_super_1', content: 'Let\'s target publishing before the August onboarding batch.', createdAt: '2026-07-17T11:20:00Z' },

  // ── DM: Omar <-> Zara ──────────────────────────────────────────────────────
  { id: 'msg_d1_1', conversationId: 'dm_omar_zara', authorId: 'usr_admin_1', content: 'Hey Zara — how\'s the handbook update coming along?', createdAt: '2026-07-18T09:05:00Z' },
  { id: 'msg_d1_2', conversationId: 'dm_omar_zara', authorId: 'usr_emp_1', content: 'Almost done! Just polishing the remote work section, submitting for review today.', createdAt: '2026-07-18T09:20:00Z' },
  { id: 'msg_d1_3', conversationId: 'dm_omar_zara', authorId: 'usr_admin_1', content: 'Perfect, thank you 🙌', createdAt: '2026-07-18T09:21:00Z' },

  // ── DM: Ayesha <-> Nadia ───────────────────────────────────────────────────
  { id: 'msg_d2_1', conversationId: 'dm_ayesha_nadia', authorId: 'usr_super_1', content: 'Do you have 15 min before the Q3 planning session to align on priorities?', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'msg_d2_2', conversationId: 'dm_ayesha_nadia', authorId: 'usr_emp_5', content: 'Yep, free right after my 1:1. I\'ll send an invite.', createdAt: '2026-07-17T10:04:00Z' },

  // ── DM: Omar <-> Bilal ─────────────────────────────────────────────────────
  { id: 'msg_d3_1', conversationId: 'dm_omar_bilal', authorId: 'usr_admin_1', content: 'The monthly analytics report was due July 3rd — can you get it to me today?', createdAt: '2026-07-19T08:05:00Z' },
  { id: 'msg_d3_2', conversationId: 'dm_omar_bilal', authorId: 'usr_emp_2', content: 'Apologies, on it now — will have it by 5pm.', createdAt: '2026-07-19T08:10:00Z' },

  // ── DM: Ayesha <-> Omar ────────────────────────────────────────────────────
  { id: 'msg_d4_1', conversationId: 'dm_ayesha_omar', authorId: 'usr_super_1', content: 'How did the enterprise client demo prep go?', createdAt: '2026-07-16T08:10:00Z' },
  { id: 'msg_d4_2', conversationId: 'dm_ayesha_omar', authorId: 'usr_admin_1', content: 'On track — deck and case studies are done, working on the pricing proposal now.', createdAt: '2026-07-16T08:30:00Z' },
]
