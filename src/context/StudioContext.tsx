
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, Preset, VocalPreset } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { generateBetterLyrics } from "@/utils/lyricsGenerator";

// Sample vocal presets
const VOCAL_PRESETS = [
  { id: "male_deep", name: "Male Deep", gender: "male", pitch: "deep", style: "Rap" },
  { id: "male_medium", name: "Male Medium", gender: "male", pitch: "medium", style: "Rap" },
  { id: "male_high", name: "Male High", gender: "male", pitch: "high", style: "Rap" },
  { id: "female_deep", name: "Female Deep", gender: "female", pitch: "deep", style: "Rap" },
  { id: "female_medium", name: "Female Medium", gender: "female", pitch: "medium", style: "Rap" },
  { id: "female_high", name: "Female High", gender: "female", pitch: "high", style: "Rap" },
  { id: "male_trap", name: "Male Trap", gender: "male", pitch: "medium", style: "Trap" },
  { id: "female_trap", name: "Female Trap", gender: "female", pitch: "medium", style: "Trap" },
  { id: "autotune_high", name: "Autotune High", gender: "neutral", pitch: "high", style: "Trap" },
  { id: "deep_fx", name: "Deep FX", gender: "male", pitch: "deep", style: "Trap", effects: "heavy" }
];

interface StudioContextType {
  projects: Project[];
  currentBeat: ArrayBuffer | null;
  currentBeatUrl: string | null;
  currentBpm: number;
  currentBeatDuration: number | null;
  presetStyle: "Rap" | "Trap" | "all";
  selectedPreset: string;
  selectedVocalPreset: string;
  loading: boolean;
  generatingVocals: boolean;
  generatingMix: boolean;
  presets: Record<string, Preset>;
  vocalPresets: VocalPreset[];
  setCurrentBeat: (beat: ArrayBuffer | null) => void;
  setCurrentBeatUrl: (url: string | null) => void;
  setCurrentBpm: (bpm: number) => void;
  setCurrentBeatDuration: (duration: number | null) => void;
  setPresetStyle: (style: "Rap" | "Trap" | "all") => void;
  setSelectedPreset: (preset: string) => void;
  setSelectedVocalPreset: (presetId: string) => void;
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
  const [presetStyle, setPresetStyle] = useState<"Rap" | "Trap" | "all">("Rap");
  const [selectedPreset, setSelectedPreset] = useState<string>("Classic Rap");
  const [selectedVocalPreset, setSelectedVocalPreset] = useState<string>("male_medium");
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

    // Generate better lyrics using our enhanced generator
    setTimeout(() => {
      // Find the selected vocal preset
      const vocalPreset = VOCAL_PRESETS.find(preset => preset.id === selectedVocalPreset) || VOCAL_PRESETS[0];
      
      // Generate lyrics with better quality and structure
      const generatedText = generateBetterLyrics(title, style, bpm, trackLength, vocalPreset);

      const newProject: Project = {
        id: uuidv4(),
        title,
        style,
        bpm,
        length: trackLength,
        lyrics: generatedText,
        date: new Date().toISOString(),
        beatUrl: currentBeatUrl || undefined,
        beatDuration: currentBeatDuration || undefined,
        vocalPresetId: selectedVocalPreset
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

    const project = projects[projectIndex];
    setGeneratingVocals(true);
    
    try {
      // Get the vocal preset for this project
      const vocalPresetId = project.vocalPresetId || selectedVocalPreset;
      const vocalPreset = VOCAL_PRESETS.find(p => p.id === vocalPresetId) || VOCAL_PRESETS[0];
      
      // Simulate vocal generation with more complex processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a more complex vocal-like audio for demonstration
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for the base frequency (simulating a voice)
      const oscNode = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      // Set different characteristics based on the vocal preset
      oscNode.type = vocalPreset.gender === 'female' ? 'sine' : 'sawtooth';
      
      // Adjust frequency based on pitch
      let baseFreq = 180; // Default medium pitch
      if (vocalPreset.pitch === 'deep') baseFreq = 120;
      if (vocalPreset.pitch === 'high') baseFreq = 240;
      
      oscNode.frequency.value = baseFreq;
      
      // Apply effects
      if (vocalPreset.effects === 'heavy') {
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 800;
        gainNode.gain.value = 0.7;
      } else if (vocalPreset.style === 'Trap') {
        filterNode.type = 'bandpass';
        filterNode.frequency.value = 1200;
        gainNode.gain.value = 0.5;
      } else {
        filterNode.type = 'highpass';
        filterNode.frequency.value = 300;
        gainNode.gain.value = 0.4;
      }
      
      // Connect nodes
      oscNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create longer sample based on track length
      const duration = project.length > 10 ? 10 : project.length; // Max 10 seconds for demo
      const sampleRate = audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      
      const myArrayBuffer = audioContext.createBuffer(2, frameCount, sampleRate); // Stereo
      const leftChannel = myArrayBuffer.getChannelData(0);
      const rightChannel = myArrayBuffer.getChannelData(1);
      
      for (let i = 0; i < frameCount; i++) {
        // Create more complex waveform that simulates speech with rhythm
        const time = i / sampleRate;
        const modulation = Math.sin(time * 5) * 0.5 + 0.5;
        const rhythmModulation = Math.sin(time * (project.bpm / 60) * Math.PI) * 0.3 + 0.7;
        
        // Different sound in each channel for stereo effect
        leftChannel[i] = (Math.sin(time * baseFreq) * modulation * rhythmModulation * 0.5);
        rightChannel[i] = (Math.sin(time * (baseFreq * 1.01)) * modulation * rhythmModulation * 0.5);
        
        // Add "word" boundaries
        if (i % Math.floor(sampleRate * 0.2) === 0) {
          leftChannel[i] *= 0.2;
          rightChannel[i] *= 0.2;
        }
      }
      
      // Convert buffer to WAV
      const audioBlob = new Blob([exportWAV(myArrayBuffer)], { type: 'audio/wav' });
      const vocalUrl = URL.createObjectURL(audioBlob);
      
      // Update project with vocal track URL
      const updatedProjects = [...projects];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        vocalUrl,
        vocalPresetId
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
      // Simulate a more complex mixing process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // In a real app, this would involve actual audio processing and mixing
      // For now, we'll create a combined audio buffer that simulates mixing
      
      // First, fetch the two audio files
      const beatResponse = await fetch(project.beatUrl);
      const beatData = await beatResponse.arrayBuffer();
      
      const vocalResponse = await fetch(project.vocalUrl);
      const vocalData = await vocalResponse.arrayBuffer();
      
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Decode both audio files
      const beatBuffer = await audioContext.decodeAudioData(beatData.slice(0));
      const vocalBuffer = await audioContext.decodeAudioData(vocalData.slice(0));
      
      // Create a new buffer for the mixed output
      // Use the longer of the two durations
      const mixedLength = Math.max(beatBuffer.length, vocalBuffer.length);
      const mixedBuffer = audioContext.createBuffer(
        2, // Stereo
        mixedLength,
        audioContext.sampleRate
      );
      
      // Mix the two tracks - beat at 70% volume, vocals at 100%
      const beatVolume = 0.7;
      const vocalVolume = 1.0;
      
      // Get the channel data
      const leftMix = mixedBuffer.getChannelData(0);
      const rightMix = mixedBuffer.getChannelData(1);
      
      // Beat data - may be mono or stereo
      const beatLeft = beatBuffer.getChannelData(0);
      const beatRight = beatBuffer.numberOfChannels > 1 ? beatBuffer.getChannelData(1) : beatLeft;
      
      // Vocal data - may be mono or stereo
      const vocalLeft = vocalBuffer.getChannelData(0);
      const vocalRight = vocalBuffer.numberOfChannels > 1 ? vocalBuffer.getChannelData(1) : vocalLeft;
      
      // Mix the samples
      for (let i = 0; i < mixedLength; i++) {
        // Only add beat samples if we haven't reached the end of the beat
        const beatSampleL = i < beatBuffer.length ? beatLeft[i] * beatVolume : 0;
        const beatSampleR = i < beatBuffer.length ? beatRight[i] * beatVolume : 0;
        
        // Only add vocal samples if we haven't reached the end of the vocals
        const vocalSampleL = i < vocalBuffer.length ? vocalLeft[i] * vocalVolume : 0;
        const vocalSampleR = i < vocalBuffer.length ? vocalRight[i] * vocalVolume : 0;
        
        // Combine the samples (with simple limiting to prevent clipping)
        leftMix[i] = Math.max(-0.99, Math.min(0.99, beatSampleL + vocalSampleL));
        rightMix[i] = Math.max(-0.99, Math.min(0.99, beatSampleR + vocalSampleR));
      }
      
      // Convert the mixed buffer to WAV
      const mixedBlob = new Blob([exportWAV(mixedBuffer)], { type: 'audio/wav' });
      const mixedTrackUrl = URL.createObjectURL(mixedBlob);
      
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
    selectedVocalPreset,
    loading,
    generatingVocals,
    generatingMix,
    presets,
    vocalPresets: VOCAL_PRESETS,
    setCurrentBeat,
    setCurrentBeatUrl,
    setCurrentBpm,
    setCurrentBeatDuration,
    setPresetStyle,
    setSelectedPreset,
    setSelectedVocalPreset,
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
