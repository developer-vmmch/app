import React, { useState, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  Activity,
  Layers,
  Compass,
  CheckCircle2,
  Radio,
  Hospital,
  AlertCircle,
  ExternalLink,
  Share2,
  X,
  Stethoscope,
} from 'lucide-react';
import {
  INITIAL_MAP_LOCATIONS,
  REGIONAL_CENTERS,
  MedicalLocation,
} from '../../services/mapsData';
import { DoctorProfile } from '../../types';

const GOOGLE_MAPS_API_KEY =
  ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || 'AIzaSyCUx1e6hpRamKnyoFGaEff0eNobcPcy41o';

interface Props {
  currentUser?: DoctorProfile | null;
  onSelectDoctor?: (doctorId: string) => void;
  onOpenChatWithDoctor?: (doctorId: string, doctorName: string) => void;
  onCallDoctor?: (doctor: { id: string; fullName: string; specialty: string; avatarUrl: string }) => void;
  onShareLocationToChat?: (location: {
    title: string;
    address: string;
    lat: number;
    lng: number;
    isLive?: boolean;
    durationMinutes?: number;
  }) => void;
  isChatPickerMode?: boolean;
  onClose?: () => void;
}

// Inner helper component to pan the camera when center or selection changes
const MapController: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();

  React.useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  return null;
};

export const DoctorKnowledgeMap: React.FC<Props> = ({
  currentUser,
  onSelectDoctor,
  onOpenChatWithDoctor,
  onCallDoctor,
  onShareLocationToChat,
  isChatPickerMode = false,
  onClose,
}) => {
  // Current region center
  const [selectedRegionId, setSelectedRegionId] = useState('salem');
  const [mapCenter, setMapCenter] = useState({ lat: 11.6643, lng: 78.1460 });
  const [mapZoom, setMapZoom] = useState(13);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(25);
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'doctor' | 'hospital'>('all');

  // Selected Marker for InfoWindow
  const [selectedLocation, setSelectedLocation] = useState<MedicalLocation | null>(null);

  // Live Location Share state (when in picker mode)
  const [shareLiveDuration, setShareLiveDuration] = useState<number>(60); // 60 mins default
  const [shareMode, setShareMode] = useState<'static' | 'live'>('static');

  // Handle region switch
  const handleSelectRegion = (regionId: string) => {
    const reg = REGIONAL_CENTERS.find((r) => r.id === regionId);
    if (reg) {
      setSelectedRegionId(regionId);
      setMapCenter({ lat: reg.lat, lng: reg.lng });
      setMapZoom(reg.zoom);
      setSelectedLocation(null);
    }
  };

  // Filter locations
  const filteredLocations = useMemo(() => {
    return INITIAL_MAP_LOCATIONS.filter((loc) => {
      // Search matching
      const matchesSearch =
        searchQuery === '' ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loc.doctorName && loc.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (loc.specialty && loc.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Type filter
      if (filterType === 'doctor' && loc.type !== 'doctor') return false;
      if (filterType === 'hospital' && loc.type !== 'hospital' && loc.type !== 'trauma_center') return false;

      // Specialty filter
      if (selectedSpecialty !== 'all') {
        if (!loc.specialty || !loc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())) {
          return false;
        }
      }

      // Emergency filter
      if (onlyEmergency && !loc.isEmergencyAvailable) return false;

      // Verified filter
      if (onlyVerified && loc.type === 'doctor' && loc.verificationStatus !== 'VERIFIED') return false;

      // Radius filter (from current map center)
      if (loc.distanceKm && loc.distanceKm > selectedRadiusKm && selectedRegionId === 'salem') {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    filterType,
    selectedSpecialty,
    onlyEmergency,
    onlyVerified,
    selectedRadiusKm,
    selectedRegionId,
  ]);

  // Handle sharing a location to chat
  const handleConfirmShare = (loc: MedicalLocation) => {
    if (!onShareLocationToChat) return;
    onShareLocationToChat({
      title: loc.doctorName || loc.name,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      isLive: shareMode === 'live',
      durationMinutes: shareMode === 'live' ? shareLiveDuration : undefined,
    });
    if (onClose) onClose();
  };

  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* =========================================================================
          TOP TOOLBAR: Region Selector, Search & Filters
          ========================================================================= */}
      <div className="bg-[#0B1528] border-b border-[#1E3A66] p-3 md:p-4 z-20 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#16845B]/20 border border-[#16845B]/40 flex items-center justify-center text-[#22C55E]">
                <Compass className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm md:text-base font-bold text-white">
                    Medical Knowledge Circles & Live Map
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#16845B]/20 text-[#22C55E] text-[10px] font-semibold border border-[#16845B]/40">
                    Google Maps Platform
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Real-time hospital networks, on-call doctor circles & emergency consult triage
                </p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Regional Medical Campus Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {REGIONAL_CENTERS.map((reg) => (
              <button
                key={reg.id}
                onClick={() => handleSelectRegion(reg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedRegionId === reg.id
                    ? 'bg-[#16845B] text-white shadow-md shadow-[#16845B]/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {reg.name.split(' ')[0]}
              </button>
            ))}

            {onClose && (
              <button
                onClick={onClose}
                className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 ml-2"
                title="Close Map View"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mt-3 pt-3 border-t border-white/10 text-xs">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors, hospitals, specialties..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#070D18] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#16845B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="md:col-span-3 flex items-center gap-1 bg-[#070D18] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                filterType === 'all' ? 'bg-[#16845B] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({filteredLocations.length})
            </button>
            <button
              onClick={() => setFilterType('doctor')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                filterType === 'doctor' ? 'bg-[#16845B] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Doctors
            </button>
            <button
              onClick={() => setFilterType('hospital')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                filterType === 'hospital' ? 'bg-[#16845B] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hospitals
            </button>
          </div>

          {/* Specialty Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-xl bg-[#070D18] border border-white/10 text-slate-200 focus:outline-none focus:border-[#16845B]"
            >
              <option value="all">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Neurology">Neurology</option>
              <option value="Oncology">Oncology</option>
              <option value="Trauma">Trauma & ER</option>
            </select>
          </div>

          {/* Emergency On-Call Toggle */}
          <div className="md:col-span-3 flex items-center justify-between gap-2 bg-[#070D18] px-3 py-1 rounded-xl border border-white/10">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyEmergency}
                onChange={(e) => setOnlyEmergency(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#16845B] focus:ring-0 bg-slate-800 border-slate-600"
              />
              <span className="text-[11px] font-medium text-red-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                24/7 Emergency
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#16845B] focus:ring-0 bg-slate-800 border-slate-600"
              />
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </label>
          </div>
        </div>

        {/* Chat Picker Mode Options Bar */}
        {isChatPickerMode && (
          <div className="mt-3 p-2.5 rounded-2xl bg-[#16845B]/15 border border-[#16845B]/40 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-300">Share in Chat:</span>
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => setShareMode('static')}
                  className={`px-2.5 py-1 rounded-md font-medium ${
                    shareMode === 'static' ? 'bg-[#16845B] text-white' : 'text-slate-400'
                  }`}
                >
                  Static Medical Pin
                </button>
                <button
                  onClick={() => setShareMode('live')}
                  className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 ${
                    shareMode === 'live' ? 'bg-[#16845B] text-white' : 'text-slate-400'
                  }`}
                >
                  <Radio className="w-3 h-3 animate-pulse" />
                  Live Location Circle
                </button>
              </div>
            </div>

            {shareMode === 'live' && (
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Duration:</span>
                {[15, 60, 480].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setShareLiveDuration(mins)}
                    className={`px-2 py-0.5 rounded-md ${
                      shareLiveDuration === mins
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {mins === 480 ? '8 Hours' : `${mins} Mins`}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          MAP CANVAS: Google Maps Platform with Advanced Markers & InfoWindow
          ========================================================================= */}
      <div className="flex-1 w-full h-full relative min-h-[350px]">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            defaultCenter={mapCenter}
            defaultZoom={mapZoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Camera pan/zoom sync controller */}
            <MapController center={mapCenter} zoom={mapZoom} />

            {/* Doctor & Hospital Markers */}
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              const isDoctor = loc.type === 'doctor';

              return (
                <AdvancedMarker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onClick={() => setSelectedLocation(loc)}
                  title={loc.name}
                >
                  {isDoctor ? (
                    /* Doctor Custom Pin with Avatar & Pulse */
                    <div className="relative group cursor-pointer transition-transform hover:scale-110">
                      {/* Pulse circle for on-call doctor */}
                      {loc.isEmergencyAvailable && (
                        <div className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping" />
                      )}
                      <div className="w-10 h-10 rounded-full bg-[#070D18] border-2 border-[#16845B] shadow-xl overflow-hidden p-0.5 relative z-10">
                        {loc.doctorAvatar ? (
                          <img
                            src={loc.doctorAvatar}
                            alt={loc.doctorName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#16845B] text-white flex items-center justify-center text-xs font-bold">
                            {loc.doctorName?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#16845B] border border-white rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-2 h-2 text-white" />
                        </span>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-[#070D18]/90 backdrop-blur-md rounded-md text-[10px] font-semibold text-white whitespace-nowrap shadow-lg border border-white/10 opacity-90 group-hover:opacity-100">
                        {loc.doctorName?.split(' ')[1] || loc.name}
                      </div>
                    </div>
                  ) : (
                    /* Hospital / Trauma Center Pin */
                    <div className="relative group cursor-pointer transition-transform hover:scale-110">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border-2 ${
                          loc.type === 'trauma_center'
                            ? 'bg-red-600 border-red-400 text-white animate-pulse'
                            : 'bg-[#16845B] border-emerald-300 text-white'
                        }`}
                      >
                        <Hospital className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-black/90 rounded-md text-[10px] font-bold text-white whitespace-nowrap shadow-lg border border-white/10">
                        {loc.name.split(' ')[0]}
                      </div>
                    </div>
                  )}
                </AdvancedMarker>
              );
            })}

            {/* Selected Location InfoWindow */}
            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div className="p-2 max-w-xs text-slate-900 font-sans">
                  {selectedLocation.type === 'doctor' ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={selectedLocation.doctorAvatar}
                          alt={selectedLocation.doctorName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#16845B]"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-bold text-sm text-slate-900 leading-snug">
                              {selectedLocation.doctorName}
                            </h4>
                            {selectedLocation.verificationStatus === 'VERIFIED' && (
                              <span title="Council Verified Doctor">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-[#16845B]">
                            {selectedLocation.specialty}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mb-1">
                        📍 {selectedLocation.address}, {selectedLocation.city}
                      </p>

                      {selectedLocation.isEmergencyAvailable && (
                        <div className="mb-2.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200 flex items-center gap-1">
                          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                          On-Call Emergency Consult Available
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-1.5 mt-2">
                        {onOpenChatWithDoctor && (
                          <button
                            onClick={() => {
                              onOpenChatWithDoctor(
                                selectedLocation.doctorId || 'doc-chat',
                                selectedLocation.doctorName || 'Doctor'
                              );
                              setSelectedLocation(null);
                            }}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#16845B] hover:bg-[#126b49] text-white text-xs font-medium"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Message
                          </button>
                        )}

                        {onCallDoctor && (
                          <button
                            onClick={() => {
                              onCallDoctor({
                                id: selectedLocation.doctorId || 'doc-call',
                                fullName: selectedLocation.doctorName || 'Doctor',
                                specialty: selectedLocation.specialty || 'Specialist',
                                avatarUrl: selectedLocation.doctorAvatar || '',
                              });
                              setSelectedLocation(null);
                            }}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium"
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-slate-200 text-xs">
                        {isChatPickerMode ? (
                          <button
                            onClick={() => handleConfirmShare(selectedLocation)}
                            className="w-full py-1.5 rounded-lg bg-[#16845B] text-white font-bold text-xs flex items-center justify-center gap-1"
                          >
                            <Share2 className="w-3 h-3" />
                            Share Doctor Location in Chat
                          </button>
                        ) : (
                          <>
                            <a
                              href={getDirectionsUrl(selectedLocation.lat, selectedLocation.lng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#16845B] hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <Navigation className="w-3 h-3" /> Directions
                            </a>
                            {onSelectDoctor && (
                              <button
                                onClick={() => {
                                  onSelectDoctor(selectedLocation.doctorId || '');
                                  setSelectedLocation(null);
                                }}
                                className="text-slate-600 hover:text-slate-900 text-[11px] font-medium"
                              >
                                View Profile →
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Hospital InfoWindow */
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                            selectedLocation.type === 'trauma_center' ? 'bg-red-600' : 'bg-[#16845B]'
                          }`}
                        >
                          <Hospital className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-snug">
                            {selectedLocation.name}
                          </h4>
                          <span className="text-[11px] font-medium text-slate-600">
                            {selectedLocation.city}, {selectedLocation.state}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mb-1">{selectedLocation.address}</p>

                      <div className="my-1.5 p-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-medium">
                        🚨 {selectedLocation.traumaLevel || '24/7 Emergency Care Center'}
                      </div>

                      {selectedLocation.phone && (
                        <p className="text-[11px] text-slate-700 font-semibold mb-2">
                          Emergency Triage: {selectedLocation.phone}
                        </p>
                      )}

                      {isChatPickerMode ? (
                        <button
                          onClick={() => handleConfirmShare(selectedLocation)}
                          className="w-full py-1.5 rounded-lg bg-[#16845B] text-white font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <Share2 className="w-3 h-3" />
                          Share Hospital Location in Chat
                        </button>
                      ) : (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                          <a
                            href={getDirectionsUrl(selectedLocation.lat, selectedLocation.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#16845B] hover:underline flex items-center gap-1 text-xs font-semibold"
                          >
                            <Navigation className="w-3.5 h-3.5" /> Navigate to ER
                          </a>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {selectedLocation.bedsCount} Beds
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Floating Bottom Quick Location Bar */}
      <div className="bg-[#0B1528] border-t border-[#1E3A66] px-4 py-2 text-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>
            {filteredLocations.length} Verified Facilities & Doctors Active in {selectedRegionId.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectRegion('salem')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" /> Reset to VMMC Campus
          </button>
        </div>
      </div>
    </div>
  );
};
