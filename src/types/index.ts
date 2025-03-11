
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
