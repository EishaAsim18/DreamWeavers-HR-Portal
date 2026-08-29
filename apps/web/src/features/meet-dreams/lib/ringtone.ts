/** Tiny WebAudio-synthesized ringtone — no audio asset needed. */

let ctx: AudioContext | null = null
let intervalId: ReturnType<typeof setInterval> | null = null

function beep(freq: number, duration: number, delay = 0): void {
  if (!ctx) return
  const startAt = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = freq
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(0.16, startAt + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startAt)
  osc.stop(startAt + duration + 0.02)
}

export function playRingtone(): void {
  if (typeof window === 'undefined' || intervalId) return
  try {
    ctx = ctx ?? new AudioContext()
    const ring = () => {
      beep(660, 0.22, 0)
      beep(880, 0.22, 0.28)
    }
    ring()
    intervalId = setInterval(ring, 1800)
  } catch {
    // Audio unavailable (e.g. autoplay policy) — ringing UI still works silently.
  }
}

export function stopRingtone(): void {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}
