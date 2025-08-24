"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Star, MapPin } from "lucide-react";

interface FeedMedia {
  id: string;
  mediaType: "photo" | "video";
  mediaUrl: string;
  caption?: string;
}

interface FeedExperience {
  id: string;
  userId: string;
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
  createdAt: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  media?: FeedMedia[];
}

export default function Home() {
  const { data: session } = useSession();
  const [feedExperiences, setFeedExperiences] = useState<FeedExperience[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchFeed();
    }
  }, [session]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/experiences/feed");
      if (response.ok) {
        const data = await response.json();
        setFeedExperiences(data.experiences || []);
      }
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
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
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 p-6 rounded-lg pitch-gradient">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">⚽ Away Days</h1>
            <p className="text-muted-foreground mt-1">Share your football watching experiences</p>
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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Start logging your matches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Friends</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Connect with other fans</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Rate your experiences</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Experiences Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                {!session ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Sign in to see your feed</p>
                      <p className="text-sm">Connect with friends and see their watching experiences</p>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading experiences...</p>
                  </div>
                ) : feedExperiences.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No experiences in your feed yet</p>
                      <p className="text-sm">Add friends or log your first match experience</p>
                    </div>
                    <div className="space-y-2">
                      <Button asChild variant="outline">
                        <Link href="/add-experience">Log Your First Experience</Link>
                      </Button>
                      <Button asChild variant="ghost">
                        <Link href="/friends">Add Friends</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedExperiences.map((experience) => (
                      <div key={experience.id} className="match-card rounded-lg p-4">
                        
                        {/* User Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{experience.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(experience.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(experience.rating)}
                          </div>
                        </div>

                        {/* Experience Content */}
                        <div className="mb-3">
                          <h3 className="font-semibold mb-1">
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

                        {/* Badges */}
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
                        </div>

                        {/* Location Details */}
                        {experience.locationDetails && (
                          <p className="text-sm text-muted-foreground mb-2">
                            📍 {experience.locationDetails}
                          </p>
                        )}

                        {/* Review */}
                        {experience.review && (
                          <p className="text-sm mb-3">{experience.review}</p>
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

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome to Away Days!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Log experiences</h4>
                      <p className="text-sm text-muted-foreground">Rate and review matches you&apos;ve watched</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Connect with friends</h4>
                      <p className="text-sm text-muted-foreground">Follow other fans and see their experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Build your history</h4>
                      <p className="text-sm text-muted-foreground">Create a personal log of your football journey</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {!session ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Sign in to see activity</p>
                  </div>
                ) : feedExperiences.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                    <Button asChild size="sm" className="mt-2">
                      <Link href="/friends">Add Friends</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {feedExperiences.slice(0, 3).map((experience) => (
                      <div key={experience.id} className="text-sm">
                        <p className="font-medium">{experience.userName}</p>
                        <p className="text-muted-foreground text-xs">
                          Watched {experience.homeTeam && experience.awayTeam 
                            ? `${experience.homeTeam} vs ${experience.awayTeam}` 
                            : experience.customMatchDescription || "a match"}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(experience.rating)}
                        </div>
                      </div>
                    ))}
                    {feedExperiences.length > 3 && (
                      <Button asChild variant="ghost" size="sm" className="w-full mt-2">
                        <Link href="/">View All</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </main>
  );
}
