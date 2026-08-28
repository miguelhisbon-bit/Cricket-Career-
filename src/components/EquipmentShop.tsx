import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, DollarSign, Shield, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile, ShopItem } from '../types/cricket';
import { SHOP_ITEMS } from '../utils/storylines';
import { cricketAudio } from '../utils/audio';

interface EquipmentShopProps {
  player: PlayerProfile;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  lang: 'en' | 'bn';
}

export const EquipmentShop: React.FC<EquipmentShopProps> = ({
  player,
  onUpdatePlayer,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'BAT' | 'GEAR' | 'STAFF' | 'LIFESTYLE'>('ALL');
  const [shopItems, setShopItems] = useState<ShopItem[]>(SHOP_ITEMS);

  const filteredItems = selectedCategory === 'ALL'
    ? shopItems
    : shopItems.filter((i) => i.category === selectedCategory);

  const handlePurchase = (item: ShopItem) => {
    if (player.cash < item.price) {
      alert(lang === 'bn' ? 'পর্যাপ্ত ব্যালেন্স নেই! ম্যাচ খেলে ক্যাশ উপার্জন করুন।' : 'Insufficient funds! Win matches to earn more cash.');
      return;
    }

    cricketAudio.playFanfare();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    // Mark as owned
    setShopItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, owned: true } : it))
    );

    // Apply boosts
    const updated: PlayerProfile = {
      ...player,
      cash: player.cash - item.price,
      equippedBat: item.category === 'BAT' ? item.id : player.equippedBat,
      equippedShoes: item.category === 'GEAR' ? item.id : player.equippedShoes,
      attributes: {
        ...player.attributes,
        timing: player.attributes.timing + (item.boost.timing || 0),
        power: player.attributes.power + (item.boost.power || 0),
        shotPlacement: player.attributes.shotPlacement + (item.boost.shotPlacement || 0),
        spinReading: player.attributes.spinReading + (item.boost.spinReading || 0),
        paceTolerance: player.attributes.paceTolerance + (item.boost.paceTolerance || 0),
        runningSpeed: player.attributes.runningSpeed + (item.boost.runningSpeed || 0),
        stamina: player.attributes.stamina + (item.boost.stamina || 0),
        clutch: player.attributes.clutch + (item.boost.clutch || 0),
        fielding: player.attributes.fielding + (item.boost.fielding || 0),
      },
      fame: player.fame + (item.boost.fame || 0),
      morale: Math.min(100, player.morale + (item.boost.morale || 0)),
      energy: Math.min(100, player.energy + (item.boost.energy || 0)),
    };

    onUpdatePlayer(updated);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(245,158,11,0.15)] text-white flex items-center justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-teko uppercase tracking-wider">
              {lang === 'bn' ? 'ক্রিকেট ইকুইপমেন্ট ও লাক্সারি শপ' : 'PRO CRICKET GEAR & LIFESTYLE MARKETPLACE'}
            </h1>
          </div>
          <p className="text-xs text-gray-300">
            {lang === 'bn' 
              ? 'সেরা ইংলিশ উইলো ব্যাট, ফিটনেস স্পেশালিস্ট ও লাক্সারি লাইফস্টাইল আনলক করুন।'
              : 'Upgrade your bats, hire private physiotherapists and acquire luxury lifestyle assets.'}
          </p>
        </div>

        {/* Current Cash */}
        <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-right shrink-0">
          <span className="text-[9px] text-amber-400 font-bold uppercase tracking-[0.2em] block">Your Balance</span>
          <span className="text-sm font-mono font-bold text-amber-300">${player.cash.toLocaleString()}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            ['ALL', 'All Items', 'সকল সামগ্রী'],
            ['BAT', 'English Bats', 'ব্যাট'],
            ['GEAR', 'Spikes & Pads', 'গিয়ার'],
            ['STAFF', 'Staff & Physio', 'কোচ ও ট্রেইনার'],
            ['LIFESTYLE', 'Lifestyle & Cars', 'লাইফস্টাইল'],
          ] as const
        ).map(([cat, labelEn, labelBn]) => (
          <button
            key={cat}
            id={`shop-cat-${cat.toLowerCase()}`}
            onClick={() => {
              cricketAudio.playUiClick();
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
            }`}
          >
            {lang === 'bn' ? labelBn : labelEn}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const canAfford = player.cash >= item.price;
          return (
            <div
              key={item.id}
              className={`bg-white/[0.03] backdrop-blur-xl border rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xl ${
                item.owned
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-white/10 hover:border-amber-500/40 group'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h2 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
                        {item.name}
                      </h2>
                      <span className="text-[9px] text-amber-400 font-bold uppercase tracking-[0.2em]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
                    ${item.price.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Boost badges & Buy button */}
              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(item.boost).map(([key, val]) => (
                    <span
                      key={key}
                      className="text-[9px] bg-black/40 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold border border-emerald-500/20"
                    >
                      +{val} {key}
                    </span>
                  ))}
                </div>

                {item.owned ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5" />
                    {lang === 'bn' ? 'মালিকানাধীন' : 'Owned'}
                  </span>
                ) : (
                  <button
                    id={`btn-buy-${item.id}`}
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'bg-white/[0.05] text-gray-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {lang === 'bn' ? 'ক্রয় করুন' : 'Purchase'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
