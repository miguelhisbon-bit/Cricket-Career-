import React, { useState } from 'react';
import { Shield, Sparkles, Check, ChevronRight } from 'lucide-react';
import { PlayerProfile, PlayerRole, BattingStyle, BowlingStyle } from '../types/cricket';
import { COUNTRIES } from '../utils/defaultData';
import { cricketAudio } from '../utils/audio';

interface PlayerCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlayer: (player: PlayerProfile) => void;
  currentPlayer: PlayerProfile;
  lang: 'en' | 'bn';
}

export const PlayerCreationModal: React.FC<PlayerCreationModalProps> = ({
  isOpen,
  onClose,
  onSavePlayer,
  currentPlayer,
  lang,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentPlayer.name);
  const [nickname, setNickname] = useState(currentPlayer.nickname);
  const [selectedCountry, setSelectedCountry] = useState(currentPlayer.country);
  const [role, setRole] = useState<PlayerRole>(currentPlayer.role);
  const [battingStyle, setBattingStyle] = useState<BattingStyle>(currentPlayer.battingStyle);
  const [bowlingStyle, setBowlingStyle] = useState<BowlingStyle>(currentPlayer.bowlingStyle);
  const [jerseyNumber, setJerseyNumber] = useState(currentPlayer.jerseyNumber);

  // Free starter attribute points allocator
  const [pointsRemaining, setPointsRemaining] = useState(15);
  const [allocated, setAllocated] = useState({
    timing: 0,
    power: 0,
    shotPlacement: 0,
    accuracy: 0,
    clutch: 0,
    runningSpeed: 0,
  });

  const handleAdjustPoint = (attr: keyof typeof allocated, delta: number) => {
    if (delta > 0 && pointsRemaining <= 0) return;
    if (delta < 0 && allocated[attr] <= 0) return;

    cricketAudio.playUiClick();
    setAllocated((prev) => ({
      ...prev,
      [attr]: prev[attr] + delta,
    }));
    setPointsRemaining((prev) => prev - delta);
  };

  const handleSave = () => {
    cricketAudio.playFanfare();
    const countryObj = COUNTRIES.find((c) => c.name === selectedCountry) || COUNTRIES[0];

    const updated: PlayerProfile = {
      ...currentPlayer,
      name: name.trim() || 'Tiger Prodigy',
      nickname: nickname.trim() || 'The Smasher',
      country: countryObj.name,
      countryCode: countryObj.code,
      flag: countryObj.flag,
      nationalTeam: countryObj.name,
      role,
      battingStyle,
      bowlingStyle,
      jerseyNumber: Number(jerseyNumber) || 7,
      attributes: {
        ...currentPlayer.attributes,
        timing: currentPlayer.attributes.timing + allocated.timing,
        power: currentPlayer.attributes.power + allocated.power,
        shotPlacement: currentPlayer.attributes.shotPlacement + allocated.shotPlacement,
        accuracy: currentPlayer.attributes.accuracy + allocated.accuracy,
        clutch: currentPlayer.attributes.clutch + allocated.clutch,
        runningSpeed: currentPlayer.attributes.runningSpeed + allocated.runningSpeed,
      },
    };

    onSavePlayer(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-auto text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 p-4 border-b border-amber-500/40">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-300" />
            <h2 className="text-xl font-bold font-teko tracking-wide uppercase text-white">
              {lang === 'bn' ? 'খেলোয়াড় প্রোফাইল তৈরি / এডিট' : 'Create & Customize Player Persona'}
            </h2>
          </div>
          <p className="text-xs text-amber-100 mt-1">
            {lang === 'bn' 
              ? 'আপনার ক্রিকেট ক্যারিয়ারের ভবিষ্যৎ কিংবদন্তি সাজিয়ে নিন।'
              : 'Sculpt your cricket superstar and allocate starting skill attributes.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Name & Nickname */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                {lang === 'bn' ? 'পূর্ণ নাম' : 'Player Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. Shakib Al Hasan"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                {lang === 'bn' ? 'ডাকনাম / উপাধি' : 'Nickname / Alias'}
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                placeholder="e.g. Master Blaster"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1.5">
              {lang === 'bn' ? 'জাতীয়তা / দেশ' : 'Select Country'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COUNTRIES.map((c) => {
                const isSelected = selectedCountry === c.name;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      cricketAudio.playUiClick();
                      setSelectedCountry(c.name);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <span className="truncate">{lang === 'bn' ? c.nameBn : c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role & Styles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                {lang === 'bn' ? 'খেলোয়াড়ের ভূমিকা' : 'Playing Role'}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as PlayerRole)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="BATSMAN">Top-Order Batsman</option>
                <option value="ALL_ROUNDER">Dynamic All-Rounder</option>
                <option value="BOWLER">Strike Pace/Spin Bowler</option>
                <option value="WICKET_KEEPER_BATSMAN">Wicket-Keeper Batsman</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                {lang === 'bn' ? 'জার্সি নম্বর' : 'Jersey Number'}
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                {lang === 'bn' ? 'ব্যাটিং স্টাইল' : 'Batting Style'}
              </label>
              <select
                value={battingStyle}
                onChange={(e) => setBattingStyle(e.target.value as BattingStyle)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="RIGHT_HAND">Right-Hand Bat (RHB)</option>
                <option value="LEFT_HAND">Left-Hand Bat (LHB)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                {lang === 'bn' ? 'বোলিং স্টাইল' : 'Bowling Style'}
              </label>
              <select
                value={bowlingStyle}
                onChange={(e) => setBowlingStyle(e.target.value as BowlingStyle)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="RIGHT_ARM_FAST">Right-Arm Express Fast</option>
                <option value="LEFT_ARM_FAST">Left-Arm Seam Fast</option>
                <option value="RIGHT_ARM_MEDIUM">Right-Arm Medium</option>
                <option value="OFF_SPIN">Right-Arm Off Spin</option>
                <option value="LEG_SPIN">Leg-Spin / Googly</option>
                <option value="LEFT_ARM_ORTHODOX">Left-Arm Orthodox Spin</option>
              </select>
            </div>
          </div>

          {/* Attribute Points Allocator */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'bn' ? 'স্টার্টিং স্কিল পয়েন্ট' : 'Skill Allocation Points'}
              </span>
              <span className="bg-amber-500/20 text-amber-300 font-mono font-bold text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
                {pointsRemaining} {lang === 'bn' ? 'পয়েন্ট বাকি' : 'PTS LEFT'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {(
                [
                  ['timing', 'Timing & Sweetspot', 'টাইমিং'],
                  ['power', 'Six-Hitting Power', 'পাওয়ার'],
                  ['shotPlacement', 'Gap Placement', 'গ্যাপ প্লেসমেন্ট'],
                  ['accuracy', 'Bowling Line/Length', 'বোলিং একুরেসি'],
                  ['clutch', 'Clutch / Pressure', 'চাপ নেওয়ার ক্ষমতা'],
                  ['runningSpeed', 'Running Speed', 'রানিং গতি'],
                ] as const
              ).map(([key, labelEn, labelBn]) => (
                <div key={key} className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-300 truncate pr-1">
                    {lang === 'bn' ? labelBn : labelEn} (+{allocated[key]})
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleAdjustPoint(key, -1)}
                      disabled={allocated[key] <= 0}
                      className="w-5 h-5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs font-bold text-slate-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustPoint(key, 1)}
                      disabled={pointsRemaining <= 0}
                      className="w-5 h-5 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 rounded text-xs font-bold text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
          >
            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            id="btn-save-player-profile"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Confirm & Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
