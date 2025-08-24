import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { friendships, user } from "@/lib/schema";
import { eq, and, or } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const targetUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (targetUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const friendUser = targetUser[0];

    // Can't send friend request to yourself
    if (friendUser.id === session.user.id) {
      return NextResponse.json({ error: "Cannot send friend request to yourself" }, { status: 400 });
    }

    // Check if friendship already exists
    const existingFriendship = await db
      .select()
      .from(friendships)
      .where(
        or(
          and(
            eq(friendships.requesterId, session.user.id),
            eq(friendships.addresseeId, friendUser.id)
          ),
          and(
            eq(friendships.requesterId, friendUser.id),
            eq(friendships.addresseeId, session.user.id)
          )
        )
      )
      .limit(1);

    if (existingFriendship.length > 0) {
      const friendship = existingFriendship[0];
      if (friendship.status === "accepted") {
        return NextResponse.json({ error: "Already friends with this user" }, { status: 400 });
      } else if (friendship.status === "pending") {
        return NextResponse.json({ error: "Friend request already sent" }, { status: 400 });
      }
    }

    // Create friend request
    const newFriendship = await db
      .insert(friendships)
      .values({
        id: crypto.randomUUID(),
        requesterId: session.user.id,
        addresseeId: friendUser.id,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ 
      success: true, 
      friendship: newFriendship[0] 
    });

  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}