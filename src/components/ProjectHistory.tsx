
import React, { useState } from "react";
import { useStudio } from "@/context/StudioContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const ProjectHistory: React.FC = () => {
  const { projects } = useStudio();

  if (projects.length === 0) {
    return (
      <Card className="bg-studio-gray border-studio-gray">
        <CardHeader>
          <CardTitle className="text-lg">Project History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6">
            No projects yet. Create your first track!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-studio-gray border-studio-gray">
      <CardHeader>
        <CardTitle className="text-lg">Project History</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto pr-2">
        <Accordion type="multiple" className="space-y-2">
          {projects.map((project) => (
            <AccordionItem
              key={project.id}
              value={project.id}
              className="border border-studio-gray bg-studio-dark/70 rounded-md overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-studio-dark/90 [&[data-state=open]]:bg-studio-dark">
                <div className="flex flex-col items-start text-left">
                  <div className="font-medium">{project.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center space-x-2 mt-1">
                    <span>{format(new Date(project.date), "MMM d, yyyy h:mm a")}</span>
                    <Badge variant="outline" className="border-studio-purple text-studio-purple/90 text-xs">
                      {project.style}
                    </Badge>
                    <span>BPM: {project.bpm}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-3">
                  {project.beatUrl && (
                    <div className="mb-2">
                      <audio 
                        src={project.beatUrl} 
                        controls 
                        className="w-full h-8 [&::-webkit-media-controls-panel]:bg-studio-dark [&::-webkit-media-controls-play-button]:text-studio-purple"
                      />
                    </div>
                  )}
                  <div className="bg-studio-darkblue/30 p-3 rounded-md overflow-x-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                      {project.lyrics}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProjectHistory;
