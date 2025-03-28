import { useState, useEffect } from "react";
import { Brain, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIContextResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AiContextProps {
  book: string;
  chapter: number;
  verse: number;
}

const AiContext = ({ book, chapter, verse }: AiContextProps) => {
  const [persona, setPersona] = useState<string>("default");
  const [customPersona, setCustomPersona] = useState<string>("");
  const [contextData, setContextData] = useState<AIContextResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchAiContext = async (personaValue?: string) => {
    setIsLoading(true);
    try {
      const personaToUse = personaValue === "custom" ? customPersona : personaValue;
      
      const response = await fetch("/api/ai-context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book,
          chapter,
          verse,
          persona: personaToUse !== "default" ? personaToUse : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setContextData(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate AI context.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while generating AI context.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiContext("default");
  }, [book, chapter, verse]);

  const handlePersonaChange = (value: string) => {
    setPersona(value);
    
    if (value === "custom") {
      const input = prompt("Enter a custom persona (e.g., 'C.S. Lewis', 'Augustine', 'Desert Father'):");
      if (input) {
        setCustomPersona(input);
        fetchAiContext("custom");
      } else {
        setPersona("default");
      }
    } else {
      fetchAiContext(value);
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm mb-6 border-l-4 border-secondary">
      <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <Brain className="text-secondary mr-2 h-5 w-5" />
          <h3 className="font-medium">AI-Powered Context</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={persona} onValueChange={handlePersonaChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="theologian">Theologian</SelectItem>
              <SelectItem value="historian">Historian</SelectItem>
              <SelectItem value="pastor">Pastor</SelectItem>
              <SelectItem value="custom">Custom Persona...</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-secondary"></div>
            <span className="ml-2 text-neutral-600">Generating context...</span>
          </div>
        ) : contextData ? (
          <div>
            <p className="text-neutral-600 leading-relaxed">
              {contextData.text}
            </p>
            {contextData.persona && (
              <p className="mt-3 text-sm text-neutral-500 italic">
                Context provided in the voice of: {contextData.persona}
              </p>
            )}
          </div>
        ) : (
          <p className="text-neutral-500">No context available for this verse.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AiContext;
