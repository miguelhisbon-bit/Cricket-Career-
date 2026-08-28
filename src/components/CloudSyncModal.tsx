import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Download, 
  Upload, 
  Save, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  HardDrive,
  Key,
  Calendar,
  DollarSign,
  Award
} from 'lucide-react';
import { PlayerProfile, TournamentState } from '../types/cricket';
import { 
  getSaveSlots, 
  saveToSlot, 
  loadFromSlot, 
  deleteSlot, 
  exportSaveToJSON, 
  parseSaveFileJSON, 
  loadFromCloudByCode,
  SaveSlotData 
} from '../utils/cloudSync';
import { cricketAudio } from '../utils/audio';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayer: PlayerProfile;
  currentTournament?: TournamentState;
  onRestoreSave: (player: PlayerProfile, tournament?: TournamentState) => void;
  lang?: 'en' | 'bn';
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  currentPlayer,
  currentTournament,
  onRestoreSave,
  lang = 'en',
}) => {
  const [slots, setSlots] = useState<SaveSlotData[]>([]);
  const [syncCodeInput, setSyncCodeInput] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'SLOTS' | 'CLOUD_CODE' | 'FILE_BACKUP'>('SLOTS');

  useEffect(() => {
    if (isOpen) {
      setSlots(getSaveSlots());
      setFeedbackMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveToSlot = (slotNum: number) => {
    cricketAudio.playSuccess();
    const updated = saveToSlot(
      slotNum,
      `${currentPlayer.name} - ${currentPlayer.tier.replace('_', ' ')}`,
      currentPlayer,
      currentTournament
    );
    setSlots(updated);
    setFeedbackMsg({
      text: lang === 'bn' ? `স্লট ${slotNum}-এ সফলভাবে সেভ করা হয়েছে!` : `Saved successfully to Slot ${slotNum}!`,
      type: 'success',
    });
  };

  const handleLoadFromSlot = (slotNum: number) => {
    const loaded = loadFromSlot(slotNum);
    if (loaded) {
      cricketAudio.playSuccess();
      onRestoreSave(loaded.player, loaded.tournament);
      setFeedbackMsg({
        text: lang === 'bn' ? `স্লট ${slotNum} থেকে ক্যারিয়ার লোড করা হয়েছে!` : `Career loaded from Slot ${slotNum}!`,
        type: 'success',
      });
      setTimeout(() => onClose(), 800);
    }
  };

  const handleDeleteSlot = (slotNum: number) => {
    cricketAudio.playUiClick();
    const updated = deleteSlot(slotNum);
    setSlots(updated);
    setFeedbackMsg({
      text: lang === 'bn' ? `স্লট ${slotNum} ডিলিট করা হয়েছে!` : `Slot ${slotNum} deleted.`,
      type: 'success',
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  const handleRestoreFromCode = () => {
    if (!syncCodeInput.trim()) return;
    const found = loadFromCloudByCode(syncCodeInput.trim());
    if (found) {
      cricketAudio.playSuccess();
      onRestoreSave(found.player, found.tournament);
      setFeedbackMsg({
        text: lang === 'bn' ? 'ক্লাউড কোড থেকে সফলভাবে লোড হয়েছে!' : 'Restored successfully from Cloud Sync code!',
        type: 'success',
      });
      setTimeout(() => onClose(), 800);
    } else {
      setFeedbackMsg({
        text: lang === 'bn' ? 'ক্লাউড কোডটি পাওয়া যায়নি। সঠিক কোড দিন।' : 'Invalid or expired Cloud Code. Please check the code.',
        type: 'error',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const parsed = parseSaveFileJSON(content);
      if (parsed) {
        cricketAudio.playSuccess();
        onRestoreSave(parsed.player, parsed.tournament);
        setFeedbackMsg({
          text: lang === 'bn' ? 'ফাইল থেকে ক্যারিয়ার সফলভাবে লোড হয়েছে!' : 'Save file restored successfully!',
          type: 'success',
        });
        setTimeout(() => onClose(), 800);
      } else {
        setFeedbackMsg({
          text: lang === 'bn' ? 'ফাইলটি সঠিক ক্রিকেট সেভ ফাইল নয়।' : 'Invalid save file format.',
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md pointer-events-auto animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full bg-slate-950 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-cyan-400 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Cloud className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-teko uppercase tracking-wider">
                {lang === 'bn' ? 'ক্লাউড সিঙ্ক ও সেভ ম্যানেজার' : 'Cloud Sync & Save Manager'}
              </h2>
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Persistent Cross-Device Backup
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 my-3 p-1 bg-white/5 rounded-2xl border border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('SLOTS')}
            className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'SLOTS'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সেভ স্লটস' : 'Save Slots'}</span>
          </button>
          <button
            onClick={() => setActiveTab('CLOUD_CODE')}
            className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'CLOUD_CODE'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ক্লাউড কোড' : 'Cloud Code'}</span>
          </button>
          <button
            onClick={() => setActiveTab('FILE_BACKUP')}
            className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'FILE_BACKUP'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ফাইল ব্যাকআপ' : 'JSON Backup'}</span>
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className={`mb-3 p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 shrink-0 ${
            feedbackMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            <span>{feedbackMsg.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3">
          {/* TAB 1: LOCAL SAVE SLOTS */}
          {activeTab === 'SLOTS' && (
            <div className="space-y-2.5">
              {[1, 2, 3].map((slotNum) => {
                const slot = slots.find(s => s.slotNumber === slotNum);
                return (
                  <div 
                    key={slotNum}
                    className={`p-3 rounded-2xl border transition-all ${
                      slot 
                        ? 'bg-white/[0.04] border-amber-500/30 hover:border-amber-500/50' 
                        : 'bg-white/[0.01] border-white/5 border-dashed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                          #{slotNum}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {slot ? slot.player.name : (lang === 'bn' ? 'ফাঁকা স্লট' : 'Empty Slot')}
                        </span>
                        {slot && (
                          <span className="text-xs">{slot.player.flag}</span>
                        )}
                      </div>

                      {slot && (
                        <span className="text-[9px] font-mono text-gray-400">
                          {new Date(slot.timestamp).toLocaleDateString()} {new Date(slot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    {slot ? (
                      <div className="mb-2.5 flex items-center justify-between text-[10px] font-mono text-gray-300 bg-black/40 p-2 rounded-xl border border-white/5">
                        <span className="flex items-center gap-1 text-amber-300 font-bold">
                          <Award className="w-3 h-3" />
                          {slot.player.tier.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <DollarSign className="w-3 h-3" />
                          ${slot.player.cash.toLocaleString()}
                        </span>
                        <span className="text-cyan-300">
                          {slot.player.stats.runs} Runs • {slot.player.stats.wickets} Wkts
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-500 italic mb-2.5">
                        {lang === 'bn' ? 'আপনার বর্তমান ক্যারিয়ার এখানে সেভ করতে পারেন।' : 'No saved career in this slot. Tap save to store current progress.'}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveToSlot(slotNum)}
                        className="flex-1 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[10px] uppercase rounded-xl border border-amber-500/40 transition-all flex items-center justify-center gap-1 active:scale-95"
                      >
                        <Save className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'এখানে সেভ করুন' : 'Save Current'}</span>
                      </button>

                      {slot && (
                        <>
                          <button
                            onClick={() => handleLoadFromSlot(slotNum)}
                            className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-[10px] uppercase rounded-xl border border-emerald-500/40 transition-all flex items-center justify-center gap-1 active:scale-95"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{lang === 'bn' ? 'লোড করুন' : 'Load Slot'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteSlot(slotNum)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 rounded-xl border border-rose-500/20 transition-all"
                            title="Delete Slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: CLOUD CODE RESTORE & GENERATION */}
          {activeTab === 'CLOUD_CODE' && (
            <div className="space-y-3">
              <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] font-bold text-amber-300 uppercase block mb-1">
                  {lang === 'bn' ? 'বর্তমান ক্যারিয়ারের ক্লাউড কোড' : 'Your Live Cloud Sync Code'}
                </span>
                <p className="text-[11px] text-gray-400 mb-3">
                  {lang === 'bn'
                    ? 'এই কোডটি কপি করে অন্য যেকোনো ব্রাউজারে বা ডিভাইসে আপনার ক্যারিয়ার ইনস্ট্যান্ট রিস্টোর করতে পারেন।'
                    : 'Copy this unique sync code to instantly restore this career on any phone, tablet, or browser.'}
                </p>

                <div className="flex items-center gap-2 bg-black/60 p-2 rounded-xl border border-amber-500/30">
                  <span className="font-mono text-xs font-black text-amber-400 tracking-wider flex-1 truncate">
                    {slots[0]?.syncCode || `CRIC-CLOUD-LIVE-${currentPlayer.countryCode}-${currentPlayer.jerseyNumber}`}
                  </span>
                  <button
                    onClick={() => handleCopyCode(slots[0]?.syncCode || `CRIC-CLOUD-LIVE-${currentPlayer.countryCode}-${currentPlayer.jerseyNumber}`)}
                    className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-lg active:scale-95 transition-all flex items-center gap-1"
                  >
                    {copySuccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copySuccess ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] font-bold text-cyan-300 uppercase block mb-1">
                  {lang === 'bn' ? 'কোড দিয়ে ক্যারিয়ার লোড করুন' : 'Restore Career from Cloud Code'}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={syncCodeInput}
                    onChange={(e) => setSyncCodeInput(e.target.value)}
                    placeholder="e.g. CRIC-CLOUD-8849-BD"
                    className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 uppercase"
                  />
                  <button
                    onClick={handleRestoreFromCode}
                    className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black text-xs uppercase rounded-xl active:scale-95 transition-all shadow-md"
                  >
                    {lang === 'bn' ? 'লোড' : 'RESTORE'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JSON FILE EXPORT / IMPORT */}
          {activeTab === 'FILE_BACKUP' && (
            <div className="space-y-3">
              <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/10 text-center">
                <Download className="w-8 h-8 text-amber-400 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  {lang === 'bn' ? 'সম্পূর্ণ ক্যারিয়ার ফাইল ডাউনলোড করুন' : 'Export Full Career File (.json)'}
                </h4>
                <p className="text-[11px] text-gray-400 mb-3 max-w-xs mx-auto">
                  {lang === 'bn'
                    ? 'আপনার প্লেয়ার স্ট্যাটস, গিয়ার, ক্যাশ এবং টুর্নামেন্ট ডাটা একটি ব্যাকআপ ফাইল হিসেবে ডাউনলোড করুন।'
                    : 'Download an offline backup file of all player attributes, gear, coins, and tournament trophies.'}
                </p>
                <button
                  onClick={() => exportSaveToJSON(currentPlayer, currentTournament)}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ফাইল ডাউনলোড করুন' : 'DOWNLOAD SAVE FILE'}</span>
                </button>
              </div>

              <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/10 text-center">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  {lang === 'bn' ? 'সেভ ফাইল আপলোড করে লোড করুন' : 'Import Save File (.json)'}
                </h4>
                <p className="text-[11px] text-gray-400 mb-3 max-w-xs mx-auto">
                  {lang === 'bn'
                    ? 'পূর্বে ডাউনলোড করা .json ব্যাকআপ ফাইলটি সিলেক্ট করে লোড করুন।'
                    : 'Select a previously exported .json file to restore your entire career.'}
                </p>
                <label className="px-5 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-cyan-500/40 cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ফাইল সিলেক্ট করুন' : 'CHOOSE SAVE FILE'}</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center shrink-0">
          <span className="text-[9.5px] font-mono text-gray-400">
            Auto-saves occur after every match, training session, and shop purchase.
          </span>
        </div>
      </div>
    </div>
  );
};
