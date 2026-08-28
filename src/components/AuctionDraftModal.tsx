import React, { useState, useEffect } from 'react';
import { Gavel, CheckCircle, Trophy, Sparkles, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile } from '../types/cricket';
import { cricketAudio } from '../utils/audio';

interface AuctionDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onCompleteAuction: (updatedPlayer: PlayerProfile, teamName: string, finalPrice: number) => void;
  lang: 'en' | 'bn';
}

const AUCTION_TEAMS = [
  { name: 'Dhaka Dynamites', city: 'Dhaka', color: 'text-amber-400' },
  { name: 'Chattogram Challengers', city: 'Chittagong', color: 'text-sky-400' },
  { name: 'Comilla Victorians', city: 'Comilla', color: 'text-rose-400' },
  { name: 'Fortune Barishal', city: 'Barishal', color: 'text-emerald-400' },
  { name: 'Sylhet Strikers', city: 'Sylhet', color: 'text-purple-400' },
];

export const AuctionDraftModal: React.FC<AuctionDraftModalProps> = ({
  isOpen,
  onClose,
  player,
  onCompleteAuction,
  lang,
}) => {
  if (!isOpen) return null;

  const [currentBid, setCurrentBid] = useState<number>(5000);
  const [leadingTeam, setLeadingTeam] = useState<string>('Dhaka Dynamites');
  const [isBidding, setIsBidding] = useState<boolean>(true);
  const [isSold, setIsSold] = useState<boolean>(false);
  const [bidHistory, setBidHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    let bidsCount = 0;
    const basePrice = 5000 + Math.floor(player.fame * 0.5) + (player.attributes.timing + player.attributes.power) * 50;
    let bid = basePrice;

    setBidHistory([`Auctioneer: "Starting bid for ${player.name} at $${basePrice.toLocaleString()}!"`]);

    const interval = setInterval(() => {
      if (bidsCount >= 6) {
        clearInterval(interval);
        setIsBidding(false);
        setIsSold(true);
        cricketAudio.playFanfare();
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
        return;
      }

      bidsCount++;
      const team = AUCTION_TEAMS[Math.floor(Math.random() * AUCTION_TEAMS.length)];
      const raise = Math.floor(Math.random() * 4000 + 2000);
      bid += raise;

      cricketAudio.playUiClick();
      setCurrentBid(bid);
      setLeadingTeam(team.name);
      setBidHistory((prev) => [
        `🔨 ${team.name} raises the paddle to $${bid.toLocaleString()}!`,
        ...prev.slice(0, 5),
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen, player]);

  const handleSignContract = () => {
    cricketAudio.playFanfare();
    const updated: PlayerProfile = {
      ...player,
      tier: 'PREMIER_LEAGUE',
      currentTeam: leadingTeam,
      cash: player.cash + currentBid,
      matchFee: 5000,
      fame: player.fame + 2000,
      careerMilestones: [
        ...player.careerMilestones,
        `Signed by ${leadingTeam} in Mega T20 Franchise Auction for $${currentBid.toLocaleString()}!`,
      ],
    };
    onCompleteAuction(updated, leadingTeam, currentBid);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-auto text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 p-4 border-b border-amber-500/30 flex items-center gap-2">
          <Gavel className="w-6 h-6 text-amber-300 animate-pulse" />
          <div>
            <h2 className="text-xl font-bold font-teko uppercase tracking-wide text-white">
              {lang === 'bn' ? 'মেগা টি-টোয়েন্টি ফ্র্যাঞ্চাইজি নিলাম' : 'Mega T20 Franchise Auction Room'}
            </h2>
            <span className="text-[10px] text-amber-100 font-semibold uppercase">
              Live Bidding War • Season 2026
            </span>
          </div>
        </div>

        {/* Auction Body */}
        <div className="p-4 space-y-4 text-center">
          {/* Player on Block */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <span className="text-4xl mb-1">{player.flag}</span>
            <h3 className="text-base font-bold text-white">{player.name}</h3>
            <span className="text-xs text-amber-400 font-semibold uppercase">
              {player.role.replace('_', ' ')} • #{player.jerseyNumber}
            </span>
          </div>

          {/* Current Bid Display */}
          <div className="bg-gradient-to-br from-amber-950/60 to-slate-950 p-4 rounded-xl border border-amber-500/40">
            <span className="text-xs text-slate-400 uppercase font-bold block">
              {isSold ? '🎉 FINAL SOLD PRICE' : 'CURRENT HIGHEST BID'}
            </span>
            <div className="text-3xl font-extrabold font-mono text-amber-300 my-1">
              ${currentBid.toLocaleString()}
            </div>
            <span className="text-xs font-bold text-emerald-400">
              Leading Franchise: {leadingTeam}
            </span>
          </div>

          {/* Live Auction Feed */}
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-left h-28 overflow-y-auto space-y-1.5 font-mono text-xs">
            {bidHistory.map((line, idx) => (
              <div key={idx} className="text-slate-300">
                {line}
              </div>
            ))}
          </div>

          {/* Action Button */}
          {isSold ? (
            <button
              id="btn-sign-franchise-contract"
              onClick={handleSignContract}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle className="w-5 h-5" />
              {lang === 'bn' ? 'চুক্তি স্বাক্ষর করুন ও দলে যোগ দিন' : 'Sign Multi-Million Contract'}
            </button>
          ) : (
            <div className="text-xs text-amber-400 font-semibold animate-pulse flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {lang === 'bn' ? 'ফ্র্যাঞ্চাইজি দলগুলো বিড করছে...' : 'Bidding in progress... franchises raising paddles!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
