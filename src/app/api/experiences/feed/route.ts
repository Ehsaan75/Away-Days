import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { watchingExperiences, matches, user, friendships, experienceMedia } from "@/lib/schema";
import { eq, desc, and, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get friend IDs (handle both directions of friendship)
    const friendships_data = await db
      .select({
        requesterId: friendships.requesterId,
        addresseeId: friendships.addresseeId,
      })
      .from(friendships)
      .where(
        and(
          or(
            eq(friendships.requesterId, session.user.id),
            eq(friendships.addresseeId, session.user.id)
          ),
          eq(friendships.status, "accepted")
        )
      );

    const friendIds = friendships_data.map(f => 
      f.requesterId === session.user.id ? f.addresseeId : f.requesterId
    );

    // Include user's own experiences in the feed
    friendIds.push(session.user.id);

    if (friendIds.length === 0) {
      return NextResponse.json({ experiences: [] });
    }

    // Fetch public watching experiences from friends (and self)
    const feedExperiences = await db
      .select({
        id: watchingExperiences.id,
        userId: watchingExperiences.userId,
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
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(watchingExperiences)
      .leftJoin(matches, eq(watchingExperiences.matchId, matches.id))
      .leftJoin(user, eq(watchingExperiences.userId, user.id))
      .where(
        and(
          or(...friendIds.map(id => eq(watchingExperiences.userId, id))),
          eq(watchingExperiences.isPublic, true)
        )
      )
      .orderBy(desc(watchingExperiences.createdAt))
      .limit(50);

    // Fetch media for each feed experience
    const experiencesWithMedia = await Promise.all(
      feedExperiences.map(async (experience) => {
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

    return NextResponse.json({
      experiences: experiencesWithMedia,
    });

  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}