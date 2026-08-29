import { cn } from '@/shared/lib/utils'

/**
 * Premium 3D-style hero statue — CSS transforms only (no canvas).
 * Slow float (translateY ±12px / 6s) + subtle rotateY sway (±6°),
 * blue-purple radial glow beneath and a blurred ground shadow
 * under the pedestal. Height is controlled by the `className`
 * passed by the caller (e.g. h-[360px] on desktop, h-[220px] mobile).
 */
export function HeroStatue({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'hero-statue pointer-events-none flex select-none items-center justify-center',
        className,
      )}
      aria-hidden="true"
    >
      <div className="relative h-full">
        {/* Soft blue-purple radial glow beneath the statue */}
        <div className="hero-statue-glow absolute left-1/2 top-[58%] h-[75%] w-[120%] max-w-[92vw] -translate-x-1/2 -translate-y-1/2" />

        {/* Floating + swaying statue */}
        <div className="hero-statue-float relative h-full">
          <div className="hero-statue-sway h-full">
            <img
              src="/dreamweavers-logo.png"
              alt=""
              className="hero-statue-img h-full w-auto"
              draggable={false}
            />
          </div>
        </div>

        {/* Blurred ground shadow under the pedestal (translateX handled by keyframes) */}
        <div className="hero-statue-shadow absolute -bottom-[4%] left-1/2 h-[7%] w-[72%]" />
      </div>
    </div>
  )
}
