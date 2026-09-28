import React from 'react';

// ─── Shared SVG props ─────────────────────────────────────────────────────────

interface SVGIllustrationProps {
  animated?: boolean;
  className?: string;
}

// ─── Neck Rotation Illustration ───────────────────────────────────────────────

export function NeckRotationSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {/* Body */}
      <rect x="40" y="80" width="40" height="45" rx="8" fill="currentColor" opacity="0.15" />
      {/* Neck */}
      <rect x="52" y="62" width="16" height="20" rx="4" fill="currentColor" opacity="0.25" />
      {/* Head */}
      <ellipse
        cx="60" cy="48" rx="20" ry="22"
        fill="currentColor" opacity="0.2"
        style={
          animated
            ? { animation: 'neckRotate 3s ease-in-out infinite' }
            : undefined
        }
        className={animated ? 'neck-rotate-head' : ''}
      />
      {/* Eyes */}
      <circle cx="53" cy="46" r="2.5" fill="currentColor" opacity="0.5"
        style={animated ? { animation: 'neckRotate 3s ease-in-out infinite' } : undefined}
      />
      <circle cx="67" cy="46" r="2.5" fill="currentColor" opacity="0.5"
        style={animated ? { animation: 'neckRotate 3s ease-in-out infinite' } : undefined}
      />
      {/* Rotation arrows */}
      <path
        d="M 30 48 Q 20 30 40 20"
        stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"
        strokeDasharray="4 2"
        strokeLinecap="round"
      />
      <path
        d="M 90 48 Q 100 30 80 20"
        stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"
        strokeDasharray="4 2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Neck Side Stretch Illustration ──────────────────────────────────────────

export function NeckSideStretchSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <rect x="40" y="80" width="40" height="45" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="52" y="62" width="16" height="20" rx="4" fill="currentColor" opacity="0.25" />
      <ellipse
        cx="60" cy="44" rx="20" ry="22"
        fill="currentColor" opacity="0.2"
        style={animated ? { animation: 'sideStretch 3s ease-in-out infinite' } : undefined}
        className={animated ? 'side-stretch-head' : ''}
      />
      {/* Hand on head */}
      <ellipse cx="38" cy="42" rx="7" ry="5" fill="currentColor" opacity="0.25"
        style={animated ? { animation: 'sideStretch 3s ease-in-out infinite' } : undefined}
      />
      <path d="M 47 85 Q 30 65 38 42" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" />
      {/* Arrow indicating tilt direction */}
      <path d="M 72 28 Q 85 22 85 38" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="4 2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Chin Tuck Illustration ───────────────────────────────────────────────────

export function ChinTuckSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <rect x="40" y="80" width="40" height="45" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="52" y="62" width="16" height="20" rx="4" fill="currentColor" opacity="0.25" />
      <ellipse
        cx="60" cy="46" rx="20" ry="22"
        fill="currentColor" opacity="0.2"
        style={animated ? { animation: 'chinTuck 3s ease-in-out infinite' } : undefined}
      />
      <circle cx="53" cy="44" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="67" cy="44" r="2.5" fill="currentColor" opacity="0.5" />
      {/* Arrow showing chin movement back */}
      <path d="M 78 60 Q 90 58 88 52" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" markerEnd="url(#arrowhead)" />
    </svg>
  );
}

// ─── Wrist Flexor Illustration ────────────────────────────────────────────────

export function WristFlexorSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {/* Arm */}
      <rect x="20" y="55" width="70" height="14" rx="7" fill="currentColor" opacity="0.2" />
      {/* Hand bending up */}
      <g style={animated ? { animation: 'wristBend 2.5s ease-in-out infinite', transformOrigin: '90px 62px' } : undefined}>
        <rect x="88" y="42" width="14" height="35" rx="7" fill="currentColor" opacity="0.3" />
        {/* Fingers */}
        <rect x="86" y="38" width="4" height="12" rx="2" fill="currentColor" opacity="0.35" />
        <rect x="92" y="36" width="4" height="14" rx="2" fill="currentColor" opacity="0.35" />
        <rect x="98" y="38" width="4" height="12" rx="2" fill="currentColor" opacity="0.35" />
      </g>
      {/* Direction arrow */}
      <path d="M 100 45 Q 110 35 105 25" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="3 2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Wrist Extensor Illustration ──────────────────────────────────────────────

export function WristExtensorSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <rect x="20" y="55" width="70" height="14" rx="7" fill="currentColor" opacity="0.2" />
      <g style={animated ? { animation: 'wristBendDown 2.5s ease-in-out infinite', transformOrigin: '90px 62px' } : undefined}>
        <rect x="88" y="55" width="14" height="35" rx="7" fill="currentColor" opacity="0.3" />
        <rect x="86" y="75" width="4" height="12" rx="2" fill="currentColor" opacity="0.35" />
        <rect x="92" y="78" width="4" height="14" rx="2" fill="currentColor" opacity="0.35" />
        <rect x="98" y="75" width="4" height="12" rx="2" fill="currentColor" opacity="0.35" />
      </g>
      <path d="M 100 85 Q 110 95 105 105" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="3 2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Finger Stretch Illustration ──────────────────────────────────────────────

export function FingerStretchSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {/* Palm */}
      <rect x="42" y="68" width="36" height="30" rx="8" fill="currentColor" opacity="0.2" />
      {/* Thumb */}
      <rect x="30" y="72" width="14" height="10" rx="5" fill="currentColor" opacity="0.25" />
      {/* Fingers spread */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={44 + i * 9}
          y={42}
          width="7"
          height="28"
          rx="3.5"
          fill="currentColor"
          opacity="0.3"
          style={
            animated
              ? {
                  animation: `fingerSpread${i} 2s ease-in-out infinite`,
                  transformOrigin: `${47 + i * 9}px 68px`,
                }
              : undefined
          }
        />
      ))}
    </svg>
  );
}

// ─── Wrist Circles Illustration ───────────────────────────────────────────────

export function WristCirclesSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <rect x="25" y="55" width="30" height="12" rx="6" fill="currentColor" opacity="0.2" />
      <rect x="65" y="55" width="30" height="12" rx="6" fill="currentColor" opacity="0.2" />
      {/* Left fist */}
      <ellipse
        cx="40" cy="72" rx="10" ry="8"
        fill="currentColor" opacity="0.25"
        style={animated ? { animation: 'circleLeft 2s linear infinite', transformOrigin: '40px 62px' } : undefined}
      />
      {/* Right fist */}
      <ellipse
        cx="80" cy="72" rx="10" ry="8"
        fill="currentColor" opacity="0.25"
        style={animated ? { animation: 'circleRight 2s linear infinite reverse', transformOrigin: '80px 62px' } : undefined}
      />
      {/* Circle paths */}
      <circle cx="40" cy="62" r="14" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" strokeDasharray="4 2" />
      <circle cx="80" cy="62" r="14" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" strokeDasharray="4 2" />
    </svg>
  );
}

// ─── Shoulder Rolls Illustration ──────────────────────────────────────────────

export function ShoulderRollsSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <rect x="40" y="80" width="40" height="40" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="52" y="62" width="16" height="20" rx="4" fill="currentColor" opacity="0.25" />
      <ellipse cx="60" cy="48" rx="18" ry="20" fill="currentColor" opacity="0.2" />
      {/* Left shoulder */}
      <ellipse
        cx="30" cy="82" rx="14" ry="8"
        fill="currentColor" opacity="0.2"
        style={animated ? { animation: 'shoulderRollLeft 2s ease-in-out infinite', transformOrigin: '40px 82px' } : undefined}
      />
      {/* Right shoulder */}
      <ellipse
        cx="90" cy="82" rx="14" ry="8"
        fill="currentColor" opacity="0.2"
        style={animated ? { animation: 'shoulderRollRight 2s ease-in-out infinite', transformOrigin: '80px 82px' } : undefined}
      />
      {/* Roll path circles */}
      <circle cx="30" cy="82" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.15" strokeDasharray="4 3" />
      <circle cx="90" cy="82" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.15" strokeDasharray="4 3" />
    </svg>
  );
}

// ─── Shoulder Squeeze Illustration ───────────────────────────────────────────

export function ShoulderSqueezeSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <rect x="40" y="80" width="40" height="40" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="52" y="62" width="16" height="20" rx="4" fill="currentColor" opacity="0.25" />
      <ellipse cx="60" cy="48" rx="18" ry="20" fill="currentColor" opacity="0.2" />
      {/* Left shoulder moving inward */}
      <ellipse
        cx="32" cy="82" rx="14" ry="9"
        fill="currentColor" opacity="0.2"
        style={animated ? { animation: 'squeezeShoulder 2.5s ease-in-out infinite', transformOrigin: '60px 82px' } : undefined}
      />
      {/* Right shoulder */}
      <ellipse
        cx="88" cy="82" rx="14" ry="9"
        fill="currentColor" opacity="0.2"
        style={animated ? { animation: 'squeezeShoulder 2.5s ease-in-out infinite reverse', transformOrigin: '60px 82px' } : undefined}
      />
      {/* Arrows showing inward squeeze */}
      <path d="M 50 88 L 38 88" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" markerEnd="url(#arrowhead)" />
      <path d="M 70 88 L 82 88" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

// ─── Spinal Twist Illustration ────────────────────────────────────────────────

export function SpinalTwistSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {/* Chair */}
      <rect x="35" y="95" width="50" height="8" rx="4" fill="currentColor" opacity="0.15" />
      <rect x="38" y="103" width="8" height="22" rx="3" fill="currentColor" opacity="0.12" />
      <rect x="74" y="103" width="8" height="22" rx="3" fill="currentColor" opacity="0.12" />
      {/* Body */}
      <rect
        x="42" y="72" width="36" height="25" rx="6"
        fill="currentColor" opacity="0.15"
        style={animated ? { animation: 'spinalTwist 4s ease-in-out infinite', transformOrigin: '60px 84px' } : undefined}
      />
      {/* Neck */}
      <rect x="53" y="58" width="14" height="16" rx="4" fill="currentColor" opacity="0.2"
        style={animated ? { animation: 'spinalTwist 4s ease-in-out infinite', transformOrigin: '60px 84px' } : undefined}
      />
      {/* Head */}
      <ellipse cx="60" cy="44" rx="17" ry="18" fill="currentColor" opacity="0.2"
        style={animated ? { animation: 'spinalTwist 4s ease-in-out infinite', transformOrigin: '60px 84px' } : undefined}
      />
      {/* Hand on knee */}
      <ellipse cx="38" cy="93" rx="8" ry="5" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

// ─── Side Stretch Illustration ────────────────────────────────────────────────

export function SideStretchSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <rect x="40" y="90" width="40" height="35" rx="8" fill="currentColor" opacity="0.15" />
      {/* Body leaning */}
      <g style={animated ? { animation: 'sideBodyStretch 3s ease-in-out infinite', transformOrigin: '60px 90px' } : undefined}>
        <rect x="44" y="68" width="32" height="24" rx="6" fill="currentColor" opacity="0.15" />
        <rect x="52" y="54" width="16" height="16" rx="4" fill="currentColor" opacity="0.25" />
        <ellipse cx="60" cy="42" rx="16" ry="17" fill="currentColor" opacity="0.2" />
        {/* Raised arm */}
        <path d="M 60 58 Q 80 50 88 32" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.2" strokeLinecap="round" />
        <ellipse cx="90" cy="28" rx="6" ry="5" fill="currentColor" opacity="0.2" />
      </g>
    </svg>
  );
}

// ─── Lower Back Stretch Illustration ─────────────────────────────────────────

export function LowerBackSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {/* Chair seat */}
      <rect x="30" y="88" width="60" height="8" rx="4" fill="currentColor" opacity="0.15" />
      {/* Body */}
      <rect x="42" y="65" width="36" height="25" rx="6" fill="currentColor" opacity="0.15" />
      <rect x="53" y="52" width="14" height="15" rx="4" fill="currentColor" opacity="0.25" />
      <ellipse cx="60" cy="40" rx="17" ry="18" fill="currentColor" opacity="0.2" />
      {/* Raised knee */}
      <g style={animated ? { animation: 'kneeRaise 3s ease-in-out infinite', transformOrigin: '55px 88px' } : undefined}>
        <rect x="42" y="78" width="24" height="12" rx="6" fill="currentColor" opacity="0.2" />
        <ellipse cx="55" cy="76" rx="10" ry="8" fill="currentColor" opacity="0.25" />
        {/* Arms hugging */}
        <path d="M 45 68 Q 40 76 42 84" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.2" strokeLinecap="round" />
        <path d="M 62 68 Q 68 76 65 84" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ─── Ankle Circles Illustration ───────────────────────────────────────────────

export function AnkleCirclesSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {/* Seated legs */}
      <rect x="30" y="55" width="25" height="40" rx="6" fill="currentColor" opacity="0.15" />
      <rect x="65" y="55" width="25" height="40" rx="6" fill="currentColor" opacity="0.15" />
      {/* Left ankle/foot */}
      <g style={animated ? { animation: 'ankleCircle 2s linear infinite', transformOrigin: '42px 95px' } : undefined}>
        <ellipse cx="42" cy="100" rx="10" ry="6" fill="currentColor" opacity="0.25" />
      </g>
      {/* Right ankle/foot */}
      <g style={animated ? { animation: 'ankleCircle 2s linear infinite reverse', transformOrigin: '78px 95px' } : undefined}>
        <ellipse cx="78" cy="100" rx="10" ry="6" fill="currentColor" opacity="0.25" />
      </g>
      <circle cx="42" cy="95" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" strokeDasharray="4 2" />
      <circle cx="78" cy="95" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" strokeDasharray="4 2" />
    </svg>
  );
}

// ─── Leg Extension Illustration ───────────────────────────────────────────────

export function LegExtensionSVG({ animated = true, className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {/* Body */}
      <rect x="30" y="55" width="50" height="35" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="42" y="40" width="16" height="18" rx="4" fill="currentColor" opacity="0.25" />
      <ellipse cx="50" cy="30" rx="16" ry="17" fill="currentColor" opacity="0.2" />
      {/* Seated leg bent */}
      <rect x="30" y="88" width="22" height="12" rx="6" fill="currentColor" opacity="0.15" />
      {/* Extending leg */}
      <g style={animated ? { animation: 'legExtend 3s ease-in-out infinite', transformOrigin: '44px 88px' } : undefined}>
        <rect x="44" y="85" width="55" height="12" rx="6" fill="currentColor" opacity="0.2" />
        <ellipse cx="102" cy="91" rx="8" ry="6" fill="currentColor" opacity="0.25" />
      </g>
    </svg>
  );
}

// ─── Generic Exercise SVG (fallback) ──────────────────────────────────────────

export function GenericExerciseSVG({ className = '' }: SVGIllustrationProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <ellipse cx="60" cy="35" rx="18" ry="20" fill="currentColor" opacity="0.2" />
      <rect x="44" y="52" width="32" height="40" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="52" y="90" width="12" height="35" rx="6" fill="currentColor" opacity="0.15" />
      <rect x="64" y="90" width="12" height="35" rx="6" fill="currentColor" opacity="0.15" />
      <path d="M 44 68 L 20 85" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.2" strokeLinecap="round" />
      <path d="M 76 68 L 100 85" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

// ─── SVG Map ──────────────────────────────────────────────────────────────────

type SVGComponent = React.FC<SVGIllustrationProps>;

export const SVG_MAP: Record<string, SVGComponent> = {
  'neck-rotation': NeckRotationSVG,
  'neck-side-stretch': NeckSideStretchSVG,
  'chin-tuck': ChinTuckSVG,
  'wrist-flexor': WristFlexorSVG,
  'wrist-extensor': WristExtensorSVG,
  'finger-stretch': FingerStretchSVG,
  'wrist-circles': WristCirclesSVG,
  'shoulder-rolls': ShoulderRollsSVG,
  'shoulder-squeeze': ShoulderSqueezeSVG,
  'spinal-twist': SpinalTwistSVG,
  'side-stretch': SideStretchSVG,
  'lower-back': LowerBackSVG,
  'ankle-circles': AnkleCirclesSVG,
  'leg-extension': LegExtensionSVG,
};

export function getExerciseSVG(svgKey: string): SVGComponent {
  return SVG_MAP[svgKey] ?? GenericExerciseSVG;
}
