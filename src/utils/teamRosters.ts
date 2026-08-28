import { PlayingXIPlayer, TeamSquad, PlayerProfile, CareerTier } from '../types/cricket';

// Roster Database for All Career Tiers
export const TEAM_ROSTERS: Record<string, { shortName: string; city: string; flag: string; primaryColor: string; secondaryColor: string; players: Omit<PlayingXIPlayer, 'runs' | 'balls' | 'fours' | 'sixes' | 'isOut' | 'oversBowled' | 'runsConceded' | 'wickets' | 'maidens'>[] }> = {
  // --- GULLY / STREET TIER ---
  'Mirpur Thunder 11': {
    shortName: 'MT11',
    city: 'Mirpur, Dhaka',
    flag: '⚡',
    primaryColor: '#0284c7',
    secondaryColor: '#f59e0b',
    players: [
      { id: 'mt_1', name: 'Tanvir Hossain', nameBn: 'তানভীর হোসেন', role: 'BATSMAN', isCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 72, jerseyNumber: 77 },
      { id: 'mt_2', name: 'Rakib "Rocket" Hasan', nameBn: 'রাকিব রকেট', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 68, jerseyNumber: 10 },
      { id: 'mt_3', name: 'Shakil Ahmed', nameBn: 'শাকিল আহমেদ', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 65, jerseyNumber: 3 },
      { id: 'mt_4', name: 'Fahim "Sixer" Zaman', nameBn: 'ফাহিম জামান', role: 'ALL_ROUNDER', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 70, jerseyNumber: 18 },
      { id: 'mt_5', name: 'Mehedi Hasan Jibon', nameBn: 'মেহেদী জীবন', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 64, jerseyNumber: 99 },
      { id: 'mt_6', name: 'Sabbir Hossain', nameBn: 'সাব্বির হোসেন', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 63, jerseyNumber: 7 },
      { id: 'mt_7', name: 'Nafis Iqbal Jr.', nameBn: 'নাফিস ইকবাল', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 62, jerseyNumber: 21 },
      { id: 'mt_8', name: 'Kawsar "Shooter" Mia', nameBn: 'কাওসার মিয়া', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 67, jerseyNumber: 88 },
      { id: 'mt_9', name: 'Al-Amin Bullet', nameBn: 'আল-আমিন বুলেট', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 66, jerseyNumber: 14 },
      { id: 'mt_10', name: 'Ripon "Spinner" Ali', nameBn: 'রিপন আলী', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 65, jerseyNumber: 23 },
      { id: 'mt_11', name: 'Imran Yorkerman', nameBn: 'ইমরান', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 64, jerseyNumber: 11 },
    ],
  },
  'Old Town Titans': {
    shortName: 'OTT',
    city: 'Puran Dhaka',
    flag: '🏛️',
    primaryColor: '#b91c1c',
    secondaryColor: '#fde047',
    players: [
      { id: 'ott_1', name: 'Kamal "Don" Bhai', nameBn: 'কামাল ভাই', role: 'BATSMAN', isCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 70, jerseyNumber: 1 },
      { id: 'ott_2', name: 'Sujon Bakarkhani', nameBn: 'সুজন', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 66, jerseyNumber: 9 },
      { id: 'ott_3', name: 'Tareq Biryani', nameBn: 'তারেক', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 64, jerseyNumber: 12 },
      { id: 'ott_4', name: 'Habibullah Babu', nameBn: 'হাবিবুল্লাহ', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 65, jerseyNumber: 16 },
      { id: 'ott_5', name: 'Arman Hossain', nameBn: 'আরমান', role: 'ALL_ROUNDER', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 69, jerseyNumber: 27 },
      { id: 'ott_6', name: 'Zahid Hasan', nameBn: 'জাহিদ', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEG_SPIN', rating: 63, jerseyNumber: 45 },
      { id: 'ott_7', name: 'Sohel "Boom" Rana', nameBn: 'সোহেল রানা', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 66, jerseyNumber: 5 },
      { id: 'ott_8', name: 'Rony Express', nameBn: 'রনি এক্সপ্রেস', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 68, jerseyNumber: 17 },
      { id: 'ott_9', name: 'Mithu Spinner', nameBn: 'মিঠু', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 64, jerseyNumber: 33 },
      { id: 'ott_10', name: 'Rasel Mia', nameBn: 'রাসেল মিয়া', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 65, jerseyNumber: 8 },
      { id: 'ott_11', name: 'Asif Yorkie', nameBn: 'আসিফ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 62, jerseyNumber: 55 },
    ],
  },
  'Agrabad Street Boys': {
    shortName: 'ASB',
    city: 'Chittagong',
    flag: '🌊',
    primaryColor: '#0f766e',
    secondaryColor: '#fbbf24',
    players: [
      { id: 'asb_1', name: 'Sayedur Rahman', nameBn: 'সায়েদুর রহমান', role: 'BATSMAN', isCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 68, jerseyNumber: 10 },
      { id: 'asb_2', name: 'Mahfuz Shipyard', nameBn: 'মাহফুজ', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 63, jerseyNumber: 2 },
      { id: 'asb_3', name: 'Didarul Alam', nameBn: 'দিদারুল', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 65, jerseyNumber: 7 },
      { id: 'asb_4', name: 'Faisal Port King', nameBn: 'ফয়সাল', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 67, jerseyNumber: 11 },
      { id: 'asb_5', name: 'Jashim Uddin', nameBn: 'জসিম উদ্দিন', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 62, jerseyNumber: 15 },
      { id: 'asb_6', name: 'Hasan Coastal', nameBn: 'হাসান', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 64, jerseyNumber: 19 },
      { id: 'asb_7', name: 'Erfan Habib', nameBn: 'ইরফান', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 61, jerseyNumber: 22 },
      { id: 'asb_8', name: 'Giasuddin Pace', nameBn: 'গিয়াসউদ্দিন', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 66, jerseyNumber: 31 },
      { id: 'asb_9', name: 'Monir Swing', nameBn: 'মনির', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 65, jerseyNumber: 44 },
      { id: 'asb_10', name: 'Babul Googly', nameBn: 'বাবুল', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 63, jerseyNumber: 50 },
      { id: 'asb_11', name: 'Zillur Yorker', nameBn: 'জিল্লুর', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 62, jerseyNumber: 90 },
    ],
  },
  'Zindabazar Strikers': {
    shortName: 'ZBS',
    city: 'Sylhet',
    flag: '🍃',
    primaryColor: '#15803d',
    secondaryColor: '#facc15',
    players: [
      { id: 'zbs_1', name: 'Anwar Tea-King', nameBn: 'আনোয়ার', role: 'BATSMAN', isCaptain: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 69, jerseyNumber: 14 },
      { id: 'zbs_2', name: 'Mubin Chowdhury', nameBn: 'মুবিন চৌধুরী', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 64, jerseyNumber: 8 },
      { id: 'zbs_3', name: 'Rayhan Surma', nameBn: 'রায়হান', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 63, jerseyNumber: 17 },
      { id: 'zbs_4', name: 'Tamim Hill-Blaster', nameBn: 'তামিম', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 67, jerseyNumber: 29 },
      { id: 'zbs_5', name: 'Shahidul Gloves', nameBn: 'শহিদুল', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 63, jerseyNumber: 5 },
      { id: 'zbs_6', name: 'Faruq Spin', nameBn: 'ফারুক', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 64, jerseyNumber: 4 },
      { id: 'zbs_7', name: 'Liton Sledge', nameBn: 'লিটন', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 61, jerseyNumber: 37 },
      { id: 'zbs_8', name: 'Kamrul Speedster', nameBn: 'কামরুল', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 66, jerseyNumber: 91 },
      { id: 'zbs_9', name: 'Bappi Left-Arm', nameBn: 'বাপ্পি', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 64, jerseyNumber: 12 },
      { id: 'zbs_10', name: 'Rana Mystery', nameBn: 'রানা', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 63, jerseyNumber: 71 },
      { id: 'zbs_11', name: 'Tarek Fire', nameBn: 'তারেক', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 62, jerseyNumber: 9 },
    ],
  },

  // --- PREMIER LEAGUE FRANCHISE TIER ---
  'Dhaka Dynamites': {
    shortName: 'DD',
    city: 'Dhaka',
    flag: '💣',
    primaryColor: '#1e3a8a',
    secondaryColor: '#f59e0b',
    players: [
      { id: 'dd_1', name: 'Liton Das', nameBn: 'লিটন দাস', role: 'BATSMAN', isCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 88, jerseyNumber: 16 },
      { id: 'dd_2', name: 'Sunil Narine', nameBn: 'সুনিল নারিন', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 87, jerseyNumber: 74 },
      { id: 'dd_3', name: 'Andre Russell', nameBn: 'আন্দ্রে রাসেল', role: 'ALL_ROUNDER', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 91, jerseyNumber: 12 },
      { id: 'dd_4', name: 'Shakib Al Hasan', nameBn: 'সাকিব আল হাসান', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 92, jerseyNumber: 75 },
      { id: 'dd_5', name: 'Nurul Hasan Sohan', nameBn: 'নুরুল হাসান সোহান', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 82, jerseyNumber: 81 },
      { id: 'dd_6', name: 'Mosaddek Hossain', nameBn: 'মোসাদ্দেক হোসেন', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 80, jerseyNumber: 32 },
      { id: 'dd_7', name: 'Kieron Pollard', nameBn: 'কাইরন পোলার্ড', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 86, jerseyNumber: 55 },
      { id: 'dd_8', name: 'Taskin Ahmed', nameBn: 'তাসকিন আহমেদ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 88, jerseyNumber: 3 },
      { id: 'dd_9', name: 'Mustafizur Rahman', nameBn: 'মুস্তাফিজুর রহমান', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 89, jerseyNumber: 90 },
      { id: 'dd_10', name: 'Rubel Hossain', nameBn: 'রুবেল হোসেন', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 81, jerseyNumber: 34 },
      { id: 'dd_11', name: 'Arafat Sunny', nameBn: 'আরাফাত সানি', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 79, jerseyNumber: 24 },
    ],
  },
  'Chattogram Challengers': {
    shortName: 'CC',
    city: 'Chattogram',
    flag: '⚓',
    primaryColor: '#0284c7',
    secondaryColor: '#e11d48',
    players: [
      { id: 'cc_1', name: 'Tamim Iqbal', nameBn: 'তামিম ইকবাল', role: 'BATSMAN', isCaptain: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 89, jerseyNumber: 28 },
      { id: 'cc_2', name: 'Chris Gayle', nameBn: 'ক্রিস গেইল', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 88, jerseyNumber: 333 },
      { id: 'cc_3', name: 'Afif Hossain', nameBn: 'আফিফ হোসেন', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 84, jerseyNumber: 18 },
      { id: 'cc_4', name: 'Shoaib Malik', nameBn: 'শোয়েব মালিক', role: 'ALL_ROUNDER', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 85, jerseyNumber: 18 },
      { id: 'cc_5', name: 'Chadwick Walton', nameBn: 'চ্যাডউইক ওয়ালটন', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 80, jerseyNumber: 59 },
      { id: 'cc_6', name: 'Ziaur Rahman', nameBn: 'জিয়াউর রহমান', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 78, jerseyNumber: 6 },
      { id: 'cc_7', name: 'Benny Howell', nameBn: 'বেনি হাওয়েল', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 81, jerseyNumber: 22 },
      { id: 'cc_8', name: 'Shoriful Islam', nameBn: 'শরিফুল ইসলাম', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 86, jerseyNumber: 47 },
      { id: 'cc_9', name: 'Nasum Ahmed', nameBn: 'নাসুম আহমেদ', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 83, jerseyNumber: 10 },
      { id: 'cc_10', name: 'Mehedi Hasan Rana', nameBn: 'মেহেদী রানা', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 80, jerseyNumber: 55 },
      { id: 'cc_11', name: 'Mukidul Islam Mugdho', nameBn: 'মুকিদুল মুগ্ধ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 77, jerseyNumber: 99 },
    ],
  },
  'Comilla Victorians': {
    shortName: 'CV',
    city: 'Comilla',
    flag: '🏆',
    primaryColor: '#b91c1c',
    secondaryColor: '#38bdf8',
    players: [
      { id: 'cv_1', name: 'Mohammad Rizwan', nameBn: 'মোহাম্মদ রিজওয়ান', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 91, jerseyNumber: 16 },
      { id: 'cv_2', name: 'Johnson Charles', nameBn: 'জনসন চার্লস', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 84, jerseyNumber: 25 },
      { id: 'cv_3', name: 'Towhid Hridoy', nameBn: 'তৌহিদ হৃদয়', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 86, jerseyNumber: 77 },
      { id: 'cv_4', name: 'Imrul Kayes', nameBn: 'ইমরুল কায়েস', role: 'BATSMAN', isCaptain: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 83, jerseyNumber: 45 },
      { id: 'cv_5', name: 'Moeen Ali', nameBn: 'মঈন আলী', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 88, jerseyNumber: 18 },
      { id: 'cv_6', name: 'Khushdil Shah', nameBn: 'খুশদিল শাহ', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 82, jerseyNumber: 72 },
      { id: 'cv_7', name: 'Mosaddek Hossain Saikat', nameBn: 'মোসাদ্দেক সৈকত', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 81, jerseyNumber: 32 },
      { id: 'cv_8', name: 'Sunil Narine', nameBn: 'নারিন', role: 'ALL_ROUNDER', isViceCaptain: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 89, jerseyNumber: 74 },
      { id: 'cv_9', name: 'Mustafizur The Fizz', nameBn: 'মুস্তাফিজ ফিজ', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 90, jerseyNumber: 90 },
      { id: 'cv_10', name: 'Tanvir Islam', nameBn: 'তানভীর ইসলাম', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 83, jerseyNumber: 66 },
      { id: 'cv_11', name: 'Mukidul Islam', nameBn: 'মুকিদুল ইসলাম', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 80, jerseyNumber: 8 },
    ],
  },
  'Fortune Barishal': {
    shortName: 'FB',
    city: 'Barishal',
    flag: '🌪️',
    primaryColor: '#7c3aed',
    secondaryColor: '#f97316',
    players: [
      { id: 'fb_1', name: 'Tamim Iqbal Khan', nameBn: 'তামিম খান', role: 'BATSMAN', isCaptain: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 89, jerseyNumber: 28 },
      { id: 'fb_2', name: 'Ahmed Shehzad', nameBn: 'আহমেদ শেহজাদ', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 83, jerseyNumber: 19 },
      { id: 'fb_3', name: 'Soumya Sarkar', nameBn: 'সৌম্য সরকার', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 84, jerseyNumber: 59 },
      { id: 'fb_4', name: 'Mushfiqur Rahim', nameBn: 'মুশফিকুর রহিম', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 89, jerseyNumber: 15 },
      { id: 'fb_5', name: 'Mahmudullah Riyad', nameBn: 'মাহমুদউল্লাহ রিয়াদ', role: 'ALL_ROUNDER', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 87, jerseyNumber: 30 },
      { id: 'fb_6', name: 'Mehidy Hasan Miraz', nameBn: 'মেহেদী মিরাজ', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 88, jerseyNumber: 53 },
      { id: 'fb_7', name: 'David Miller', nameBn: 'ডেভিড মিলার', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 90, jerseyNumber: 10 },
      { id: 'fb_8', name: 'Mohammad Saifuddin', nameBn: 'মোহাম্মদ সাইফুদ্দিন', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 84, jerseyNumber: 41 },
      { id: 'fb_9', name: 'Keshav Maharaj', nameBn: 'কেশব মহারাজ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 86, jerseyNumber: 16 },
      { id: 'fb_10', name: 'Obed McCoy', nameBn: 'ওবেড ম্যাককয়', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 84, jerseyNumber: 61 },
      { id: 'fb_11', name: 'Khaled Ahmed', nameBn: 'খালেদ আহমেদ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 81, jerseyNumber: 14 },
    ],
  },
  'Sylhet Sixers': {
    shortName: 'SS',
    city: 'Sylhet',
    flag: '🦅',
    primaryColor: '#059669',
    secondaryColor: '#f43f5e',
    players: [
      { id: 'ss_1', name: 'Najmul Hossain Shanto', nameBn: 'নাজমুল শান্ত', role: 'BATSMAN', isCaptain: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 87, jerseyNumber: 99 },
      { id: 'ss_2', name: 'Harry Tector', nameBn: 'হ্যারি টেক্টর', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 84, jerseyNumber: 13 },
      { id: 'ss_3', name: 'Zakir Hasan', nameBn: 'জাকির হাসান', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 82, jerseyNumber: 21 },
      { id: 'ss_4', name: 'Ryan Burl', nameBn: 'রায়ান বার্ল', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEG_SPIN', rating: 83, jerseyNumber: 54 },
      { id: 'ss_5', name: 'Ben Cutting', nameBn: 'বেন কাটিং', role: 'ALL_ROUNDER', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 83, jerseyNumber: 31 },
      { id: 'ss_6', name: 'Mashrafe Mortaza', nameBn: 'মাশরাফি বিন মর্তুজা', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 86, jerseyNumber: 2 },
      { id: 'ss_7', name: 'Samit Patel', nameBn: 'সামিত প্যাটেল', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 80, jerseyNumber: 27 },
      { id: 'ss_8', name: 'Rejaur Rahman Raja', nameBn: 'রেজাউর রাজা', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 82, jerseyNumber: 17 },
      { id: 'ss_9', name: 'Richard Ngarava', nameBn: 'রিচার্ড এনগারাভা', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 84, jerseyNumber: 48 },
      { id: 'ss_10', name: 'Sunzamul Islam', nameBn: 'সানজামুল ইসলাম', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 79, jerseyNumber: 88 },
      { id: 'ss_11', name: 'Nazmul Islam Apu', nameBn: 'নাজমুল অপু', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 78, jerseyNumber: 7 },
    ],
  },

  // --- INTERNATIONAL TIER ---
  'India National Team': {
    shortName: 'IND',
    city: 'Mumbai / Delhi',
    flag: '🇮🇳',
    primaryColor: '#1d4ed8',
    secondaryColor: '#f97316',
    players: [
      { id: 'ind_1', name: 'Rohit Sharma', nameBn: 'রোহিত শর্মা', role: 'BATSMAN', isCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 94, jerseyNumber: 45 },
      { id: 'ind_2', name: 'Shubman Gill', nameBn: 'শুভমান গিল', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 91, jerseyNumber: 77 },
      { id: 'ind_3', name: 'Virat Kohli', nameBn: 'বিরাট কোহলি', role: 'BATSMAN', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 96, jerseyNumber: 18 },
      { id: 'ind_4', name: 'Suryakumar Yadav', nameBn: 'সূর্যকুমার যাদব', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 93, jerseyNumber: 63 },
      { id: 'ind_5', name: 'Rishabh Pant', nameBn: 'ঋষভ পন্থ', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 91, jerseyNumber: 17 },
      { id: 'ind_6', name: 'Hardik Pandya', nameBn: 'হার্দিক পান্ডিয়া', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 92, jerseyNumber: 33 },
      { id: 'ind_7', name: 'Ravindra Jadeja', nameBn: 'রবীন্দ্র জাদেজা', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 93, jerseyNumber: 8 },
      { id: 'ind_8', name: 'Axar Patel', nameBn: 'অক্ষর প্যাটেল', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 89, jerseyNumber: 20 },
      { id: 'ind_9', name: 'Kuldeep Yadav', nameBn: 'কুলদীপ যাদব', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 91, jerseyNumber: 23 },
      { id: 'ind_10', name: 'Jasprit Bumrah', nameBn: 'জাসপ্রিত বুমরাহ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 98, jerseyNumber: 93 },
      { id: 'ind_11', name: 'Mohammed Shami', nameBn: 'মোহাম্মদ শামি', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 92, jerseyNumber: 11 },
    ],
  },
  'Australia National Team': {
    shortName: 'AUS',
    city: 'Melbourne / Sydney',
    flag: '🇦🇺',
    primaryColor: '#eab308',
    secondaryColor: '#15803d',
    players: [
      { id: 'aus_1', name: 'Travis Head', nameBn: 'ট্রাভিস হেড', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 93, jerseyNumber: 62 },
      { id: 'aus_2', name: 'David Warner', nameBn: 'ডেভিড ওয়ার্নার', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEG_SPIN', rating: 92, jerseyNumber: 31 },
      { id: 'aus_3', name: 'Mitchell Marsh', nameBn: 'মিচেল মার্শ', role: 'ALL_ROUNDER', isCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 92, jerseyNumber: 8 },
      { id: 'aus_4', name: 'Steve Smith', nameBn: 'স্টিভ স্মিথ', role: 'BATSMAN', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 95, jerseyNumber: 49 },
      { id: 'aus_5', name: 'Glenn Maxwell', nameBn: 'গ্লেন ম্যাক্সওয়েল', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 94, jerseyNumber: 32 },
      { id: 'aus_6', name: 'Marcus Stoinis', nameBn: 'মার্কাস স্টয়নিস', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 89, jerseyNumber: 17 },
      { id: 'aus_7', name: 'Josh Inglis', nameBn: 'জশ ইংলিস', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 87, jerseyNumber: 48 },
      { id: 'aus_8', name: 'Pat Cummins', nameBn: 'প্যাট কামিন্স', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 95, jerseyNumber: 30 },
      { id: 'aus_9', name: 'Mitchell Starc', nameBn: 'মিচেল স্টার্ক', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 95, jerseyNumber: 56 },
      { id: 'aus_10', name: 'Adam Zampa', nameBn: 'অ্যাডাম জাম্পা', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 91, jerseyNumber: 88 },
      { id: 'aus_11', name: 'Josh Hazlewood', nameBn: 'জশ হ্যাজলউড', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 93, jerseyNumber: 38 },
    ],
  },
  'Pakistan National Team': {
    shortName: 'PAK',
    city: 'Lahore / Karachi',
    flag: '🇵🇰',
    primaryColor: '#15803d',
    secondaryColor: '#facc15',
    players: [
      { id: 'pak_1', name: 'Mohammad Rizwan', nameBn: 'মোহাম্মদ রিজওয়ান', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 92, jerseyNumber: 16 },
      { id: 'pak_2', name: 'Babar Azam', nameBn: 'বাবর আজম', role: 'BATSMAN', isCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 95, jerseyNumber: 56 },
      { id: 'pak_3', name: 'Fakhar Zaman', nameBn: 'ফখর জামান', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 90, jerseyNumber: 39 },
      { id: 'pak_4', name: 'Saim Ayub', nameBn: 'সাইম আইয়ুব', role: 'BATSMAN', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 86, jerseyNumber: 63 },
      { id: 'pak_5', name: 'Iftikhar Ahmed', nameBn: 'ইফতিখার আহমেদ', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 87, jerseyNumber: 95 },
      { id: 'pak_6', name: 'Shadab Khan', nameBn: 'শাদাব খান', role: 'ALL_ROUNDER', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 90, jerseyNumber: 7 },
      { id: 'pak_7', name: 'Imad Wasim', nameBn: 'ইমাদ ওয়াসিম', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 88, jerseyNumber: 9 },
      { id: 'pak_8', name: 'Shaheen Shah Afridi', nameBn: 'শাহীন শাহ আফ্রিদি', role: 'BOWLER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 96, jerseyNumber: 10 },
      { id: 'pak_9', name: 'Haris Rauf', nameBn: 'হারিস রউফ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 92, jerseyNumber: 150 },
      { id: 'pak_10', name: 'Naseem Shah', nameBn: 'নাসিম শাহ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 93, jerseyNumber: 71 },
      { id: 'pak_11', name: 'Abrar Ahmed', nameBn: 'আবরার আহমেদ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 88, jerseyNumber: 82 },
    ],
  },
  'England National Team': {
    shortName: 'ENG',
    city: 'London / Birmingham',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    primaryColor: '#dc2626',
    secondaryColor: '#1e3a8a',
    players: [
      { id: 'eng_1', name: 'Jos Buttler', nameBn: 'জস বাটলার', role: 'WICKET_KEEPER_BATSMAN', isCaptain: true, isWicketKeeper: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 95, jerseyNumber: 63 },
      { id: 'eng_2', name: 'Phil Salt', nameBn: 'ফিল সল্ট', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 91, jerseyNumber: 28 },
      { id: 'eng_3', name: 'Jonny Bairstow', nameBn: 'জনি বেয়ারস্টো', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 90, jerseyNumber: 51 },
      { id: 'eng_4', name: 'Harry Brook', nameBn: 'হ্যারি ব্রুক', role: 'BATSMAN', isViceCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 92, jerseyNumber: 88 },
      { id: 'eng_5', name: 'Liam Livingstone', nameBn: 'লিয়াম লিভিংস্টোন', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 90, jerseyNumber: 23 },
      { id: 'eng_6', name: 'Moeen Ali', nameBn: 'মঈন আলী', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'OFF_SPIN', rating: 89, jerseyNumber: 18 },
      { id: 'eng_7', name: 'Sam Curran', nameBn: 'স্যাম কারান', role: 'ALL_ROUNDER', battingStyle: 'LEFT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 89, jerseyNumber: 58 },
      { id: 'eng_8', name: 'Chris Jordan', nameBn: 'ক্রিস জর্ডান', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 86, jerseyNumber: 34 },
      { id: 'eng_9', name: 'Jofra Archer', nameBn: 'জোফরা আর্চার', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 95, jerseyNumber: 22 },
      { id: 'eng_10', name: 'Adil Rashid', nameBn: 'আদিল রশিদ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEG_SPIN', rating: 93, jerseyNumber: 95 },
      { id: 'eng_11', name: 'Mark Wood', nameBn: 'মার্ক উড', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 92, jerseyNumber: 33 },
    ],
  },
  'South Africa National Team': {
    shortName: 'SA',
    city: 'Johannesburg / Cape Town',
    flag: '🇿🇦',
    primaryColor: '#15803d',
    secondaryColor: '#facc15',
    players: [
      { id: 'sa_1', name: 'Quinton de Kock', nameBn: 'কুইন্টন ডি কক', role: 'WICKET_KEEPER_BATSMAN', isWicketKeeper: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 93, jerseyNumber: 12 },
      { id: 'sa_2', name: 'Reeza Hendricks', nameBn: 'রিজা হেনড্রিক্স', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 88, jerseyNumber: 77 },
      { id: 'sa_3', name: 'Aiden Markram', nameBn: 'এইডেন মার্করাম', role: 'BATSMAN', isCaptain: true, battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 92, jerseyNumber: 4 },
      { id: 'sa_4', name: 'Heinrich Klaasen', nameBn: 'হেইনরিখ ক্লাসেন', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 95, jerseyNumber: 45 },
      { id: 'sa_5', name: 'David Miller', nameBn: 'ডেভিড মিলার', role: 'BATSMAN', isViceCaptain: true, battingStyle: 'LEFT_HAND', bowlingStyle: 'RIGHT_ARM_MEDIUM', rating: 92, jerseyNumber: 10 },
      { id: 'sa_6', name: 'Tristan Stubbs', nameBn: 'ট্রিস্টান স্টাবস', role: 'BATSMAN', battingStyle: 'RIGHT_HAND', bowlingStyle: 'OFF_SPIN', rating: 89, jerseyNumber: 30 },
      { id: 'sa_7', name: 'Marco Jansen', nameBn: 'মার্কো জানসেন', role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEFT_ARM_FAST', rating: 90, jerseyNumber: 70 },
      { id: 'sa_8', name: 'Keshav Maharaj', nameBn: 'কেশব মহারাজ', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 90, jerseyNumber: 16 },
      { id: 'sa_9', name: 'Kagiso Rabada', nameBn: 'কাগিসো রাবাদা', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 95, jerseyNumber: 25 },
      { id: 'sa_10', name: 'Anrich Nortje', nameBn: 'আনরিখ নর্কিয়া', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'RIGHT_ARM_FAST', rating: 93, jerseyNumber: 20 },
      { id: 'sa_11', name: 'Tabraiz Shamsi', nameBn: 'তাবরাইজ শামসি', role: 'BOWLER', battingStyle: 'RIGHT_HAND', bowlingStyle: 'LEFT_ARM_ORTHODOX', rating: 89, jerseyNumber: 68 },
    ],
  },
};

// Realistic dynamic name pools for authentic Cricket 26 atmosphere
const BD_FIRST_NAMES = ['Tamim', 'Liton', 'Shakib', 'Mushfiqur', 'Taskin', 'Mustafizur', 'Mahmudullah', 'Afif', 'Towhid', 'Mehidy', 'Shoriful', 'Tanzim', 'Zakir', 'Ebadot', 'Najmul', 'Rishad', 'Jaker', 'Parvez', 'Shamim', 'Tanvir', 'Rakib', 'Fahim', 'Mehedi', 'Sabbir', 'Al-Amin', 'Ripon', 'Kawsar', 'Imran', 'Kamal', 'Sujon', 'Tareq', 'Arman', 'Zahid', 'Sohel', 'Rony', 'Mithu', 'Rasel', 'Mahfuz', 'Didar', 'Faisal', 'Jashim', 'Anwar', 'Mubin', 'Rayhan', 'Kamrul', 'Bappi', 'Rana'];
const BD_LAST_NAMES = ['Hossain', 'Rahman', 'Ahmed', 'Iqbal', 'Das', 'Hasan', 'Ali', 'Mia', 'Chowdhury', 'Khan', 'Sarkar', 'Shanto', 'Hridoy', 'Miraz', 'Sakib', 'Hridoy', 'Islam', 'Uddin', 'Mahmud', 'Joy', 'Rony', 'Sunny', 'Gazi', 'Babu', 'Express', 'Bullet', 'Sixer', 'Yorker', 'Spinner', 'Rocket'];

const GLOBAL_FIRST_NAMES = ['Virat', 'Rohit', 'Babar', 'Shaheen', 'Rizwan', 'Jasprit', 'Pat', 'Travis', 'Mitchell', 'Glenn', 'Steve', 'David', 'Jos', 'Ben', 'Harry', 'Jofra', 'Mark', 'Kane', 'Trent', 'Daryl', 'Rachin', 'Kagiso', 'Quinton', 'Heinrich', 'Anrich', 'Nicholas', 'Andre', 'Shimron', 'Alzarri', 'Shai', 'Wanindu', 'Pathum', 'Matheesha', 'Rashid', 'Mohammad', 'Rahmanullah', 'Fazalhaq', 'Noor'];
const GLOBAL_LAST_NAMES = ['Kohli', 'Sharma', 'Azam', 'Afridi', 'Bumrah', 'Cummins', 'Head', 'Starc', 'Maxwell', 'Smith', 'Warner', 'Buttler', 'Stokes', 'Brook', 'Archer', 'Wood', 'Williamson', 'Boult', 'Mitchell', 'Ravindra', 'Rabada', 'de Kock', 'Klaasen', 'Nortje', 'Pooran', 'Russell', 'Hetmyer', 'Joseph', 'Hope', 'Hasaranga', 'Nissanka', 'Pathirana', 'Khan', 'Nabi', 'Gurbaz', 'Farooqi', 'Ahmad'];

/**
 * Generate a rich, dynamic player with authentic attributes and Cricket 26 style details
 */
export function generateRandomCricketPlayer(role?: PlayerRole, tier: CareerTier = 'PREMIER_LEAGUE', country: string = 'Bangladesh'): Omit<PlayingXIPlayer, 'runs' | 'balls' | 'fours' | 'sixes' | 'isOut' | 'oversBowled' | 'runsConceded' | 'wickets' | 'maidens'> {
  const isBD = country === 'Bangladesh' || country === 'BD';
  const firstPool = isBD ? BD_FIRST_NAMES : GLOBAL_FIRST_NAMES;
  const lastPool = isBD ? BD_LAST_NAMES : GLOBAL_LAST_NAMES;

  const fn = firstPool[Math.floor(Math.random() * firstPool.length)];
  const ln = lastPool[Math.floor(Math.random() * lastPool.length)];
  const fullName = `${fn} ${ln}`;

  const assignedRole: PlayerRole = role || (['BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER_BATSMAN'] as const)[Math.floor(Math.random() * 4)];
  const battingStyle = Math.random() > 0.7 ? 'LEFT_HAND' : 'RIGHT_HAND';
  const bowlingStyles: BowlingStyle[] = ['RIGHT_ARM_FAST', 'LEFT_ARM_FAST', 'RIGHT_ARM_MEDIUM', 'OFF_SPIN', 'LEG_SPIN', 'LEFT_ARM_ORTHODOX'];
  const bowlingStyle = bowlingStyles[Math.floor(Math.random() * bowlingStyles.length)];

  // Rating scaling by tier
  const baseRating = tier === 'GULLY_STREET' ? 62 : tier === 'DISTRICT_U19' ? 70 : tier === 'DOMESTIC_FC' ? 77 : tier === 'PREMIER_LEAGUE' ? 84 : 89;
  const rating = Math.min(96, Math.max(55, baseRating + Math.floor(Math.random() * 10) - 3));

  return {
    id: `rnd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: fullName,
    nameBn: isBD ? `${fn} ${ln}` : fullName,
    role: assignedRole,
    isCaptain: false,
    isViceCaptain: false,
    isWicketKeeper: assignedRole === 'WICKET_KEEPER_BATSMAN',
    battingStyle,
    bowlingStyle,
    rating,
    jerseyNumber: Math.floor(Math.random() * 99) + 1,
  };
}

/**
 * Get or Generate Starting 11 for any team name
 */
export function getStartingXIForTeam(teamName: string, userPlayer?: PlayerProfile, isUserTeam: boolean = false): PlayingXIPlayer[] {
  const found = TEAM_ROSTERS[teamName];

  let rawList: Omit<PlayingXIPlayer, 'runs' | 'balls' | 'fours' | 'sixes' | 'isOut' | 'oversBowled' | 'runsConceded' | 'wickets' | 'maidens'>[];

  if (found) {
    rawList = found.players;
  } else {
    // Generate realistic, specialized 11 using our dynamic engine
    rawList = [
      generateRandomCricketPlayer('BATSMAN', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('BATSMAN', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('BATSMAN', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('BATSMAN', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('WICKET_KEEPER_BATSMAN', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('ALL_ROUNDER', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('ALL_ROUNDER', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('BOWLER', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('BOWLER', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('BOWLER', userPlayer?.tier || 'PREMIER_LEAGUE'),
      generateRandomCricketPlayer('BOWLER', userPlayer?.tier || 'PREMIER_LEAGUE'),
    ].map((p, idx) => ({
      ...p,
      isCaptain: idx === 0,
      isViceCaptain: idx === 1,
      isWicketKeeper: idx === 4,
    }));
  }

  // If user team and user player provided, inject user into opening or top order
  const lineup: PlayingXIPlayer[] = rawList.map((p, idx) => {
    if (isUserTeam && userPlayer && idx === 0) {
      return {
        id: userPlayer.id,
        name: userPlayer.name,
        nameBn: userPlayer.name,
        role: userPlayer.role,
        isCaptain: true,
        isViceCaptain: false,
        isWicketKeeper: userPlayer.role === 'WICKET_KEEPER_BATSMAN',
        battingStyle: userPlayer.battingStyle,
        bowlingStyle: userPlayer.bowlingStyle,
        rating: Math.round((userPlayer.attributes.timing + userPlayer.attributes.power + userPlayer.attributes.accuracy) / 3),
        jerseyNumber: userPlayer.jerseyNumber,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        oversBowled: 0,
        runsConceded: 0,
        wickets: 0,
        maidens: 0,
      };
    }

    return {
      ...p,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
      oversBowled: 0,
      runsConceded: 0,
      wickets: 0,
      maidens: 0,
    };
  });

  return lineup;
}

/**
 * Get bowlers list available for bowling changes
 */
export function getBowlingRotationList(lineup: PlayingXIPlayer[]): { player: PlayingXIPlayer; index: number }[] {
  // Bowlers and All-Rounders ranked from slots 6-11 and all-rounders 4-5
  const eligible = lineup
    .map((p, index) => ({ player: p, index }))
    .filter(({ player, index }) => player.role === 'BOWLER' || player.role === 'ALL_ROUNDER' || index >= 5);

  return eligible.length > 0 ? eligible : lineup.slice(6).map((p, idx) => ({ player: p, index: idx + 6 }));
}
