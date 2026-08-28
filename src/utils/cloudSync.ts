import { PlayerProfile, TournamentState } from '../types/cricket';
import { INITIAL_PLAYER } from './defaultData';

export interface SaveSlotData {
  id: string;
  name: string;
  timestamp: number;
  player: PlayerProfile;
  tournament?: TournamentState;
  slotNumber: number;
  syncCode?: string;
}

export interface CloudSaveBackup {
  version: string;
  app: string;
  exportedAt: number;
  syncCode: string;
  player: PlayerProfile;
  tournament?: TournamentState;
}

const STORAGE_SLOTS_KEY = 'REAL_CRICKET_SAVE_SLOTS_V1';
const CLOUD_CACHE_KEY = 'REAL_CRICKET_CLOUD_CACHE_V1';

export function getSaveSlots(): SaveSlotData[] {
  try {
    const raw = localStorage.getItem(STORAGE_SLOTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to get save slots', e);
  }
  return [];
}

export function saveToSlot(slotNumber: number, name: string, player: PlayerProfile, tournament?: TournamentState): SaveSlotData[] {
  const slots = getSaveSlots();
  const syncCode = generateSyncCode(player.id, slotNumber);
  
  const slotEntry: SaveSlotData = {
    id: `slot_${slotNumber}_${Date.now()}`,
    name: name || `Slot ${slotNumber} - ${player.name}`,
    timestamp: Date.now(),
    player: JSON.parse(JSON.stringify(player)),
    tournament: tournament ? JSON.parse(JSON.stringify(tournament)) : undefined,
    slotNumber,
    syncCode,
  };

  const filtered = slots.filter(s => s.slotNumber !== slotNumber);
  filtered.push(slotEntry);
  filtered.sort((a, b) => a.slotNumber - b.slotNumber);

  try {
    localStorage.setItem(STORAGE_SLOTS_KEY, JSON.stringify(filtered));
    // Also save into cloud simulation cache
    saveToCloudCache(syncCode, slotEntry);
  } catch (e) {
    console.error('Failed to save slot', e);
  }

  return filtered;
}

export function loadFromSlot(slotNumber: number): { player: PlayerProfile; tournament?: TournamentState } | null {
  const slots = getSaveSlots();
  const slot = slots.find(s => s.slotNumber === slotNumber);
  if (!slot) return null;
  return {
    player: slot.player,
    tournament: slot.tournament,
  };
}

export function deleteSlot(slotNumber: number): SaveSlotData[] {
  const slots = getSaveSlots().filter(s => s.slotNumber !== slotNumber);
  try {
    localStorage.setItem(STORAGE_SLOTS_KEY, JSON.stringify(slots));
  } catch (e) {
    console.error('Failed to delete slot', e);
  }
  return slots;
}

export function generateSyncCode(playerId: string, slotNum: number = 1): string {
  const randomAlpha = Math.random().toString(36).substring(2, 6).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CRIC-CLOUD-${num}-${randomAlpha}`;
}

export function saveToCloudCache(syncCode: string, slotData: SaveSlotData) {
  try {
    const raw = localStorage.getItem(CLOUD_CACHE_KEY) || '{}';
    const cache = JSON.parse(raw);
    cache[syncCode] = slotData;
    localStorage.setItem(CLOUD_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save to cloud cache', e);
  }
}

export function loadFromCloudByCode(syncCode: string): SaveSlotData | null {
  try {
    const cleanCode = syncCode.trim().toUpperCase();
    const raw = localStorage.getItem(CLOUD_CACHE_KEY) || '{}';
    const cache = JSON.parse(raw);
    if (cache[cleanCode]) {
      return cache[cleanCode];
    }
    // Also check slots
    const slots = getSaveSlots();
    const slot = slots.find(s => s.syncCode === cleanCode);
    if (slot) return slot;
  } catch (e) {
    console.error('Failed to load from cloud cache', e);
  }
  return null;
}

export function exportSaveToJSON(player: PlayerProfile, tournament?: TournamentState): void {
  const syncCode = generateSyncCode(player.id);
  const backup: CloudSaveBackup = {
    version: '1.2.0',
    app: 'Real Cricket Pro 3D',
    exportedAt: Date.now(),
    syncCode,
    player,
    tournament,
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cricket_save_${player.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseSaveFileJSON(jsonContent: string): { player: PlayerProfile; tournament?: TournamentState } | null {
  try {
    const data = JSON.parse(jsonContent);
    if (data && data.player && data.player.name && data.player.attributes) {
      return {
        player: data.player,
        tournament: data.tournament,
      };
    }
    // Fallback if raw PlayerProfile
    if (data && data.name && data.attributes && data.stats) {
      return {
        player: data,
      };
    }
  } catch (e) {
    console.error('Failed to parse save JSON', e);
  }
  return null;
}
