
import { VocalPreset } from "@/types";

// Database of rhyming words to help with lyric generation
const RHYME_SETS = [
  ['flow', 'go', 'know', 'show', 'glow', 'slow', 'grow', 'blow', 'low', 'though'],
  ['beat', 'street', 'feet', 'complete', 'elite', 'sweet', 'repeat', 'defeat', 'heat', 'tweet'],
  ['game', 'fame', 'name', 'flame', 'same', 'aim', 'claim', 'frame', 'blame', 'shame'],
  ['mind', 'find', 'blind', 'behind', 'kind', 'grind', 'defined', 'designed', 'aligned', 'combined'],
  ['day', 'way', 'say', 'play', 'stay', 'away', 'display', 'okay', 'sway', 'pray'],
  ['time', 'rhyme', 'prime', 'climb', 'crime', 'sublime', 'paradigm', 'pantomime', 'dime', 'chime'],
  ['life', 'strife', 'knife', 'wife', 'rife', 'fife'],
  ['real', 'feel', 'deal', 'steel', 'seal', 'heel', 'meal', 'wheel', 'zeal', 'appeal'],
  ['high', 'sky', 'fly', 'try', 'guy', 'by', 'why', 'cry', 'tie', 'my'],
  ['sound', 'round', 'bound', 'found', 'ground', 'pound', 'around', 'profound', 'renowned', 'compound']
];

// Rap themes
const RAP_THEMES = [
  'street life', 'struggle', 'success', 'ambition', 'perseverance',
  'authenticity', 'competition', 'legacy', 'wealth', 'hardship',
  'urban experience', 'hustle', 'loyalty', 'respect', 'triumph over adversity',
  'social commentary', 'self-expression', 'art', 'craft', 'cultural influence'
];

// Trap themes
const TRAP_THEMES = [
  'luxury lifestyle', 'extravagance', 'party life', 'nightlife', 'money',
  'opulence', 'flexing', 'status symbols', 'designer brands', 'cars',
  'success story', 'rise to fame', 'street credibility', 'influence', 'power',
  'city life', 'excess', 'hustle', 'grinding', 'ambition'
];

// Helper to get random items from an array
const getRandomItems = (array: string[], count: number): string[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get rhyming words for a theme
const getRhymingWordsForLine = (excludeSets: number[] = []): { words: string[], setIndex: number } => {
  const availableSets = RHYME_SETS.map((_, i) => i).filter(i => !excludeSets.includes(i));
  const setIndex = availableSets[Math.floor(Math.random() * availableSets.length)];
  return { words: RHYME_SETS[setIndex], setIndex };
};

// Generate verse with proper structure and rhyme scheme
const generateVerse = (title: string, style: "Rap" | "Trap", themes: string[]): string => {
  let verse = '';
  const rhymeSetsUsed: number[] = [];
  
  // Generate 8 lines per verse with alternating rhyme scheme (ABABCDCD)
  const rhymeScheme = ['A', 'B', 'A', 'B', 'C', 'D', 'C', 'D'];
  const rhymeWords: Record<string, string[]> = {};
  
  rhymeScheme.forEach(scheme => {
    if (!rhymeWords[scheme]) {
      const { words, setIndex } = getRhymingWordsForLine(rhymeSetsUsed);
      rhymeWords[scheme] = words;
      rhymeSetsUsed.push(setIndex);
    }
  });
  
  rhymeScheme.forEach((scheme, i) => {
    const rhymeOptions = rhymeWords[scheme];
    const endWord = rhymeOptions[Math.floor(Math.random() * rhymeOptions.length)];
    
    let line = '';
    // First line of each rhyme pair often references the title or a theme
    if (i % 2 === 0) {
      if (i === 0) {
        line = `${title} got me feeling like I'm ready to ${endWord}`;
      } else {
        const theme = themes[Math.floor(Math.random() * themes.length)];
        line = `This ${theme} life, watch how we continue to ${endWord}`;
      }
    } else {
      if (style === 'Trap') {
        line = `In the trap with the beat, that's how we ${endWord}`;
      } else {
        line = `On the mic with the flow, that's just how I ${endWord}`;
      }
    }
    
    verse += line + '\n';
  });
  
  return verse;
};

// Generate chorus with repetition and memorable hooks
const generateChorus = (title: string, style: "Rap" | "Trap", bpm: number): string => {
  let chorus = '';
  const { words } = getRhymingWordsForLine();
  const rhymeWord1 = words[Math.floor(Math.random() * words.length)];
  const rhymeWord2 = words[Math.floor(Math.random() * words.length)];
  
  // Chorus structure with repetition and hook
  if (style === 'Trap') {
    chorus += `[Chorus]\n`;
    chorus += `${title}, yeah, ${title} (${title})\n`;
    chorus += `Got that beat at ${bpm}, watch me ${rhymeWord1}\n`;
    chorus += `${title}, yeah, ${title} (${title})\n`;
    chorus += `This is how we live, this is how we ${rhymeWord2}\n`;
  } else {
    chorus += `[Chorus]\n`;
    chorus += `This is ${title}, can't you hear the ${rhymeWord1}?\n`;
    chorus += `BPM at ${bpm}, feeling so alive\n`;
    chorus += `This is ${title}, rhythm in my ${rhymeWord2}\n`;
    chorus += `Classic beats and rhymes, that's how we survive\n`;
  }
  
  return chorus;
};

// Generate bridge to add variety
const generateBridge = (style: "Rap" | "Trap"): string => {
  let bridge = '[Bridge]\n';
  
  if (style === 'Trap') {
    bridge += 'Break it down now, let the beat speak\n';
    bridge += 'Trap life rhythm, got that unique technique\n';
    bridge += 'Turn it up loud, let the speakers peak\n';
    bridge += 'This is that sound that makes your system leak\n';
  } else {
    bridge += 'Now hold up, let me break it down\n';
    bridge += 'This is that classic flow, that authentic sound\n';
    bridge += 'Been in the game, know how to move the crowd\n';
    bridge += 'Real hip-hop vibes, keeping it profound\n';
  }
  
  return bridge;
};

// Generate outro
const generateOutro = (title: string): string => {
  return `[Outro]\n${title} (${title})\nThat's how we do (that's how we do)\nOne time for the beat (for the beat)\nOne time for the flow (for the flow)\n`;
};

// Main lyrics generator function
export const generateBetterLyrics = (
  title: string, 
  style: "Rap" | "Trap", 
  bpm: number, 
  length: number,
  vocalPreset: VocalPreset
): string => {
  // Choose themes based on style
  const themes = style === 'Trap' ? getRandomItems(TRAP_THEMES, 3) : getRandomItems(RAP_THEMES, 3);
  
  // Structure based on track length
  let lyrics = '';
  
  // Intro
  lyrics += `[Intro]\n${title} (${title})\nYeah... Let's go\n\n`;
  
  // First verse
  lyrics += `[Verse 1]\n${generateVerse(title, style, themes)}\n`;
  
  // Chorus
  lyrics += `${generateChorus(title, style, bpm)}\n`;
  
  // Second verse if track is long enough
  if (length > 120) {
    lyrics += `[Verse 2]\n${generateVerse(title, style, themes)}\n`;
    lyrics += `${generateChorus(title, style, bpm)}\n`;
  }
  
  // Bridge for longer tracks
  if (length > 180) {
    lyrics += `${generateBridge(style)}\n`;
    lyrics += `${generateChorus(title, style, bpm)}\n`;
  }
  
  // Outro
  lyrics += generateOutro(title);
  
  // Add metadata for the vocal style
  lyrics += `\n[Vocal Style: ${vocalPreset.name}, Gender: ${vocalPreset.gender}, Pitch: ${vocalPreset.pitch}]`;
  
  return lyrics;
};
