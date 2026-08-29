import { IncomingCallBanner } from './incoming-call-banner'
import { CallOverlay } from './call-overlay'

/** Mounted once, app-wide, so calls can ring/connect from any page — not just
 * while the user has Meet Dreams open, exactly like a real calling app. */
export function MeetCallHost() {
  return (
    <>
      <IncomingCallBanner />
      <CallOverlay />
    </>
  )
}
