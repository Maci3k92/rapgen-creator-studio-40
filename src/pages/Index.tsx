
import React from "react";
import { StudioProvider } from "@/context/StudioContext";
import Header from "@/components/Header";
import BeatUploader from "@/components/BeatUploader";
import TrackControls from "@/components/TrackControls";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import TrackGenerationForm from "@/components/TrackGenerationForm";
import ProjectHistory from "@/components/ProjectHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudio } from "@/context/StudioContext";

// Wrapper component for accessing the studio context
const StudioContent: React.FC = () => {
  const { currentBeatUrl } = useStudio();

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls & Generation */}
        <div className="space-y-6">
          <Card className="bg-studio-gray border-studio-gray">
            <CardHeader>
              <CardTitle className="text-lg">Track Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!currentBeatUrl && <BeatUploader />}
              {currentBeatUrl && <WaveformVisualizer />}
              <TrackControls />
              <TrackGenerationForm />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - History */}
        <div>
          <ProjectHistory />
        </div>
      </div>
    </main>
  );
};

// Main page with context provider
const Index: React.FC = () => {
  return (
    <StudioProvider>
      <div className="min-h-screen flex flex-col bg-studio-dark">
        <Header />
        <StudioContent />
      </div>
    </StudioProvider>
  );
};

export default Index;
