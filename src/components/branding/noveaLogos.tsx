import React from 'react';

export interface NoveaLogoDefinition {
  id: number;
  name: string;
  tagline: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  renderLogo: (props: { className?: string }) => React.ReactElement;
}

// Common typography styling for clean NOVEA vector rendering
const NAVY = '#0F1E36';
const BLUE = '#1D4ED8';
const TEAL = '#0D9488';
const CYAN = '#0284C7';
const GREEN = '#16A34A';
const EMERALD = '#059669';

export const NOVEA_LOGOS: NoveaLogoDefinition[] = [
  // 1. Modern Stethoscope
  {
    id: 1,
    name: 'Modern Stethoscope',
    tagline: 'Modern Stethoscope',
    description: 'Letter O integrated with a sleek medical stethoscope tube and chestpiece.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        {/* Stethoscope O */}
        <circle cx="48" cy="22" r="11" stroke={NAVY} strokeWidth="5.5" fill="none" />
        <path d="M 48 33 C 48 39 40 40 37 36 C 35 33 38 29 41 29" stroke={BLUE} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="42" cy="29" r="2.2" fill={BLUE} />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 2. Medical Cross Circle
  {
    id: 2,
    name: 'Medical Cross Circle',
    tagline: 'Medical Cross Circle',
    description: 'Letter O contains a vibrant teal healthcare medical cross in a circle.',
    primaryColor: NAVY,
    accentColor: TEAL,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={NAVY} strokeWidth="5" fill="none" />
        <circle cx="48" cy="22" r="7.5" fill={TEAL} />
        <path d="M 48 18 V 26 M 44 22 H 52" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 3. Heartbeat Wave
  {
    id: 3,
    name: 'Heartbeat Wave',
    tagline: 'Heartbeat Wave',
    description: 'Cyan ECG rhythm lifeline pulsating across the O and V intersection.',
    primaryColor: NAVY,
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={NAVY} strokeWidth="5" fill="none" />
        {/* ECG pulse through O and into V */}
        <path d="M 42 22 H 45 L 47 14 L 49 29 L 52 18 L 54 22 H 68" stroke={CYAN} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="68" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 4. Stethoscope Curve
  {
    id: 4,
    name: 'Stethoscope Curve',
    tagline: 'Stethoscope Curve',
    description: 'A smooth continuous stethoscope cord sweeping underneath the wordmark.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="30" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
        <path d="M 46 29 C 46 39 88 40 108 34 C 114 32 118 28 116 24" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="116" cy="24" r="2.2" fill={BLUE} />
      </svg>
    ),
  },

  // 5. Care & Growth
  {
    id: 5,
    name: 'Care & Growth',
    tagline: 'Care & Growth',
    description: 'Vibrant green leaves sprouting gracefully above the center of NOVEA.',
    primaryColor: TEAL,
    accentColor: GREEN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="32" fill={TEAL} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NO</text>
        {/* Sprouting leaf above V */}
        <path d="M 78 18 C 76 9 86 5 91 5 C 91 10 88 18 78 18 Z" fill={GREEN} />
        <path d="M 79 17 C 72 13 72 6 78 4 C 82 7 81 14 79 17 Z" fill="#22C55E" />
        <text x="64" y="32" fill={TEAL} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 6. Healthcare Plus
  {
    id: 6,
    name: 'Healthcare Plus',
    tagline: 'Healthcare Plus',
    description: 'Bold clinical blue wordmark with medical plus cross nested in O.',
    primaryColor: BLUE,
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={BLUE} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={BLUE} strokeWidth="5" fill="none" />
        <path d="M 48 16 V 28 M 42 22 H 54" stroke={CYAN} strokeWidth="3.2" strokeLinecap="round" />
        <text x="66" y="31" fill={BLUE} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 7. Global Care
  {
    id: 7,
    name: 'Global Care',
    tagline: 'Global Care',
    description: 'Planetary orbital ellipse encircling NOVEA for worldwide clinical knowledge.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <ellipse cx="64" cy="22" rx="46" ry="14" stroke={CYAN} strokeWidth="2.2" strokeDasharray="3 0" transform="rotate(-12 64 22)" fill="none" />
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
        <circle cx="108" cy="11" r="2.8" fill={BLUE} />
      </svg>
    ),
  },

  // 8. Minimal Professional
  {
    id: 8,
    name: 'Minimal Professional',
    tagline: 'Minimal Professional',
    description: 'Clean high-end geometric sans with minimalist lambda-form apex A.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.12em">NOVE</text>
        {/* Lambda A */}
        <path d="M 125 31 L 137 10 L 149 31" stroke={NAVY} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },

  // 9. Clinical Trust
  {
    id: 9,
    name: 'Clinical Trust',
    tagline: 'Clinical Trust',
    description: 'Rich blue clinical branding with medical cross inside O and lambda A.',
    primaryColor: '#1E3A8A',
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill="#1E3A8A" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke="#1E3A8A" strokeWidth="5.2" fill="none" />
        <path d="M 48 17 V 27 M 43 22 H 53" stroke={CYAN} strokeWidth="2.8" strokeLinecap="round" />
        <text x="66" y="31" fill="#1E3A8A" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VE</text>
        <path d="M 125 31 L 137 10 L 149 31" stroke="#1E3A8A" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },

  // 10. Doctor Network
  {
    id: 10,
    name: 'Doctor Network',
    tagline: 'Doctor Network',
    description: 'Letter O framed as a medical listening loop with telemetry connector.',
    primaryColor: NAVY,
    accentColor: TEAL,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={TEAL} strokeWidth="4.8" fill="none" />
        <path d="M 48 33 C 48 40 68 40 68 33" stroke={TEAL} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 11. Health & Knowledge
  {
    id: 11,
    name: 'Health & Knowledge',
    tagline: 'Health & Knowledge',
    description: 'Gradient blue with stylized human silhouette emerging from O.',
    primaryColor: BLUE,
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={CYAN} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={CYAN} strokeWidth="5" fill="none" />
        <circle cx="78" cy="9" r="3.2" fill={BLUE} />
        <text x="66" y="31" fill={BLUE} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 12. Life Line
  {
    id: 12,
    name: 'Life Line',
    tagline: 'Life Line',
    description: 'ECG heartbeat line extending out from the final letter A.',
    primaryColor: NAVY,
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
        <path d="M 136 24 H 142 L 145 13 L 148 31 L 151 20 L 153 24 H 162" stroke={CYAN} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },

  // 13. Wellness & Science
  {
    id: 13,
    name: 'Wellness & Science',
    tagline: 'Wellness & Science',
    description: 'Natural healthcare leaf motif centered inside the letter O.',
    primaryColor: NAVY,
    accentColor: TEAL,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={NAVY} strokeWidth="5" fill="none" />
        <path d="M 43 25 C 43 17 52 16 53 16 C 53 22 47 26 43 25 Z" fill={TEAL} />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 14. Community Care
  {
    id: 14,
    name: 'Community Care',
    tagline: 'Community Care',
    description: 'Arched network bridge with nodes linking healthcare practitioners.',
    primaryColor: '#1E3A8A',
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M 48 11 C 60 5 88 5 100 11" stroke={CYAN} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="48" cy="11" r="2.5" fill={CYAN} />
        <circle cx="74" cy="6" r="2.5" fill={CYAN} />
        <circle cx="100" cy="11" r="2.5" fill={CYAN} />
        <text x="4" y="32" fill="#1E3A8A" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
      </svg>
    ),
  },

  // 15. People & Progress
  {
    id: 15,
    name: 'People & Progress',
    tagline: 'People & Progress',
    description: 'Active doctor figure with cyan head reaching up from the V vertex.',
    primaryColor: '#0A2540',
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="82" cy="8" r="3.2" fill={CYAN} />
        <text x="4" y="32" fill="#0A2540" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
      </svg>
    ),
  },

  // 16. Medical Innovation
  {
    id: 16,
    name: 'Medical Innovation',
    tagline: 'Medical Innovation',
    description: 'Vibrant emerald green clinical styling with white negative cross.',
    primaryColor: EMERALD,
    accentColor: '#10B981',
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={EMERALD} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <rect x="37" y="11" width="22" height="22" rx="11" fill={EMERALD} />
        <path d="M 48 16 V 28 M 42 22 H 54" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
        <text x="66" y="31" fill={EMERALD} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 17. Healing Journey
  {
    id: 17,
    name: 'Healing Journey',
    tagline: 'Healing Journey',
    description: 'Fluid cyan healing wave flowing beneath the letter A.',
    primaryColor: '#1E3A8A',
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="30" fill="#1E3A8A" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
        <path d="M 106 33 Q 120 37 136 33 T 154 32" stroke={CYAN} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },

  // 18. Doctors Together
  {
    id: 18,
    name: 'Doctors Together',
    tagline: 'Doctors Together',
    description: 'Teal medical cross with a dual stethoscope looping under the letters.',
    primaryColor: NAVY,
    accentColor: TEAL,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={TEAL} strokeWidth="4.5" fill="none" />
        <path d="M 48 17 V 27 M 43 22 H 53" stroke={TEAL} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 48 33 C 48 42 78 40 82 32" stroke={TEAL} strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="82" cy="32" r="2" fill={TEAL} />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 19. Clinical Learning
  {
    id: 19,
    name: 'Clinical Learning',
    tagline: 'Clinical Learning',
    description: 'Heart pulse beat centered directly inside letter O.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={NAVY} strokeWidth="5" fill="none" />
        <path d="M 41 22 H 44 L 46 16 L 49 28 L 51 19 L 53 22 H 55" stroke={BLUE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 20. Knowledge Network
  {
    id: 20,
    name: 'Knowledge Network',
    tagline: 'Knowledge Network',
    description: 'Leaf and cellular split motif inside letter O for clinical knowledge sharing.',
    primaryColor: NAVY,
    accentColor: TEAL,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={NAVY} strokeWidth="4.8" fill="none" />
        <path d="M 44 26 C 44 18 52 17 52 17 C 52 23 48 27 44 26 Z" fill={TEAL} />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 21. Mentor & Learner
  {
    id: 21,
    name: 'Mentor & Learner',
    tagline: 'Mentor & Learner',
    description: 'Dual stethoscope earpieces gracefully rising above letter O.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="32" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        {/* Dual earpieces */}
        <path d="M 43 14 C 43 8 45 4 48 4 C 51 4 53 8 53 14" stroke={BLUE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="43" cy="8" r="1.8" fill={BLUE} />
        <circle cx="53" cy="8" r="1.8" fill={BLUE} />
        <circle cx="48" cy="23" r="10" stroke={NAVY} strokeWidth="5" fill="none" />
        <text x="66" y="32" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 22. Better Healthcare
  {
    id: 22,
    name: 'Better Healthcare',
    tagline: 'Better Healthcare',
    description: 'Vibrant turquoise healthcare cross inside solid dark navy letters.',
    primaryColor: NAVY,
    accentColor: TEAL,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke={NAVY} strokeWidth="5" fill="none" />
        <path d="M 48 16 V 28 M 42 22 H 54" stroke="#06B6D4" strokeWidth="3.2" strokeLinecap="round" />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 23. Connected Doctors
  {
    id: 23,
    name: 'Connected Doctors',
    tagline: 'Connected Doctors',
    description: 'Continuous teal circular loop connecting O and V.',
    primaryColor: NAVY,
    accentColor: TEAL,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="70" cy="22" r="18" stroke={TEAL} strokeWidth="2.8" fill="none" />
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
      </svg>
    ),
  },

  // 24. Excellence in Care
  {
    id: 24,
    name: 'Excellence in Care',
    tagline: 'Excellence in Care',
    description: 'Classic serif medical font with cyan leaf above V.',
    primaryColor: '#1E3A8A',
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M 85 15 C 83 7 92 4 96 4 C 96 9 93 15 85 15 Z" fill={CYAN} />
        <text x="4" y="31" fill="#1E3A8A" fontSize="28" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="0.1em">NOVEA</text>
      </svg>
    ),
  },

  // 25. Medical Professionals
  {
    id: 25,
    name: 'Medical Professionals',
    tagline: 'Medical Professionals',
    description: 'Teal clinical lettering with stethoscope tubing running through base.',
    primaryColor: TEAL,
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="30" fill={TEAL} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
        <path d="M 45 32 C 45 39 88 40 108 34" stroke={CYAN} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="108" cy="34" r="2.2" fill={CYAN} />
      </svg>
    ),
  },

  // 26. Education & Training
  {
    id: 26,
    name: 'Education & Training',
    tagline: 'Education & Training',
    description: 'Academic graduation mortarboard cap perched above letter O.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="32" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        {/* Mortarboard cap */}
        <polygon points="48,4 35,9 48,14 61,9" fill={BLUE} />
        <rect x="42" y="13" width="12" height="3" fill="#1E40AF" />
        <path d="M 60 10 V 17" stroke={BLUE} strokeWidth="1.6" />
        <circle cx="48" cy="24" r="10" stroke={NAVY} strokeWidth="5" fill="none" />
        <text x="66" y="32" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 27. Empower Together
  {
    id: 27,
    name: 'Empower Together',
    tagline: 'Empower Together',
    description: 'Clinician figure with raised arms above V symbolizing collegiate support.',
    primaryColor: NAVY,
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="82" cy="7" r="3" fill={CYAN} />
        <path d="M 75 14 Q 82 10 89 14" stroke={CYAN} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <text x="4" y="32" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
      </svg>
    ),
  },

  // 28. Trust & Collaboration
  {
    id: 28,
    name: 'Trust & Collaboration',
    tagline: 'Trust & Collaboration',
    description: 'Interlocking cyan medical cross rings on the left with VEA.',
    primaryColor: TEAL,
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="30" cy="22" r="13" stroke={TEAL} strokeWidth="4" fill="none" />
        <path d="M 30 16 V 28 M 24 22 H 36" stroke={TEAL} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="46" cy="22" r="13" stroke={CYAN} strokeWidth="4" fill="none" />
        <text x="66" y="32" fill={CYAN} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 29. Next Gen Healthcare
  {
    id: 29,
    name: 'Next Gen Healthcare',
    tagline: 'Next Gen Healthcare',
    description: 'Modern streamlined typography with dynamic blue to cyan gradient.',
    primaryColor: '#1E40AF',
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="grad29" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <text x="4" y="31" fill="url(#grad29)" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.1em">NOVEA</text>
      </svg>
    ),
  },

  // 30. Innovation in Medicine
  {
    id: 30,
    name: 'Innovation in Medicine',
    tagline: 'Innovation in Medicine',
    description: 'Orbiting innovation rings circling around NOVEA.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M 38 12 C 55 5 85 5 102 12" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="38" cy="12" r="2.8" fill={BLUE} />
        <path d="M 102 32 C 85 39 55 39 38 32" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="102" cy="32" r="2.8" fill={BLUE} />
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
      </svg>
    ),
  },

  // 31. Doctor Knowledge
  {
    id: 31,
    name: 'Doctor Knowledge',
    tagline: 'Doctor Knowledge',
    description: 'Sparkle star of excellence with heartbeat pulse inside letter O.',
    primaryColor: NAVY,
    accentColor: CYAN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <path d="M 23 8 L 24 12 L 28 13 L 24 14 L 23 18 L 22 14 L 18 13 L 22 12 Z" fill={CYAN} />
        <circle cx="48" cy="22" r="11" stroke={NAVY} strokeWidth="5" fill="none" />
        <path d="M 42 22 H 45 L 47 16 L 49 28 L 51 20 L 53 22 H 55" stroke={CYAN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 32. Smart Healthcare
  {
    id: 32,
    name: 'Smart Healthcare',
    tagline: 'Smart Healthcare',
    description: 'Glowing turquoise circular ring inside O symbolizing digital connectivity.',
    primaryColor: NAVY,
    accentColor: '#06B6D4',
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">N</text>
        <circle cx="48" cy="22" r="11" stroke="#06B6D4" strokeWidth="4.8" fill="none" />
        <circle cx="48" cy="22" r="5" fill="#06B6D4" opacity="0.25" />
        <text x="66" y="31" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">VEA</text>
      </svg>
    ),
  },

  // 33. Lifelong Learning
  {
    id: 33,
    name: 'Lifelong Learning',
    tagline: 'Lifelong Learning',
    description: 'Forward educational arrows inside deep cobalt blue lettering.',
    primaryColor: '#1E3A8A',
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" fill="#1E3A8A" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
        <path d="M 52 14 L 58 22 L 52 30" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },

  // 34. Modern Minimal
  {
    id: 34,
    name: 'Modern Minimal',
    tagline: 'Modern Minimal',
    description: 'Architectural inline dual-line modern lettering.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="4" y="31" stroke={NAVY} strokeWidth="1.4" fill="none" fontSize="28" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.1em">NOVEA</text>
        <text x="4" y="31" fill={NAVY} fillOpacity="0.15" fontSize="28" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.1em">NOVEA</text>
      </svg>
    ),
  },

  // 35. Care • Learn • Grow
  {
    id: 35,
    name: 'Care • Learn • Grow',
    tagline: 'Care • Learn • Grow',
    description: 'Twin cyan and green leaves blossoming above the central V.',
    primaryColor: NAVY,
    accentColor: GREEN,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M 82 15 C 80 8 88 5 92 5 C 92 9 89 15 82 15 Z" fill={GREEN} />
        <path d="M 83 14 C 77 11 77 5 82 3 C 85 6 85 12 83 14 Z" fill={CYAN} />
        <text x="4" y="32" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
      </svg>
    ),
  },

  // 36. Medical Community
  {
    id: 36,
    name: 'Medical Community',
    tagline: 'Medical Community',
    description: 'Interconnected telemetry network nodes linking O, V, and A.',
    primaryColor: NAVY,
    accentColor: BLUE,
    renderLogo: ({ className = 'h-7 sm:h-8 w-auto' }) => (
      <svg viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M 48 12 Q 74 2 100 12" stroke={BLUE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="48" cy="12" r="2.8" fill={BLUE} />
        <circle cx="74" cy="6" r="2.8" fill={CYAN} />
        <circle cx="100" cy="12" r="2.8" fill={BLUE} />
        <text x="4" y="32" fill={NAVY} fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.08em">NOVEA</text>
      </svg>
    ),
  },
];

export const getLogoById = (id: number): NoveaLogoDefinition => {
  return NOVEA_LOGOS.find((l) => l.id === id) || NOVEA_LOGOS[0];
};
