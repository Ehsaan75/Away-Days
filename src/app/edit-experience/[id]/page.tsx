"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClubSelector } from "@/components/ui/club-selector";
import { ChevronLeft, Star, Calendar, MapPin } from "lucide-react";
import { findClubByName } from "@/lib/clubs";

interface RouteProps {
  params: {
    id: string;
  };
}

export default function EditExperience({ params }: RouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    homeTeamId: "",
    homeTeamName: "",
    homeTeamCustom: "",
    awayTeamId: "",
    awayTeamName: "",
    awayTeamCustom: "",
    homeScore: "",
    awayScore: "",
    matchDate: "",
    competition: "",
    venue: "",
    watchingLocation: "",
    locationDetails: "",
    review: ""
  });

  const fetchExperience = useCallback(async () => {
    try {
      const response = await fetch(`/api/experiences/user`);
      if (response.ok) {
        const data = await response.json();
        const experience = data.experiences.find((exp: { id: string }) => exp.id === params.id);
        
        if (experience) {
          // Try to find clubs by name for existing experiences
          const homeClub = findClubByName(experience.homeTeam || "");
          const awayClub = findClubByName(experience.awayTeam || "");
          
          setFormData({
            homeTeamId: homeClub?.id || (experience.homeTeam ? "custom" : ""),
            homeTeamName: homeClub?.name || experience.homeTeam || "",
            homeTeamCustom: !homeClub && experience.homeTeam ? experience.homeTeam : "",
            awayTeamId: awayClub?.id || (experience.awayTeam ? "custom" : ""),
            awayTeamName: awayClub?.name || experience.awayTeam || "",
            awayTeamCustom: !awayClub && experience.awayTeam ? experience.awayTeam : "",
            homeScore: experience.homeScore?.toString() || "",
            awayScore: experience.awayScore?.toString() || "",
            matchDate: experience.watchedAt ? new Date(experience.watchedAt).toISOString().slice(0, 16) : "",
            competition: experience.competition || "",
            venue: experience.venue || "",
            watchingLocation: experience.watchingLocation || "",
            locationDetails: experience.locationDetails || "",
            review: experience.review || ""
          });
          setRating(experience.rating || 0);
        } else {
          alert("Experience not found");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Failed to fetch experience:", error);
      alert("Failed to load experience");
      router.push("/dashboard");
    } finally {
      setFetchLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHomeTeamChange = (clubId: string, clubName: string) => {
    setFormData(prev => ({
      ...prev,
      homeTeamId: clubId,
      homeTeamName: clubName
    }));
  };

  const handleAwayTeamChange = (clubId: string, clubName: string) => {
    setFormData(prev => ({
      ...prev,
      awayTeamId: clubId,
      awayTeamName: clubName
    }));
  };

  const handleHomeTeamCustomChange = (value: string) => {
    setFormData(prev => ({ ...prev, homeTeamCustom: value }));
  };

  const handleAwayTeamCustomChange = (value: string) => {
    setFormData(prev => ({ ...prev, awayTeamCustom: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!formData.homeTeamId || !formData.awayTeamId) {
      alert("Please select both home and away teams");
      return;
    }
    if ((formData.homeTeamId === "custom" && !formData.homeTeamCustom) || 
        (formData.awayTeamId === "custom" && !formData.awayTeamCustom)) {
      alert("Please enter custom team names");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/experiences/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          homeTeam: formData.homeTeamId === "custom" ? formData.homeTeamCustom : formData.homeTeamName,
          awayTeam: formData.awayTeamId === "custom" ? formData.awayTeamCustom : formData.awayTeamName,
          rating: rating.toString(),
          homeScore: formData.homeScore || null,
          awayScore: formData.awayScore || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update experience");
      }

      const result = await response.json();
      console.log("Experience updated:", result);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update experience:", error);
      alert(error instanceof Error ? error.message : "Failed to update experience");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>Loading experience...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ChevronLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Experience</h1>
            <p className="text-muted-foreground">Update your football watching experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Match Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Match Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ClubSelector
                  label="Home Team"
                  value={formData.homeTeamId}
                  onChange={handleHomeTeamChange}
                  placeholder="Select home team..."
                  customValue={formData.homeTeamCustom}
                  onCustomChange={handleHomeTeamCustomChange}
                />
                <ClubSelector
                  label="Away Team"
                  value={formData.awayTeamId}
                  onChange={handleAwayTeamChange}
                  placeholder="Select away team..."
                  customValue={formData.awayTeamCustom}
                  onCustomChange={handleAwayTeamCustomChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="homeScore">Home Score (optional)</Label>
                  <Input
                    id="homeScore"
                    type="number"
                    min="0"
                    value={formData.homeScore}
                    onChange={(e) => handleInputChange("homeScore", e.target.value)}
                    placeholder="2"
                  />
                </div>
                <div>
                  <Label htmlFor="awayScore">Away Score (optional)</Label>
                  <Input
                    id="awayScore"
                    type="number"
                    min="0"
                    value={formData.awayScore}
                    onChange={(e) => handleInputChange("awayScore", e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="matchDate">Match Date</Label>
                  <Input
                    id="matchDate"
                    type="datetime-local"
                    value={formData.matchDate}
                    onChange={(e) => handleInputChange("matchDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="competition">Competition</Label>
                  <Input
                    id="competition"
                    value={formData.competition}
                    onChange={(e) => handleInputChange("competition", e.target.value)}
                    placeholder="Premier League"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="venue">Stadium/Venue (optional)</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                  placeholder="Emirates Stadium"
                />
              </div>
            </CardContent>
          </Card>

          {/* Watching Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Where Did You Watch?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="watchingLocation">Watching Location</Label>
                <Input
                  id="watchingLocation"
                  value={formData.watchingLocation}
                  onChange={(e) => handleInputChange("watchingLocation", e.target.value)}
                  placeholder="Stadium, Home, Pub, Friend's House, etc."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="locationDetails">Location Details (optional)</Label>
                <Input
                  id="locationDetails"
                  value={formData.locationDetails}
                  onChange={(e) => handleInputChange("locationDetails", e.target.value)}
                  placeholder="The Woolpack Pub, North London"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rating & Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Rate Your Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${
                        star <= rating
                          ? "text-yellow-400 hover:text-yellow-500"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {rating === 0 && "Click to rate your experience"}
                  {rating === 1 && "Poor experience"}
                  {rating === 2 && "Fair experience"}
                  {rating === 3 && "Good experience"}
                  {rating === 4 && "Very good experience"}
                  {rating === 5 && "Excellent experience"}
                </p>
              </div>

              <div>
                <Label htmlFor="review">Review (optional)</Label>
                <Textarea
                  id="review"
                  value={formData.review}
                  onChange={(e) => handleInputChange("review", e.target.value)}
                  placeholder="Share your thoughts about the match and watching experience..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" asChild className="flex-1">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Experience"}
            </Button>
          </div>

        </form>
      </div>
    </main>
  );
}