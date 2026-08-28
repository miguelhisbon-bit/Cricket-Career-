import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Sparkles, Activity } from 'lucide-react';
import { DRSReviewData } from '../types/cricket';
import { cricketAudio } from '../utils/audio';

interface DRSReviewModalProps {
  drsData: DRSReviewData;
  onCompleteReview: (finalDecision: 'OUT' | 'NOT_OUT') => void;
  lang: 'en' | 'bn';
}

export const DRSReviewModal: React.FC<DRSReviewModalProps> = ({
  drsData,
  onCompleteReview,
  lang,
}) => {
  const [step, setStep] = useState<'FRONT_FOOT' | 'SNICKO' | 'BALL_TRACKING' | 'DECISION'>('FRONT_FOOT');
  const [waveformOffset, setWaveformOffset] = useState<number>(0);

  useEffect(() => {
    // Sound effect on review initiation
    cricketAudio.playAppealSound();

    const t1 = setTimeout(() => {
      setStep('SNICKO');
    }, 1500);

    const t2 = setTimeout(() => {
      setStep('BALL_TRACKING');
    }, 3200);

    const t3 = setTimeout(() => {
      setStep('DECISION');
      if (drsData.finalDecision === 'OUT') {
        cricketAudio.playWicketSound();
      }
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [drsData]);

  // Snicko Waveform animation
  useEffect(() => {
    if (step !== 'SNICKO') return;
    const interval = setInterval(() => {
      setWaveformOffset((prev) => (prev + 1) % 20);
    }, 50);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b0f19] border-2 border-cyan-500/50 rounded-3xl p-6 max-w-md w-full text-white shadow-[0_0_50px_rgba(6,182,212,0.4)] relative overflow-hidden">
        {/* Broadcast Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-mono font-black uppercase tracking-[0.25em] text-cyan-400">
              📺 ULTRA-EDGE DRS REVIEW
            </span>
          </div>
          <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/40">
            {drsData.ballSpeedKmh} KM/H
          </span>
        </div>

        {/* Phase 1: No-Ball Front Foot Check */}
        {step === 'FRONT_FOOT' && (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="text-4xl">👟</div>
            <div className="font-mono text-sm font-bold text-gray-300">
              CHECKING FRONT FOOT NO-BALL...
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>FAIR DELIVERY (BEHIND POPPING CREASE)</span>
            </div>
          </div>
        )}

        {/* Phase 2: UltraEdge Snickometer Audio Waveform */}
        {step === 'SNICKO' && (
          <div className="py-4 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
              <span className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>ULTRAEDGE RTS / SNICKO</span>
              </span>
              <span className="text-[10px] text-gray-400">FRAME 42 / 60 FPS</span>
            </div>

            {/* Oscilloscope Waveform Canvas */}
            <div className="h-28 bg-black/80 rounded-2xl border border-cyan-500/30 p-3 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:12px_12px]" />
              
              {/* Waveform Bars */}
              <div className="flex items-center justify-center gap-1 z-10 w-full">
                {Array.from({ length: 28 }).map((_, i) => {
                  const isMiddle = i >= 12 && i <= 15;
                  const spikeHeight = drsData.snickoSpike && isMiddle ? (i === 13 || i === 14 ? 70 : 45) : (Math.sin(i + waveformOffset) * 6 + 10);
                  const isSpike = drsData.snickoSpike && isMiddle;

                  return (
                    <div
                      key={i}
                      style={{ height: `${spikeHeight}px` }}
                      className={`w-1.5 rounded-full transition-all duration-75 ${
                        isSpike 
                          ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse' 
                          : 'bg-cyan-400/60'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Edge Contact Tag */}
              <div className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-400/80">
                {drsData.snickoSpike ? '⚡ SPIKE DETECTED (BAT CONTACT)' : 'FLATLINE (NO BAT)'}
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Hawkeye Ball Tracking */}
        {step === 'BALL_TRACKING' && (
          <div className="py-3 space-y-3 animate-fadeIn">
            <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>HAWKEYE 3D TRAJECTORY PREDICTOR</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-black/60 p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-gray-400 block uppercase">PITCHING</span>
                <span className={`text-xs font-bold ${drsData.pitching === 'IN_LINE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {drsData.pitching}
                </span>
              </div>
              <div className="bg-black/60 p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-gray-400 block uppercase">IMPACT</span>
                <span className={`text-xs font-bold ${drsData.impact === 'IN_LINE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {drsData.impact}
                </span>
              </div>
              <div className="bg-black/60 p-2 rounded-xl border border-white/10">
                <span className="text-[9px] text-gray-400 block uppercase">WICKETS</span>
                <span className={`text-xs font-bold ${drsData.wickets === 'HITTING' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {drsData.wickets}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Phase 4: Final 3rd Umpire Decision */}
        {step === 'DECISION' && (
          <div className="py-5 text-center space-y-4 animate-scaleUp">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
              3RD UMPIRE OFFICIAL VERDICT
            </div>

            <div
              className={`py-4 px-6 rounded-2xl border-2 text-3xl font-black font-teko uppercase tracking-[0.2em] shadow-2xl transition-all ${
                drsData.finalDecision === 'OUT'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                  : 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
              }`}
            >
              {drsData.finalDecision === 'OUT' ? '🔴 OUT' : '🟢 NOT OUT'}
            </div>

            <button
              onClick={() => onCompleteReview(drsData.finalDecision)}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-all"
            >
              {lang === 'bn' ? 'ম্যাচ চালিয়ে যান' : 'CONTINUE MATCH'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
