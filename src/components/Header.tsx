
import React from "react";
import { Music } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-studio-gray">
      <div className="flex items-center space-x-2">
        <Music className="w-8 h-8 text-studio-purple" />
        <h1 className="text-2xl font-bold waveform-gradient">RapGen Studio Pro</h1>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">AI Rap Generator</span>
      </div>
    </header>
  );
};

export default Header;
