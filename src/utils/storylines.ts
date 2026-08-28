import { StoryEvent, PressQuestion, ShopItem, CareerTier } from '../types/cricket';

export const SHOP_ITEMS: ShopItem[] = [
  // BATS
  {
    id: 'bat_kashmir',
    name: 'Kashmir Willow Special',
    category: 'BAT',
    price: 150,
    description: 'A solid seasoned Kashmir willow with sturdy punch. Great for street & district leagues.',
    icon: '🏏',
    boost: { power: 3, timing: 2 },
    owned: true, // Default starter
  },
  {
    id: 'bat_grade2',
    name: 'Pro Club English Willow (Grade 2)',
    category: 'BAT',
    price: 800,
    description: 'Crisp pickup with 38mm thick edges. Enhances sweet-spot timing and lofted drives.',
    icon: '🏏',
    boost: { timing: 6, power: 5, shotPlacement: 4 },
    owned: false,
  },
  {
    id: 'bat_players_edition',
    name: 'Players Edition Carbon Curve (Grade 1+)',
    category: 'BAT',
    price: 2500,
    description: 'Handcrafted grade-1 English willow with carbon spine. Unleashes massive sixes with effortless swing.',
    icon: '🏏',
    boost: { timing: 12, power: 14, shotPlacement: 8, clutch: 5 },
    owned: false,
  },
  {
    id: 'bat_gold_legend',
    name: 'Golden Blade "Master Blaster" Signature',
    category: 'BAT',
    price: 8000,
    description: 'Legendary custom crafted willow with titanium handle reinforcement. The ultimate cricket weapon.',
    icon: '🏏',
    boost: { timing: 20, power: 22, shotPlacement: 15, clutch: 12 },
    owned: false,
  },

  // GEAR & SHOES
  {
    id: 'gear_spikes',
    name: 'Spike Pro Athletic Boots',
    category: 'GEAR',
    price: 350,
    description: 'Lightweight studded spikes for rapid acceleration between wickets and sharp boundary fielding.',
    icon: '👟',
    boost: { runningSpeed: 8, fielding: 6 },
    owned: false,
  },
  {
    id: 'gear_pro_pads',
    name: 'Aero-Shield Ultralight Pads & Gloves',
    category: 'GEAR',
    price: 600,
    description: 'High-density foam padding protecting against 150 km/h bouncers. Increases pace tolerance.',
    icon: '🥊',
    boost: { paceTolerance: 10, stamina: 5 },
    owned: false,
  },
  {
    id: 'gear_smart_sensor',
    name: 'Smart Bat Sensor & Analytics AI',
    category: 'GEAR',
    price: 1200,
    description: 'Real-time telemetry measuring bat swing speed and contact angle. Sharpens shot placement.',
    icon: '📱',
    boost: { timing: 8, shotPlacement: 10, spinReading: 8 },
    owned: false,
  },

  // STAFF & COACHES
  {
    id: 'staff_physio',
    name: 'Personal Sports Physio & Nutritionist',
    category: 'STAFF',
    price: 1500,
    description: 'Elite recovery routines, bespoke protein diets and injury prevention plans.',
    icon: '🩺',
    boost: { stamina: 12, energy: 20 },
    owned: false,
  },
  {
    id: 'staff_batting_coach',
    name: 'Former Legend Batting Consultant',
    category: 'STAFF',
    price: 3500,
    description: 'Masterclass video analysis on deciphering mystery spin and backfoot punching.',
    icon: '👨‍🏫',
    boost: { spinReading: 14, paceTolerance: 12, clutch: 10 },
    owned: false,
  },
  {
    id: 'staff_pr_manager',
    name: 'Elite Celebrity PR & Talent Agent',
    category: 'STAFF',
    price: 5000,
    description: 'Secures high-paying brand endorsements, magazine covers, and explodes your fan following.',
    icon: '💼',
    boost: { fame: 500, form: 10 },
    owned: false,
  },

  // LIFESTYLE
  {
    id: 'life_sports_car',
    name: 'Custom Matte Black Supercar',
    category: 'LIFESTYLE',
    price: 15000,
    description: 'Turn heads driving into the stadium. Massively boosts player prestige and confidence.',
    icon: '🏎️',
    boost: { fame: 2000, morale: 20 },
    owned: false,
  },
  {
    id: 'life_penthouse',
    name: 'Luxury Sky Penthouse with Private Gym & Nets',
    category: 'LIFESTYLE',
    price: 45000,
    description: 'Rooftop synthetic pitch with automated bowling machines and infinity pool.',
    icon: '🏙️',
    boost: { energy: 30, stamina: 15, fame: 5000, morale: 25 },
    owned: false,
  },
];

export const STORY_EVENTS: StoryEvent[] = [
  {
    id: 'event_captain_dilemma',
    title: 'The Captain\'s Request',
    titleBn: 'অধিনায়কের বিশেষ অনুরোধ',
    category: 'DRESSING_ROOM',
    speaker: 'Team Captain Shakib/Virat',
    speakerRole: 'Senior Leader',
    description: 'The captain pulls you aside before the big game: "We need someone to anchor the innings today under tricky overcast conditions. Can I count on your patience, or will you play your aggressive natural game?"',
    descriptionBn: 'ম্যাচের আগে অধিনায়ক ডেকে বললেন: "আজকের মেঘলা আবহাওয়ায় টিকে থাকা খুব কঠিন। তুমি কি ধৈর্য ধরে ইনিংস গড়বে নাকি তোমার স্বভাবসুলভ আক্রমণাত্মক খেলা খেলবে?"',
    choices: [
      {
        id: 'c1',
        text: 'Promise patience: "I will anchor the team and protect my wicket at all costs."',
        textBn: 'ধৈর্যশীল হওয়ার প্রতিশ্রুতি দিন: "আমি উইকেটে টিকে থেকে দলের দায়িত্ব নেব।"',
        outcomeText: 'The captain nods approvingly. Coach trust increased, batting patience boosted!',
        outcomeTextBn: 'অধিনায়ক খুশি হলেন। কোচের আস্থা বাড়ল এবং শট সিলেকশন আরও নিখুঁত হলো!',
        impact: { coachTrust: 15, morale: 10, form: 5 },
      },
      {
        id: 'c2',
        text: 'Back yourself: "I play best when I attack the bowlers from ball one!"',
        textBn: 'নিজের আগ্রাসনে ভরসা রাখুন: "আমি আক্রমণাত্মক খেলেই বোলারদের চাপে রাখব!"',
        outcomeText: 'The captain smiles: "Show them no fear then!" Power hitting boosted, but risk is high.',
        outcomeTextBn: 'অধিনায়ক বললেন: "তাহলে মাঠে ঝড় তোলো!" পাওয়ার হিটিং আত্মবিশ্বাস বাড়ল।',
        impact: { coachTrust: 5, form: 10, morale: 15 },
      },
    ],
  },
  {
    id: 'event_sponsor_approach',
    title: 'Major Bat Sponsor Deal',
    titleBn: 'ব্যাট স্পন্সরশিপের লোভনীয় প্রস্তাব',
    category: 'SPONSOR',
    speaker: 'Global Sports Brand Agent',
    speakerRole: 'Marketing Director',
    description: 'A prestigious sporting gear manufacturer offers a lucrative sticker sponsorship deal on your bat, but demands a 6-hour commercial shoot the night before a vital match.',
    descriptionBn: 'একটি বড় স্পোর্টস ব্র্যান্ড আপনার ব্যাটে স্টিকার লাগানোর জন্য মোটা অঙ্কের অফার দিয়েছে, তবে ম্যাচের আগের রাতে ৬ ঘণ্টার শুটিং করতে হবে।',
    choices: [
      {
        id: 'c1',
        text: 'Sign the contract and attend the night shoot for high cash payout.',
        textBn: 'চুক্তি স্বাক্ষর করে রাতের শুটিংয়ে যান (মোটা অঙ্কের টাকা পাবেন, তবে ক্লান্তি বাড়বে)।',
        outcomeText: 'You earned $2,000 cash and fame, but lost some sleep and energy before match day!',
        outcomeTextBn: 'আপনি $২,০০০ টাকা ও খ্যাতি পেলেন, তবে ঘুমের অভাবে কিছুটা এনার্জি কমল!',
        impact: { cash: 2000, fame: 350, energy: -20 },
      },
      {
        id: 'c2',
        text: 'Decline for now: "Cricket comes first. I need full rest for tomorrow."',
        textBn: 'প্রস্তাব ফিরিয়ে দিন: "আমার কাছে খেলা আগে। কালকের জন্য বিশ্রাম দরকার।"',
        outcomeText: 'The coach hears about your dedication. Coach trust and stamina recovery maximized!',
        outcomeTextBn: 'আপনার নিষ্ঠা দেখে কোচ মুগ্ধ হলেন। কোচের আস্থা ও এনার্জি তুঙ্গে!',
        impact: { coachTrust: 20, energy: 15, morale: 10 },
      },
    ],
  },
  {
    id: 'event_rival_sledge',
    title: 'Heated Sledging in the Nets',
    titleBn: 'নেটে প্রতিপক্ষের স্লেজিং',
    category: 'OPPONENT_SLEDGE',
    speaker: 'Fast Bowler Starc/Shaheen',
    speakerRole: 'Opposition Pace Ace',
    description: 'During optional practice, the rival team\'s fiery express pacer stares you down and remarks: "Enjoy your domestic games, kid. In the real match, my 150k bouncers will crack your helmet."',
    descriptionBn: 'অনুশীলনের সময় প্রতিপক্ষের ফাস্ট বোলার এসে কটূক্তি করে বলল: "ঘরোয়া লিগেই রাজা সেজে থাকো, ম্যাচে আমার ১৫০ কিমি বাউন্সারে ব্যাট ছুঁড়ে পালাবে।"',
    choices: [
      {
        id: 'c1',
        text: 'Stare back with icy silence and smash the next net delivery over extra cover.',
        textBn: 'শান্ত থেকে চোখে চোখ রেখে পরের বলটি সপাটে কভারের উপর দিয়ে সীমানাছাড়া করুন।',
        outcomeText: 'Ice in your veins! Your clutch composure and mental steel reached new heights.',
        outcomeTextBn: 'আপনার শীতল মনোভাব ও মানসিক দৃঢ়তা সবার প্রশংসা কুড়ালো!',
        impact: { morale: 20, form: 15 },
      },
      {
        id: 'c2',
        text: 'Fire back verbally: "Save your talk for the match, you will be retrieving balls from the roof!"',
        textBn: 'মুখে জবাব দিন: "কথা জমিয়ে রাখো, ম্যাচে ছক্কার বল স্টেডিয়ামের ছাদ থেকে কুড়াবে!"',
        outcomeText: 'The dressing room buzzes with hype! Massive fan popularity and swagger.',
        outcomeTextBn: 'ড্রেসিংরুম রোমাঞ্চে ফেটে পড়ল! ভক্তদের মাঝে আপনার উন্মাদনা বাড়ল।',
        impact: { fame: 250, morale: 15 },
      },
    ],
  },
  {
    id: 'event_fan_charity',
    title: 'Hospital Visit & Young Fans',
    titleBn: 'হাসপাতালে অসুস্থ শিশুর পাশে',
    category: 'PERSONAL',
    speaker: 'Community Coordinator',
    speakerRole: 'NGO Officer',
    description: 'A group of young hospital patients who dream of playing cricket requested a 1-hour meet and greet with you before your training session.',
    descriptionBn: 'হাসপাতালে ভর্তি কিছু খুদে ভক্ত আপনার সাথে দেখা করার ইচ্ছা প্রকাশ করেছে যারা ভবিষ্যতে ক্রিকেটার হতে চায়।',
    choices: [
      {
        id: 'c1',
        text: 'Spend quality time, gift them signed bats and bring smiles to their faces.',
        textBn: 'তাদের সাথে সময় কাটান, অটোগ্রাফ দেওয়া ব্যাট উপহার দিয়ে উৎসাহ জোগান।',
        outcomeText: 'Heartwarming moment! Public admiration skyrockets and your morale is blessed.',
        outcomeTextBn: 'হৃদয়স্পর্শী মুহূর্ত! মিডিয়ায় আপনার সুনাম ছড়িয়ে পড়ল এবং আত্মতৃপ্তি বাড়ল।',
        impact: { fame: 600, morale: 25, cash: -100 },
      },
      {
        id: 'c2',
        text: 'Send signed merchandise via assistant so you can do 50 extra batting drills.',
        textBn: 'সহকারী মারফত উপহার পাঠিয়ে দিয়ে নেটে বাড়তি ৫০টি বল অনুশীলন করুন।',
        outcomeText: 'Pure focus on grind! Batting timing honed to perfection.',
        outcomeTextBn: 'কঠোর অনুশীলনে আপনার টাইমিং আরও ধারালো হলো।',
        impact: { form: 15 },
      },
    ],
  },
];

export function generateDynamicPressQuestions(
  userRuns: number,
  userBalls: number,
  userWickets: number,
  wonMatch: boolean,
  isCenturion: boolean,
  isDuck: boolean
): PressQuestion[] {
  const questions: PressQuestion[] = [];

  if (isCenturion || userRuns >= 50) {
    questions.push({
      id: 'pq_big_score',
      journalist: 'Rezaul Karim',
      mediaOutlet: 'CricTracker Live',
      question: `Phenomenal knock of ${userRuns} runs off just ${userBalls} balls today! Were you eyeing the boundaries right from ball one, or did you adjust to the pitch conditions?`,
      questionBn: `আজ মাত্র ${userBalls} বলে ${userRuns} রানের অনবদ্য ইনিংস! শুরু থেকেই কি আক্রমণাত্মক পরিকল্পনা ছিল, নাকি পিচ দেখে খেলতে হয়েছে?`,
      context: 'BIG_SCORE',
      answers: [
        {
          text: 'It was all about team requirement and executing what we practiced in the nets.',
          textBn: 'পুরো কৃতিত্ব দলের পরিকল্পনার এবং নেটে কঠোর অনুশীলনের ফল।',
          tone: 'HUMBLE',
          coachImpact: 15,
          fanImpact: 100,
          moraleImpact: 10,
        },
        {
          text: 'When the ball hits the sweet-spot like that, no boundary in the world is big enough!',
          textBn: 'ব্যাটের ঠিক মাঝে যখন বল লাগে, বিশ্বের কোনো সীমানাই তখন বড় মনে হয় না!',
          tone: 'CONFIDENT',
          coachImpact: 5,
          fanImpact: 350,
          moraleImpact: 20,
        },
      ],
    });
  } else if (isDuck || userRuns <= 5) {
    questions.push({
      id: 'pq_duck',
      journalist: 'David Warner-Smith',
      mediaOutlet: 'Daily Sports Times',
      question: `Tough day at the crease getting dismissed early today. Critics are questioning your shot selection on that delivery. What is your response?`,
      questionBn: `আজ খুব দ্রুত আউট হয়ে ফিরতে হলো। বিশ্লেষকরা শট সিলেকশন নিয়ে প্রশ্ন তুলছেন। আপনার মন্তব্য কী?`,
      context: 'DUCK_FAILURE',
      answers: [
        {
          text: 'It was a brilliant delivery. I take responsibility and will work harder in the nets tomorrow.',
          textBn: 'বলটি অসাধারণ ছিল। আমি দায় স্বীকার করছি এবং কাল নেটে দ্বিগুণ পরিশ্রম করব।',
          tone: 'HUMBLE',
          coachImpact: 15,
          fanImpact: 50,
          moraleImpact: 5,
        },
        {
          text: 'Form is temporary, class is permanent. One bad ball doesn\'t define my ability.',
          textBn: 'ফর্ম সাময়িক, জাত খেলোয়াড় চিরস্থায়ী। একটি বাজে বল আমার সক্ষমতা পরিমাপ করে না।',
          tone: 'AGGRESSIVE',
          coachImpact: -5,
          fanImpact: 200,
          moraleImpact: 15,
        },
      ],
    });
  } else {
    questions.push({
      id: 'pq_general',
      journalist: 'Tariq Hasan',
      mediaOutlet: 'Cricket World Pulse',
      question: wonMatch 
        ? `What a thrilling team victory! As a crucial member of the squad, what turned the tide in the match?`
        : `A close heartbreak defeat today. How does the squad bounce back for the upcoming fixtures?`,
      questionBn: wonMatch 
        ? `দলের এক রোমাঞ্চকর জয়! দলের অন্যতম সেরা খেলোয়াড় হিসেবে মোড় ঘোরানোর মুহূর্ত কোনটি ছিল?`
        : `খুব কাছে গিয়েও অল্পের জন্য হার। আগামী ম্যাচের জন্য কীভাবে মানসিকভাবে ঘুরে দাঁড়াবেন?`,
      context: wonMatch ? 'VICTORY' : 'DEFEAT',
      answers: [
        {
          text: wonMatch ? 'Every single player fought till the last ball. Super proud of our brotherhood!' : 'We will analyze our mistakes and come back stronger.',
          textBn: wonMatch ? 'প্রত্যেক খেলোয়াড় শেষ বল পর্যন্ত লড়াই করেছে। এই দল নিয়ে আমি গর্বিত!' : 'আমরা ভুলগুলো শুধরে নিয়ে পরের ম্যাচে আরও শক্তিশালী হয়ে ফিরব।',
          tone: 'HUMBLE',
          coachImpact: 10,
          fanImpact: 120,
          moraleImpact: 10,
        },
        {
          text: wonMatch ? 'We knew we had their measure. We are playing championship cricket!' : 'We were the better team, just a few unlucky moments decided the game.',
          textBn: wonMatch ? 'আমরা জানতাম আমরাই জিতব। আমাদের লক্ষ্য ট্রফি জয়!' : 'আমরা ভালো খেলেছি, সামান্য কিছু আনলাকি মুহূর্ত ম্যাচের ভাগ্য নির্ধারণ করেছে।',
          tone: 'CONFIDENT',
          coachImpact: 5,
          fanImpact: 250,
          moraleImpact: 15,
        },
      ],
    });
  }

  return questions;
}
