/**
 * NOVEA Medical Network - WebRTC 1-to-1 Voice & Video Calling Signaling Service
 * Manages RTCPeerConnection, STUN configuration, local/remote streams, and media track controls.
 */

export interface PeerCallConfig {
  isVideo: boolean;
  onRemoteStream?: (stream: MediaStream) => void;
  onCallEnded?: () => void;
  onCallError?: (err: Error) => void;
}

const STUN_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  public async startLocalMedia(isVideo: boolean): Promise<MediaStream | null> {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        return null;
      }
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      });
      return this.localStream;
    } catch (err) {
      console.warn('Failed to access local media devices for call:', err);
      return null;
    }
  }

  public initializePeerConnection(config: PeerCallConfig): RTCPeerConnection {
    this.peerConnection = new RTCPeerConnection(STUN_SERVERS);

    // Attach local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
    }

    // Handle incoming remote stream tracks
    this.peerConnection.ontrack = (e) => {
      if (e.streams && e.streams[0]) {
        this.remoteStream = e.streams[0];
        if (config.onRemoteStream) {
          config.onRemoteStream(this.remoteStream);
        }
      }
    };

    // ICE Candidate signaling handler
    this.peerConnection.onicecandidate = (e) => {
      if (e.candidate && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('webrtc_ice_candidate', { detail: { candidate: e.candidate } }));
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        const state = this.peerConnection.connectionState;
        if (state === 'failed' || state === 'disconnected' || state === 'closed') {
          if (config.onCallEnded) config.onCallEnded();
        }
      }
    };

    return this.peerConnection;
  }

  public toggleMuteAudio(muted: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  public toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  public endCall(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}

export const webrtcService = new WebRTCService();
