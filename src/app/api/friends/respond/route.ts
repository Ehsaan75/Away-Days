import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { friendships } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { friendshipId, action } = body;

    if (!friendshipId || !action) {
      return NextResponse.json({ error: "Friendship ID and action are required" }, { status: 400 });
    }

    if (action !== "accept" && action !== "decline") {
      return NextResponse.json({ error: "Action must be 'accept' or 'decline'" }, { status: 400 });
    }

    // Find the friendship request
    const friendship = await db
      .select()
      .from(friendships)
      .where(
        and(
          eq(friendships.id, friendshipId),
          eq(friendships.addresseeId, session.user.id), // User must be the addressee
          eq(friendships.status, "pending")
        )
      )
      .limit(1);

    if (friendship.length === 0) {
      return NextResponse.json({ error: "Friend request not found or already responded to" }, { status: 404 });
    }

    // Update the friendship status
    const newStatus = action === "accept" ? "accepted" : "declined";
    
    const updatedFriendship = await db
      .update(friendships)
      .set({ 
        status: newStatus,
        updatedAt: new Date()
      })
      .where(eq(friendships.id, friendshipId))
      .returning();

    return NextResponse.json({ 
      success: true, 
      friendship: updatedFriendship[0] 
    });

  } catch (error) {
    console.error("Error responding to friend request:", error);
    return NextResponse.json(
      { error: "Failed to respond to friend request" },
      { status: 500 }
    );
  }
}