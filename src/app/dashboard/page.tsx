"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Lock, Calendar, Star, MapPin, Plus, Trophy, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface ExperienceMedia {
  id: string;
  mediaType: "photo" | "video";
  mediaUrl: string;
  caption?: string;
}

interface WatchingExperience {
  id: string;
  matchId?: string;
  customMatchDescription?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  competition?: string;
  venue?: string;
  watchingLocation: string;
  locationDetails?: string;
  rating: number;
  review?: string;
  watchedAt: string;
  aiCategorizedLocation?: string;
  media?: ExperienceMedia[];
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [experiences, setExperiences] = useState<WatchingExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalExperiences: 0,
    averageRating: 0,
    favoriteLocation: null as string | null,
  });

  const fetchUserExperiences = useCallback(async () => {
    try {
      const response = await fetch("/api/experiences/user");
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.experiences || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setLoading(false);
    }
  }, [stats]);

  useEffect(() => {
    if (session?.user) {
      fetchUserExperiences();
    }
  }, [session, fetchUserExperiences]);

  const handleDeleteExperience = async (experienceId: string) => {
    if (!confirm("Are you sure you want to delete this experience? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(experienceId);
    try {
      const response = await fetch(`/api/experiences/${experienceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
        // Update stats
        const remainingExperiences = experiences.filter(exp => exp.id !== experienceId);
        const newTotal = remainingExperiences.length;
        const newAverage = newTotal > 0 
          ? remainingExperiences.reduce((sum, exp) => sum + exp.rating, 0) / newTotal 
          : 0;
        
        setStats(prev => ({
          ...prev,
          totalExperiences: newTotal,
          averageRating: parseFloat(newAverage.toFixed(1))
        }));
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete experience");
      }
    } catch (error) {
      console.error("Failed to delete experience:", error);
      alert("Failed to delete experience");
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Protected Page</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access your profile
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-8 p-6 rounded-lg pitch-gradient">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center stadium-glow">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{session.user.name}</h1>
              <p className="text-muted-foreground">⚽ Football fan since joining</p>
            </div>
          </div>
          <Button asChild className="gap-2 glow">
            <Link href="/add-experience">
              <Plus className="h-4 w-4" />
              Log Experience
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExperiences}</div>
              <p className="text-xs text-muted-foreground">Matches watched</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
              </div>
              <p className="text-xs text-muted-foreground">Out of 5 stars</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Location</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.favoriteLocation || "-"}
              </div>
              <p className="text-xs text-muted-foreground">Most watched at</p>
            </CardContent>
          </Card>
        </div>

        {/* Experiences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Watching Experiences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading experiences...</p>
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No watching experiences yet</p>
                  <p className="text-sm">Start by logging your first match experience</p>
                </div>
                <Button asChild>
                  <Link href="/add-experience">Log Your First Experience</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((experience) => (
                  <div key={experience.id} className="match-card rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {experience.homeTeam && experience.awayTeam ? (
                            `${experience.homeTeam} vs ${experience.awayTeam}`
                          ) : (
                            experience.customMatchDescription || "Custom Match"
                          )}
                        </h3>
                        {experience.homeScore !== null && experience.awayScore !== null && (
                          <p className="text-sm text-muted-foreground">
                            Final Score: {experience.homeScore} - {experience.awayScore}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(experience.rating)}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/edit-experience/${experience.id}`} className="flex items-center gap-2 cursor-pointer">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              variant="destructive"
                              onClick={() => handleDeleteExperience(experience.id)}
                              disabled={deleteLoading === experience.id}
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                              {deleteLoading === experience.id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {experience.competition && (
                        <Badge variant="secondary">{experience.competition}</Badge>
                      )}
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {experience.watchingLocation}
                      </Badge>
                      {experience.aiCategorizedLocation && (
                        <Badge variant="default" className="gap-1">
                          🤖 {experience.aiCategorizedLocation}
                        </Badge>
                      )}
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(experience.watchedAt)}
                      </Badge>
                    </div>

                    {experience.locationDetails && (
                      <p className="text-sm text-muted-foreground mb-2">
                        📍 {experience.locationDetails}
                      </p>
                    )}

                    {experience.review && (
                      <p className="text-sm">{experience.review}</p>
                    )}

                    {/* Media Gallery */}
                    {experience.media && experience.media.length > 0 && (
                      <div className="mt-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {experience.media.map((media) => (
                            <div key={media.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              {media.mediaType === "photo" ? (
                                <img
                                  src={media.mediaUrl}
                                  alt="Experience photo"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                  onClick={() => window.open(media.mediaUrl, '_blank')}
                                />
                              ) : (
                                <video
                                  src={media.mediaUrl}
                                  className="w-full h-full object-cover cursor-pointer"
                                  controls={false}
                                  muted
                                  preload="metadata"
                                  onClick={() => window.open(media.mediaUrl, '_blank')}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
