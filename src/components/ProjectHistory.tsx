
import React, { useState } from "react";
import { useStudio } from "@/context/StudioContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Music, Mic, Share2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ProjectHistory: React.FC = () => {
  const { projects, generatingVocals, generatingMix, generateVocalTrack, mixTracks } = useStudio();
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProject(prev => (prev === id ? null : id));
  };

  const handleGenerateVocals = (projectId: string, lyrics: string) => {
    generateVocalTrack(projectId, lyrics);
  };

  const handleMixTracks = (projectId: string) => {
    mixTracks(projectId);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  if (projects.length === 0) {
    return (
      <Card className="bg-studio-gray border-studio-gray">
        <CardHeader>
          <CardTitle className="text-lg">Project History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No projects yet. Generate your first track!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-studio-gray border-studio-gray">
      <CardHeader>
        <CardTitle className="text-lg">Project History ({projects.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {projects.map((project) => (
          <Card key={project.id} className="bg-studio-dark border-studio-gray overflow-hidden">
            <Collapsible
              open={expandedProject === project.id}
              onOpenChange={() => toggleProject(project.id)}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <div className="p-4 cursor-pointer flex items-center justify-between hover:bg-black/20">
                  <div>
                    <h3 className="font-medium text-foreground">{project.title}</h3>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-2 mt-1">
                      <span className="bg-studio-purple/20 rounded-full px-2 py-0.5">{project.style}</span>
                      <span>{project.bpm} BPM</span>
                      <span>{project.length}s</span>
                      <span>{formatDate(project.date)}</span>
                    </div>
                  </div>
                  {expandedProject === project.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div className="border border-studio-gray rounded-md p-3 bg-black/20">
                    <h4 className="text-sm font-medium mb-2">Lyrics</h4>
                    <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{project.lyrics}</pre>
                  </div>
                  
                  {project.beatUrl && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Beat Track</h4>
                      <audio controls className="w-full h-8" src={project.beatUrl}></audio>
                    </div>
                  )}
                  
                  {project.vocalUrl && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Vocal Track</h4>
                      <audio controls className="w-full h-8" src={project.vocalUrl}></audio>
                    </div>
                  )}
                  
                  {project.mixedTrackUrl && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Mixed Track</h4>
                      <audio controls className="w-full h-8" src={project.mixedTrackUrl}></audio>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {!project.vocalUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-studio-purple text-studio-purple hover:bg-studio-purple/10"
                        onClick={() => handleGenerateVocals(project.id, project.lyrics)}
                        disabled={generatingVocals}
                      >
                        {generatingVocals ? (
                          <>
                            <div className="w-3 h-3 border-2 border-studio-purple/30 border-t-studio-purple rounded-full animate-spin mr-2" />
                            Generating Vocals...
                          </>
                        ) : (
                          <>
                            <Mic size={14} className="mr-1" />
                            Generate Vocals
                          </>
                        )}
                      </Button>
                    )}
                    
                    {project.vocalUrl && !project.mixedTrackUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-studio-purple text-studio-purple hover:bg-studio-purple/10"
                        onClick={() => handleMixTracks(project.id)}
                        disabled={generatingMix}
                      >
                        {generatingMix ? (
                          <>
                            <div className="w-3 h-3 border-2 border-studio-purple/30 border-t-studio-purple rounded-full animate-spin mr-2" />
                            Mixing...
                          </>
                        ) : (
                          <>
                            <Music size={14} className="mr-1" />
                            Mix Track
                          </>
                        )}
                      </Button>
                    )}
                    
                    {project.mixedTrackUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-studio-purple text-studio-purple hover:bg-studio-purple/10"
                      >
                        <Share2 size={14} className="mr-1" />
                        Share
                      </Button>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectHistory;
