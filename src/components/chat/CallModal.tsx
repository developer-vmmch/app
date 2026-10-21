import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Share2,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Activity,
  Heart,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';
import { DoctorProfile } from '../../types';

export interface ActiveCallState {
  id: string;
  type: 'audio' | 'video';
  doctor: {
    id: string;
    fullName: string;
    specialty: string;
    avatarUrl: string;
    hospitalName?: string;
  };
  status: 'ringing' | 'connected' | 'ended';
  isIncoming?: boolean;
}

interface Props {
  call: ActiveCallState;
  currentUser: DoctorProfile;
  onEndCall: (durationSeconds: number, callType: 'audio' | 'video') => void;
  onAcceptIncoming?: () => void;
  onDeclineIncoming?: () => void;
}

export const CallModal: React.FC<Props> = ({
  call,
  currentUser,
  onEndCall,
  onAcceptIncoming,
  onDeclineIncoming,
}) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(call.type === 'audio');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<'HD' | 'Good' | 'Fair'>('HD');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Handle call timer when connected
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (call.status === 'connected') {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [call.status]);

  // Attempt real camera stream if video call, fallback smoothly if permissions blocked
  useEffect(() => {
    if (call.type === 'video' && !isVideoOff && call.status === 'connected') {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setLocalStream(stream);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            // Camera not available or blocked in iframe - fallback to clinical simulation
          });
      }
    }
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [call.type, isVideoOff, call.status]);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    onEndCall(duration, call.type);
  };

  // If incoming ringing call
  if (call.isIncoming && call.status === 'ringing') {
    return (
      <div className="fixed inset-0 z-50 bg-[#070B18]/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0D1933] border border-[#21437A] rounded-3xl p-6 text-white text-center shadow-2xl animate-bounce-subtle">
          <div className="w-24 h-24 mx-auto rounded-full ring-4 ring-[#16845B]/60 p-1 relative mb-4">
            <img
              src={call.doctor.avatarUrl}
              alt={call.doctor.fullName}
              className="w-full h-full rounded-full object-cover"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#16845B] border-2 border-[#0D1933] rounded-full flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-white" />
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16845B]/20 text-[#22C55E] text-xs font-semibold uppercase tracking-wider mb-2">
            <Radio className="w-3 h-3 animate-pulse" />
            Incoming Clinical Consult ({call.type.toUpperCase()})
          </div>

          <h3 className="text-xl font-bold">{call.doctor.fullName}</h3>
          <p className="text-sm text-slate-300 mt-1">{call.doctor.specialty}</p>
          <p className="text-xs text-slate-400 mt-0.5">Vinayaka Mission's Medical College Hospital</p>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={onDeclineIncoming || handleEnd}
              className="flex flex-col items-center gap-1.5 focus:outline-none group"
            >
              <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <PhoneOff className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-300">Decline</span>
            </button>

            <button
              onClick={onAcceptIncoming}
              className="flex flex-col items-center gap-1.5 focus:outline-none group"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 animate-pulse">
                {call.type === 'video' ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <Phone className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-xs font-medium text-emerald-400">Accept Consult</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={`${call.type === 'video' ? 'Video' : 'Voice'} Call with ${call.doctor.fullName}`}
      className={`fixed inset-0 z-50 bg-[#070B18]/95 backdrop-blur-lg flex items-center justify-center p-2 md:p-6 text-white transition-all ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`w-full ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-4xl h-[90vh] max-h-[820px] rounded-3xl'
        } bg-[#0A1731] border border-[#1E3E6E] shadow-2xl flex flex-col overflow-hidden relative`}
      >
        {/* Call Top Header */}
        <div className="px-5 py-3.5 bg-[#0D1E3F]/80 border-b border-[#1E3E6E]/60 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#16845B]/70 shrink-0">
              <img
                src={call.doctor.avatarUrl}
                alt={call.doctor.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm md:text-base text-white">{call.doctor.fullName}</h3>
                <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
              </div>
              <p className="text-xs text-slate-300">
                {call.doctor.specialty} • {call.status === 'connected' ? formatDuration(duration) : 'Calling...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#16845B]/20 text-[#22C55E] text-xs font-medium flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              {networkQuality} Encrypted
            </span>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Call Video / Audio Arena */}
        <div className="flex-1 relative bg-gradient-to-b from-[#09152B] to-[#050C1A] flex items-center justify-center overflow-hidden">
          {call.type === 'video' && !isVideoOff ? (
            <div className="w-full h-full relative flex items-center justify-center">
              {/* Remote Doctor Simulated / Live Video */}
              <div className="w-full h-full bg-[#050B16] flex items-center justify-center relative">
                <img
                  src={call.doctor.avatarUrl}
                  alt={call.doctor.fullName}
                  className="w-full h-full object-cover opacity-75 blur-xs md:blur-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Clinical telemetry overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs flex items-center gap-3">
                  <span className="flex items-center gap-1 text-red-400">
                    <Heart className="w-3.5 h-3.5 animate-pulse" /> 72 BPM
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-sky-300">SpO2: 98%</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-emerald-400">Secure Peer-to-Peer</span>
                </div>

                <div className="absolute bottom-4 left-4 text-left">
                  <p className="text-base font-bold text-white drop-shadow">{call.doctor.fullName}</p>
                  <p className="text-xs text-slate-300 drop-shadow">{call.doctor.specialty} Department</p>
                </div>
              </div>

              {/* Local Self-View Picture-in-Picture */}
              <div className="absolute bottom-6 right-6 w-32 md:w-44 h-44 md:h-56 rounded-2xl overflow-hidden border-2 border-[#16845B] shadow-2xl bg-slate-900 z-10">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!localStream && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-center p-2">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-12 h-12 rounded-full object-cover mb-1 border border-white/20"
                    />
                    <span className="text-[10px] text-slate-300 font-medium">You (Consultant)</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">
                  You
                </div>
              </div>
            </div>
          ) : (
            /* Audio Call Clinical Interface */
            <div className="flex flex-col items-center text-center p-6">
              {/* Doctor Avatar with Pulsing Audio Waves */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-[#16845B]/20 animate-ping opacity-60" />
                <div className="absolute -inset-2 rounded-full bg-[#16845B]/40 animate-pulse" />
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#16845B] relative z-10 shadow-2xl">
                  <img
                    src={call.doctor.avatarUrl}
                    alt={call.doctor.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{call.doctor.fullName}</h2>
              <p className="text-slate-300 text-sm font-medium mb-1">{call.doctor.specialty}</p>
              <p className="text-xs text-slate-400 mb-6">Vinayaka Mission's Medical College and Hospital</p>

              {/* Call Status & Audio Waveform Animation */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-mono text-emerald-400 font-semibold px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                  {call.status === 'connected' ? `Connected • ${formatDuration(duration)}` : 'Ringing peer...'}
                </span>

                {/* Animated Audio Waveform Bars */}
                <div className="flex items-center gap-1.5 h-10 mt-2">
                  {[24, 38, 16, 48, 32, 54, 28, 42, 60, 30, 45, 20].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        height: call.status === 'connected' ? `${h}px` : '8px',
                        animationDelay: `${i * 0.08}s`,
                      }}
                      className={`w-1 rounded-full ${
                        isMuted
                          ? 'bg-slate-600'
                          : 'bg-gradient-to-t from-[#16845B] to-[#22C55E] animate-pulse'
                      } transition-all duration-300`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isMuted ? 'Your microphone is muted' : 'HIPAA & Telemedicine Compliant Audio Stream'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Call Bottom Controls Toolbar */}
        <div className="px-6 py-4 bg-[#0A1731] border-t border-[#1E3E6E]/60 flex items-center justify-center gap-4 md:gap-6 z-20">
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              isVideoOff
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isVideoOff ? 'Enable Camera' : 'Disable Camera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Speaker Switch */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              !isSpeakerOn
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isSpeakerOn ? 'Speakerphone On' : 'Speakerphone Off'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              isScreenSharing
                ? 'bg-[#16845B] text-white border border-emerald-400'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Clinical Diagnostic Screen'}
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEnd}
            className="w-14 h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xl shadow-red-900/40 focus:outline-none"
            title="End Consult Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
