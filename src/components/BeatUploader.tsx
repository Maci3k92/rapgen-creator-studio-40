
import React, { useState, useRef } from "react";
import { useStudio } from "@/context/StudioContext";
import { Button } from "@/components/ui/button";
import { Upload, AudioWaveform } from "lucide-react";
import { toast } from "sonner";

const BeatUploader: React.FC = () => {
  const { setCurrentBeat, setCurrentBeatUrl, setCurrentBpm } = useStudio();
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const processBeat = async (file: File) => {
    try {
      // Create object URL for audio playback
      const objectUrl = URL.createObjectURL(file);
      setCurrentBeatUrl(objectUrl);

      // Read file as ArrayBuffer for potential processing
      const arrayBuffer = await file.arrayBuffer();
      setCurrentBeat(arrayBuffer);

      // Simulate BPM detection
      const detectedBpm = Math.floor(Math.random() * (160 - 80) + 80);
      setCurrentBpm(detectedBpm);

      toast.success(`Beat uploaded successfully! Detected BPM: ${detectedBpm}`);
    } catch (error) {
      console.error("Error processing beat:", error);
      toast.error("Error processing beat. Please try another file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("audio")) {
        processBeat(file);
      } else {
        toast.error("Please upload an audio file (WAV/MP3)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processBeat(e.target.files[0]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors 
      ${dragging ? "border-studio-purple bg-studio-purple/10" : "border-border"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AudioWaveform className="w-12 h-12 mx-auto mb-4 text-studio-purple" />
      <h3 className="text-lg font-medium mb-2">Upload Your Beat</h3>
      <p className="text-muted-foreground mb-4">Drag & drop a WAV or MP3 file here, or click to browse</p>
      
      <input 
        type="file" 
        accept="audio/wav,audio/mp3,audio/mpeg"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef} 
      />
      
      <Button onClick={handleClickUpload} className="bg-studio-purple hover:bg-studio-purple/90">
        <Upload className="w-4 h-4 mr-2" />
        Select Beat
      </Button>
    </div>
  );
};

export default BeatUploader;
