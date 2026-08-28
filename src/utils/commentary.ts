import { BallOutcome } from '../types/cricket';

// Commentary banks in English and Bengali for cricket immersion
export function generateCricketCommentary(
  outcome: Partial<BallOutcome>,
  batsmanName: string,
  bowlerName: string,
  runs: number,
  isWicket: boolean,
  shotType?: string
): { en: string; bn: string } {
  if (isWicket) {
    const wicketType = outcome.wicketType || 'CAUGHT';
    if (wicketType === 'BOWLED') {
      return {
        en: `CLEAN BOWLED! ${bowlerName} shatters the timber! The stumps are sent cartwheeling. Big blow for ${batsmanName}!`,
        bn: `ক্লিন বোল্ড! ${bowlerName} ভেঙে দিলেন স্ট্যাম্প! অফ-স্ট্যাম্প উড়ে গেল বহু দূরে। বিদায় নিলেন ${batsmanName}!`
      };
    } else if (wicketType === 'LBW') {
      return {
        en: `LOUD APPEAL... AND GIVEN! Rapid delivery, caught right in front of middle and leg. ${batsmanName} has to walk!`,
        bn: `জোরালো আবেদন... এবং আউট! প্যাডে আঘাত হেনেছিল সোজা লাইনে। আম্পায়ারের আঙুল উঠে গেল, ফিরছেন ${batsmanName}!`
      };
    } else if (wicketType === 'CAUGHT') {
      return {
        en: `IN THE AIR AND CAUGHT! ${batsmanName} went for the big hit, but didn't get all of it. Safe hands in the deep!`,
        bn: `উঁচু করে তুলে মেরেছিলেন, কিন্তু বাউন্ডারির কাছে সহজ ক্যাচ! কোনো ভুল করলেন না ফিল্ডার, আউট ${batsmanName}!`
      };
    } else if (wicketType === 'CAUGHT_BEHIND') {
      return {
        en: `EDGED AND TAKEN! A faint nick through to the wicketkeeper. Magnificent bowling by ${bowlerName}!`,
        bn: `ব্যাটের কানা ছুঁয়ে সোজা উইকেটকিপারের বিশ্বস্ত গ্লাভসে! দুর্দান্ত সুইং বল করলেন ${bowlerName}!`
      };
    } else {
      return {
        en: `OUT! What a dramatic dismissal! ${batsmanName} is on their way back to the pavilion.`,
        bn: `আউট! নাটকীয় বিদায়! প্যাভিলিয়নের পথে হাঁটছেন ${batsmanName}।`
      };
    }
  }

  if (runs === 6) {
    const sixRemarks = [
      {
        en: `SIX RUNS! High, handsome and into the second tier! That is pure class from ${batsmanName}!`,
        bn: `বিশাল ছক্কা! বল গিয়ে পড়ল গ্যালারির দ্বিতীয় তলায়! কী দুর্দান্ত শট খেললেন ${batsmanName}!`
      },
      {
        en: `MONSTER HIT! That ball is out of the stadium! ${batsmanName} picks the bones out of that delivery!`,
        bn: `অসাধারণ টাইমিংয়ে দানবীয় ছক্কা! স্টেডিয়ামের বাইরে ফেলে দিলেন ${batsmanName}!`
      },
      {
        en: `MAXIMUM! Stand and deliver! That was sent into orbit with authority!`,
        bn: `আকাশচুম্বী ছক্কা! কোনো নড়াচড়া ছাড়াই দাঁড়িয়ে অবিশ্বাস্য এক শটে বল গ্যালারিতে!`
      }
    ];
    return sixRemarks[Math.floor(Math.random() * sixRemarks.length)];
  }

  if (runs === 4) {
    const fourRemarks = [
      {
        en: `FOUR! Pierces the gap with pinpoint precision! The fielder gives chase in vain.`,
        bn: `দুর্দান্ত চার! ফিল্ডারদের ফাঁক গলে বিদ্যুৎ গতিতে বাউন্ডারির দড়ি ছুঁয়ে ফেলল!`
      },
      {
        en: `CRACKING SHOT! That made a sweet sound off the willow. Races away across the carpet!`,
        bn: `কী চোখ জুড়ানো বাউন্ডারি! ব্যাটের মাঝখান দিয়ে বের হওয়া বল সোজা বাউন্ডারির বাইরে!`
      },
      {
        en: `FOUR RUNS! Pure elegance from ${batsmanName}. No stopping that one!`,
        bn: `চার রান! শিল্পীর তুলির আঁচড়ের মতো মনমুগ্ধকর এক শট উপহার দিলেন ${batsmanName}!`
      }
    ];
    return fourRemarks[Math.floor(Math.random() * fourRemarks.length)];
  }

  if (runs === 2 || runs === 3) {
    return {
      en: `Good running between the wickets! Pushed into the deep and they scamper back for ${runs} runs.`,
      bn: `উইকেটের মাঝে চমৎকার রানিং! গ্যাপে ঠেলে দিয়ে দ্রুত গতিতে ${runs} রান তুলে নিলেন।`
    };
  }

  if (runs === 1) {
    return {
      en: `Tucked away gently into the leg side for a sharp single. Keeps the scoreboard ticking.`,
      bn: `হালকা করে পুশ করে একটি চটপটে সিঙ্গেল নিয়ে স্ট্রাইক রোটেট করলেন।`
    };
  }

  // Dot ball (0 runs)
  const dotRemarks = [
    {
      en: `Good length delivery on off stump, solidly defended back down the pitch. No run.`,
      bn: `দারুণ লাইন ও লেন্থে বল, সোজা ব্যাটে আত্মরক্ষামূলক খেলে দিলেন। কোনো রান হলো না।`
    },
    {
      en: `Beaten outside the off stump! Whistling past the outside edge. Excellent contest!`,
      bn: `অফ-স্ট্যাম্পের বাইরে সুইং করে বিট করলেন! ব্যাটের কানায় কানায় বেঁচে গেলেন ব্যাটার।`
    },
    {
      en: `Driven straight to the fielder at extra cover. Great fielding stops any run.`,
      bn: `কাভারে সরাসরি ফিল্ডারের হাতে। রান নেওয়ার কোনো সুযোগ দেননি ফিল্ডার।`
    }
  ];
  return dotRemarks[Math.floor(Math.random() * dotRemarks.length)];
}
