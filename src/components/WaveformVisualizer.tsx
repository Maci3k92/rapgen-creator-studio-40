
import React, { useRef, useEffect, useState } from "react";
import { useStudio } from "@/context/StudioContext";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const WaveformVisualizer: React.FC = () => {
  const { currentBeatUrl } = useStudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (!currentBeatUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const audio = audioRef.current;
    if (!audio) return;

    // Connect audio element to analyzer
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Configure canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);
      
      x = 0;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw waveform
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#8A2BE2");
        gradient.addColorStop(1, "#4169E1");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    }
    
    renderFrame();
    
    return () => {
      // Cleanup audio context
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [currentBeatUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (!currentBeatUrl) {
    return (
      <div className="waveform-container flex items-center justify-center">
        <p className="text-muted-foreground">Upload a beat to visualize waveform</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="waveform-container">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      
      <div className="flex items-center justify-between">
        <Button 
          onClick={togglePlay} 
          variant="ghost" 
          size="icon" 
          className="text-studio-purple hover:text-studio-highlight hover:bg-studio-purple/10"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        
        <div className="flex items-center">
          <Volume2 size={16} className="mr-2 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-studio-gray rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-studio-purple"
          />
        </div>
      </div>
      
      <audio ref={audioRef} src={currentBeatUrl} loop />
    </div>
  );
};

export default WaveformVisualizer;
