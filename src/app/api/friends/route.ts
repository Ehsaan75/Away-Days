import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { friendships, user } from "@/lib/schema";
import { eq, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all friendships where user is involved
    const userFriendships = await db
      .select({
        id: friendships.id,
        requesterId: friendships.requesterId,
        addresseeId: friendships.addresseeId,
        status: friendships.status,
        requesterName: user.name,
        requesterEmail: user.email,
        requesterImage: user.image,
        addresseeName: user.name,
        addresseeEmail: user.email,
        addresseeImage: user.image,
      })
      .from(friendships)
      .leftJoin(user, eq(friendships.requesterId, user.id))
      .where(
        or(
          eq(friendships.requesterId, session.user.id),
          eq(friendships.addresseeId, session.user.id)
        )
      );

    // Transform the data to a cleaner format
    const friends = await Promise.all(
      userFriendships.map(async (friendship) => {
        const isRequester = friendship.requesterId === session.user.id;
        const friendUserId = isRequester ? friendship.addresseeId : friendship.requesterId;

        // Get the friend's details
        const friendDetails = await db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          })
          .from(user)
          .where(eq(user.id, friendUserId))
          .limit(1);

        const friend = friendDetails[0];

        return {
          id: friendship.id,
          name: friend.name,
          email: friend.email,
          image: friend.image,
          status: friendship.status,
          isRequester,
        };
      })
    );

    return NextResponse.json({ friends });

  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}