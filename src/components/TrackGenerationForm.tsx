
import React, { useState } from "react";
import { useStudio } from "@/context/StudioContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Settings, AudioWaveform } from "lucide-react";

const TrackGenerationForm: React.FC = () => {
  const { 
    currentBeat, 
    currentBpm, 
    presetStyle,
    loading,
    generateTrack
  } = useStudio();
  
  const [title, setTitle] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [trackLength, setTrackLength] = useState(180);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateTrack(title, presetStyle, currentBpm, trackLength);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-studio-gray border-studio-gray">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Track Title</Label>
            <Input
              id="title"
              placeholder="Enter track title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-studio-dark border-studio-gray"
            />
          </div>
          
          <Collapsible 
            open={isAdvancedOpen} 
            onOpenChange={setIsAdvancedOpen} 
            className="space-y-4"
          >
            <CollapsibleTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                className="flex items-center w-full justify-between px-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                <div className="flex items-center">
                  <Settings size={16} className="mr-2" />
                  <span>Advanced Settings</span>
                </div>
                {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="length">Track Length</Label>
                  <span className="text-sm font-medium text-muted-foreground">{trackLength} seconds</span>
                </div>
                <Slider
                  id="length"
                  min={60}
                  max={300}
                  step={10}
                  value={[trackLength]}
                  onValueChange={(val) => setTrackLength(val[0])}
                  className="[&_[role=slider]]:bg-studio-purple"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-studio-purple hover:bg-studio-purple/90"
            disabled={!title || !currentBeat || loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-studio-purple/30 border-t-white rounded-full animate-spin mr-2" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center">
                <AudioWaveform size={18} className="mr-2" />
                Generate Track
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default TrackGenerationForm;
