import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { watchingExperiences, matches, experienceMedia } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's watching experiences with match details
    const userExperiences = await db
      .select({
        id: watchingExperiences.id,
        matchId: watchingExperiences.matchId,
        customMatchDescription: watchingExperiences.customMatchDescription,
        homeTeam: matches.homeTeam,
        awayTeam: matches.awayTeam,
        homeScore: matches.homeScore,
        awayScore: matches.awayScore,
        competition: matches.competition,
        venue: matches.venue,
        watchingLocation: watchingExperiences.watchingLocation,
        locationDetails: watchingExperiences.locationDetails,
        rating: watchingExperiences.rating,
        review: watchingExperiences.review,
        watchedAt: watchingExperiences.watchedAt,
        aiCategorizedLocation: watchingExperiences.aiCategorizedLocation,
        createdAt: watchingExperiences.createdAt,
      })
      .from(watchingExperiences)
      .leftJoin(matches, eq(watchingExperiences.matchId, matches.id))
      .where(eq(watchingExperiences.userId, session.user.id))
      .orderBy(desc(watchingExperiences.watchedAt));

    // Fetch media for each experience
    const experiencesWithMedia = await Promise.all(
      userExperiences.map(async (experience) => {
        const media = await db
          .select({
            id: experienceMedia.id,
            mediaType: experienceMedia.mediaType,
            mediaUrl: experienceMedia.mediaUrl,
            caption: experienceMedia.caption,
          })
          .from(experienceMedia)
          .where(eq(experienceMedia.experienceId, experience.id));

        return {
          ...experience,
          media: media || []
        };
      })
    );

    // Calculate user stats
    const totalExperiences = userExperiences.length;
    
    let averageRating = 0;
    if (totalExperiences > 0) {
      const ratingSum = userExperiences.reduce((sum, exp) => sum + exp.rating, 0);
      averageRating = parseFloat((ratingSum / totalExperiences).toFixed(1));
    }

    // Find favorite location (most common watching location)
    let favoriteLocation: string | null = null;
    if (totalExperiences > 0) {
      const locationCounts = userExperiences.reduce((acc, exp) => {
        const location = exp.watchingLocation;
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      favoriteLocation = Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || null;
    }

    const stats = {
      totalExperiences,
      averageRating,
      favoriteLocation,
    };

    return NextResponse.json({
      experiences: experiencesWithMedia,
      stats,
    });

  } catch (error) {
    console.error("Error fetching user experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch user experiences" },
      { status: 500 }
    );
  }
}