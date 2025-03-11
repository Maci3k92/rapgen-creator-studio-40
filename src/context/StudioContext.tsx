
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, Preset } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface StudioContextType {
  projects: Project[];
  currentBeat: ArrayBuffer | null;
  currentBeatUrl: string | null;
  currentBpm: number;
  currentBeatDuration: number | null;
  presetStyle: "Rap" | "Trap";
  selectedPreset: string;
  loading: boolean;
  generatingVocals: boolean;
  generatingMix: boolean;
  presets: Record<string, Preset>;
  setCurrentBeat: (beat: ArrayBuffer | null) => void;
  setCurrentBeatUrl: (url: string | null) => void;
  setCurrentBpm: (bpm: number) => void;
  setCurrentBeatDuration: (duration: number | null) => void;
  setPresetStyle: (style: "Rap" | "Trap") => void;
  setSelectedPreset: (preset: string) => void;
  applyPreset: (presetName: string) => void;
  generateTrack: (title: string, style: "Rap" | "Trap", bpm: number, length: number) => void;
  generateVocalTrack: (projectId: string, lyrics: string) => Promise<void>;
  mixTracks: (projectId: string) => Promise<void>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentBeat, setCurrentBeat] = useState<ArrayBuffer | null>(null);
  const [currentBeatUrl, setCurrentBeatUrl] = useState<string | null>(null);
  const [currentBpm, setCurrentBpm] = useState<number>(140);
  const [currentBeatDuration, setCurrentBeatDuration] = useState<number | null>(null);
  const [presetStyle, setPresetStyle] = useState<"Rap" | "Trap">("Rap");
  const [selectedPreset, setSelectedPreset] = useState<string>("Classic Rap");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingVocals, setGeneratingVocals] = useState<boolean>(false);
  const [generatingMix, setGeneratingMix] = useState<boolean>(false);

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

    // Use the detected beat duration or the user-selected length
    const trackLength = currentBeatDuration || length;

    // Simulate AI generation delay
    setTimeout(() => {
      const generatedText = 
        `This is a sample generated text for "${title}" in ${style} style.\n` +
        `BPM: ${bpm}, Length: ${trackLength}s\n\n` +
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
        length: trackLength,
        lyrics: generatedText,
        date: new Date().toISOString(),
        beatUrl: currentBeatUrl || undefined,
        beatDuration: currentBeatDuration || undefined
      };

      setProjects(prev => [newProject, ...prev]);
      setLoading(false);
      toast.success("Track generated successfully! You can now generate vocals.");
    }, 2000);
  };

  const generateVocalTrack = async (projectId: string, lyrics: string) => {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      toast.error("Project not found");
      return;
    }

    setGeneratingVocals(true);
    
    try {
      // Simulate vocal generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a simple vocal-like audio for demonstration
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscNode = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscNode.type = 'sine';
      oscNode.frequency.value = projects[projectIndex].style === 'Trap' ? 200 : 180;
      gainNode.gain.value = 0.5;
      
      oscNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const duration = 5; // 5 seconds sample
      const sampleRate = audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      
      const myArrayBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
      const nowBuffering = myArrayBuffer.getChannelData(0);
      
      for (let i = 0; i < frameCount; i++) {
        // Add some variation to simulate speech pattern
        const modulation = Math.sin(i / 1000) * 0.5 + 0.5;
        nowBuffering[i] = (Math.sin(i / 10) * modulation * 0.5);
      }
      
      // Convert buffer to WAV
      const audioBlob = new Blob([exportWAV(myArrayBuffer)], { type: 'audio/wav' });
      const vocalUrl = URL.createObjectURL(audioBlob);
      
      // Update project with vocal track URL
      const updatedProjects = [...projects];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        vocalUrl
      };
      
      setProjects(updatedProjects);
      toast.success("Vocals generated successfully! You can now mix the track.");
    } catch (error) {
      console.error("Error generating vocal track:", error);
      toast.error("Failed to generate vocal track. Please try again.");
    } finally {
      setGeneratingVocals(false);
    }
  };

  const mixTracks = async (projectId: string) => {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      toast.error("Project not found");
      return;
    }

    const project = projects[projectIndex];
    if (!project.vocalUrl || !project.beatUrl) {
      toast.error("Both beat and vocals are required for mixing");
      return;
    }

    setGeneratingMix(true);
    
    try {
      // Simulate mixing process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demonstration, we'll just create a simple mixed track URL
      // In a real app, this would involve actual audio processing
      const mixedTrackUrl = project.vocalUrl; // Using vocal URL as placeholder
      
      // Update project with mixed track URL
      const updatedProjects = [...projects];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        mixedTrackUrl
      };
      
      setProjects(updatedProjects);
      toast.success("Track mixed successfully!");
    } catch (error) {
      console.error("Error mixing tracks:", error);
      toast.error("Failed to mix tracks. Please try again.");
    } finally {
      setGeneratingMix(false);
    }
  };

  // Helper function to create WAV file from audio buffer
  const exportWAV = (audioBuffer: AudioBuffer) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const result = new Float32Array(audioBuffer.length * numberOfChannels);
    const channelData = new Array(numberOfChannels);
    
    // Extract data from all channels
    for (let channel = 0; channel < numberOfChannels; channel++) {
      channelData[channel] = audioBuffer.getChannelData(channel);
    }
    
    // Interleave all channels
    let offset = 0;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        result[offset++] = channelData[channel][i];
      }
    }
    
    // Create WAV file
    const dataSize = result.length * 2; // 16-bit samples
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    
    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    
    // fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true); // format
    view.setUint16(22, numberOfChannels, true); // channels
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * numberOfChannels * 2, true); // byte rate
    view.setUint16(32, numberOfChannels * 2, true); // block align
    view.setUint16(34, bitDepth, true); // bits per sample
    
    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true); // data chunk size
    
    // Write samples
    floatTo16BitPCM(view, 44, result);
    
    return buffer;
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  const value = {
    projects,
    currentBeat,
    currentBeatUrl,
    currentBpm,
    currentBeatDuration,
    presetStyle,
    selectedPreset,
    loading,
    generatingVocals,
    generatingMix,
    presets,
    setCurrentBeat,
    setCurrentBeatUrl,
    setCurrentBpm,
    setCurrentBeatDuration,
    setPresetStyle,
    setSelectedPreset,
    applyPreset,
    generateTrack,
    generateVocalTrack,
    mixTracks
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
