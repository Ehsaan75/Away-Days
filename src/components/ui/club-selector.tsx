"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { leagues, customOptions, findClubById, type Club } from "@/lib/clubs";
import { cn } from "@/lib/utils";

interface ClubSelectorProps {
  label: string;
  value: string;
  onChange: (clubId: string, clubName: string) => void;
  placeholder?: string;
  customValue?: string;
  onCustomChange?: (value: string) => void;
}

export function ClubSelector({ 
  label, 
  value, 
  onChange, 
  placeholder = "Select club...",
  customValue = "",
  onCustomChange
}: ClubSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (value) {
      const club = findClubById(value);
      setSelectedClub(club);
      setIsCustom(value === "custom");
    }
  }, [value]);

  const handleSelect = (clubId: string) => {
    const club = findClubById(clubId);
    if (club) {
      setSelectedClub(club);
      setIsCustom(clubId === "custom");
      onChange(clubId, club.name);
      setOpen(false);
    }
  };

  const handleCustomChange = (customName: string) => {
    if (onCustomChange) {
      onCustomChange(customName);
      onChange("custom", customName);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              {selectedClub && selectedClub.badgeUrl && (
                <img 
                  src={selectedClub.badgeUrl} 
                  alt={selectedClub.name}
                  className="w-5 h-5 rounded"
                  onError={(e) => {
                    e.currentTarget.src = "https://img.icons8.com/color/48/football.png";
                  }}
                />
              )}
              {selectedClub ? selectedClub.name : placeholder}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search clubs..." />
            <CommandList>
              <CommandEmpty>No clubs found.</CommandEmpty>
              
              {leagues.map((league) => (
                <CommandGroup key={league.id} heading={`${league.name} (${league.country})`}>
                  {league.clubs.map((club) => (
                    <CommandItem
                      key={club.id}
                      value={club.name}
                      onSelect={() => handleSelect(club.id)}
                      className="flex items-center gap-2"
                    >
                      <img 
                        src={club.badgeUrl} 
                        alt={club.name}
                        className="w-5 h-5 rounded"
                        onError={(e) => {
                          e.currentTarget.src = "https://img.icons8.com/color/48/football.png";
                        }}
                      />
                      <span className="flex-1">{club.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === club.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              
              <CommandGroup heading="Other">
                {customOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => handleSelect(option.id)}
                    className="flex items-center gap-2"
                  >
                    <img 
                      src={option.badgeUrl} 
                      alt={option.name}
                      className="w-5 h-5 rounded"
                    />
                    <span className="flex-1">{option.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Custom team name input */}
      {isCustom && (
        <Input
          placeholder="Enter team name..."
          value={customValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          className="mt-2"
        />
      )}
    </div>
  );
}