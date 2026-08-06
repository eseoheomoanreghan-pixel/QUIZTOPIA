import { Question, DifficultyId } from '../types';

export function generateTopicQuestions(topic: string, difficulty: DifficultyId): Question[] {
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();

  // Known topic presets for rich custom trivia if offline / quota exhausted
  if (lower.includes('naruto')) {
    return [
      {
        id: `custom_naruto_1`,
        category: 'custom',
        difficulty,
        question: `In Naruto, what is the title of the leader of the Hidden Leaf Village (Konohagakure)?`,
        options: ['Hokage', 'Kazekage', 'Mizukage'],
        correctAnswer: 'Hokage',
        explanation: 'The Hokage is the supreme leader and strongest ninja in the Hidden Leaf Village!',
        imageUrl: '/images/anime/naruto.jpg',
      },
      {
        id: `custom_naruto_2`,
        category: 'custom',
        difficulty,
        question: `What is the name of the Nine-Tailed Fox beast sealed inside Naruto Uzumaki?`,
        options: ['Kurama', 'Gyuki', 'Shukaku'],
        correctAnswer: 'Kurama',
        explanation: 'Kurama is the Nine-Tails who becomes Naruto’s ultimate partner!',
        imageUrl: '/images/anime/naruto.jpg',
      },
      {
        id: `custom_naruto_3`,
        category: 'custom',
        difficulty,
        question: `Which signature Jutsu technique was taught to Naruto by Master Jiraiya?`,
        options: ['Rasengan', 'Chidori', 'Amaterasu'],
        correctAnswer: 'Rasengan',
        explanation: 'The Rasengan is a spinning sphere of concentrated chakra created by the 4th Hokage!',
        imageUrl: '/images/anime/naruto.jpg',
      },
      {
        id: `custom_naruto_4`,
        category: 'custom',
        difficulty,
        question: `Who are Naruto's original teammates in Team 7 under Kakashi Hatake?`,
        options: ['Sasuke Uchiha & Sakura Haruno', 'Shikamaru & Choji', 'Neji Hyuga & Tenten'],
        correctAnswer: 'Sasuke Uchiha & Sakura Haruno',
        explanation: 'Team 7 originally consists of Naruto, Sasuke, and Sakura led by Kakashi Sensei!',
        imageUrl: '/images/anime/naruto.jpg',
      },
    ];
  }

  if (lower.includes('demon slayer') || lower.includes('kimetsu')) {
    return [
      {
        id: `custom_ds_1`,
        category: 'custom',
        difficulty,
        question: `In Demon Slayer, what distinctive jewelry item does Tanjiro Kamado wear?`,
        options: ['Hanafuda Earrings', 'Magatama Necklace', 'Sun Pendant'],
        correctAnswer: 'Hanafuda Earrings',
        explanation: 'Tanjiro wears his family’s heirloom Hanafuda earrings inherited from Sun Breathing users.',
        imageUrl: '/images/anime/demon_slayer.jpg',
      },
      {
        id: `custom_ds_2`,
        category: 'custom',
        difficulty,
        question: `What is the name of Tanjiro Kamado's sister who was turned into a demon?`,
        options: ['Nezuko Kamado', 'Kanao Tsuyuri', 'Shinobu Kocho'],
        correctAnswer: 'Nezuko Kamado',
        explanation: 'Nezuko retains her human heart and fights alongside Tanjiro to protect humans.',
        imageUrl: '/images/anime/demon_slayer.jpg',
      },
      {
        id: `custom_ds_3`,
        category: 'custom',
        difficulty,
        question: `What special sword color does Tanjiro's Nichirin blade turn when forged?`,
        options: ['Black', 'Bright Red', 'Deep Blue'],
        correctAnswer: 'Black',
        explanation: 'Tanjiro’s Nichirin blade turns black, associated with Sun Breathing practitioners!',
        imageUrl: '/images/anime/demon_slayer.jpg',
      },
      {
        id: `custom_ds_4`,
        category: 'custom',
        difficulty,
        question: `Who is the Sound Hashira who leads the entertainment district mission in Demon Slayer?`,
        options: ['Tengen Uzui', 'Kyojuro Rengoku', 'Giyu Tomioka'],
        correctAnswer: 'Tengen Uzui',
        explanation: 'Tengen Uzui is the flamboyant Sound Hashira!',
        imageUrl: '/images/anime/demon_slayer.jpg',
      },
    ];
  }

  if (lower.includes('dr. stone') || lower.includes('dr stone') || lower.includes('senku')) {
    return [
      {
        id: `custom_ds_1`,
        category: 'custom',
        difficulty,
        question: `In Dr. Stone, what is Senku Ishigami's iconic catchphrase when expressing confidence?`,
        options: ['Ten Billion Percent!', 'One Hundred Percent!', 'To Infinity and Beyond!'],
        correctAnswer: 'Ten Billion Percent!',
        explanation: 'Senku uses "Ten Billion Percent" whenever calculating probabilities or scientific facts!',
        imageUrl: '/images/anime/dr_stone.jpg',
      },
      {
        id: `custom_ds_2`,
        category: 'custom',
        difficulty,
        question: `What is the name of the civilization kingdom founded by Senku in the Stone World?`,
        options: ['Kingdom of Science', 'Empire of Might', 'Petrification Alliance'],
        correctAnswer: 'Kingdom of Science',
        explanation: 'Senku creates the Kingdom of Science to restore technology and humanity!',
        imageUrl: '/images/anime/dr_stone.jpg',
      },
      {
        id: `custom_ds_3`,
        category: 'custom',
        difficulty,
        question: `What major invention does Senku craft to defeat Tsukasa's army without bloodshed?`,
        options: ['Cell Phone (Nitel Communication)', 'Steam Gorilla Tank', 'Dynamite Gun'],
        correctAnswer: 'Cell Phone (Nitel Communication)',
        explanation: 'Senku built a cell phone from scratch in the Stone World to communicate across distances!',
        imageUrl: '/images/anime/dr_stone.jpg',
      },
      {
        id: `custom_ds_4`,
        category: 'custom',
        difficulty,
        question: `What chemical fluid mixture is created by Senku and Taiju to undo petrification?`,
        options: ['Nital Acid (Nitric Acid + Alcohol)', 'Sulfuric Acid Bath', 'Aqua Regia Liquid'],
        correctAnswer: 'Nital Acid (Nitric Acid + Alcohol)',
        explanation: 'Nital revival fluid breaks down the stone casing surrounding petrified humans!',
        imageUrl: '/images/anime/dr_stone.jpg',
      },
    ];
  }

  if (lower.includes('jujutsu') || lower.includes('gojo') || lower.includes('jjk')) {
    return [
      {
        id: `custom_jjk_1`,
        category: 'custom',
        difficulty,
        question: `In Jujutsu Kaisen, what is Satoru Gojo's signature Domain Expansion technique?`,
        options: ['Unlimited Void', 'Malevolent Shrine', 'Chimera Shadow Garden'],
        correctAnswer: 'Unlimited Void',
        explanation: 'Unlimited Void floods the victim’s brain with infinite information, paralyzing them!',
        imageUrl: '/images/anime/jujutsu_kaisen.jpg',
      },
      {
        id: `custom_jjk_2`,
        category: 'custom',
        difficulty,
        question: `Who swallowed Ryomen Sukuna's cursed finger to gain cursed energy?`,
        options: ['Yuji Itadori', 'Megumi Fushiguro', 'Yuta Okkotsu'],
        correctAnswer: 'Yuji Itadori',
        explanation: 'Yuji swallowed Sukuna’s finger to save his friends, becoming Sukuna’s vessel!',
        imageUrl: '/images/anime/jujutsu_kaisen.jpg',
      },
      {
        id: `custom_jjk_3`,
        category: 'custom',
        difficulty,
        question: `What special ocular trait allows Satoru Gojo to see cursed energy in atomic detail?`,
        options: ['Six Eyes', 'Sharingan', 'Byakugan'],
        correctAnswer: 'Six Eyes',
        explanation: 'The Six Eyes grant Gojo precise control over his Limitless cursed technique!',
        imageUrl: '/images/anime/jujutsu_kaisen.jpg',
      },
      {
        id: `custom_jjk_4`,
        category: 'custom',
        difficulty,
        question: `Who was Gojo Satoru's close friend and classmate during their Tokyo Jujutsu High student days?`,
        options: ['Suguru Geto', 'Kento Nanami', 'Toji Fushiguro'],
        correctAnswer: 'Suguru Geto',
        explanation: 'Gojo and Geto were known as the strongest duo during their high school years!',
        imageUrl: '/images/anime/jujutsu_kaisen.jpg',
      },
    ];
  }

  if (lower.includes('minecraft')) {
    return [
      {
        id: `custom_mc_1`,
        category: 'custom',
        difficulty,
        question: `In Minecraft, which boss mob must be defeated in The End dimension to beat the game?`,
        options: ['Ender Dragon', 'The Wither', 'Elder Guardian'],
        correctAnswer: 'Ender Dragon',
        explanation: 'Defeating the Ender Dragon spawns the exit portal and unlocks the End credits!',
      },
      {
        id: `custom_mc_2`,
        category: 'custom',
        difficulty,
        question: `What material is required to build a Nether Portal frame in Minecraft?`,
        options: ['Obsidian', 'Bedrock', 'Crying Obsidian'],
        correctAnswer: 'Obsidian',
        explanation: 'A Nether Portal requires at least 10 blocks of Obsidian ignited with Flint and Steel.',
      },
      {
        id: `custom_mc_3`,
        category: 'custom',
        difficulty,
        question: `Which iconic green Minecraft mob quietly approaches players and explodes?`,
        options: ['Creeper', 'Zombie', 'Enderman'],
        correctAnswer: 'Creeper',
        explanation: 'The Creeper was created accidentally during game development from a broken pig model!',
      },
      {
        id: `custom_mc_4`,
        category: 'custom',
        difficulty,
        question: `What red mineral dust in Minecraft allows players to construct electrical circuits and logic gates?`,
        options: ['Redstone', 'Glowstone', 'Blaze Powder'],
        correctAnswer: 'Redstone',
        explanation: 'Redstone acts as Minecraft’s electricity system for automated doors, traps, and computers!',
      },
    ];
  }

  if (lower.includes('roblox')) {
    return [
      {
        id: `custom_rb_1`,
        category: 'custom',
        difficulty,
        question: `What is the virtual currency used to buy avatar items and gamepasses in Roblox?`,
        options: ['Robux', 'V-Bucks', 'Minecoins'],
        correctAnswer: 'Robux',
        explanation: 'Robux is the official currency used across all Roblox experiences and avatar shop items.',
      },
      {
        id: `custom_rb_2`,
        category: 'custom',
        difficulty,
        question: `Which programming language is used by creators to script games in Roblox Studio?`,
        options: ['Lua', 'Python', 'JavaScript'],
        correctAnswer: 'Lua',
        explanation: 'Roblox uses Luau, a fast version of Lua, for game logic and scripts!',
      },
      {
        id: `custom_rb_3`,
        category: 'custom',
        difficulty,
        question: `Which extremely popular Roblox pet-collecting game was created by DreamCraft?`,
        options: ['Adopt Me!', 'Brookhaven RP', 'Blox Fruits'],
        correctAnswer: 'Adopt Me!',
        explanation: 'Adopt Me! is one of the most played Roblox experiences of all time!',
      },
      {
        id: `custom_rb_4`,
        category: 'custom',
        difficulty,
        question: `Who is the co-founder and current CEO of Roblox Corporation?`,
        options: ['David Baszucki (Builderman)', 'Gabe Newell', 'Mark Zuckerberg'],
        correctAnswer: 'David Baszucki (Builderman)',
        explanation: 'David Baszucki founded Roblox in 2004 alongside Erik Cassel!',
      },
    ];
  }

  // Dynamic fallback for ANY other typed topic
  return [
    {
      id: `custom_gen_1`,
      category: 'custom',
      difficulty,
      question: `Regarding "${cleanTopic}", which of the following is considered a core element or key highlight?`,
      options: [
        `Major iconic lore and facts of ${cleanTopic}`,
        `Unrelated fictional myths`,
        `Random trivia from other topics`
      ],
      correctAnswer: `Major iconic lore and facts of ${cleanTopic}`,
      explanation: `Exploring ${cleanTopic} reveals its central facts, lore, and defining characteristics!`,
    },
    {
      id: `custom_gen_2`,
      category: 'custom',
      difficulty,
      question: `When discussing "${cleanTopic}", what is a primary concept or achievement enthusiasts focus on?`,
      options: [
        `Deep mastery and key milestones in ${cleanTopic}`,
        `Irrelevant historical events`,
        `Outdated fictional lore`
      ],
      correctAnswer: `Deep mastery and key milestones in ${cleanTopic}`,
      explanation: `${cleanTopic} contains rich details and milestones celebrated by fans and experts!`,
    },
    {
      id: `custom_gen_3`,
      category: 'custom',
      difficulty,
      question: `Which answer choice represents a true statement or fundamental principle in "${cleanTopic}"?`,
      options: [
        `Essential concepts and facts of ${cleanTopic}`,
        `Inaccurate rumors`,
        `Disproven myths`
      ],
      correctAnswer: `Essential concepts and facts of ${cleanTopic}`,
      explanation: `Understanding ${cleanTopic} requires knowing its core principles and facts!`,
    },
    {
      id: `custom_gen_4`,
      category: 'custom',
      difficulty,
      question: `In a championship trivia match about "${cleanTopic}", which option is the correct answer?`,
      options: [
        `The definitive expert facts on ${cleanTopic}`,
        `Incorrect distractor answer A`,
        `Incorrect distractor answer B`
      ],
      correctAnswer: `The definitive expert facts on ${cleanTopic}`,
      explanation: `You nailed the custom trivia question on ${cleanTopic}!`,
    },
  ];
}
