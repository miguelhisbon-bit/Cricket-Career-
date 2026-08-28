import React, { useState } from 'react';
import { MessageSquareQuote, Shield, Sparkles, ChevronRight, User, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile, StoryEvent, StoryChoice } from '../types/cricket';
import { STORY_EVENTS } from '../utils/storylines';
import { cricketAudio } from '../utils/audio';

interface LockerRoomEventsProps {
  player: PlayerProfile;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  lang: 'en' | 'bn';
}

export const LockerRoomEvents: React.FC<LockerRoomEventsProps> = ({
  player,
  onUpdatePlayer,
  lang,
}) => {
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [resolvedChoices, setResolvedChoices] = useState<Record<string, StoryChoice>>({});

  const activeEvent = STORY_EVENTS[currentEventIndex] || STORY_EVENTS[0];
  const chosenOption = resolvedChoices[activeEvent.id];

  const handleSelectChoice = (choice: StoryChoice) => {
    if (chosenOption) return;

    cricketAudio.playFanfare();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });

    setResolvedChoices((prev) => ({
      ...prev,
      [activeEvent.id]: choice,
    }));

    // Apply impact
    const updated: PlayerProfile = {
      ...player,
      cash: player.cash + (choice.impact.cash || 0),
      fame: player.fame + (choice.impact.fame || 0),
      energy: Math.min(100, Math.max(0, player.energy + (choice.impact.energy || 0))),
      morale: Math.min(100, Math.max(0, player.morale + (choice.impact.morale || 0))),
      form: Math.min(100, Math.max(0, player.form + (choice.impact.form || 0))),
      coachTrust: Math.min(100, Math.max(0, player.coachTrust + (choice.impact.coachTrust || 0))),
    };

    onUpdatePlayer(updated);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(245,158,11,0.15)] text-white relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquareQuote className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-bold font-teko uppercase tracking-wider">
            {lang === 'bn' ? 'ড্রেসিংরুম গল্প ও খেলোয়াড়ি সিদ্ধান্ত' : 'LOCKER ROOM ENCOUNTERS & STORYLINE DILEMMAS'}
          </h1>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          {lang === 'bn'
            ? 'অধিনায়ক, সিনিয়র তারকা ও স্পন্সরদের সাথে আপনার কথোপকথন আপনার ক্যারিয়ারের ভাগ্য গড়ে তুলবে।'
            : 'Make impactful decisions in the locker room, facing seniors, agents, and opposition mind games.'}
        </p>
      </div>

      {/* Storyline Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STORY_EVENTS.map((event, idx) => (
          <button
            key={event.id}
            onClick={() => {
              cricketAudio.playUiClick();
              setCurrentEventIndex(idx);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              currentEventIndex === idx
                ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
            }`}
          >
            <span>{resolvedChoices[event.id] ? '✅' : '💬'}</span>
            <span>{lang === 'bn' ? event.titleBn : event.title}</span>
          </button>
        ))}
      </div>

      {/* Active Story Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Speaker Badge */}
        {activeEvent.speaker && (
          <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300 text-lg font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              👤
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white leading-tight">{activeEvent.speaker}</h2>
              <span className="text-[9px] text-amber-400 uppercase font-bold tracking-[0.2em]">
                {activeEvent.speakerRole || 'Team Member'}
              </span>
            </div>
          </div>
        )}

        {/* Narrative Description */}
        <div className="bg-black/50 rounded-xl p-4 border border-white/5 text-gray-200 text-xs sm:text-sm leading-relaxed italic">
          "{lang === 'bn' ? activeEvent.descriptionBn : activeEvent.description}"
        </div>

        {/* Branching Choices */}
        <div className="space-y-2.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400 block">
            {lang === 'bn' ? 'আপনার সিদ্ধান্ত বেছে নিন:' : 'CHOOSE YOUR RESPONSE & ACTION:'}
          </span>

          {activeEvent.choices.map((choice) => {
            const isChosen = chosenOption?.id === choice.id;
            return (
              <button
                key={choice.id}
                id={`btn-story-choice-${choice.id}`}
                onClick={() => handleSelectChoice(choice)}
                disabled={!!chosenOption}
                className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex flex-col gap-1.5 ${
                  isChosen
                    ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold'
                    : chosenOption
                    ? 'bg-black/20 border-white/5 text-gray-600 opacity-50 cursor-not-allowed'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-gray-200 hover:border-amber-400/60 active:scale-[0.99]'
                }`}
              >
                <div className="font-semibold flex items-center justify-between">
                  <span>{lang === 'bn' ? choice.textBn : choice.text}</span>
                  {isChosen && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                      Selected
                    </span>
                  )}
                </div>

                {/* Impact previews */}
                <div className="flex flex-wrap gap-1.5 text-[9px] font-mono font-bold">
                  {Object.entries(choice.impact).map(([stat, val]) => (
                    <span
                      key={stat}
                      className={`px-1.5 py-0.5 rounded border ${
                        val > 0
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      {val > 0 ? `+${val}` : val} {stat}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Outcome result reveal if chosen */}
        {chosenOption && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 p-3.5 rounded-xl text-emerald-200 text-xs sm:text-sm animate-pulse">
            <span className="font-bold block mb-1 uppercase tracking-wider text-xs text-emerald-400">
              🎉 {lang === 'bn' ? 'ফলাফল:' : 'Consequence:'}
            </span>
            {lang === 'bn' ? chosenOption.outcomeTextBn : chosenOption.outcomeText}
          </div>
        )}
      </div>
    </div>
  );
};
