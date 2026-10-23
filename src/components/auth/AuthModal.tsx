import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Activity,
  Layers,
  FileCheck,
  AlertCircle,
  KeyRound,
  GraduationCap,
  Building2,
  BookOpen,
  Users,
  Compass,
  Cpu,
} from 'lucide-react';
import { DoctorProfile, RegisterDTO } from '../../types';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUserChanged: (user: DoctorProfile) => void;
}

const COUNCILS = [
  'Tamil Nadu Medical Council (TNMC)',
  'National Medical Commission (NMC India)',
  'Karnataka Medical Council (KMC)',
  'Maharashtra Medical Council (MMC)',
  'General Medical Council (GMC UK)',
  'US State Medical Boards (FSMB)',
];

const QUICK_PERSONAS = [
  {
    id: 'AMT-DOC-TEST-A',
    name: 'Dr. Novea Test Doctor A',
    specialty: 'General Medicine (Test Account A)',
    institution: 'DoctoHub Medical Network',
    badge: 'Account A',
  },
  {
    id: 'AMT-DOC-TEST-B',
    name: 'Dr. Novea Test Doctor B',
    specialty: 'Cardiology (Test Account B)',
    institution: 'DoctoHub Specialty Center',
    badge: 'Account B',
  },
  {
    id: 'AMT-DOC-10024',
    name: 'Dr. Alex Rivera',
    specialty: 'Internal Medicine (Resident)',
    institution: 'Vinayaka Mission Hospital',
    badge: 'Resident MD',
  },
  {
    id: 'AMT-DOC-08412',
    name: 'Dr. Sarah Lin',
    specialty: 'Interventional Cardiology',
    institution: 'Apollo Heart Center',
    badge: 'Senior Specialist',
  },
  {
    id: 'AMT-DOC-11204',
    name: 'Dr. K. Senthil Kumar',
    specialty: 'General Medicine & Diabetology',
    institution: 'Govt. Kilpauk Medical College',
    badge: 'Attending MD',
  },
  {
    id: 'AMT-DOC-07921',
    name: 'Dr. Marcus Vance',
    specialty: 'Pediatric Neurosurgery',
    institution: 'Children Specialized Hospital',
    badge: 'Chief Surgeon',
  },
];

// Node definition for the Medical Knowledge Universe canvas
interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  label?: string;
  category?: 'hub' | 'specialty' | 'research' | 'mentorship';
  pulsePhase: number;
}

interface Particle {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onUserChanged }) => {
  const [authView, setAuthView] = useState<'signin' | 'register' | 'forgot_password'>('signin');

  // Sign In fields
  const [userId, setUserId] = useState('AMT-DOC-10024');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [country, setCountry] = useState('India');
  const [medicalProfession, setMedicalProfession] = useState('Allopathic Physician');
  const [primarySpecialty, setPrimarySpecialty] = useState('Pediatrics');
  const [qualification, setQualification] = useState('MBBS, MD');
  const [medicalCollege, setMedicalCollege] = useState("Vinayaka Mission's Medical College");
  const [institution, setInstitution] = useState("Apollo Children's Hospital");
  const [registrationCouncil, setRegistrationCouncil] = useState(COUNCILS[0]);
  const [medicalRegistrationNumber, setMedicalRegistrationNumber] = useState('TNMC-90432');
  const [graduationYear, setGraduationYear] = useState(2023);
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Parallax pointer offset
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const mouseOffsetRef = useRef({ x: 0, y: 0 });

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pointer movement handler for subtle parallax
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseOffsetRef.current = { x: relX * 24, y: relY * 24 };
    setMouseOffset({ x: relX * 24, y: relY * 24 });
  }, []);

  // "The Medical Knowledge Universe" Canvas Animation
  useEffect(() => {
    if (!isOpen) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 480);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 640);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Knowledge nodes in the medical network universe
    const nodeDefinitions: Array<{ label?: string; category?: NetworkNode['category']; relX: number; relY: number }> = [
      { label: 'Knowledge Hub', category: 'hub', relX: 0.5, relY: 0.44 },
      { label: 'Cardiology', category: 'specialty', relX: 0.22, relY: 0.28 },
      { label: 'Pediatrics', category: 'specialty', relX: 0.78, relY: 0.32 },
      { label: 'Genomic Research', category: 'research', relX: 0.30, relY: 0.65 },
      { label: 'Peer Mentorship', category: 'mentorship', relX: 0.70, relY: 0.60 },
      { label: 'Critical Care', category: 'specialty', relX: 0.16, relY: 0.50 },
      { label: 'Clinical Trials', category: 'research', relX: 0.52, relY: 0.76 },
      { label: 'Neurosurgery', category: 'specialty', relX: 0.84, relY: 0.48 },
      { relX: 0.38, relY: 0.20 },
      { relX: 0.62, relY: 0.18 },
      { relX: 0.42, relY: 0.58 },
      { relX: 0.58, relY: 0.52 },
      { relX: 0.12, relY: 0.38 },
      { relX: 0.88, relY: 0.22 },
      { relX: 0.26, relY: 0.80 },
      { relX: 0.74, relY: 0.78 },
    ];

    const nodes: NetworkNode[] = nodeDefinitions.map((def, idx) => ({
      x: def.relX * width,
      y: def.relY * height,
      vx: (Math.random() - 0.5) * (idx === 0 ? 0.05 : 0.25),
      vy: (Math.random() - 0.5) * (idx === 0 ? 0.05 : 0.25),
      baseRadius: idx === 0 ? 9 : def.label ? 4.5 : 2.5,
      radius: idx === 0 ? 9 : def.label ? 4.5 : 2.5,
      label: def.label,
      category: def.category,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Traveling information particles
    const particleCount = 10;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        fromNode: Math.floor(Math.random() * nodes.length),
        toNode: Math.floor(Math.random() * nodes.length),
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
      });
    }

    let tick = 0;

    const render = () => {
      tick += 0.02;
      ctx.clearRect(0, 0, width, height);

      const parallax = mouseOffsetRef.current;
      const hubX = nodes[0].x + parallax.x * 0.25;
      const hubY = nodes[0].y + parallax.y * 0.25;

      // 1. Soft radial atmosphere lighting around central hub
      const radialGlow = ctx.createRadialGradient(hubX, hubY, 10, hubX, hubY, width * 0.55);
      radialGlow.addColorStop(0, 'rgba(49, 133, 255, 0.22)');
      radialGlow.addColorStop(0.35, 'rgba(38, 217, 195, 0.10)');
      radialGlow.addColorStop(0.7, 'rgba(11, 22, 48, 0.04)');
      radialGlow.addColorStop(1, 'rgba(7, 11, 24, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle concentric orbital paths
      ctx.save();
      ctx.strokeStyle = 'rgba(49, 133, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      [90, 160, 240].forEach((r) => {
        ctx.beginPath();
        ctx.arc(hubX, hubY, r, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      // 3. Connective network filaments
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const p1x = n1.x + parallax.x * (i === 0 ? 0.25 : 0.6);
          const p1y = n1.y + parallax.y * (i === 0 ? 0.25 : 0.6);
          const p2x = n2.x + parallax.x * (j === 0 ? 0.25 : 0.6);
          const p2y = n2.y + parallax.y * (j === 0 ? 0.25 : 0.6);

          const dx = p1x - p2x;
          const dy = p1y - p2y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * (i === 0 || j === 0 ? 0.35 : 0.16);
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);
            ctx.strokeStyle = `rgba(49, 133, 255, ${alpha})`;
            ctx.lineWidth = i === 0 || j === 0 ? 1.5 : 1;
            ctx.stroke();
          }
        }
      }

      // 4. Moving synaptic pulses traveling along paths
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.progress += p.speed;
          if (p.progress >= 1) {
            p.progress = 0;
            p.fromNode = Math.floor(Math.random() * nodes.length);
            p.toNode = Math.floor(Math.random() * nodes.length);
          }
        }
        const n1 = nodes[p.fromNode];
        const n2 = nodes[p.toNode];
        if (n1 && n2) {
          const p1x = n1.x + parallax.x * 0.5;
          const p1y = n1.y + parallax.y * 0.5;
          const p2x = n2.x + parallax.x * 0.5;
          const p2y = n2.y + parallax.y * 0.5;
          const px = p1x + (p2x - p1x) * p.progress;
          const py = p1y + (p2y - p1y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#26D9C3';
          ctx.shadowColor = '#26D9C3';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 5. Render nodes
      nodes.forEach((n, idx) => {
        n.pulsePhase += 0.03;
        const currentRadius = n.baseRadius + Math.sin(n.pulsePhase) * (idx === 0 ? 1.8 : 0.7);
        const nx = n.x + parallax.x * (idx === 0 ? 0.25 : 0.6);
        const ny = n.y + parallax.y * (idx === 0 ? 0.25 : 0.6);

        // Core fill
        ctx.beginPath();
        ctx.arc(nx, ny, currentRadius, 0, Math.PI * 2);
        if (idx === 0) {
          ctx.fillStyle = '#3185FF';
          ctx.shadowColor = '#3185FF';
          ctx.shadowBlur = 16;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Central pulsing halo
          ctx.beginPath();
          ctx.arc(nx, ny, currentRadius + 5 + Math.sin(n.pulsePhase) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(38, 217, 195, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (n.label) {
          ctx.fillStyle = n.category === 'specialty' ? '#3185FF' : '#26D9C3';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(nx, ny, currentRadius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(49, 133, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(164, 204, 255, 0.4)';
          ctx.fill();
        }

        // Floating label
        if (n.label && width > 360) {
          ctx.font = idx === 0 ? '600 10px system-ui, sans-serif' : '500 9px system-ui, sans-serif';
          ctx.fillStyle = idx === 0 ? '#FFFFFF' : 'rgba(215, 235, 255, 0.85)';
          ctx.fillText(n.label, nx + (idx === 0 ? 14 : 9), ny + 3);
        }

        // Node motion bounded in space
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 20 || n.x > width - 20) n.vx *= -1;
          if (n.y < 20 || n.y > height - 20) n.vy *= -1;
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setErrorMessage('Please enter your Doctor User ID or email.');
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);

    api.setCurrentUserId(userId.trim());
    const res = await api.getCurrentUser();
    setSubmitting(false);

    if (res.success) {
      onUserChanged(res.data);
      onClose();
    } else {
      setErrorMessage('Doctor credentials could not be verified in registry.');
    }
  };

  const handleQuickSwitch = async (docId: string) => {
    setSubmitting(true);
    setErrorMessage(null);
    api.setCurrentUserId(docId);
    const res = await api.getCurrentUser();
    setSubmitting(false);

    if (res.success) {
      onUserChanged(res.data);
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !medicalRegistrationNumber.trim()) {
      setErrorMessage('Please fill in doctor name, professional email, and registration number.');
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);

    const dto: RegisterDTO = {
      fullName: fullName.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim() || undefined,
      country,
      medicalProfession,
      primarySpecialty,
      additionalSpecialties: [],
      qualification,
      medicalCollege,
      institution,
      registrationCouncil,
      medicalRegistrationNumber: medicalRegistrationNumber.trim(),
      graduationYear,
      preferredLanguage,
      verificationDocumentProvided: true,
    };

    const res = await api.register(dto);
    setSubmitting(false);

    if (res.success) {
      onUserChanged(res.data.user);
      onClose();
    } else {
      setErrorMessage(res.error?.message || 'Failed to complete doctor registration');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMessage('Enter your registered medical email or doctor ID.');
      return;
    }
    setForgotSent(true);
    setErrorMessage(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AMT Doctor Knowledge Network Authentication"
      className="fixed inset-0 z-50 bg-[#070B18]/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
    >
      {/* Main Container: Two-panel on desktop (54% / 46%), sleek single-column on mobile */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-full sm:h-auto sm:max-w-5xl bg-[#0B1630] sm:rounded-3xl border-0 sm:border sm:border-[#1E3E6E]/60 shadow-2xl overflow-y-auto sm:overflow-hidden flex flex-col md:flex-row min-h-screen sm:min-h-[600px] text-white"
      >
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3185FF] via-[#26D9C3] to-[#3185FF] z-30" />

        {/* Accessible Close Button */}
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-40 p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#3185FF]/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =========================================================================
            LEFT PANEL: "The Medical Knowledge Universe" (approx 54% width on desktop)
            ========================================================================= */}
        <div className="relative w-full md:w-[54%] p-5 sm:p-7 md:p-9 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#070B18] via-[#0B1630] to-[#0A142A] border-b md:border-b-0 md:border-r border-[#1E3E6E]/50 shrink-0">
          {/* Animated Canvas (strictly behind content, pointer-events-none) */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none opacity-90 z-0"
          />

          {/* Top Brand Identity & Hierarchy */}
          <div className="relative z-10 space-y-3 sm:space-y-4">
            {/* DoctoHub Brand Mark */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#1B4B82] via-[#3185FF] to-[#26D9C3] flex items-center justify-center text-white shadow-lg shrink-0">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-black text-sm sm:text-base tracking-tight text-white">DoctoHub</span>
                  <span className="w-1 h-1 rounded-full bg-[#26D9C3]" />
                  <span className="text-[11px] sm:text-xs font-bold text-[#64B5F6] tracking-tight">
                    Powered by NOVEA
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Verified Healthcare Peer Exchange
                </span>
              </div>
            </div>

            {/* Headline and Supporting Copy */}
            <div className="pt-1 sm:pt-4 space-y-2">
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3185FF]/15 border border-[#3185FF]/35 text-[#64B5F6] text-[10px] font-bold tracking-wide">
                <Sparkles className="w-3 h-3 text-[#26D9C3]" />
                <span>EXCLUSIVELY FOR MEDICAL PRACTITIONERS</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-white tracking-tight leading-tight">
                Knowledge connects.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3185FF] via-[#42A5F5] to-[#26D9C3] block sm:inline">
                  Medicine advances.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md pt-0.5">
                Connect with medical professionals, exchange knowledge, discover mentors, and grow
                together through a trusted learning network.
              </p>
            </div>

            {/* 3 Compact Feature Indicators (Desktop & Tablet) */}
            <div className="hidden sm:grid grid-cols-1 gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-xs">
                <BookOpen className="w-4 h-4 text-[#26D9C3] shrink-0" />
                <span className="font-medium">Peer-to-peer medical learning</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-xs">
                <Activity className="w-4 h-4 text-[#3185FF] shrink-0" />
                <span className="font-medium">Professional knowledge exchange</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-xs">
                <Users className="w-4 h-4 text-[#26D9C3] shrink-0" />
                <span className="font-medium">Mentorship and collaboration</span>
              </div>
            </div>
          </div>

          {/* Understated Trust Statement */}
          <div className="relative z-10 pt-4 sm:pt-6 border-t border-white/10 mt-4 sm:mt-6">
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-normal">
              Intended exclusively for verified medical practitioners. HIPAA & PHI educational peer
              exchange standard. Not an HMS electronic medical records chart repository.
            </p>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: Premium Authentication Panel (approx 46% width on desktop)
            ========================================================================= */}
        <div className="w-full md:w-[46%] p-5 sm:p-7 md:p-8 flex flex-col justify-center bg-[#09152C]/95 backdrop-blur-md text-white flex-1">
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-3.5 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-3.5 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* VIEW 1: SIGN IN */}
          {authView === 'signin' && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Welcome back
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Continue your professional learning network.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-3.5 sm:space-y-4">
                {/* 1. User ID Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-user-id"
                    className="block text-xs font-semibold text-slate-200"
                  >
                    User ID
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="auth-user-id"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Doctor ID or registered email (e.g. AMT-DOC-10024)"
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] focus:border-[#3185FF] focus:ring-2 focus:ring-[#3185FF]/25 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none h-11 sm:h-11 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* 2. Password Field with Visibility Toggle */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="auth-password"
                      className="block text-xs font-semibold text-slate-200"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthView('forgot_password')}
                      className="text-[11px] text-[#64B5F6] hover:text-[#26D9C3] transition-colors py-0.5 focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] focus:border-[#3185FF] focus:ring-2 focus:ring-[#3185FF]/25 rounded-xl pl-9 pr-11 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none h-11 sm:h-11 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="min-w-[44px] min-h-[44px] p-2 text-slate-400 hover:text-white absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1E3E6E] bg-[#060E1E] text-[#3185FF] focus:ring-[#3185FF] cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="text-xs text-slate-300 cursor-pointer select-none">
                    Remember me on this browser
                  </label>
                </div>

                {/* Primary Sign In Button (48 dp minimum touch target) */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[48px] h-12 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3185FF] via-[#246BCE] to-[#1D58A7] hover:from-[#42A5F5] hover:to-[#246BCE] active:scale-[0.99] text-white font-bold text-sm shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#3185FF]/50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying Doctor Credentials...
                    </span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Persona Evaluator Switcher */}
              <div className="pt-3 border-t border-[#1E3E6E]/60 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Switch Verified Personas (QA & Demo)
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleQuickSwitch(p.id)}
                      className="p-2 rounded-xl bg-[#060E1E] hover:bg-[#0F1E3D] active:bg-[#162D59] border border-[#1E3E6E] text-left transition-colors flex flex-col group focus:outline-none focus:ring-2 focus:ring-[#3185FF]/30"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-white group-hover:text-[#64B5F6] truncate">
                          {p.name}
                        </span>
                        <span className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded bg-[#3185FF]/25 text-[#64B5F6] shrink-0 font-medium">
                          {p.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">{p.specialty}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Register Switch Link */}
              <div className="text-center pt-1.5">
                <p className="text-xs text-slate-300">
                  New practitioner?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setAuthView('register');
                    }}
                    className="font-bold text-[#64B5F6] hover:text-[#26D9C3] underline focus:outline-none"
                  >
                    Create Doctor Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* VIEW 2: REGISTER */}
          {authView === 'register' && (
            <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Doctor Registration
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Join with your medical council registration.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Full Name (with Dr. prefix)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Rajesh Ramanathan"
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3185FF]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Professional Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dr.rajesh@hospital.org"
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3185FF]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Primary Specialty
                    </label>
                    <select
                      value={primarySpecialty}
                      onChange={(e) => setPrimarySpecialty(e.target.value)}
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3185FF]"
                    >
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Neurosurgery">Neurosurgery</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Radiology">Radiology</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Medical Council
                    </label>
                    <select
                      value={registrationCouncil}
                      onChange={(e) => setRegistrationCouncil(e.target.value)}
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3185FF]"
                    >
                      {COUNCILS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Registration License Number
                    </label>
                    <input
                      type="text"
                      value={medicalRegistrationNumber}
                      onChange={(e) => setMedicalRegistrationNumber(e.target.value)}
                      placeholder="e.g. TNMC-90432"
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3185FF]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Current Hospital / Clinic
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="Apollo Children's Hospital"
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3185FF]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[48px] h-12 py-3 px-4 rounded-xl bg-[#3185FF] hover:bg-[#246BCE] text-white font-bold text-xs shadow-md transition-all mt-2 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting Credentials...' : 'Register & Verify Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthView('signin')}
                  className="text-xs text-[#64B5F6] hover:underline"
                >
                  Already registered? Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: FORGOT PASSWORD */}
          {authView === 'forgot_password' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#3185FF]/20 text-[#64B5F6]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Reset Doctor Password
                  </h2>
                  <p className="text-xs text-slate-300">
                    Receive verification token at your medical email
                  </p>
                </div>
              </div>

              {forgotSent ? (
                <div className="p-4 rounded-2xl bg-[#060E1E] border border-[#1E3E6E] space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Password Reset Link Dispatched</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    We sent a secure council verification reset link to{' '}
                    <strong className="text-white">{forgotEmail}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setForgotSent(false);
                      setAuthView('signin');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#3185FF] text-white font-bold text-xs"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200">
                      Doctor ID or Medical Email
                    </label>
                    <input
                      type="text"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. AMT-DOC-10024 or doctor@hospital.org"
                      className="w-full bg-[#060E1E] border border-[#1E3E6E] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#3185FF]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] h-12 py-3 rounded-xl bg-[#3185FF] hover:bg-[#246BCE] text-white font-bold text-xs transition-colors"
                  >
                    Send Recovery Link
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthView('signin')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
