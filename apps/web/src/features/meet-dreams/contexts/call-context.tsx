import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks/use-auth'
import { signalingClient, type SignalingMessage } from '../lib/signaling-client'
import { playRingtone, stopRingtone } from '../lib/ringtone'

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

/** No answer within this window → treat as missed, matching real calling apps
 * (and explicitly NOT a Zoom/Meet-style meeting-length cap — once connected,
 * calls run until someone hangs up). */
const RING_TIMEOUT_MS = 30_000

export type CallKind = 'video' | 'audio'
export type CallPhase = 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected'

export interface CallInfo {
  callId: string
  conversationId: string
  peerUserId: string
  kind: CallKind
}

interface CallContextValue {
  phase: CallPhase
  activeCall: CallInfo | null
  incomingCall: CallInfo | null
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  isMuted: boolean
  isCameraOff: boolean
  elapsedSeconds: number
  onlineUserIds: Set<string>
  startCall: (conversationId: string, peerUserId: string, kind?: CallKind) => Promise<void>
  acceptCall: () => Promise<void>
  declineCall: () => void
  hangUp: () => void
  toggleMute: () => void
  toggleCamera: () => void
}

const CallContext = createContext<CallContextValue | null>(null)

export function useCall(): CallContextValue {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used within CallProvider')
  return ctx
}

function newCallId(): string {
  return `call_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function CallProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [phase, setPhase] = useState<CallPhase>('idle')
  const [activeCall, setActiveCall] = useState<CallInfo | null>(null)
  const [incomingCall, setIncomingCall] = useState<CallInfo | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set())

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([])
  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const roleRef = useRef<'caller' | 'callee' | null>(null)
  const phaseRef = useRef<CallPhase>('idle')
  const activeCallRef = useRef<CallInfo | null>(null)
  const incomingCallRef = useRef<CallInfo | null>(null)

  phaseRef.current = phase
  activeCallRef.current = activeCall
  incomingCallRef.current = incomingCall

  // ── Connect to signaling server whenever authenticated ──────────────────
  useEffect(() => {
    if (!user) return
    signalingClient.connect(user.id)
    return () => signalingClient.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const clearTimers = useCallback(() => {
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current)
      ringTimeoutRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const cleanup = useCallback(() => {
    stopRingtone()
    clearTimers()
    pcRef.current?.getSenders().forEach((s) => s.track?.stop())
    pcRef.current?.close()
    pcRef.current = null
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    pendingCandidatesRef.current = []
    roleRef.current = null
    setLocalStream(null)
    setRemoteStream(null)
    setActiveCall(null)
    setIncomingCall(null)
    setIsMuted(false)
    setIsCameraOff(false)
    setElapsedSeconds(0)
    setPhase('idle')
  }, [clearTimers])

  const startTimer = useCallback(() => {
    if (timerRef.current) return
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
  }, [])

  const createPeerConnection = useCallback((peerUserId: string, callId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        signalingClient.send({
          type: 'webrtc:ice-candidate',
          toUserId: peerUserId,
          callId,
          candidate: e.candidate.toJSON(),
        })
      }
    }

    pc.ontrack = (e) => {
      setRemoteStream(e.streams[0] ?? null)
    }

    pcRef.current = pc
    return pc
  }, [])

  // ── Outgoing call ─────────────────────────────────────────────────────────
  const startCall = useCallback(
    async (conversationId: string, peerUserId: string, kind: CallKind = 'video') => {
      if (!user || phaseRef.current !== 'idle') return
      const callId = newCallId()
      roleRef.current = 'caller'

      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: kind === 'video', audio: true })
      } catch {
        toast.error('Could not access your camera/microphone.')
        roleRef.current = null
        return
      }
      localStreamRef.current = stream
      setLocalStream(stream)

      const call: CallInfo = { callId, conversationId, peerUserId, kind }
      setActiveCall(call)
      setPhase('calling')

      signalingClient.send({ type: 'call:invite', toUserId: peerUserId, conversationId, callId, kind })

      ringTimeoutRef.current = setTimeout(() => {
        toast.info('No answer.')
        signalingClient.send({ type: 'call:cancel', toUserId: peerUserId, callId })
        cleanup()
      }, RING_TIMEOUT_MS)
    },
    [user, cleanup],
  )

  // ── Incoming call handling ───────────────────────────────────────────────
  const declineCallWith = useCallback((call: CallInfo) => {
    signalingClient.send({ type: 'call:decline', toUserId: call.peerUserId, callId: call.callId })
    stopRingtone()
    clearTimers()
    setIncomingCall(null)
    setPhase('idle')
  }, [clearTimers])

  const acceptCall = useCallback(async () => {
    const call = incomingCallRef.current
    if (!call || !user) return
    stopRingtone()
    clearTimers()
    roleRef.current = 'callee'

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: call.kind === 'video', audio: true })
    } catch {
      toast.error('Could not access your camera/microphone.')
      declineCallWith(call)
      return
    }
    localStreamRef.current = stream
    setLocalStream(stream)

    const pc = createPeerConnection(call.peerUserId, call.callId)
    stream.getTracks().forEach((t) => pc.addTrack(t, stream))

    setActiveCall(call)
    setIncomingCall(null)
    setPhase('connecting')

    signalingClient.send({ type: 'call:accept', toUserId: call.peerUserId, callId: call.callId })
  }, [user, clearTimers, createPeerConnection, declineCallWith])

  const declineCall = useCallback(() => {
    const call = incomingCallRef.current
    if (call) declineCallWith(call)
  }, [declineCallWith])

  const hangUp = useCallback(() => {
    const call = activeCallRef.current
    if (call) {
      signalingClient.send({ type: 'call:hangup', toUserId: call.peerUserId, callId: call.callId })
    }
    cleanup()
  }, [cleanup])

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current
    if (!stream) return
    setIsMuted((prev) => {
      const next = !prev
      stream.getAudioTracks().forEach((t) => (t.enabled = !next))
      return next
    })
  }, [])

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current
    if (!stream) return
    setIsCameraOff((prev) => {
      const next = !prev
      stream.getVideoTracks().forEach((t) => (t.enabled = !next))
      return next
    })
  }, [])

  // ── Signaling message handling ───────────────────────────────────────────
  useEffect(() => {
    const handle = (msg: SignalingMessage) => {
      switch (msg.type) {
        case 'presence:list': {
          const ids = Array.isArray(msg.onlineUserIds) ? (msg.onlineUserIds as string[]) : []
          setOnlineUserIds(new Set(ids))
          break
        }

        case 'call:invite': {
          const fromUserId = msg.fromUserId as string
          const callId = msg.callId as string
          if (phaseRef.current !== 'idle') {
            signalingClient.send({ type: 'call:decline', toUserId: fromUserId, callId })
            return
          }
          const call: CallInfo = {
            callId,
            conversationId: msg.conversationId as string,
            peerUserId: fromUserId,
            kind: (msg.kind as CallKind) ?? 'video',
          }
          setIncomingCall(call)
          setPhase('ringing')
          playRingtone()
          ringTimeoutRef.current = setTimeout(() => declineCallWith(call), RING_TIMEOUT_MS)
          break
        }

        case 'call:accept': {
          const call = activeCallRef.current
          if (!call || call.callId !== msg.callId || roleRef.current !== 'caller') return
          clearTimers()
          void (async () => {
            const pc = createPeerConnection(call.peerUserId, call.callId)
            localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!))
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            signalingClient.send({ type: 'webrtc:offer', toUserId: call.peerUserId, callId: call.callId, sdp: offer })
            setPhase('connecting')
          })()
          break
        }

        case 'call:decline': {
          if (activeCallRef.current?.callId === msg.callId) {
            toast.info('Call declined.')
            cleanup()
          }
          break
        }

        case 'call:cancel': {
          if (incomingCallRef.current?.callId === msg.callId) {
            stopRingtone()
            clearTimers()
            setIncomingCall(null)
            setPhase('idle')
          }
          break
        }

        case 'call:unavailable': {
          if (activeCallRef.current?.callId === msg.callId) {
            toast.error('They are not reachable right now.')
            cleanup()
          }
          break
        }

        case 'call:hangup': {
          if (activeCallRef.current?.callId === msg.callId) {
            toast.info('Call ended.')
            cleanup()
          }
          break
        }

        case 'webrtc:offer': {
          const call = activeCallRef.current
          if (!call || call.callId !== msg.callId) return
          void (async () => {
            const pc = pcRef.current
            if (!pc) return
            await pc.setRemoteDescription(msg.sdp as RTCSessionDescriptionInit)
            for (const candidate of pendingCandidatesRef.current) await pc.addIceCandidate(candidate)
            pendingCandidatesRef.current = []
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            signalingClient.send({ type: 'webrtc:answer', toUserId: call.peerUserId, callId: call.callId, sdp: answer })
          })()
          break
        }

        case 'webrtc:answer': {
          const call = activeCallRef.current
          if (!call || call.callId !== msg.callId) return
          void (async () => {
            const pc = pcRef.current
            if (!pc) return
            await pc.setRemoteDescription(msg.sdp as RTCSessionDescriptionInit)
            for (const candidate of pendingCandidatesRef.current) await pc.addIceCandidate(candidate)
            pendingCandidatesRef.current = []
            setPhase('connected')
            startTimer()
          })()
          break
        }

        case 'webrtc:ice-candidate': {
          const call = activeCallRef.current
          if (!call || call.callId !== msg.callId) return
          const pc = pcRef.current
          const candidate = msg.candidate as RTCIceCandidateInit
          if (pc?.remoteDescription) {
            void pc.addIceCandidate(candidate).catch(() => {})
          } else {
            pendingCandidatesRef.current.push(candidate)
          }
          break
        }
      }
    }

    return signalingClient.subscribe(handle)
  }, [clearTimers, cleanup, createPeerConnection, declineCallWith, startTimer])

  const value = useMemo<CallContextValue>(
    () => ({
      phase,
      activeCall,
      incomingCall,
      localStream,
      remoteStream,
      isMuted,
      isCameraOff,
      elapsedSeconds,
      onlineUserIds,
      startCall,
      acceptCall,
      declineCall,
      hangUp,
      toggleMute,
      toggleCamera,
    }),
    [
      phase,
      activeCall,
      incomingCall,
      localStream,
      remoteStream,
      isMuted,
      isCameraOff,
      elapsedSeconds,
      onlineUserIds,
      startCall,
      acceptCall,
      declineCall,
      hangUp,
      toggleMute,
      toggleCamera,
    ],
  )

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}
