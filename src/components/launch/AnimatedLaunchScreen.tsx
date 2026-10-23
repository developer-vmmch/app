import React, { useState, useEffect, useRef } from 'react';
import { DoctorProfile } from '../../types';
import { useNoveaLogo } from '../branding/useNoveaLogo';

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
}) => {
  const { activeLogo } = useNoveaLogo();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [animStep, setAnimStep] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);
  const transitionedRef = useRef<boolean>(false);

  const handleVideoEnded = () => {
    if (transitionedRef.current) return;
    transitionedRef.current = true;
    if (currentDoctor) {
      onEnterApp();
    } else {
      onOpenAuth('signin');
    }
  };

  useEffect(() => {
    // Attempt explicit video playback for Android WebView
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((err) => {
          console.warn('Video playback notice:', err);
          setVideoError(true);
        });
    }

    const t1 = setTimeout(() => setAnimStep(1), 300);
    const t2 = setTimeout(() => setAnimStep(2), 800);
    const t3 = setTimeout(() => setAnimStep(3), 1300);

    // Safety fallback timer to prevent any blank screen or hang (5.5 seconds max)
    const fallbackTimer = setTimeout(() => {
      handleVideoEnded();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between text-white overflow-hidden select-none px-6 py-12 bg-[#040812]">
      {/* Background Intro Video (No Skip, No Progress Bar, No Line Cursor) */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-50 z-0"
          src="./assets/videos/launch-bg.mp4"
        />
      )}

      {/* Dark Cyan/Navy Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E1E38]/80 via-[#081122]/85 to-[#040812]/95 z-0 pointer-events-none" />

      {/* Background Glowing Medical Aura */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-[#0D9488]/30 via-[#1D4ED8]/25 to-transparent blur-3xl pointer-events-none transition-opacity duration-1000 z-10 ${
          animStep >= 1 ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
        }`}
      />

      {/* Center Stage: DoctoHub 3D Logo + Wordmark + Powered by NOVEA */}
      <div className="flex flex-col items-center justify-center my-auto w-full max-w-md text-center relative z-20 space-y-4">
        {/* Logo Centerpiece */}
        <div className="relative flex items-center justify-center">
          <div
            className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-white/20 to-white/5 border border-white/20 backdrop-blur-xl p-4 flex items-center justify-center shadow-2xl transition-all duration-700 ${
              animStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            {activeLogo.renderLogo({
              className: 'h-16 sm:h-20 w-auto max-w-full drop-shadow-md',
            })}
          </div>
        </div>

        {/* DoctoHub Main Title */}
        <div
          className={`transition-all duration-700 ${
            animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans">
            Docto<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#14B8A6]">Hub</span>
          </h1>
        </div>

        {/* Subtitle Tagline: Powered by NOVEA */}
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#38BDF8] transition-all duration-700 ${
            animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <span className="text-[#94A3B8]">——</span>
          <span>POWERED BY</span>
          <span className="text-white font-extrabold px-2 py-0.5 rounded bg-white/10 border border-white/15">
            NOVEA
          </span>
          <span className="text-[#94A3B8]">——</span>
        </div>

        {/* Value Proposition Statement matching Reference Screen 2 */}
        <p
          className={`text-xs sm:text-sm text-[#CBD5E1] font-semibold max-w-xs transition-all duration-700 pt-4 ${
            animStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          Connecting Medical Minds for a Healthier Tomorrow
        </p>
      </div>

      {/* Security Footnote */}
      <div className="relative z-20 text-center pb-2">
        <p className="text-[10px] text-[#64748B]">
          ISO 27799 Compliant • Council Roll Grounded • PHI Protected
        </p>
      </div>
    </div>
  );
};
