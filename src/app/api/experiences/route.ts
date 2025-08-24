import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { matches, watchingExperiences } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (!homeTeam || !awayTeam || !matchDate || !competition || !watchingLocation || rating === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    let matchId: string | null = null;

    // Create or find the match
    if (homeTeam && awayTeam && matchDate && competition) {
      const existingMatch = await db
        .select()
        .from(matches)
        .where(eq(matches.homeTeam, homeTeam))
        .limit(1);

      if (existingMatch.length === 0) {
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
      } else {
        matchId = existingMatch[0].id;
      }
    }

    // AI categorization of location
    let aiCategorizedLocation: string | null = null;
    try {
      const locationContext = [watchingLocation, locationDetails].filter(Boolean).join(" - ");
      
      const { generateText } = await import("ai");
      const { openai } = await import("@ai-sdk/openai");
      const model = openai(process.env.OPENAI_MODEL || "gpt-3.5-turbo");

      const result = await generateText({
        model,
        prompt: `Categorize this football watching location into one of these categories: "Stadium", "Home", "Pub/Bar", "Friend's House", "Outdoor", "Other". 

Location: ${locationContext}

Respond with only the category name, nothing else.`,
      });

      aiCategorizedLocation = result.text.trim();
      console.log("AI categorized location:", aiCategorizedLocation);
    } catch (error) {
      console.error("AI categorization failed:", error);
      // Continue without AI categorization if it fails
    }

    // Create watching experience
    const newExperience = await db
      .insert(watchingExperiences)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        matchId,
        customMatchDescription,
        watchingLocation,
        locationDetails: locationDetails || null,
        rating: parseInt(rating),
        review: review || null,
        watchedAt: new Date(matchDate),
        isPublic: true,
        aiCategorizedLocation
      })
      .returning();

    return NextResponse.json({ 
      success: true, 
      experience: newExperience[0] 
    });

  } catch (error) {
    console.error("Error creating watching experience:", error);
    return NextResponse.json(
      { error: "Failed to create watching experience" },
      { status: 500 }
    );
  }
}