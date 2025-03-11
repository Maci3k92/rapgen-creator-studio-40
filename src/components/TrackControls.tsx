
import React from "react";
import { useStudio } from "@/context/StudioContext";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const TrackControls: React.FC = () => {
  const { 
    currentBpm, 
    presetStyle, 
    selectedPreset, 
    presets, 
    setCurrentBpm, 
    setPresetStyle,
    applyPreset 
  } = useStudio();

  return (
    <Card className="bg-studio-gray border-studio-gray">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preset-select">Select Preset</Label>
            <Select
              value={selectedPreset}
              onValueChange={(value) => applyPreset(value)}
            >
              <SelectTrigger id="preset-select" className="bg-studio-dark border-studio-gray">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent className="bg-studio-dark border-studio-gray">
                {Object.keys(presets).map((presetName) => (
                  <SelectItem key={presetName} value={presetName}>
                    {presetName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Style</Label>
            <RadioGroup
              value={presetStyle}
              onValueChange={(value: "Rap" | "Trap") => setPresetStyle(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Rap" id="rap" className="border-studio-purple text-studio-purple" />
                <Label htmlFor="rap" className="cursor-pointer">Rap</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Trap" id="trap" className="border-studio-purple text-studio-purple" />
                <Label htmlFor="trap" className="cursor-pointer">Trap</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="bpm">BPM</Label>
              <span className="text-sm font-medium text-muted-foreground">{currentBpm}</span>
            </div>
            <Slider
              id="bpm"
              min={60}
              max={200}
              step={1}
              value={[currentBpm]}
              onValueChange={(value) => setCurrentBpm(value[0])}
              className="[&_[role=slider]]:bg-studio-purple"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackControls;
