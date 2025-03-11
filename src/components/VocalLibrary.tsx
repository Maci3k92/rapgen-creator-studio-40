
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudio } from "@/context/StudioContext";
import { Waveform, Mic, Plus, Library } from "lucide-react";

// Sample vocal presets with different characteristics
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

export interface VocalPreset {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  pitch: "deep" | "medium" | "high";
  style: "Rap" | "Trap";
  effects?: "light" | "medium" | "heavy";
}

const VocalLibrary: React.FC = () => {
  const { presetStyle, selectedVocalPreset, setSelectedVocalPreset } = useStudio();
  const [filteredPresets, setFilteredPresets] = useState<VocalPreset[]>(VOCAL_PRESETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");
  
  useEffect(() => {
    // Filter presets based on search term, style and gender
    let filtered = VOCAL_PRESETS.filter(preset => 
      preset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (presetStyle === "all" || preset.style === presetStyle) &&
      (filterGender === "all" || preset.gender === filterGender)
    );
    
    setFilteredPresets(filtered);
  }, [searchTerm, presetStyle, filterGender]);

  return (
    <Card className="bg-studio-gray border-studio-gray">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Library size={18} className="mr-2" />
          Vocal Library
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="search-vocals">Search Vocals</Label>
          <Input
            id="search-vocals"
            placeholder="Search vocal presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-studio-dark border-studio-gray"
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="filter-gender">Filter by Voice Type</Label>
          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger className="bg-studio-dark border-studio-gray">
              <SelectValue placeholder="All voice types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All voice types</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
          {filteredPresets.map(preset => (
            <Button
              key={preset.id}
              variant={selectedVocalPreset === preset.id ? "default" : "outline"}
              className={`justify-start flex items-center px-3 ${
                selectedVocalPreset === preset.id 
                ? "bg-studio-purple hover:bg-studio-purple/90" 
                : "bg-studio-dark border-studio-gray hover:bg-studio-gray"
              }`}
              onClick={() => setSelectedVocalPreset(preset.id)}
            >
              <Waveform size={14} className="mr-2" />
              {preset.name}
            </Button>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="border-dashed border-studio-purple/50 text-studio-purple w-full hover:bg-studio-purple/10"
        >
          <Plus size={14} className="mr-2" />
          Add Custom Vocal
        </Button>
      </CardContent>
    </Card>
  );
};

export default VocalLibrary;
