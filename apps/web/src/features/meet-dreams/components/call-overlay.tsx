import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Infinity as InfinityIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { getPerson } from '@/features/calendar/data/calendar.mock'
import { useCall } from '../contexts/call-context'

function formatElapsed(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function CallOverlay() {
  const {
    phase,
    activeCall,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    elapsedSeconds,
    hangUp,
    toggleMute,
    toggleCamera,
  } = useCall()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
  }, [remoteStream])

  const isOpen = !!activeCall && (phase === 'calling' || phase === 'connecting' || phase === 'connected')
  const peer = activeCall ? getPerson(activeCall.peerUserId) : undefined
  const hasRemoteVideo = activeCall?.kind === 'video' && !!remoteStream?.getVideoTracks().some((t) => t.enabled)

  const statusText =
    phase === 'calling' ? 'Calling…' : phase === 'connecting' ? 'Connecting…' : formatElapsed(elapsedSeconds)

  return (
    <AnimatePresence>
      {isOpen && activeCall && (
        <motion.div
          className="fixed inset-0 z-[65] flex flex-col bg-[#0d1a1f]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(74,124,146,0.25) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-white">{peer?.name ?? 'Unknown'}</p>
              <p className="text-xs text-white/50">{statusText}</p>
            </div>
            {phase === 'connected' && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/60">
                <InfinityIcon className="size-3 text-emerald-400" />
                Unlimited · no time limit
              </span>
            )}
          </div>

          {/* Video area */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-6">
            {hasRemoteVideo ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="max-h-full max-w-full rounded-2xl border border-white/10 object-contain shadow-2xl"
              />
            ) : (
              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.span
                  className="flex size-24 items-center justify-center rounded-full text-2xl font-bold text-white shadow-2xl"
                  style={{ background: peer?.avatarColor ?? '#4a7c92' }}
                  animate={phase !== 'connected' ? { scale: [1, 1.05, 1] } : undefined}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  {peer?.initials ?? '?'}
                </motion.span>
                <p className="text-sm text-white/60">
                  {activeCall.kind === 'audio' ? 'Audio call' : phase === 'connected' ? 'Camera off' : statusText}
                </p>
              </motion.div>
            )}

            {/* Local self-preview (real camera) */}
            {activeCall.kind === 'video' && (
              <motion.div
                className="absolute bottom-4 right-4 h-28 w-20 overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-lg sm:h-36 sm:w-28"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isCameraOff ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <VideoOff className="size-5 text-white/40" />
                  </div>
                ) : (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}
                <span className="absolute bottom-1 left-1.5 text-[9px] font-medium text-white/70">You</span>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="relative z-10 flex items-center justify-center gap-3 px-6 py-6">
            <button
              onClick={toggleMute}
              className={cn(
                'flex size-11 items-center justify-center rounded-full transition-colors',
                isMuted ? 'bg-white/15 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10',
              )}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="size-4.5" /> : <Mic className="size-4.5" />}
            </button>
            {activeCall.kind === 'video' && (
              <button
                onClick={toggleCamera}
                className={cn(
                  'flex size-11 items-center justify-center rounded-full transition-colors',
                  isCameraOff ? 'bg-white/15 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10',
                )}
                aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
              >
                {isCameraOff ? <VideoOff className="size-4.5" /> : <Video className="size-4.5" />}
              </button>
            )}
            <button
              onClick={hangUp}
              className="flex h-11 items-center gap-2 rounded-full bg-red-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              <PhoneOff className="size-4" />
              End call
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
