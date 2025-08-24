"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClubSelector } from "@/components/ui/club-selector";
import { ChevronLeft, Star, Calendar, MapPin, Upload, X, Image, Video } from "lucide-react";

export default function AddExperience() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<{file: File, preview: string, type: 'image' | 'video'}[]>([]);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      return (isImage || isVideo) && isValidSize;
    });

    validFiles.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setUploadPreviews(prev => [...prev, {
          file,
          preview,
          type: isImage ? 'image' : 'video'
        }]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadPreviews(prev => prev.filter((_, i) => i !== index));
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
      // First, create the experience
      const response = await fetch("/api/experiences", {
        method: "POST",
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
        throw new Error(error.error || "Failed to create experience");
      }

      const result = await response.json();
      const experienceId = result.experience.id;

      // Then, upload media files if any
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("experienceId", experienceId);
          
          const uploadResponse = await fetch("/api/experiences/media", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            console.error("Failed to upload file:", file.name);
          }
        });

        await Promise.all(uploadPromises);
      }

      console.log("Experience created with media:", result);
      router.push("/");
    } catch (error) {
      console.error("Failed to create experience:", error);
      alert(error instanceof Error ? error.message : "Failed to create experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Log Watching Experience</h1>
            <p className="text-muted-foreground">Share your football watching experience</p>
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

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Share Photos & Videos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="media-upload">Upload Photos or Videos (optional)</Label>
                <div className="mt-2">
                  <input
                    id="media-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="media-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> photos or videos
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF, MP4, MOV (MAX. 50MB each)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* File Previews */}
              {uploadPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadPreviews.map((item, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {item.type === 'image' ? (
                          <img
                            src={item.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <Video className="w-8 h-8 text-gray-500" />
                            <span className="ml-2 text-xs text-gray-500">
                              {item.file.name.length > 15 
                                ? item.file.name.substring(0, 12) + '...' 
                                : item.file.name}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-600">
                        {item.type === 'image' ? (
                          <Image className="w-3 h-3 inline mr-1" />
                        ) : (
                          <Video className="w-3 h-3 inline mr-1" />
                        )}
                        {(item.file.size / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" asChild className="flex-1">
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Experience"}
            </Button>
          </div>

        </form>
      </div>
    </main>
  );
}