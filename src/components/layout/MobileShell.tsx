import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  Wifi,
  Signal,
  Battery,
  Settings,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
  productName: string;
  onUpdateProductName: (name: string) => void;
  onOpenSpecs: () => void;
}

export const MobileShell: React.FC<Props> = ({
  children,
  productName,
  onUpdateProductName,
  onOpenSpecs,
}) => {
  const [deviceMode, setDeviceMode] = useState<'pixel' | 'fullscreen'>('fullscreen');
  const [currentTime] = useState('09:42');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(productName);

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      onUpdateProductName(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="min-h-screen bg-[#0E2038] sm:bg-[#12345B] text-[#142238] flex flex-col items-center justify-start p-0 sm:p-4 lg:p-6 overflow-x-hidden">
      {/* Top Controls Bar (Clean and compact) */}
      <div className="w-full max-w-4xl mb-0 sm:mb-3 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-white/95 sm:bg-white backdrop-blur rounded-none sm:rounded-2xl border-b sm:border border-[#E1E9F3] flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#EAF3FF] text-[#12345B] font-bold border border-[#246BCE]/30">
            <span className="w-2 h-2 rounded-full bg-[#16845B]" />
            <span className="text-[11px] sm:text-xs">AMT Tech Nova</span>
          </div>

          {/* Configurable Name Editor */}
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="bg-[#F6F9FD] text-[#142238] px-2 py-0.5 rounded border border-[#246BCE] text-xs focus:outline-none"
                placeholder="Product Name"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="px-2 py-0.5 bg-[#246BCE] text-white rounded font-bold"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempTitle(productName);
                  setIsEditingTitle(false);
                }}
                className="px-1.5 py-0.5 text-[#63738A]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-[#63738A] hover:text-[#246BCE] flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-[#F6F9FD]"
              title="Click to rename product"
            >
              <span className="text-[#142238] font-bold text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-none">
                {productName}
              </span>
              <Settings className="w-3 h-3 text-[#63738A]" />
            </button>
          )}
        </div>

        {/* Viewport & Spec explorer */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden xs:flex items-center bg-[#F6F9FD] p-0.5 rounded-lg border border-[#E1E9F3]">
            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors text-[11px] ${
                deviceMode === 'fullscreen'
                  ? 'bg-[#12345B] text-white font-bold shadow-2xs'
                  : 'text-[#63738A] hover:text-[#142238]'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fluid</span>
            </button>
            <button
              onClick={() => setDeviceMode('pixel')}
              className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors text-[11px] ${
                deviceMode === 'pixel'
                  ? 'bg-[#12345B] text-white font-bold shadow-2xs'
                  : 'text-[#63738A] hover:text-[#142238]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Bezel</span>
            </button>
          </div>

          <button
            onClick={onOpenSpecs}
            className="px-2.5 py-1 rounded-lg bg-[#246BCE] hover:bg-[#12345B] text-white font-bold text-[11px] sm:text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QA Test Suite & </span>
            <span>Android Specs</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Device Surface (No thick artificial outer frame) */}
      <div
        className={`w-full flex-1 sm:flex-initial transition-all duration-200 flex flex-col ${
          deviceMode === 'pixel'
            ? 'w-full sm:max-w-[420px] rounded-none sm:rounded-[36px] bg-white border-0 sm:border sm:border-[#CAD8E8] shadow-none sm:shadow-2xl my-0 sm:my-auto overflow-hidden ring-0 sm:ring-2 sm:ring-[#246BCE]/20'
            : 'w-full sm:max-w-md md:max-w-lg rounded-none sm:rounded-2xl bg-white border-0 sm:border sm:border-[#CAD8E8] shadow-none sm:shadow-xl my-0 sm:my-auto overflow-hidden'
        }`}
      >
        {/* Android Status Bar */}
        <div className="bg-white text-[#142238] px-4 sm:px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] select-none font-medium border-b border-[#E1E9F3] shrink-0">
          <span className="font-bold">{currentTime}</span>

          {deviceMode === 'pixel' && (
            <div className="hidden sm:block w-3 h-3 rounded-full bg-slate-800 ring-2 ring-slate-600/40 -mt-0.5" />
          )}

          <div className="flex items-center gap-1.5 text-[#63738A]">
            <Signal className="w-3 h-3 text-[#142238]" />
            <Wifi className="w-3 h-3 text-[#142238]" />
            <div className="flex items-center gap-0.5 font-bold text-[#142238]">
              <span>98%</span>
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Inner App Content Screen (Flexible and responsive) */}
        <div className="flex-1 min-h-[640px] sm:h-[760px] flex flex-col bg-[#F6F9FD] relative overflow-hidden">
          {children}
        </div>

        {/* Android Bottom Navigation Pill */}
        {deviceMode === 'pixel' && (
          <div className="hidden sm:flex bg-white py-1.5 justify-center items-center border-t border-[#E1E9F3] shrink-0">
            <div className="w-28 h-1 rounded-full bg-slate-300" />
          </div>
        )}
      </div>
    </div>
  );
};
