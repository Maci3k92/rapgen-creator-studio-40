
export interface Project {
  id: string;
  title: string;
  style: "Rap" | "Trap";
  bpm: number;
  length: number;
  lyrics: string;
  date: string;
  beatUrl?: string;
}

export interface Preset {
  name: string;
  bpm: number;
  style: "Rap" | "Trap";
}

// Adding these presets to match your Streamlit implementation
export const DEFAULT_PRESETS: Preset[] = [
  { name: "Classic Rap", bpm: 90, style: "Rap" },
  { name: "Modern Trap", bpm: 140, style: "Trap" },
  { name: "Boom Bap", bpm: 95, style: "Rap" }
];
