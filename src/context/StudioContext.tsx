
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, Preset } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface StudioContextType {
  projects: Project[];
  currentBeat: ArrayBuffer | null;
  currentBeatUrl: string | null;
  currentBpm: number;
  presetStyle: "Rap" | "Trap";
  selectedPreset: string;
  loading: boolean;
  presets: Record<string, Preset>;
  setCurrentBeat: (beat: ArrayBuffer | null) => void;
  setCurrentBeatUrl: (url: string | null) => void;
  setCurrentBpm: (bpm: number) => void;
  setPresetStyle: (style: "Rap" | "Trap") => void;
  setSelectedPreset: (preset: string) => void;
  applyPreset: (presetName: string) => void;
  generateTrack: (title: string, style: "Rap" | "Trap", bpm: number, length: number) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentBeat, setCurrentBeat] = useState<ArrayBuffer | null>(null);
  const [currentBeatUrl, setCurrentBeatUrl] = useState<string | null>(null);
  const [currentBpm, setCurrentBpm] = useState<number>(140);
  const [presetStyle, setPresetStyle] = useState<"Rap" | "Trap">("Rap");
  const [selectedPreset, setSelectedPreset] = useState<string>("Classic Rap");
  const [loading, setLoading] = useState<boolean>(false);

  const presets: Record<string, Preset> = {
    "Classic Rap": { name: "Classic Rap", bpm: 90, style: "Rap" },
    "Modern Trap": { name: "Modern Trap", bpm: 140, style: "Trap" },
    "Boom Bap": { name: "Boom Bap", bpm: 95, style: "Rap" },
    "Lo-Fi Hip Hop": { name: "Lo-Fi Hip Hop", bpm: 80, style: "Rap" },
    "Drill": { name: "Drill", bpm: 140, style: "Trap" },
  };

  useEffect(() => {
    // Load projects from localStorage on component mount
    const savedProjects = localStorage.getItem("rapgen-projects");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Error loading saved projects:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save projects to localStorage whenever they change
    localStorage.setItem("rapgen-projects", JSON.stringify(projects));
  }, [projects]);

  const applyPreset = (presetName: string) => {
    if (presets[presetName]) {
      const preset = presets[presetName];
      setCurrentBpm(preset.bpm);
      setPresetStyle(preset.style);
      setSelectedPreset(presetName);
      toast(`Applied preset: ${presetName}`);
    }
  };

  const generateTrack = (title: string, style: "Rap" | "Trap", bpm: number, length: number) => {
    if (!title || !currentBeat) {
      toast.error("Please enter a title and upload a beat");
      return;
    }

    setLoading(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const generatedText = 
        `This is a sample generated text for "${title}" in ${style} style.\n` +
        `BPM: ${bpm}, Length: ${length}s\n\n` +
        `[Verse 1]\n` +
        `I'm in the studio, crafting my flow\n` +
        `Beat is ${bpm} BPM, watch me go\n` +
        `${style === "Trap" ? "Trap beats hitting hard" : "Classic beats in my veins"}\n` +
        `This is how we do it in the game\n\n` +
        `[Chorus]\n` +
        `RapGen Studio, helping me create\n` +
        `Artificial flows that sound first-rate\n` +
        `${style === "Trap" ? "Trap vibes" : "Boom bap"} all day, that's my state\n` +
        `Generating hits at a rapid rate`;

      const newProject: Project = {
        id: uuidv4(),
        title,
        style,
        bpm,
        length,
        lyrics: generatedText,
        date: new Date().toISOString(),
        beatUrl: currentBeatUrl || undefined
      };

      setProjects(prev => [newProject, ...prev]);
      setLoading(false);
      toast.success("Track generated successfully!");
    }, 2000);
  };

  const value = {
    projects,
    currentBeat,
    currentBeatUrl,
    currentBpm,
    presetStyle,
    selectedPreset,
    loading,
    presets,
    setCurrentBeat,
    setCurrentBeatUrl,
    setCurrentBpm,
    setPresetStyle,
    setSelectedPreset,
    applyPreset,
    generateTrack
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
};
