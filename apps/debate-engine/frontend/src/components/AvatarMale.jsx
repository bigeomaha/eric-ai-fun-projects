/**
 * AvatarMale — detailed Memoji-style SVG portrait (male).
 * `accentColor` tints the clothing to match the debater's side color.
 */
export default function AvatarMale({ accentColor = "#3B82F6" }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <radialGradient id="m-bg" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#EEF4FF" />
          <stop offset="100%" stopColor="#C8DEFF" />
        </radialGradient>
        <radialGradient id="m-face" cx="42%" cy="35%">
          <stop offset="0%" stopColor="#F9D4A8" />
          <stop offset="100%" stopColor="#E8A870" />
        </radialGradient>
        <clipPath id="m-clip">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>

      <g clipPath="url(#m-clip)">
        {/* BG */}
        <circle cx="100" cy="100" r="100" fill={`url(#m-bg)`} />

        {/* Suit body */}
        <path d="M10 210 Q10 148 55 130 L100 152 L145 130 Q190 148 190 210 Z" fill={accentColor} />
        {/* Shirt collar */}
        <path d="M100 152 L86 130 L100 137 L114 130 Z" fill="#FFFFFF" />
        {/* Tie */}
        <path d="M96 137 L94 152 L100 156 L106 152 L104 137 L100 140 Z" fill="#F59E0B" />
        {/* Suit lapels */}
        <path d="M55 130 L80 152 L86 130 Z" fill={accentColor} opacity="0.7" />
        <path d="M145 130 L120 152 L114 130 Z" fill={accentColor} opacity="0.7" />

        {/* Neck */}
        <rect x="87" y="120" width="26" height="22" rx="10" fill="#E8A870" />

        {/* Ears */}
        <ellipse cx="54" cy="102" rx="11" ry="14" fill="#E8A870" />
        <ellipse cx="146" cy="102" rx="11" ry="14" fill="#E8A870" />
        <ellipse cx="54" cy="102" rx="6" ry="9" fill="#D4936A" opacity="0.35" />
        <ellipse cx="146" cy="102" rx="6" ry="9" fill="#D4936A" opacity="0.35" />

        {/* Face */}
        <ellipse cx="100" cy="97" rx="46" ry="52" fill="url(#m-face)" />

        {/* Hair — short, styled */}
        <path d="M54 85 Q57 42 100 40 Q143 42 146 85 Q140 55 100 52 Q60 55 54 85 Z" fill="#2A1A0C" />
        <path d="M62 78 Q65 44 100 42 Q135 44 138 78 Q132 52 100 50 Q68 52 62 78 Z" fill="#3D2714" />
        {/* sideburns */}
        <rect x="55" y="86" width="9" height="18" rx="4" fill="#2A1A0C" />
        <rect x="136" y="86" width="9" height="18" rx="4" fill="#2A1A0C" />

        {/* Eyebrows */}
        <path d="M70 83 Q82 77 93 81" stroke="#2A1A0C" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M107 81 Q118 77 130 83" stroke="#2A1A0C" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Eye whites */}
        <ellipse cx="82" cy="97" rx="13" ry="11" fill="white" />
        <ellipse cx="118" cy="97" rx="13" ry="11" fill="white" />
        {/* Iris */}
        <circle cx="82" cy="97" r="8" fill="#3D7EC9" />
        <circle cx="118" cy="97" r="8" fill="#3D7EC9" />
        {/* Pupil */}
        <circle cx="82" cy="97" r="4.5" fill="#111827" />
        <circle cx="118" cy="97" r="4.5" fill="#111827" />
        {/* Highlight */}
        <circle cx="85" cy="94" r="2.5" fill="white" />
        <circle cx="121" cy="94" r="2.5" fill="white" />

        {/* Nose */}
        <ellipse cx="96" cy="114" rx="4" ry="3" fill="#C47C50" opacity="0.28" />
        <ellipse cx="104" cy="114" rx="4" ry="3" fill="#C47C50" opacity="0.28" />
        <path d="M97 108 Q100 114 103 108" stroke="#C47C50" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />

        {/* Smile */}
        <path d="M82 126 Q100 140 118 126" stroke="#B0643C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M85 128 Q100 140 115 128 L115 131 Q100 142 85 131 Z" fill="white" />

        {/* Cheek blush */}
        <circle cx="72" cy="120" r="11" fill="#F4907A" opacity="0.18" />
        <circle cx="128" cy="120" r="11" fill="#F4907A" opacity="0.18" />
      </g>
    </svg>
  );
}
