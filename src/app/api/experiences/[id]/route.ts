import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { matches, watchingExperiences, experienceMedia } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experienceId = params.id;
    const body = await request.json();
    
    const {
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      matchDate,
      competition,
      venue,
      watchingLocation,
      locationDetails,
      rating,
      review,
      customMatchDescription
    } = body;

    // Verify experience belongs to user
    const existingExperience = await db
      .select()
      .from(watchingExperiences)
      .where(
        and(
          eq(watchingExperiences.id, experienceId),
          eq(watchingExperiences.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingExperience.length === 0) {
      return NextResponse.json({ error: "Experience not found or unauthorized" }, { status: 404 });
    }

    // Update or create match if provided
    let matchId = existingExperience[0].matchId;
    if (homeTeam && awayTeam && matchDate && competition) {
      if (matchId) {
        // Update existing match
        await db
          .update(matches)
          .set({
            homeTeam,
            awayTeam,
            homeScore: homeScore ? parseInt(homeScore) : null,
            awayScore: awayScore ? parseInt(awayScore) : null,
            matchDate: new Date(matchDate),
            competition,
            venue: venue || null,
            season: new Date(matchDate).getFullYear().toString() + "/" + (new Date(matchDate).getFullYear() + 1).toString().slice(-2),
            updatedAt: new Date()
          })
          .where(eq(matches.id, matchId));
      } else {
        // Create new match
        const newMatch = await db
          .insert(matches)
          .values({
            id: crypto.randomUUID(),
            homeTeam,
            awayTeam,
            homeScore: homeScore ? parseInt(homeScore) : null,
            awayScore: awayScore ? parseInt(awayScore) : null,
            matchDate: new Date(matchDate),
            competition,
            venue: venue || null,
            season: new Date(matchDate).getFullYear().toString() + "/" + (new Date(matchDate).getFullYear() + 1).toString().slice(-2)
          })
          .returning();
        
        matchId = newMatch[0].id;
      }
    }

    // Update watching experience
    const updatedExperience = await db
      .update(watchingExperiences)
      .set({
        matchId,
        customMatchDescription,
        watchingLocation,
        locationDetails: locationDetails || null,
        rating: parseInt(rating),
        review: review || null,
        watchedAt: new Date(matchDate),
        updatedAt: new Date()
      })
      .where(eq(watchingExperiences.id, experienceId))
      .returning();

    return NextResponse.json({ 
      success: true, 
      experience: updatedExperience[0] 
    });

  } catch (error) {
    console.error("Error updating watching experience:", error);
    return NextResponse.json(
      { error: "Failed to update watching experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experienceId = params.id;

    // Verify experience belongs to user
    const existingExperience = await db
      .select()
      .from(watchingExperiences)
      .where(
        and(
          eq(watchingExperiences.id, experienceId),
          eq(watchingExperiences.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingExperience.length === 0) {
      return NextResponse.json({ error: "Experience not found or unauthorized" }, { status: 404 });
    }

    // Delete associated media first (cascade should handle this but being explicit)
    await db
      .delete(experienceMedia)
      .where(eq(experienceMedia.experienceId, experienceId));

    // Delete the experience
    await db
      .delete(watchingExperiences)
      .where(eq(watchingExperiences.id, experienceId));

    return NextResponse.json({ 
      success: true, 
      message: "Experience deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting watching experience:", error);
    return NextResponse.json(
      { error: "Failed to delete watching experience" },
      { status: 500 }
    );
  }
}