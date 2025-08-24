import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { experienceMedia, watchingExperiences } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const experienceId = formData.get("experienceId") as string;

    if (!file || !experienceId) {
      return NextResponse.json({ error: "File and experience ID are required" }, { status: 400 });
    }

    // Verify the experience belongs to the user
    const experience = await db
      .select()
      .from(watchingExperiences)
      .where(eq(watchingExperiences.id, experienceId))
      .limit(1);

    if (experience.length === 0 || experience[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Experience not found or unauthorized" }, { status: 404 });
    }

    // Validate file type and size
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Only image and video files are allowed" }, { status: 400 });
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 });
    }

    try {
      // Upload to Vercel Blob
      const blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true,
      });

      // Save media record to database
      const newMedia = await db
        .insert(experienceMedia)
        .values({
          id: crypto.randomUUID(),
          experienceId: experienceId,
          mediaType: isImage ? "photo" : "video",
          mediaUrl: blob.url,
          caption: null, // Could be added later as a feature
        })
        .returning();

      return NextResponse.json({
        success: true,
        media: newMedia[0],
        url: blob.url
      });

    } catch (blobError) {
      console.error("Blob upload failed:", blobError);
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 }
    );
  }
}