import React from 'react';
import {
  ShieldCheck,
  Camera,
  Mic,
  MapPin,
  Users,
  Bell,
  X,
  Lock,
} from 'lucide-react';
import { PermissionType, PERMISSION_RATIONALES, permissionService } from '../../services/permissionService';

interface Props {
  permissionType: PermissionType | null;
  onClose: () => void;
  onGranted: () => void;
}

export const PermissionRationaleModal: React.FC<Props> = ({
  permissionType,
  onClose,
  onGranted,
}) => {
  if (!permissionType) return null;

  const rationale = PERMISSION_RATIONALES[permissionType];

  const renderIcon = () => {
    switch (permissionType) {
      case 'camera':
        return <Camera className="w-6 h-6 text-[#1D4ED8]" />;
      case 'microphone':
        return <Mic className="w-6 h-6 text-[#1D4ED8]" />;
      case 'location':
        return <MapPin className="w-6 h-6 text-[#1D4ED8]" />;
      case 'contacts':
        return <Users className="w-6 h-6 text-[#1D4ED8]" />;
      case 'notifications':
        return <Bell className="w-6 h-6 text-[#1D4ED8]" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-[#1D4ED8]" />;
    }
  };

  const handleConfirm = async () => {
    const success = await permissionService.requestPermission(permissionType);
    if (success) {
      onGranted();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B18]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#CBD5E1] p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
              {renderIcon()}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">{rationale.title}</h3>
              <p className="text-[10px] text-[#64748B] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#14B8A6]" />
                <span>On-Demand Permission Request</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-[#334155] leading-relaxed">
            {rationale.purpose}
          </p>
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#64748B]">
            You can modify or revoke this permission anytime in your Android Device Settings.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            Not Now
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Allow Access
          </button>
        </div>
      </div>
    </div>
  );
};
