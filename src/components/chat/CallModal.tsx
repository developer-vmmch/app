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
  Maximize2,
  Minimize2,
  ShieldCheck,
  Activity,
  Sparkles,
  Radio,
} from 'lucide-react';
import { DoctorProfile } from '../../types';
import { webrtcService } from '../../services/webrtcService';
import { permissionService } from '../../services/permissionService';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<'HD' | 'Good' | 'Fair'>('HD');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Call duration timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (call.status === 'connected') {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [call.status]);

  // WebRTC Media Initialization
  useEffect(() => {
    let active = true;

    const setupCallMedia = async () => {
      if (call.status === 'connected') {
        const needPermission = call.type === 'video' ? 'camera' : 'microphone';
        await permissionService.requestPermission(needPermission);

        const localStream = await webrtcService.startLocalMedia(call.type === 'video');
        if (active && localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        webrtcService.initializePeerConnection({
          isVideo: call.type === 'video',
          onRemoteStream: (remoteStream) => {
            if (active && remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          },
          onCallEnded: () => {
            if (active) handleEnd();
          },
        });
      }
    };

    setupCallMedia();

    return () => {
      active = false;
      webrtcService.endCall();
    };
  }, [call.status, call.type]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    webrtcService.toggleMuteAudio(nextMuted);
  };

  const toggleVideoTrack = () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);
    webrtcService.toggleVideo(!nextVideoOff);
  };

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    webrtcService.endCall();
    onEndCall(duration, call.type);
  };

  // Incoming Call Ringing Screen
  if (call.isIncoming && call.status === 'ringing') {
    return (
      <div className="fixed inset-0 z-50 bg-[#070B18]/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0D1933] border border-[#21437A] rounded-3xl p-6 text-white text-center shadow-2xl space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full ring-4 ring-[#16845B]/60 p-1 relative">
            <img
              src={call.doctor.avatarUrl}
              alt={call.doctor.fullName}
              className="w-full h-full rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#16845B] border-2 border-[#0D1933] flex items-center justify-center">
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
            </span>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16845B]/20 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Incoming Consultation ({call.type === 'video' ? 'Video' : 'Voice'})
            </span>
            <h2 className="text-xl font-bold text-white">{call.doctor.fullName}</h2>
            <p className="text-xs text-[#94A3B8] mt-1">{call.doctor.specialty}</p>
            {call.doctor.hospitalName && (
              <p className="text-[11px] text-[#64748B] mt-0.5">{call.doctor.hospitalName}</p>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-[#060E1E] border border-[#1E3E6E] text-xs text-[#94A3B8] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16845B]" />
            <span>End-to-End Encrypted Clinical Session</span>
          </div>

          <div className="flex items-center justify-center gap-8 pt-2">
            <button
              onClick={onDeclineIncoming}
              className="w-16 h-16 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <button
              onClick={onAcceptIncoming}
              className="w-16 h-16 rounded-full bg-[#16845B] hover:bg-[#126B49] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 animate-bounce cursor-pointer"
            >
              <Phone className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active / Outgoing Call Interface
  return (
    <div className={`fixed inset-0 z-50 bg-[#040812] flex flex-col justify-between text-white ${isFullscreen ? 'p-0' : 'p-4 sm:p-6'}`}>
      {/* Top Bar Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1D4ED8]/20 border border-[#1D4ED8]/40 flex items-center justify-center text-[#38BDF8]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{call.doctor.fullName}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#16845B]/30 text-[#22C55E] text-[10px] font-bold">
                {networkQuality} Stream
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              {call.status === 'connected' ? `Active Consultation • ${formatDuration(duration)}` : 'Calling Doctor...'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Center Video/Stream Container */}
      <div className="relative flex-1 rounded-3xl overflow-hidden bg-[#0A1120] border border-[#1E3E6E] my-2 flex items-center justify-center">
        {call.type === 'video' && !isVideoOff ? (
          <div className="w-full h-full relative bg-black">
            {/* Remote Peer Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Local Self Camera Picture-in-Picture */}
            <div className="absolute top-4 right-4 w-32 h-44 sm:w-40 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/30 bg-slate-900 shadow-2xl z-20">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform -scale-x-100"
              />
            </div>
          </div>
        ) : (
          /* Voice Call Avatar View */
          <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
            <div className="w-32 h-32 rounded-full ring-4 ring-[#1D4ED8]/50 p-1 relative shadow-2xl">
              <img
                src={call.doctor.avatarUrl}
                alt={call.doctor.fullName}
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#1D4ED8] border-2 border-[#0A1120] flex items-center justify-center">
                <Radio className="w-4 h-4 text-white animate-pulse" />
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{call.doctor.fullName}</h3>
              <p className="text-xs text-[#94A3B8] mt-1">{call.doctor.specialty}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center gap-4 relative z-20">
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            isMuted ? 'bg-[#DC2626] border-[#DC2626] text-white' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {call.type === 'video' && (
          <button
            onClick={toggleVideoTrack}
            className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              isVideoOff ? 'bg-[#DC2626] border-[#DC2626] text-white' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}

        <button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            isSpeakerOn ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
          }`}
        >
          {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        <button
          onClick={handleEnd}
          className="w-16 h-16 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center justify-center shadow-xl transition-transform active:scale-95 cursor-pointer ml-2"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
