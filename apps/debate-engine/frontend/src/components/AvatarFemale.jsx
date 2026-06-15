/**
 * AvatarFemale — detailed Memoji-style SVG portrait (female).
 * `accentColor` tints the clothing to match the debater's side color.
 */
export default function AvatarFemale({ accentColor = "#EF4444" }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <radialGradient id="f-bg" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FFF0E8" />
          <stop offset="100%" stopColor="#FFD5C0" />
        </radialGradient>
        <radialGradient id="f-face" cx="42%" cy="35%">
          <stop offset="0%" stopColor="#FAD4B0" />
          <stop offset="100%" stopColor="#E8A882" />
        </radialGradient>
        <clipPath id="f-clip">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>

      <g clipPath="url(#f-clip)">
        {/* BG */}
        <circle cx="100" cy="100" r="100" fill="url(#f-bg)" />

        {/* Blazer / top body */}
        <path d="M10 210 Q10 148 52 132 L100 150 L148 132 Q190 148 190 210 Z" fill={accentColor} opacity="0.9" />
        {/* Inner blouse */}
        <path d="M82 132 L100 142 L118 132 Q110 148 100 150 Q90 148 82 132 Z" fill="#FFF5EE" />
        {/* Blazer lapels */}
        <path d="M52 132 L80 150 L82 132 Z" fill={accentColor} opacity="0.65" />
        <path d="M148 132 L120 150 L118 132 Z" fill={accentColor} opacity="0.65" />

        {/* Long hair — flows behind head and down sides */}
        <path d="M55 88 Q52 38 100 34 Q148 38 145 88 L148 145 Q130 168 100 170 Q70 168 52 145 Z" fill="#2A1A10" />
        {/* Hair sheen */}
        <path d="M62 82 Q62 42 100 38 Q138 42 138 82 Q134 52 100 50 Q66 52 62 82 Z" fill="#3D2418" />
        {/* Hair side volumes */}
        <path d="M52 100 Q48 130 55 155 Q62 162 68 155 Q60 135 62 105 Z" fill="#2A1A10" />
        <path d="M148 100 Q152 130 145 155 Q138 162 132 155 Q140 135 138 105 Z" fill="#2A1A10" />

        {/* Ears */}
        <ellipse cx="56" cy="100" rx="10" ry="13" fill="#E8A882" />
        <ellipse cx="144" cy="100" rx="10" ry="13" fill="#E8A882" />

        {/* Neck */}
        <rect x="88" y="120" width="24" height="22" rx="10" fill="#E8A882" />

        {/* Face */}
        <ellipse cx="100" cy="96" rx="44" ry="50" fill="url(#f-face)" />

        {/* Eyebrows — arched, defined */}
        <path d="M70 81 Q82 74 94 79" stroke="#2A1A10" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M106 79 Q118 74 130 81" stroke="#2A1A10" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Eye whites */}
        <ellipse cx="82" cy="96" rx="13" ry="11" fill="white" />
        <ellipse cx="118" cy="96" rx="13" ry="11" fill="white" />
        {/* Iris — warm brown/green */}
        <circle cx="82" cy="96" r="8" fill="#5D8A6A" />
        <circle cx="118" cy="96" r="8" fill="#5D8A6A" />
        {/* Pupil */}
        <circle cx="82" cy="96" r="4.5" fill="#111827" />
        <circle cx="118" cy="96" r="4.5" fill="#111827" />
        {/* Highlight */}
        <circle cx="85" cy="93" r="2.5" fill="white" />
        <circle cx="121" cy="93" r="2.5" fill="white" />
        {/* Lash line */}
        <path d="M69 90 Q82 85 95 90" stroke="#1A0F08" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M105 90 Q118 85 131 90" stroke="#1A0F08" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <ellipse cx="96" cy="112" rx="3.5" ry="2.5" fill="#C47C5A" opacity="0.25" />
        <ellipse cx="104" cy="112" rx="3.5" ry="2.5" fill="#C47C5A" opacity="0.25" />
        <path d="M98 107 Q100 112 102 107" stroke="#C47C5A" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />

        {/* Lips — fuller */}
        <path d="M84 124 Q92 120 100 122 Q108 120 116 124 Q108 130 100 132 Q92 130 84 124 Z" fill="#E8736A" />
        <path d="M84 124 Q100 128 116 124" stroke="#C45A52" strokeWidth="1.5" fill="none" />
        <path d="M89 122 Q100 120 111 122" fill="#F49490" />

        {/* Cheek blush */}
        <circle cx="70" cy="116" r="12" fill="#F9A0A0" opacity="0.22" />
        <circle cx="130" cy="116" r="12" fill="#F9A0A0" opacity="0.22" />
      </g>
    </svg>
  );
}
