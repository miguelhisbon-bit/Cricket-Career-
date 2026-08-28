import React, { useState } from 'react';
import { Mic, CheckCircle, MessageSquare, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PressQuestion, PlayerProfile } from '../types/cricket';
import { cricketAudio } from '../utils/audio';

interface PressConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: PressQuestion[];
  player: PlayerProfile;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  lang: 'en' | 'bn';
}

export const PressConferenceModal: React.FC<PressConferenceModalProps> = ({
  isOpen,
  onClose,
  questions,
  player,
  onUpdatePlayer,
  lang,
}) => {
  if (!isOpen || questions.length === 0) return null;

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const activeQuestion = questions[currentQIndex];

  const handleSelectAnswer = (ansIdx: number) => {
    cricketAudio.playUiClick();
    const answer = activeQuestion.answers[ansIdx];

    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: ansIdx }));

    // Apply impact
    const updated: PlayerProfile = {
      ...player,
      coachTrust: Math.min(100, Math.max(0, player.coachTrust + answer.coachImpact)),
      fame: player.fame + answer.fanImpact,
      morale: Math.min(100, Math.max(0, player.morale + answer.moraleImpact)),
    };
    onUpdatePlayer(updated);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      cricketAudio.playFanfare();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setIsFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-auto text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-300">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-teko tracking-wide uppercase text-white">
                {lang === 'bn' ? 'ম্যাচোত্তর অফিসিয়াল প্রেস কনফারেন্স' : 'Official Post-Match Press Conference'}
              </h2>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Media Center • Live Broadcast
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {currentQIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {!isFinished && activeQuestion ? (
            <div className="space-y-3">
              {/* Journalist Badge */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-bold text-slate-200">{activeQuestion.journalist}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{activeQuestion.mediaOutlet}</span>
              </div>

              {/* Question bubble */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-200 text-sm font-medium italic leading-relaxed">
                "{lang === 'bn' ? activeQuestion.questionBn : activeQuestion.question}"
              </div>

              {/* Answer Choices */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === 'bn' ? 'আপনার প্রতিক্রিয়া প্রদান করুন:' : 'Select Your Statement to the Press:'}
                </span>

                {activeQuestion.answers.map((ans, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className="w-full p-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-amber-400 text-left text-xs sm:text-sm text-slate-200 transition-all flex flex-col gap-1 active:scale-[0.99]"
                  >
                    <span className="font-semibold">{lang === 'bn' ? ans.textBn : ans.text}</span>
                    <div className="flex gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span className="text-amber-400 uppercase font-bold">[{ans.tone}]</span>
                      <span className="text-emerald-400">+{ans.fanImpact} Fans</span>
                      <span className="text-sky-400">Coach Trust: {ans.coachImpact > 0 ? `+${ans.coachImpact}` : ans.coachImpact}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Press Conference Complete */
            <div className="py-6 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold font-teko uppercase text-white">
                {lang === 'bn' ? 'মিডিয়া সাক্ষাৎকার সফলভাবে সম্পন্ন!' : 'Press Conference Concluded!'}
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                {lang === 'bn'
                  ? 'আপনার বক্তব্যের কারণে সোশ্যাল মিডিয়ায় ভক্ত সংখ্যা ও সুনাম বৃদ্ধি পেয়েছে।'
                  : 'Your statements have created waves in the cricket world. Fan engagement boosted!'}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg active:scale-95"
              >
                {lang === 'bn' ? 'হোমে ফিরে যান' : 'Return to Hub'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
