import React, { useState } from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  src?: string | null;
  name?: string;
  id?: string;
  size?: AvatarSize;
  className?: string;
  verificationStatus?: string;
  showBadge?: boolean;
  alt?: string;
  onClick?: () => void;
}

const SIZE_MAP: Record<AvatarSize, { container: string; text: string; badge: string; icon: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[9px]', badge: 'w-2 h-2 -bottom-0.5 -right-0.5', icon: 'w-1.5 h-1.5' },
  sm: { container: 'w-8 h-8', text: 'text-xs', badge: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5', icon: 'w-1.5 h-1.5' },
  md: { container: 'w-10 h-10', text: 'text-xs sm:text-sm', badge: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5', icon: 'w-2 h-2' },
  lg: { container: 'w-12 h-12', text: 'text-sm font-bold', badge: 'w-4 h-4 -bottom-1 -right-1', icon: 'w-2.5 h-2.5' },
  xl: { container: 'w-16 h-16', text: 'text-base font-bold', badge: 'w-5 h-5 -bottom-1 -right-1', icon: 'w-3 h-3' },
  '2xl': { container: 'w-20 h-20 sm:w-24 sm:h-24', text: 'text-xl sm:text-2xl font-black', badge: 'w-6 h-6 -bottom-1 -right-1', icon: 'w-3.5 h-3.5' },
};

// Deterministic medical color palette based on name or ID hash
const PALETTES = [
  { from: 'from-[#1D4ED8]', to: 'to-[#0284C7]' }, // Royal Blue to Sky
  { from: 'from-[#0D9488]', to: 'to-[#059669]' }, // Teal to Emerald
  { from: 'from-[#2563EB]', to: 'to-[#4F46E5]' }, // Blue to Indigo
  { from: 'from-[#0369A1]', to: 'to-[#0D9488]' }, // Ocean to Teal
  { from: 'from-[#4338CA]', to: 'to-[#1D4ED8]' }, // Indigo to Royal
  { from: 'from-[#0F766E]', to: 'to-[#0284C7]' }, // Deep Teal to Cyan
];

export const getDeterministicInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'MD';
  // Strip clinical honorifics like Dr., Prof., Dr, etc.
  const cleaned = name.replace(/^(Dr\.|Prof\.|Doctor|Dr)\s+/i, '').trim();
  if (!cleaned) return 'MD';

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  // Handle formats like "K. Senthil Kumar" -> "KS", "Martin Lourduraj" -> "ML", "Priya Sharma" -> "PS"
  const first = parts[0].replace(/[^a-zA-Z]/g, '') || parts[0];
  const last = parts[parts.length - 1].replace(/[^a-zA-Z]/g, '') || parts[parts.length - 1];

  const firstChar = first.charAt(0).toUpperCase();
  const lastChar = last.charAt(0).toUpperCase();

  return `${firstChar}${lastChar}`;
};

const getDeterministicPalette = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
};

export const Avatar: React.FC<Props> = ({
  src,
  name = 'Doctor',
  id,
  size = 'md',
  className = '',
  verificationStatus,
  showBadge = false,
  alt,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeConfig = SIZE_MAP[size];
  const initials = getDeterministicInitials(name);
  const key = id || name || 'default';
  const palette = getDeterministicPalette(key);
  const hasValidImage = Boolean(src && src.trim() && !imageError);

  const isVerified = verificationStatus === 'VERIFIED';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full select-none ${sizeConfig.container} ${className}`}
    >
      {hasValidImage ? (
        <img
          src={src!}
          alt={alt || name}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover border border-[#E2E8F0] shadow-2xs"
          loading="lazy"
        />
      ) : (
        <div
          title={name}
          className={`w-full h-full rounded-full bg-gradient-to-tr ${palette.from} ${palette.to} text-white font-extrabold flex items-center justify-center border border-white/60 shadow-2xs tracking-wider ${sizeConfig.text}`}
        >
          {initials}
        </div>
      )}

      {/* Verified Medical Professional Badge */}
      {(showBadge || isVerified) && isVerified && (
        <span
          title="Verified Healthcare Practitioner"
          className={`absolute rounded-full bg-[#16A34A] ring-2 ring-white text-white flex items-center justify-center shadow-2xs ${sizeConfig.badge}`}
        >
          <Check className={`${sizeConfig.icon} stroke-[3]`} />
        </span>
      )}
    </div>
  );
};
