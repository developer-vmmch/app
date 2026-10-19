import React from 'react';
import { VerificationStatus } from '../../types';
import { ShieldCheck, Clock, AlertTriangle, ShieldX, ShieldAlert, FileText, Info } from 'lucide-react';

interface Props {
  status: VerificationStatus;
  showText?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<Props> = ({ status, showText = true, className = '' }) => {
  if (status === 'VERIFIED') {
    return (
      <span
        title="Verified Medical Practitioner (Council Register Confirmed)"
        className={`inline-flex items-center gap-1 text-[11px] font-semibold text-[#16845B] bg-[#EAF8F1] px-1.5 py-0.5 rounded ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#16845B] shrink-0" />
        {showText && <span>Verified</span>}
      </span>
    );
  }

  if (status === 'PENDING_REVIEW') {
    return (
      <span
        title="Council registration submitted. In official administrative review."
        className={`inline-flex items-center gap-1 text-[11px] font-medium text-[#B7791F] bg-[#FEF6EC] px-1.5 py-0.5 rounded ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-[#B7791F] shrink-0" />
        {showText && <span>Pending Review</span>}
      </span>
    );
  }

  if (status === 'SUBMITTED') {
    return (
      <span
        title="Verification proof uploaded and queued for registrar audit."
        className={`inline-flex items-center gap-1 text-[11px] font-medium text-[#246BCE] bg-[#EAF3FF] px-1.5 py-0.5 rounded ${className}`}
      >
        <FileText className="w-3.5 h-3.5 text-[#246BCE] shrink-0" />
        {showText && <span>Submitted</span>}
      </span>
    );
  }

  if (status === 'REQUIRES_MORE_INFORMATION') {
    return (
      <span
        title="Additional council proof or gazette declaration required."
        className={`inline-flex items-center gap-1 text-[11px] font-medium text-[#C05621] bg-[#FEEBC8] px-1.5 py-0.5 rounded ${className}`}
      >
        <Info className="w-3.5 h-3.5 text-[#C05621] shrink-0" />
        {showText && <span>Action Needed</span>}
      </span>
    );
  }

  if (status === 'REJECTED') {
    return (
      <span
        title="Medical registration number could not be validated on council roll."
        className={`inline-flex items-center gap-1 text-[11px] font-medium text-[#C43D4B] bg-[#FDF2F3] px-1.5 py-0.5 rounded ${className}`}
      >
        <ShieldX className="w-3.5 h-3.5 text-[#C43D4B] shrink-0" />
        {showText && <span>Rejected</span>}
      </span>
    );
  }

  if (status === 'EXPIRED') {
    return (
      <span
        title="Periodic council registration renewal overdue."
        className={`inline-flex items-center gap-1 text-[11px] font-medium text-[#DD6B20] bg-[#FEEBC8] px-1.5 py-0.5 rounded ${className}`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-[#DD6B20] shrink-0" />
        {showText && <span>Expired</span>}
      </span>
    );
  }

  // NOT_STARTED
  return (
    <span
      title="Identity created. Council certificate number verification not submitted."
      className={`inline-flex items-center gap-1 text-[11px] text-[#63738A] bg-[#F1F5F9] px-1.5 py-0.5 rounded ${className}`}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-[#63738A] shrink-0" />
      {showText && <span>Unverified</span>}
    </span>
  );
};
