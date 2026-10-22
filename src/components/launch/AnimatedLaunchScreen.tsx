import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  Building2,
  Stethoscope,
  ChevronRight,
  RefreshCw,
  Award,
  Globe,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DoctorProfile } from '../../types';
import { useNoveaLogo } from '../branding/useNoveaLogo';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  currentDoctor: DoctorProfile | null;
  onEnterApp: () => void;
  onOpenAuth: (initialMode?: 'signin' | 'register') => void;
  onContinueAsGuest?: () => void;
}

export const AnimatedLaunchScreen: React.FC<Props> = ({
  currentDoctor,
  onEnterApp,
  onOpenAuth,
  onContinueAsGuest,
}) => {
  const { activeLogo } = useNoveaLogo();

  // Animation sequence states: 0: Init, 1: Logo Fade, 2: Letters Reveal, 3: Medical Arc, 4: Teal Highlight, 5: Ready
  const [animStep, setAnimStep] = useState<number>(0);
  const [isFinishedIntro, setIsFinishedIntro] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReduced);

    if (prefersReduced) {
      setAnimStep(5);
      setIsFinishedIntro(true);
      return;
    }

    // Sequence timing
    const t1 = setTimeout(() => setAnimStep(1), 250);
    const t2 = setTimeout(() => setAnimStep(2), 650);
    const t3 = setTimeout(() => setAnimStep(3), 1150);
    const t4 = setTimeout(() => setAnimStep(4), 1650);
    const t5 = setTimeout(() => {
      setAnimStep(5);
      setIsFinishedIntro(true);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const letters = ['N', 'O', 'V', 'E', 'A'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between text-white overflow-hidden select-none px-4 py-8 sm:py-12">
      {/* Background AI Medical Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-45 z-0"
        src="./assets/videos/launch-bg.mp4"
      />
      {/* Dark Gradient Overlay for Maximum Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E1E38]/85 via-[#081122]/90 to-[#040812]/95 z-0 pointer-events-none" />

      {/* Subtle Background Glow Effect */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-linear-to-tr from-[#1D4ED8]/20 via-[#0D9488]/20 to-transparent blur-3xl pointer-events-none transition-opacity duration-1000 z-10 ${
          animStep >= 4 ? 'opacity-100 scale-110' : 'opacity-30 scale-90'
        }`}
      />

      {/* Top Branding Pill */}
      <div
        className={`transition-all duration-700 ${
          animStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-[#94A3B8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
          <span>Verified Medical Professional Network</span>
        </div>
      </div>

      {/* Center Stage: NOVEA Active Logo + Staggered Letters + Medical Arc */}
      <div className="flex flex-col items-center justify-center my-auto w-full max-w-md text-center relative z-10">
        {/* Medical-inspired Circular Arc & Pulse around Logo */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Animated SVG Medical Line / Arc */}
          <svg
            className={`w-36 h-36 sm:w-44 sm:h-44 absolute pointer-events-none transition-all duration-1000 ${
              animStep >= 3 ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
            }`}
            viewBox="0 0 160 160"
          >
            {/* Soft background track */}
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
            />
            {/* Animated medical arc gradient */}
            <defs>
              <linearGradient id="medicalArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1D4ED8" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="url(#medicalArcGrad)"
              strokeWidth="2.5"
              strokeDasharray="452"
              strokeDashoffset={animStep >= 3 ? '0' : '452'}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Medical Pulse indicator dot */}
            {animStep >= 4 && (
              <circle cx="80" cy="8" r="3.5" fill="#14B8A6" className="animate-ping" />
            )}
          </svg>

          {/* Active NOVEA Logo Centerpiece */}
          <div
            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-xl p-4 flex items-center justify-center shadow-2xl transition-all duration-700 ${
              animStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            } ${animStep >= 4 ? 'ring-2 ring-[#06B6D4]/40 shadow-[#06B6D4]/20' : ''}`}
          >
            {activeLogo.renderLogo({
              className: 'h-14 sm:h-16 w-auto max-w-full drop-shadow-md',
            })}
          </div>
        </div>

        {/* Staggered NOVEA Wordmark Letters */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3">
          {letters.map((letter, index) => {
            const isVisible = animStep >= 2;
            const delayMs = index * 80;
            return (
              <span
                key={index}
                style={{
                  transitionDelay: `${delayMs}ms`,
                }}
                className={`text-4xl sm:text-5xl font-extrabold tracking-tight transition-all duration-500 font-sans ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'
                } ${
                  index === 2
                    ? 'text-transparent bg-clip-text bg-linear-to-r from-[#38BDF8] to-[#14B8A6]'
                    : 'text-white'
                }`}
              >
                {letter}
              </span>
            );
          })}
        </div>

        {/* Subtitle / Value Proposition */}
        <p
          className={`text-xs sm:text-sm text-[#94A3B8] font-medium max-w-xs transition-all duration-700 ${
            animStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Collegiate Clinical Networking, Knowledge Sharing & Medical Council Verification
        </p>

        {/* Current Concept Badge */}
        <div
          className={`mt-3 inline-flex items-center gap-1.5 text-[11px] text-[#64748B] transition-opacity duration-700 ${
            animStep >= 4 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#38BDF8]" />
          <span>Active Identity: </span>
          <span className="text-[#CBD5E1] font-semibold">{activeLogo.name}</span>
        </div>
      </div>

      {/* Bottom Action Area: Differs for Returning User vs First Launch */}
      <div
        className={`w-full max-w-sm space-y-3 transition-all duration-700 ${
          isFinishedIntro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        {currentDoctor ? (
          /* Returning Doctor with Active Session */
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl space-y-3 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#1D4ED8] to-[#0D9488] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {currentDoctor.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{currentDoctor.fullName}</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] block truncate max-w-[180px]">
                    {currentDoctor.primarySpecialty || currentDoctor.specialty}
                  </span>
                </div>
              </div>

              {/* Real Verification Badge */}
              <VerificationBadge status={currentDoctor.verificationStatus} showText={true} />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#14B8A6]" />
                <span>Session Restored</span>
              </span>
              <button
                onClick={() => onOpenAuth('signin')}
                className="text-[#38BDF8] hover:underline font-medium cursor-pointer"
              >
                Switch Account
              </button>
            </div>

            <button
              onClick={onEnterApp}
              className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-[#1D4ED8] via-[#2563EB] to-[#0D9488] hover:from-[#1E40AF] hover:to-[#0F766E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1D4ED8]/25 transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Enter NOVEA Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* First Launch (Unauthenticated User) */
          <div className="space-y-2">
            <button
              onClick={() => onOpenAuth('signin')}
              className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-[#1D4ED8] to-[#2563EB] hover:from-[#1E40AF] hover:to-[#1D4ED8] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1D4ED8]/30 transition-all active:scale-[0.99] cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Doctor Sign In</span>
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-[#38BDF8]" />
              <span>Register Medical Account</span>
            </button>

            {onContinueAsGuest && (
              <button
                onClick={onContinueAsGuest}
                className="w-full text-center py-1.5 text-[11px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              >
                Explore Public Knowledge & Guidelines
              </button>
            )}
          </div>
        )}

        {/* Security & Regulatory Footnote */}
        <div className="text-center">
          <p className="text-[10px] text-[#64748B]">
            Protected Health Information (PHI) Safe • ISO 27799 Compliant • Council Roll Grounded
          </p>
        </div>
      </div>
    </div>
  );
};
